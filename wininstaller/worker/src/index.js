/**
 * wininstaller — Cloudflare Worker
 *
 * Alur:
 *   browser  -> POST /api/jobs            (buat job, kredensial dienkripsi)
 *   browser  -> GET  /api/jobs/:id        (poll status + event)
 *   runner   -> GET  /api/runner/next     (ambil job berikutnya, kredensial didekripsi sekali)
 *   runner   -> POST /api/runner/jobs/:id/events
 *
 * Rahasia (via `wrangler secret put`):
 *   JOBS_KEY      kunci enkripsi kredensial (string acak panjang)
 *   RUNNER_TOKEN  bearer token untuk endpoint runner
 */

const POLICY = {
  maxJobsPerHourPerIp: 6,
  maxEventsPerJob: 400,
  jobRetentionSec: 7 * 24 * 3600,
  maxBodyBytes: 16 * 1024,
};

const OS_MAP = {
  ws2022: { name: 'Windows Server 2022', image: 'windows-server-2022' },
  ws2019: { name: 'Windows Server 2019', image: 'windows-server-2019' },
};

// ---------- util ----------
const enc = new TextEncoder();
const dec = new TextDecoder();

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

function err(message, status = 400, extra = {}) {
  return json({ ok: false, error: message, ...extra }, status);
}

function toB64(buf) {
  const bytes = new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

function fromB64(str) {
  const bin = atob(str);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function keyFrom(secret) {
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(secret));
  return crypto.subtle.importKey('raw', digest, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

async function encryptCreds(secret, obj) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await keyFrom(secret);
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(obj)));
  return toB64(iv) + '.' + toB64(ct);
}

async function decryptCreds(secret, blob) {
  const [ivB64, ctB64] = String(blob).split('.');
  if (!ivB64 || !ctB64) throw new Error('creds rusak');
  const key = await keyFrom(secret);
  const pt = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromB64(ivB64) },
    key,
    fromB64(ctB64),
  );
  return JSON.parse(dec.decode(pt));
}

const HOST_RE = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$|^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

const PRIVATE_V4 = [
  /^0\./, /^10\./, /^127\./, /^169\.254\./, /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./, /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,
];

