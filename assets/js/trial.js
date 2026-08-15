(() => {
  const API = 'https://license.topup.eu.org';
  const status = document.querySelector('#trial-status');
  const googleMount = document.querySelector('#google-signin');
  const githubButton = document.querySelector('#github-signin');
  const microsoftButton = document.querySelector('#microsoft-signin');
  const gitlabButton = document.querySelector('#gitlab-signin');
  const telegramButton = document.querySelector('#telegram-signin');
  const signinRow = document.querySelector('#trial-signin-row');
  const account = document.querySelector('#trial-account');
  const action = document.querySelector('#trial-action');
  const license = document.querySelector('#trial-license');
  const email = document.querySelector('#trial-email');
  const name = document.querySelector('#trial-name');
  const create = document.querySelector('#trial-create');
  const logout = document.querySelector('#trial-logout');
  const key = document.querySelector('#trial-license-key');
  const copy = document.querySelector('#trial-copy');
  const meta = document.querySelector('#trial-license-meta');
  const keyLabel = document.querySelector('#trial-key-label');
  const keyRow = document.querySelector('#trial-key-row');
  const keyHelp = document.querySelector('#trial-key-help');
  const licenseTitle = document.querySelector('#trial-license-title');
  const licenseIcon = document.querySelector('#trial-license-icon');
  const expiredMessage = document.querySelector('#trial-expired-message');
  const avatar = document.querySelector('#trial-avatar');
  let githubConfigured = false;
  let microsoftConfigured = false;
  let gitlabConfigured = false;
  let telegramConfigured = false;
  let googleConfigured = false;
  if (!status || !googleMount) return;

  const setStatus = (message, kind = '') => {
    status.textContent = message;
    status.className = `trial-status${kind ? ` trial-status--${kind}` : ''}`;
  };


  const syncProviderVisibility = () => {
    googleMount.hidden = !googleConfigured;
    if (githubButton) githubButton.hidden = !githubConfigured;
    if (microsoftButton) microsoftButton.hidden = !microsoftConfigured;
    if (gitlabButton) gitlabButton.hidden = !gitlabConfigured;
    if (telegramButton) telegramButton.hidden = !telegramConfigured;
  };

  const sha256Fallback = (str) => {
    let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a,
        h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;
    const bytes = new TextEncoder().encode(str);
    const bitLen = bytes.length * 8;
    const padded = new Uint8Array(Math.ceil((bytes.length + 9) / 64) * 64);
    padded.set(bytes);
    padded[bytes.length] = 0x80;
    const view = new DataView(padded.buffer);
    view.setUint32(padded.length - 4, bitLen, false);
    const K = [
      0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
      0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
      0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
      0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
      0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
      0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
      0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
      0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
    ];
    const rotr = (x, n) => (x >>> n) | (x << (32 - n));
    for (let off = 0; off < padded.length; off += 64) {
      const w = new Int32Array(64);
      for (let i = 0; i < 16; i++) w[i] = view.getInt32(off + i * 4, false);
      for (let i = 16; i < 64; i++) {
        const s0 = rotr(w[i-15],7) ^ rotr(w[i-15],18) ^ (w[i-15]>>>3);
        const s1 = rotr(w[i-2],17) ^ rotr(w[i-2],19) ^ (w[i-2]>>>10);
        w[i] = (w[i-16] + s0 + w[i-7] + s1) | 0;
      }
      let a=h0, b=h1, c=h2, d=h3, e=h4, f=h5, g=h6, h=h7;
      for (let i = 0; i < 64; i++) {
        const S1 = rotr(e,6) ^ rotr(e,11) ^ rotr(e,25);
        const ch = (e & f) ^ (~e & g);
        const t1 = (h + S1 + ch + K[i] + w[i]) | 0;
        const S0 = rotr(a,2) ^ rotr(a,13) ^ rotr(a,22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const t2 = (S0 + maj) | 0;
        h=g; g=f; f=e; e=(d+t1)|0; d=c; c=b; b=a; a=(t1+t2)|0;
      }
      h0=(h0+a)|0; h1=(h1+b)|0; h2=(h2+c)|0; h3=(h3+d)|0;
      h4=(h4+e)|0; h5=(h5+f)|0; h6=(h6+g)|0; h7=(h7+h)|0;
    }
    return [h0,h1,h2,h3,h4,h5,h6,h7].map(v => (v>>>0).toString(16).padStart(8,'0')).join('');
  };

  const detectWebRtcIps = () => new Promise((resolve) => {
    try {
      const pc = new (window.RTCPeerConnection || window.webkitRTCPeerConnection)({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
      const ips = new Set();
      const privateRe = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|127\.|0\.0\.0\.0|::1|fe80:)/i;
      pc.createDataChannel('');
      pc.createOffer().then(o => pc.setLocalDescription(o)).catch(() => {});
      pc.onicecandidate = (e) => {
        if (!e.candidate) return;
        const m = e.candidate.candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
        if (m && !privateRe.test(m[1])) ips.add(m[1]);
      };
      setTimeout(() => { try { pc.close(); } catch {} resolve([...ips]); }, 3000);
    } catch { resolve([]); }
  });

  const canvasFingerprint = () => {
    try {
      const c = document.createElement('canvas');
      c.width = 260; c.height = 64;
      const x = c.getContext('2d');
      if (!x) return '';
      x.fillStyle = '#e74c3c'; x.fillRect(0, 0, 130, 64);
      x.fillStyle = '#2ecc71'; x.fillRect(130, 0, 130, 64);
      x.fillStyle = '#3498db'; x.beginPath(); x.arc(65, 32, 24, 0, Math.PI * 2); x.fill();
      x.fillStyle = '#f39c12'; x.beginPath(); x.arc(195, 32, 18, 0, Math.PI * 2); x.fill();
      x.globalCompositeOperation = 'difference';
      x.fillStyle = '#fff'; x.fillRect(50, 10, 160, 44);
      x.globalCompositeOperation = 'source-over';
      x.font = 'bold 15px Arial,Helvetica,sans-serif';
      x.fillStyle = '#1a1a2e'; x.fillText('TopOrg~Fp!#2026', 4, 22);
      x.font = 'italic 12px Georgia,serif';
      x.fillStyle = '#16213e'; x.fillText('canvas\u2603\u2764\u2605', 4, 48);
      x.strokeStyle = '#0f3460'; x.lineWidth = 2;
      x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(65, 64, 195, 0, 260, 64); x.stroke();
      const d = x.getImageData(0, 0, 260, 64).data;
      let s = '';
      for (let i = 0; i < d.length; i += 17) s += String.fromCharCode(d[i]);
      return sha256Fallback(s);
    } catch { return ''; }
  };

  const webglFingerprint = () => {
    try {
      const c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
      if (!gl) return '';
      const parts = [];
      const di = gl.getExtension('WEBGL_debug_renderer_info');
      if (di) { parts.push(gl.getParameter(di.UNMASKED_VENDOR_WEBGL)); parts.push(gl.getParameter(di.UNMASKED_RENDERER_WEBGL)); }
      parts.push(gl.getParameter(gl.VERSION));
      parts.push(gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
      const exts = gl.getSupportedExtensions() || [];
      parts.push(exts.sort().join(','));
      [gl.MAX_TEXTURE_SIZE, gl.MAX_VIEWPORT_DIMS, gl.MAX_VERTEX_ATTRIBS, gl.MAX_VARYING_VECTORS, gl.MAX_FRAGMENT_UNIFORM_VECTORS, gl.MAX_VERTEX_UNIFORM_VECTORS, gl.ALIASED_LINE_WIDTH_RANGE, gl.ALIASED_POINT_SIZE_RANGE].forEach(p => parts.push(String(gl.getParameter(p))));
      gl.clearColor(0.2, 0.4, 0.6, 1); gl.clear(gl.COLOR_BUFFER_BIT);
      const vs = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vs, 'attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}'); gl.compileShader(vs);
      const fs = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fs, 'precision mediump float;void main(){gl_FragColor=vec4(0.9,0.3,0.7,1);}'); gl.compileShader(fs);
      const pg = gl.createProgram(); gl.attachShader(pg, vs); gl.attachShader(pg, fs); gl.linkProgram(pg); gl.useProgram(pg);
      const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0.8, -0.8, -0.8, 0.8, -0.8]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(pg, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      const px = new Uint8Array(64 * 64 * 4); gl.readPixels(0, 0, 64, 64, gl.RGBA, gl.UNSIGNED_BYTE, px);
      let s = '';
      for (let i = 0; i < px.length; i += 23) s += String.fromCharCode(px[i]);
      parts.push(s);
      return sha256Fallback(parts.join('|'));
    } catch { return ''; }
  };

  const collectFingerprint = async () => {
    const parts = [];
    parts.push(`screen:${screen.width}x${screen.height}@${screen.availWidth || 0}x${screen.availHeight || 0}`);
    parts.push(`cd:${screen.colorDepth}|${screen.pixelDepth}`);
    parts.push(`pr:${window.devicePixelRatio || 1}`);
    parts.push(`tz:${new Date().getTimezoneOffset()}`);
    parts.push(`hw:${navigator.hardwareConcurrency || 0}`);
    parts.push(`dm:${navigator.deviceMemory || 0}`);
    parts.push(`pl:${navigator.platform || ''}`);
    parts.push(`lang:${navigator.languages ? navigator.languages.join(',') : (navigator.language || '')}`);
    parts.push(`touch:${navigator.maxTouchPoints || 0}`);
    parts.push(`ck:${navigator.cookieEnabled ? '1' : '0'}`);
    parts.push(`dnt:${navigator.doNotTrack || ''}`);
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          parts.push(`gpu:${gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)}|${gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)}`);
        }
      }
    } catch {}
    const raw = parts.join('|');
    let deviceFp;
    try {
      if (window.crypto && crypto.subtle && crypto.subtle.digest) {
        const buffer = new TextEncoder().encode(raw);
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        deviceFp = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
      }
    } catch {}
    if (!deviceFp) deviceFp = sha256Fallback(raw);
    const webrtcIps = await detectWebRtcIps();
    return {
      device_fingerprint: deviceFp,
      canvas_fp: canvasFingerprint(),
      webgl_fp: webglFingerprint(),
      tz_offset: new Date().getTimezoneOffset(),
      tz_name: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
      browser_lang: navigator.language || '',
      webrtc_ips: webrtcIps,
    };
  };

  const request = async (path, options = {}) => {
    const response = await fetch(`${API}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Request failed. Please try again.');
    return data;
  };

  const formatDate = (value) => {
    const timestamp = Date.parse(value || '');
    return Number.isFinite(timestamp) ? new Date(timestamp).toLocaleString() : 'unknown date';
  };

  const getLicenseState = (licenseData) => {
    const expiresAt = Date.parse(licenseData?.expires_at || '');
    const expiredByDate = Number.isFinite(expiresAt) && expiresAt <= Date.now();
    const statusName = String(licenseData?.status || '').toLowerCase();
    if (statusName === 'expired' || expiredByDate) return 'expired';
    if (statusName && statusName !== 'active') return 'unavailable';
    return 'active';
  };

  const hideLicenseKey = () => {
    if (key) key.value = '';
    if (keyRow) keyRow.hidden = true;
    if (keyLabel) keyLabel.hidden = true;
    if (keyHelp) keyHelp.hidden = true;
  };

  const renderLicense = (licenseData) => {
    const state = getLicenseState(licenseData);
    action.hidden = true;
    license.hidden = false;
    license.classList.toggle('trial-license--expired', state === 'expired');
    license.classList.toggle('trial-license--unavailable', state === 'unavailable');
    if (expiredMessage) expiredMessage.hidden = state !== 'expired';

    if (state === 'expired') {
      hideLicenseKey();
      if (licenseTitle) licenseTitle.textContent = 'Trial expired';
      if (licenseIcon) {
        licenseIcon.textContent = '!';
        licenseIcon.className = 'trial-step trial-step--expired';
      }
      if (meta) meta.textContent = `Expired ${formatDate(licenseData.expires_at)}`;
      setStatus('Your one-day trial has expired.', 'error');
      return;
    }

    if (state === 'unavailable') {
      hideLicenseKey();
      if (licenseTitle) licenseTitle.textContent = 'Trial unavailable';
      if (licenseIcon) {
        licenseIcon.textContent = '!';
        licenseIcon.className = 'trial-step trial-step--expired';
      }
      if (meta) meta.textContent = `Status: ${licenseData.status || 'inactive'}`;
      setStatus('This trial license is no longer available.', 'error');
      return;
    }

    if (licenseTitle) licenseTitle.textContent = 'Trial license ready';
    if (licenseIcon) {
      licenseIcon.textContent = '✓';
      licenseIcon.className = 'trial-step trial-step--done';
    }
    if (meta) meta.textContent = `Active · expires ${formatDate(licenseData.expires_at)}`;
    const readableKey = String(licenseData.license_key || '');
    if (readableKey && key) {
      key.value = readableKey;
      if (keyRow) keyRow.hidden = false;
      if (keyLabel) keyLabel.hidden = false;
      if (keyHelp) {
        keyHelp.hidden = false;
        keyHelp.textContent = 'Save this key securely. It remains available only while your trial is active and you are signed in.';
      }
    } else {
      hideLicenseKey();
      if (keyHelp) {
        keyHelp.hidden = false;
        keyHelp.textContent = 'This older trial key was created before secure key recovery was enabled and cannot be shown again.';
      }
    }
    setStatus('Your account already has an active trial license.', 'success');
  };

  const showAccount = (data) => {
    if (signinRow) signinRow.hidden = true;
    googleMount.hidden = true;
    if (githubButton) githubButton.hidden = true;
    if (microsoftButton) microsoftButton.hidden = true;
    if (gitlabButton) gitlabButton.hidden = true;
    if (telegramButton) telegramButton.hidden = true;
    account.hidden = false;
    const accountNavLink = document.querySelector('#account-nav-link');
    if (accountNavLink) accountNavLink.hidden = true;
    const provider = String(data.user.provider || '').toLowerCase();
    if (avatar) {
      avatar.textContent = provider === 'github' ? 'GH' : (provider === 'microsoft' ? 'MS' : (provider === 'gitlab' ? 'GL' : (provider === 'telegram' ? 'TG' : 'G')));
      avatar.classList.toggle('trial-avatar--github', provider === 'github');
      avatar.classList.toggle('trial-avatar--microsoft', provider === 'microsoft');
      avatar.classList.toggle('trial-avatar--gitlab', provider === 'gitlab');
      avatar.classList.toggle('trial-avatar--telegram', provider === 'telegram');
    }
    const providerName = provider === 'github' ? 'GitHub account' : (provider === 'microsoft' ? 'Microsoft account' : (provider === 'gitlab' ? 'GitLab account' : (provider === 'telegram' ? 'Telegram account' : 'Google account')));
    name.textContent = data.user.name || providerName;
    email.textContent = data.user.email;
    if (data.license) {
      renderLicense(data.license);
    } else {
      action.hidden = true;
      license.hidden = true;
      hideLicenseKey();
      initEmailVerification(data.user.email || '');
    }
  };

  const initEmailVerification = (prefillEmail) => {
    const isTelegram = prefillEmail.startsWith('Telegram ID');
    const emailValue = isTelegram ? '' : prefillEmail;
    const emailSection = document.createElement('div');
    emailSection.id = 'trial-email-section';
    emailSection.className = 'trial-row trial-row--email';
    emailSection.innerHTML = `
      <span class="trial-step">2</span>
      <div class="trial-row__copy" style="flex:1;min-width:0">
        <h2>Verify your email</h2>
        <p>Only @gmail.com addresses are accepted. A 6-digit code will be sent.</p>
        <input id="trial-verify-email" type="email" placeholder="yourname@gmail.com" value="${emailValue}" ${prefillEmail && !isTelegram ? 'readonly' : ''} style="width:100%;padding:12px 14px;border-radius:8px;border:1px solid var(--border,#334155);background:var(--surface,#1e293b);color:inherit;margin:8px 0;font-size:16px;box-sizing:border-box">
        <div id="trial-otp-row" hidden style="display:flex;gap:8px;align-items:center;margin-top:8px;flex-wrap:wrap">
          <input id="trial-otp-input" type="text" inputmode="numeric" maxlength="6" placeholder="6-digit code" style="flex:1;min-width:120px;padding:12px 14px;border-radius:8px;border:1px solid var(--border,#334155);background:var(--surface,#1e293b);color:inherit;font-size:20px;letter-spacing:8px;text-align:center;box-sizing:border-box">
          <button id="trial-verify-btn" class="button button--primary" type="button" style="white-space:nowrap">Verify</button>
        </div>
        <p id="trial-email-status" style="font-size:13px;margin:6px 0 0;color:var(--muted,#94a3b8)"></p>
      </div>
      <button id="trial-send-otp" class="button button--primary" type="button" style="white-space:nowrap;align-self:flex-start;margin-top:4px">Send code</button>`;
    if (action && action.parentNode) action.parentNode.insertBefore(emailSection, action);
    const emailInput = emailSection.querySelector('#trial-verify-email');
    const sendBtn = emailSection.querySelector('#trial-send-otp');
    const otpRow = emailSection.querySelector('#trial-otp-row');
    const otpInput = emailSection.querySelector('#trial-otp-input');
    const verifyBtn = emailSection.querySelector('#trial-verify-btn');
    const emailStatus = emailSection.querySelector('#trial-email-status');
    let cooldownTimer = null;
    const startCooldown = () => {
      let seconds = 60;
      sendBtn.disabled = true;
      sendBtn.textContent = `Resend (${seconds}s)`;
      cooldownTimer = setInterval(() => {
        seconds--;
        sendBtn.textContent = `Resend (${seconds}s)`;
        if (seconds <= 0) {
          clearInterval(cooldownTimer);
          cooldownTimer = null;
          sendBtn.disabled = false;
          sendBtn.textContent = 'Resend code';
        }
      }, 1000);
    };
    sendBtn.addEventListener('click', async () => {
      const em = emailInput.value.trim().toLowerCase();
      if (!em.endsWith('@gmail.com')) { emailStatus.textContent = 'Only @gmail.com addresses are accepted.'; emailStatus.style.color = '#ef4444'; return; }
      sendBtn.disabled = true; emailStatus.textContent = 'Sending verification code…'; emailStatus.style.color = '#94a3b8';
      try {
        const res = await request('/v1/trial/request-otp', { method: 'POST', body: JSON.stringify({ email: em }) });
        if (res.already_verified) {
          emailStatus.textContent = 'Already verified! Redirecting…'; emailStatus.style.color = '#22c55e';
          setTimeout(() => window.location.replace('/accounts/trial-license/'), 1000);
          return;
        }
        emailStatus.textContent = res.message || 'Code sent. Check your inbox.'; emailStatus.style.color = '#22c55e';
        otpRow.hidden = false; otpInput.focus();
        sendBtn.textContent = 'Resend';
        startCooldown();
      } catch (err) { emailStatus.textContent = err.message; emailStatus.style.color = '#ef4444'; sendBtn.disabled = false; }
    });
    verifyBtn.addEventListener('click', async () => {
      const otp = otpInput.value.trim();
      if (otp.length !== 6) { emailStatus.textContent = 'Enter the 6-digit code.'; emailStatus.style.color = '#ef4444'; return; }
      verifyBtn.disabled = true; emailStatus.textContent = 'Verifying…'; emailStatus.style.color = '#94a3b8';
      try {
        await request('/v1/trial/verify-otp', { method: 'POST', body: JSON.stringify({ email: emailInput.value.trim().toLowerCase(), otp }) });
        emailStatus.textContent = 'Email verified! Redirecting…'; emailStatus.style.color = '#22c55e';
        emailSection.innerHTML = '<span class="trial-step trial-step--done" aria-hidden="true">✓</span><div class="trial-row__copy"><h2>Email verified</h2><p>Redirecting to your dashboard…</p></div>';
        if (cooldownTimer) clearInterval(cooldownTimer);
        setTimeout(() => window.location.replace('/accounts/trial-license/'), 1500);
      } catch (err) { emailStatus.textContent = err.message; emailStatus.style.color = '#ef4444'; }
      finally { verifyBtn.disabled = false; }
    });
    setStatus('Verify your email to continue.', 'neutral');
  };

  const loadAccount = async () => {
    try {
      const data = await request('/v1/account');
      if (data.license && data.license.status === 'active') {
        window.location.replace('/accounts/overview/');
      } else if (data.otp_verified) {
        window.location.replace('/accounts/trial-license/');
      } else {
        showAccount(data);
      }
    } catch {
      setStatus('Sign in with Google, GitHub, Microsoft, GitLab, or Telegram to create your trial.', 'neutral');
    }
  };

  const initialize = async () => {
    try {
      const config = await request('/v1/auth/config', { method: 'GET', headers: {} });
      githubConfigured = Boolean(config.github_enabled);
      microsoftConfigured = Boolean(config.microsoft_enabled);
      gitlabConfigured = Boolean(config.gitlab_enabled);
      telegramConfigured = Boolean(config.telegram_enabled);

      const googleReady = Boolean(config.google_oauth_enabled);
      googleConfigured = googleReady;
      syncProviderVisibility();
      if (!googleReady && !githubConfigured && !microsoftConfigured && !gitlabConfigured && !telegramConfigured) throw new Error('No sign-in provider is configured yet.');
      await loadAccount();
      const authError = new URLSearchParams(window.location.search).get('auth_error');
      if (authError && account.hidden) setStatus(authError, 'error');
    } catch (error) {
      setStatus(error.message, 'error');
    }
  };

  create?.addEventListener('click', async () => {
    try {
      if (localStorage.getItem('smmo_trial_created') === '1') {
        setStatus('A trial was already created from this device. Contact support if this is an error.', 'error');
        return;
      }
    } catch {}
    create.disabled = true;
    setStatus('Creating your trial license…');
    try {
      const fp = await collectFingerprint();
      const body = {
        device_fingerprint: fp.device_fingerprint,
        tz_offset: fp.tz_offset,
        tz_name: fp.tz_name,
        browser_lang: fp.browser_lang,
        webrtc_ips: fp.webrtc_ips,
      };
      if (fp.canvas_fp) body.canvas_fp = fp.canvas_fp;
      if (fp.webgl_fp) body.webgl_fp = fp.webgl_fp;
      const result = await request('/v1/trial', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      try { localStorage.setItem('smmo_trial_created', '1'); } catch {}
      renderLicense({
        status: 'active',
        expires_at: result.expires_at,
        license_key: result.license_key,
        max_devices: result.max_devices,
      });
      setStatus('Trial license created. Copy and save the key now.', 'success');
    } catch (error) {
      setStatus(error.message, 'error');
    } finally {
      create.disabled = false;
    }
  });

  copy?.addEventListener('click', async () => {
    if (!key?.value) return;
    try {
      await navigator.clipboard.writeText(key.value);
      copy.textContent = 'Copied';
      setTimeout(() => { copy.textContent = 'Copy'; }, 1600);
    } catch {
      key.select();
      document.execCommand('copy');
    }
  });

  logout?.addEventListener('click', async () => {
    try {
      await request('/v1/auth/logout', { method: 'POST', body: '{}' });
    } catch {}
    account.hidden = true;
    action.hidden = true;
    license.hidden = true;
    hideLicenseKey();
    if (signinRow) signinRow.hidden = false;
    syncProviderVisibility();
    setStatus('Signed out. Sign in with Google, GitHub, Microsoft, GitLab, or Telegram to continue.', 'neutral');
  });

  initialize();
})();
