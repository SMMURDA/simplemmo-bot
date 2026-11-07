#!/usr/bin/env python3
"""
wininstaller runner
===================

Service kecil yang mengambil job dari Worker (wininstaller.topup.eu.org),
menyambung SSH ke VPS tujuan, memeriksa kesesuaian, lalu menjalankan
reinstall ke Windows memakai script bin456789/reinstall (ISO resmi Microsoft
+ driver virtio otomatis). Tanpa image buatan sendiri.

Jalankan:
    python3 runner.py --once          # proses satu job lalu keluar (uji)
    python3 runner.py                 # daemon, poll terus
    python3 runner.py --dry-run       # tidak mengeksekusi apa pun, hanya cetak rencana

Konfigurasi (env atau .env di direktori yang sama):
    WI_API      default https://wininstaller.topup.eu.org
    WI_TOKEN    bearer token runner (wajib)
    WI_NAME     nama runner, untuk log di sisi Worker
    WI_POLL     detik antar poll (default 5)
    WI_HOLD     "1" = jalankan dengan --hold 1 (berhenti di lingkungan installer)
    WI_RDP_WAIT menit menunggu port 3389 (default 45)
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import shlex
import socket
import sys
import time
import urllib.error
import urllib.request

try:
    import asyncssh
except ImportError:  # pragma: no cover
    print('butuh paket asyncssh: pip install asyncssh', file=sys.stderr)
    raise

IMAGE_NAMES = {
    'ws2022': 'Windows Server 2022 ServerStandard',
    'ws2019': 'Windows Server 2019 ServerStandard',
}

PREFLIGHT_SH = r'''
v=$(systemd-detect-virt 2>/dev/null || echo unknown)
mem=$(awk '/MemTotal/{printf "%d",$2/1024}' /proc/meminfo)
disk=$(df -BG --output=avail / 2>/dev/null | tail -1 | tr -dc 0-9)
boot=$([ -d /sys/firmware/efi ] && echo uefi || echo bios)
grub=$(([ -d /boot/grub ] || [ -d /boot/grub2 ]) && echo yes || echo no)
kx=$(command -v kexec >/dev/null && echo yes || echo no)
osid=$( . /etc/os-release 2>/dev/null; echo "${ID:-?}" )
echo "WI|$v|$mem|$disk|$boot|$grub|$kx|$osid"
'''

BLOCKED_VIRT = {'openvz', 'lxc', 'lxc-libvirt', 'docker', 'podman', 'systemd-nspawn'}
MIN_MEM_MB = 1900
MIN_DISK_GB = 22


def log(*a):
    print(time.strftime('%H:%M:%S'), *a, flush=True)


class Api:
    def __init__(self, base: str, token: str, name: str):
        self.base = base.rstrip('/')
        self.token = token
        self.name = name

    def _req(self, path: str, method: str = 'GET', body: dict | None = None):
        data = json.dumps(body).encode() if body is not None else None
        req = urllib.request.Request(
            self.base + path,
            method=method,
            data=data,
            headers={
                'content-type': 'application/json',
                'authorization': f'Bearer {self.token}',
                'x-runner-name': self.name,
                # Cloudflare memblokir UA bawaan urllib; pakai UA eksplisit.
                'user-agent': 'wininstaller-runner/1.0 (+https://wininstaller.topup.eu.org)',
            },
        )
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.load(r)

    def next_job(self):
        return self._req('/api/runner/next').get('job')

    def events(self, job_id: str, events: list[dict], status: str | None = None, error: str = ''):
        payload = {'events': events}
        if status:
            payload['status'] = status
        if error:
            payload['error'] = error
        try:
            return self._req(f'/api/runner/jobs/{job_id}/events', 'POST', payload)
        except (urllib.error.URLError, TimeoutError) as e:
            log('! gagal kirim event:', e)
            return None


class Reporter:
    """Menampung baris log dan mengirimnya berkelompok, supaya tidak spam API."""

    def __init__(self, api: Api, job_id: str, secrets=()):
        self.api = api
        self.job_id = job_id
        self.buf: list[dict] = []
        self.last = 0.0
        # Script reinstall mencetak password ke stdout; jangan sampai masuk log.
        self.secrets = [s for s in secrets if s and len(s) >= 4]

    def add(self, msg: str, level: str = 'info', step: str = ''):
        msg = msg.rstrip()
        for s in self.secrets:
            msg = msg.replace(s, '***')
        if not msg:
            return
        self.buf.append({'level': level, 'step': step, 'msg': msg[:800]})
        log(level.upper(), msg)
        if len(self.buf) >= 10:
            self.flush()

    def flush(self, force: bool = False):
        if not self.buf:
            return
        if not force and time.time() - self.last < 1.5:
            return
        batch, self.buf = self.buf, []
        self.last = time.time()
        self.api.events(self.job_id, batch)

    def step(self, name: str, msg: str, level: str = 'info'):
        self.add(msg, level, name)
        self.flush(force=True)


async def connect(job):
    kwargs = dict(
        host=job['host'],
        port=int(job['port'] or 22),
        username=job['sshUser'],
        known_hosts=None,          # VPS baru: kunci host belum ada
        login_timeout=25,
    )
    if job.get('auth') == 'key':
        kwargs['client_keys'] = [asyncssh.import_private_key(job['secret'])]
    else:
        kwargs['password'] = job['secret']
        kwargs['client_keys'] = None
        kwargs['preferred_auth'] = 'password,keyboard-interactive'
    return await asyncssh.connect(**kwargs)


async def preflight(conn, rep: Reporter) -> dict:
    rep.step('preflight', 'memeriksa sistem: virtualisasi, RAM, disk, boot mode')
    res = await conn.run(PREFLIGHT_SH, check=False, timeout=60)
    line = ''
    for ln in (res.stdout or '').splitlines():
        if ln.startswith('WI|'):
            line = ln
            break
    if not line:
        raise RuntimeError('tidak bisa membaca informasi sistem (bukan Linux?)')

    _, virt, mem, disk, boot, grub, kexec, osid = line.split('|')[:8]
    info = {
        'virt': virt, 'mem': int(mem or 0), 'disk': int(disk or 0),
        'boot': boot, 'grub': grub, 'kexec': kexec, 'os': osid,
    }
    rep.add(f'os={osid} virt={virt} ram={info["mem"]}MB disk={info["disk"]}GB boot={boot} grub={grub} kexec={kexec}')

    if virt in BLOCKED_VIRT:
        raise RuntimeError(f'virtualisasi {virt} tidak didukung (butuh KVM/bare metal)')
    if info['mem'] < MIN_MEM_MB:
        raise RuntimeError(f'RAM {info["mem"]} MB terlalu kecil (minimal ~2 GB)')
    if info['disk'] < MIN_DISK_GB:
        raise RuntimeError(f'sisa disk {info["disk"]} GB terlalu kecil (minimal {MIN_DISK_GB} GB)')

    rep.step('preflight', f'lolos syarat · {virt} · {info["mem"]} MB · {info["disk"]} GB · {boot}', 'ok')
    return info


def redact(cmd: str, job: dict) -> str:
    pw = job.get('adminPass') or ''
    return cmd.replace(pw, '***') if pw else cmd


def build_command(job, hold: bool) -> str:
    image = IMAGE_NAMES.get(job['os'], IMAGE_NAMES['ws2022'])
    args = [
        'bash', '/tmp/wi-reinstall.sh', 'windows',
        '--image-name', image,
        '--lang', 'en-us',
        '--username', 'Administrator',
        '--password', job['adminPass'],
        '--rdp-port', '3389',
        '--allow-ping',
    ]
    if hold:
        args += ['--hold', '1']
    return ' '.join(shlex.quote(a) for a in args)


async def stream_process(process, rep: Reporter, step: str):
    """Baca stdout+stderr sampai perintah selesai atau koneksi putus."""
    async def pump(reader):
        while True:
            try:
                chunk = await reader.read(512)
            except (asyncssh.Error, OSError):
                return
            if not chunk:
                return
            for ln in str(chunk).replace('\r', '').splitlines():
                low = ln.lower()
                level = 'warn' if ('error' in low or 'fail' in low) else 'info'
                rep.add(ln, level, step)

    await asyncio.gather(pump(process.stdout), pump(process.stderr), return_exceptions=True)


async def wait_rdp(host: str, minutes: int, rep: Reporter):
    deadline = time.time() + minutes * 60
    attempt = 0
    while time.time() < deadline:
        attempt += 1
        try:
            fut = asyncio.open_connection(host, 3389)
            reader, writer = await asyncio.wait_for(fut, timeout=6)
            writer.close()
            try:
                await writer.wait_closed()
            except Exception:
                pass
            rep.step('rdp', f'port 3389 terbuka setelah {attempt} percobaan', 'ok')
            return True
        except (OSError, asyncio.TimeoutError):
            if attempt % 6 == 0:
                rep.add(f'menunggu RDP… ({attempt} percobaan, sisa {int((deadline - time.time()) / 60)} menit)', 'info', 'rdp')
        await asyncio.sleep(20)
    return False


async def run_job(api: Api, job: dict, hold: bool, rdp_wait: int, dry: bool):
    rep = Reporter(api, job['id'], secrets=(job.get('adminPass') or '', job.get('secret') or ''))
    rep.step('queue', f"job {job['id'][:8]} diterima · {job.get('osName')} · mode {job.get('mode')}", 'ac')
    rep.add(f"target {job['sshUser']}@{job['host']}:{job['port']} · hostname {job.get('hostname')}")

    if job.get('mode') == 'rescue':
        rep.add('mode rescue: pastikan VPS sudah di-boot ke rescue/live Linux sebelum job ini', 'warn')

    if dry:
        rep.add('[dry-run] tidak menyentuh server', 'ac')
        rep.add('[dry-run] perintah: ' + redact(build_command(job, hold), job))
        rep.flush(force=True)
        api.events(job['id'], [{'level': 'warn', 'step': 'apply', 'msg': 'dry-run: job tidak dieksekusi'}],
                   status='error', error='dry-run (tidak dieksekusi)')
        return

    try:
        conn = await connect(job)
    except Exception as e:
        api.events(job['id'], [{'level': 'err', 'step': 'queue', 'msg': f'SSH gagal: {e}'}], status='error',
                   error='SSH gagal — periksa IP, port, user, dan kredensial')
        rep.flush(force=True)
        return

    try:
        rep.step('queue', 'SSH terhubung', 'ok')
        await preflight(conn, rep)

        rep.step('download', 'mengunduh script reinstall resmi (bin456789/reinstall)')
        dl = await conn.run(
            'curl -fsSL --retry 2 -o /tmp/wi-reinstall.sh '
            'https://raw.githubusercontent.com/bin456789/reinstall/main/reinstall.sh '
            '&& wc -c /tmp/wi-reinstall.sh',
            check=False,
        )
        if dl.exit_status != 0:
            raise RuntimeError('gagal mengunduh script: ' + (dl.stderr or '').strip()[:200])
        rep.add('script siap: ' + (dl.stdout or '').strip(), 'ok', 'download')

        cmd = build_command(job, hold)
        rep.step('apply', 'menjalankan instalasi — server akan menulis disk lalu reboot')
        rep.add('perintah: ' + redact(cmd, job))

        process = await conn.create_process(cmd, term_type=None)
        try:
            await asyncio.wait_for(stream_process(process, rep, 'apply'), timeout=5400)
        except asyncio.TimeoutError:
            raise RuntimeError('instalasi melewati batas 90 menit tanpa selesai')

        # Script hanya MENYIAPKAN entri GRUB; reboot tidak terjadi saat sesi
        # non-interaktif (tidak ada tty untuk konfirmasi). Jadi reboot dilakukan di sini.
        try:
            process.close()
        except Exception:
            pass

        if not hold:
            rep.step('reboot', 'instalasi siap — me-reboot server sekarang')
            rb = await conn.run('(sleep 3; reboot) >/dev/null 2>&1 & echo reboot-terkirim',
                                check=False, timeout=30)
            rep.add('reboot: ' + ((rb.stdout or '').strip() or 'dikirim'))

        conn.close()

        if hold:
            rep.step('reboot', 'mode --hold 1: instalasi tidak dijalankan. Cek SSH/console manual.', 'warn')
            api.events(job['id'], [], status='done')
            rep.flush(force=True)
            return

        rep.step('rdp', f'menunggu port 3389 di {job["host"]} (maks {rdp_wait} menit)')
        ok = await wait_rdp(job['host'], rdp_wait, rep)
        if ok:
            api.events(job['id'], [], status='done')
            rep.step('rdp', f'Windows siap · RDP {job["host"]}:3389 · user Administrator', 'ok')
        else:
            api.events(job['id'], [{'level': 'warn', 'step': 'rdp',
                                    'msg': 'RDP belum terbuka; Windows mungkin masih boot atau IP perlu diset manual'}],
                       status='error', error='RDP tidak terbuka dalam batas waktu')
        rep.flush(force=True)
    except Exception as e:
        log('job gagal:', e)
        rep.step('apply', f'gagal: {e}', 'err')
        api.events(job['id'], [], status='error', error=str(e)[:400])
        rep.flush(force=True)
        try:
            conn.close()
        except Exception:
            pass


async def main_async(args, api: Api, hold: bool):
    log(f'runner {api.name} → {api.base}')
    idle = 0
    while True:
        try:
            job = await asyncio.to_thread(api.next_job)
        except Exception as e:
            log('! poll gagal:', e)
            job = None
        if not job:
            idle += 1
            if args.once:
                log('tidak ada job.')
                return
            if idle % 12 == 0:
                log('menunggu job…')
            await asyncio.sleep(args.poll)
            continue
        idle = 0
        log(f"job {job['id'][:8]} · {job.get('osName')} · {job['host']}")
        await run_job(api, job, hold, args.rdp_wait, args.dry_run)
        if args.once:
            return


def load_env():
    here = os.path.dirname(os.path.abspath(__file__))
    for name in ('.env', 'runner.env'):
        p = os.path.join(here, name)
        if os.path.exists(p):
            for line in open(p):
                line = line.strip()
                if not line or line.startswith('#') or '=' not in line:
                    continue
                k, v = line.split('=', 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def main():
    load_env()
    ap = argparse.ArgumentParser(description='wininstaller runner')
    ap.add_argument('--once', action='store_true', help='proses satu job lalu keluar')
    ap.add_argument('--dry-run', action='store_true', help='jangan eksekusi apa pun')
    ap.add_argument('--rdp-wait', type=int, default=int(os.environ.get('WI_RDP_WAIT', 45)))
    ap.add_argument('--poll', type=int, default=int(os.environ.get('WI_POLL', 5)))
    args = ap.parse_args()

    token = os.environ.get('WI_TOKEN', '')
    if len(token) < 16:
        sys.exit('WI_TOKEN belum diset (lihat runner.env.example)')

    api = Api(os.environ.get('WI_API', 'https://wininstaller.topup.eu.org'),
              token, os.environ.get('WI_NAME', socket.gethostname()))
    hold = os.environ.get('WI_HOLD', '0') == '1'
    asyncio.run(main_async(args, api, hold))


if __name__ == '__main__':
    main()
