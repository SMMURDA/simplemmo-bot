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

  const errorContacts = document.querySelector('#trial-error-contacts');
  const setStatus = (message, kind = '') => {
    status.textContent = message;
    status.className = `trial-status${kind ? ` trial-status--${kind}` : ''}`;
    if (errorContacts) errorContacts.classList.toggle('is-visible', kind === 'error');
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

  const collectFingerprint = async () => {
    const parts = [];

    parts.push(`screen:${screen.width}x${screen.height}`);
    parts.push(`colorDepth:${screen.colorDepth}`);
    parts.push(`pixelRatio:${window.devicePixelRatio || 1}`);
    parts.push(`tz:${new Date().getTimezoneOffset()}`);
    parts.push(`hwConcurrency:${navigator.hardwareConcurrency || 0}`);
    parts.push(`platform:${navigator.platform || ''}`);
    parts.push(`language:${navigator.language || ''}`);

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
    try {
      if (window.crypto && crypto.subtle && crypto.subtle.digest) {
        const buffer = new TextEncoder().encode(raw);
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        return Array.from(new Uint8Array(hashBuffer))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
      }
    } catch {}
    return sha256Fallback(raw);
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
      action.hidden = false;
      license.hidden = true;
      hideLicenseKey();
      setStatus('Signed in. You can create your trial license.', 'success');
    }
  };

  const loadAccount = async () => {
    try {
      await request('/v1/account');
      window.location.replace('/accounts/overview/');
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
    create.disabled = true;
    setStatus('Creating your trial license…');
    try {
      const deviceFingerprint = await collectFingerprint();
      const result = await request('/v1/trial', {
        method: 'POST',
        body: JSON.stringify({ device_fingerprint: deviceFingerprint }),
      });
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