function isPrivateHost(h) {
  const host = h.trim().toLowerCase();
  if (host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal')) return true;
  if (PRIVATE_V4.some((re) => re.test(host))) return true;
  // IPv6 literal di dalam kurung siku atau tanpa kurung
  const v6 = host.replace(/^\[|\]$/g, '');
  if (v6.includes(':')) {
    if (v6 === '::1' || v6.startsWith('fe80:') || v6.startsWith('fc') || v6.startsWith('fd')) return true;
  }
  return false;
}

function validHost(h) {
  return typeof h === 'string' && h.length <= 253 && HOST_RE.test(h.trim()) && !isPrivateHost(h);
}

function str(v, max = 200) {
  if (v === undefined || v === null) return '';
  return String(v).trim().slice(0, max);
}

// ---------- rate limit ----------
async function hitRate(env, ip) {
  const bucket = Math.floor(Date.now() / 3600000);
  const row = await env.DB.prepare(
    'INSERT INTO rate (ip, bucket, count) VALUES (?, ?, 1) ' +
    'ON CONFLICT(ip, bucket) DO UPDATE SET count = count + 1 RETURNING count',
  ).bind(ip, bucket).first();
  const count = row?.count ?? 1;
  return { allowed: count <= POLICY.maxJobsPerHourPerIp, count };
}

// ---------- handlers ----------
async function createJob(request, env) {
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const raw = await request.text();
  if (raw.length > POLICY.maxBodyBytes) return err('payload terlalu besar', 413);

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return err('JSON tidak valid');
  }

  if (body.ack !== true) return err('konfirmasi destruktif belum dicentang');

  const os = str(body.os, 20);
  const mode = str(body.mode, 10);
  if (!OS_MAP[os]) return err('versi Windows tidak dikenal');
  if (mode !== 'live' && mode !== 'rescue') return err('metode tidak dikenal');

  const host = str(body.host, 253);
  if (!validHost(host)) return err('host/IP tidak valid');

  const port = Number(body.port || 22);
  if (!Number.isInteger(port) || port < 1 || port > 65535) return err('port tidak valid');

  const sshUser = str(body.user, 32) || 'root';
  if (!/^[a-z_][a-z0-9_-]{0,31}$/i.test(sshUser)) return err('user SSH tidak valid');

  const auth = str(body.auth, 10) === 'key' ? 'key' : 'pass';
  const secret = auth === 'key' ? str(body.key, 8000) : str(body.password, 200);
  if (!secret) return err(auth === 'key' ? 'private key kosong' : 'password kosong');

  const rate = await hitRate(env, ip);
  if (!rate.allowed) {
    return err('terlalu banyak permintaan dari IP ini — coba lagi nanti', 429, {
      limit: POLICY.maxJobsPerHourPerIp,
    });
  }

  const now = Math.floor(Date.now() / 1000);
  const id = crypto.randomUUID();
  const adminPass = str(body.adminPass, 64) || randomPassword();
  const hostname = (str(body.hostname, 63) || 'winserver').toLowerCase().replace(/[^a-z0-9-]/g, '');

  const credsEnc = await encryptCreds(env.JOBS_KEY, { auth, secret });

  await env.DB.prepare(
    `INSERT INTO jobs (id, created_at, updated_at, ip, status, os, mode, host, port, ssh_user,
       hostname, creds_enc, static_ip, gateway, dns1, dns2, admin_pass)
     VALUES (?, ?, ?, ?, 'queued', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    id, now, now, ip, os, mode, host, port, sshUser, hostname, credsEnc,
    str(body.staticIp, 64), str(body.gateway, 64), str(body.dns1, 64), str(body.dns2, 64),
    adminPass,
  ).run();

  await addEvents(env, id, [{ level: 'ac', step: 'queue', msg: `job dibuat · ${OS_MAP[os].name} · mode ${mode}` }]);

  // bersih-bersih job lama
  const cutoff = now - POLICY.jobRetentionSec;
  await env.DB.batch([
    env.DB.prepare('DELETE FROM events WHERE job_id IN (SELECT id FROM jobs WHERE created_at < ?)').bind(cutoff),
    env.DB.prepare('DELETE FROM jobs WHERE created_at < ?').bind(cutoff),
  ]);

  return json({ ok: true, id, adminPass, queued: true }, 201);
}

async function addEvents(env, jobId, list) {
  const now = Math.floor(Date.now() / 1000);
  const rows = list.slice(0, 50).map((e) =>
    env.DB.prepare('INSERT INTO events (job_id, ts, level, step, msg) VALUES (?, ?, ?, ?, ?)')
      .bind(jobId, now, str(e.level, 8) || 'info', str(e.step, 24), str(e.msg, 800)),
  );
  if (rows.length) await env.DB.batch(rows);
}

async function getJob(env, id) {
  const job = await env.DB.prepare(
    `SELECT id, created_at, updated_at, status, os, mode, host, port, ssh_user, hostname,
            static_ip, gateway, dns1, dns2, admin_pass, error
       FROM jobs WHERE id = ?`,
  ).bind(id).first();
  if (!job) return null;

  const { results } = await env.DB.prepare(
    'SELECT id, ts, level, step, msg FROM events WHERE job_id = ? ORDER BY id DESC LIMIT 120',
  ).bind(id).all();

  const events = (results || []).reverse();
  return {
    ok: true,
    job: {
      id: job.id,
      status: job.status,
      os: job.os,
      osName: OS_MAP[job.os]?.name || job.os,
      mode: job.mode,
      host: job.host,
      port: job.port,
      hostname: job.hostname,
      network: {
        staticIp: job.static_ip || '',
        gateway: job.gateway || '',
        dns1: job.dns1 || '',
        dns2: job.dns2 || '',
      },
      createdAt: job.created_at,
      updatedAt: job.updated_at,
      error: job.error || '',
      adminPass: job.status === 'done' ? job.admin_pass : '',
    },
    events,
  };
}

async function runnerAuth(request, env) {
  const h = request.headers.get('authorization') || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!env.RUNNER_TOKEN || token.length < 16) return false;
  // perbandingan waktu-konstan sederhana
  const a = enc.encode(token);
  const b = enc.encode(env.RUNNER_TOKEN);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function markRunnerSeen(env, name) {
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare(
    'INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
  ).bind('runner_seen', JSON.stringify({ ts: now, name })).run();
}

async function runnerNext(request, env) {
  await markRunnerSeen(env, str(request.headers.get('x-runner-name'), 64) || 'runner');
  const staleBefore = Math.floor(Date.now() / 1000) - 900;
  await env.DB.prepare(
    "UPDATE jobs SET status = 'queued', runner = NULL WHERE status IN ('claimed','running') AND updated_at < ?",
  ).bind(staleBefore).run();

  const job = await env.DB.prepare(
    "SELECT * FROM jobs WHERE status = 'queued' ORDER BY created_at ASC LIMIT 1",
  ).first();
  if (!job) return json({ ok: true, job: null });

  const now = Math.floor(Date.now() / 1000);
  const claimed = await env.DB.prepare(
    "UPDATE jobs SET status = 'claimed', updated_at = ?, runner = ? WHERE id = ? AND status = 'queued'",
  ).bind(now, str(request.headers.get('x-runner-name'), 64) || 'runner', job.id).run();

  if (!claimed.meta?.changes) return json({ ok: true, job: null });

  let creds = null;
  try {
    creds = job.creds_enc ? await decryptCreds(env.JOBS_KEY, job.creds_enc) : null;
  } catch (e) {
    await env.DB.prepare("UPDATE jobs SET status='error', error=?, creds_enc=NULL WHERE id=?")
      .bind('kredensial tidak bisa didekripsi', job.id).run();
    return json({ ok: true, job: null });
  }

  // kredensial tidak disimpan lebih lama dari yang perlu
  await env.DB.prepare('UPDATE jobs SET creds_enc = NULL WHERE id = ?').bind(job.id).run();

  return json({
    ok: true,
    job: {
      id: job.id,
      os: job.os,
      osName: OS_MAP[job.os]?.name || job.os,
      mode: job.mode,
      host: job.host,
      port: job.port,
      sshUser: job.ssh_user,
      hostname: job.hostname,
      adminPass: job.admin_pass,
      auth: creds?.auth || 'pass',
      secret: creds?.secret || '',
      network: {
        staticIp: job.static_ip || '',
        gateway: job.gateway || '',
        dns1: job.dns1 || '',
        dns2: job.dns2 || '',
      },
    },
  });
}

async function runnerEvents(request, env, id) {
  const body = await request.json().catch(() => null);
  if (!body) return err('JSON tidak valid');
  const events = Array.isArray(body.events) ? body.events : [];

  const job = await env.DB.prepare('SELECT id, status FROM jobs WHERE id = ?').bind(id).first();
  if (!job) return err('job tidak ditemukan', 404);

  const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM events WHERE job_id = ?').bind(id).first();
  const room = POLICY.maxEventsPerJob - (count?.n || 0);
  if (room > 0 && events.length) await addEvents(env, id, events.slice(0, room));

  const now = Math.floor(Date.now() / 1000);
  const status = ['claimed', 'running', 'done', 'error'].includes(body.status) ? body.status : null;
  const errorMsg = str(body.error, 500);

  if (status) {
    await env.DB.prepare('UPDATE jobs SET status = ?, updated_at = ?, error = COALESCE(NULLIF(?, \'\'), error) WHERE id = ?')
      .bind(status, now, errorMsg, id).run();
  } else {
    await env.DB.prepare('UPDATE jobs SET updated_at = ? WHERE id = ?').bind(now, id).run();
  }

  return json({ ok: true });
}

function randomPassword() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  let out = '';
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return out.slice(0, 6) + '-' + out.slice(6, 12) + '-' + out.slice(12, 18);
}

// ---------- router ----------
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (path.startsWith('/api/')) {
      try {
        if (path === '/api/health') {
          let runnerAge = null;
          let queued = 0;
          try {
            const row = await env.DB.prepare("SELECT value FROM meta WHERE key = 'runner_seen'").first();
            if (row) runnerAge = Math.floor(Date.now() / 1000) - (JSON.parse(row.value).ts || 0);
            const q = await env.DB.prepare("SELECT COUNT(*) AS n FROM jobs WHERE status = 'queued'").first();
            queued = q?.n || 0;
          } catch { /* tabel belum ada */ }
          return json({ ok: true, runner: runnerAge !== null && runnerAge < 120, runnerAge, queued });
        }

        if (path === '/api/jobs' && method === 'POST') return await createJob(request, env);

        if (method === 'GET' && path.startsWith('/api/jobs/')) {
          const id = path.split('/')[3];
          if (!/^[0-9a-f-]{36}$/i.test(id)) return err('id tidak valid');
          const data = await getJob(env, id);
          return data ? json(data) : err('job tidak ditemukan', 404);
        }

        if (!(await runnerAuth(request, env))) return err('tidak diizinkan', 401);

        if (path === '/api/runner/next' && method === 'GET') return await runnerNext(request, env);

        const m = path.match(/^\/api\/runner\/jobs\/([0-9a-f-]{36})\/events$/i);
        if (m && method === 'POST') return await runnerEvents(request, env, m[1]);

        return err('tidak ditemukan', 404);
      } catch (e) {
        return err('kesalahan server: ' + (e?.message || 'unknown'), 500);
      }
    }

    // selain /api -> aset statis
    return env.ASSETS.fetch(request);
  },
};
