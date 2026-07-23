(() => {
  const API = 'https://license.topup.eu.org';
  const status = document.querySelector('#trial-status');
  const googleMount = document.querySelector('#google-signin');
  const githubButton = document.querySelector('#github-signin');
  const microsoftButton = document.querySelector('#microsoft-signin');
  const githubDivider = document.querySelector('#github-login-divider');
  const microsoftDivider = document.querySelector('#microsoft-login-divider');
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
  let googleConfigured = false;
  if (!status || !googleMount) return;

  const setStatus = (message, kind = '') => {
    status.textContent = message;
    status.className = `trial-status${kind ? ` trial-status--${kind}` : ''}`;
  };


  const syncProviderVisibility = () => {
    googleMount.hidden = !googleConfigured;
    let hasVisibleProvider = googleConfigured;
    if (githubButton) githubButton.hidden = !githubConfigured;
    if (githubDivider) githubDivider.hidden = !githubConfigured || !hasVisibleProvider;
    if (githubConfigured) hasVisibleProvider = true;
    if (microsoftButton) microsoftButton.hidden = !microsoftConfigured;
    if (microsoftDivider) microsoftDivider.hidden = !microsoftConfigured || !hasVisibleProvider;
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
    if (githubDivider) githubDivider.hidden = true;
    if (microsoftDivider) microsoftDivider.hidden = true;
    account.hidden = false;
    const provider = String(data.user.provider || '').toLowerCase();
    if (avatar) {
      avatar.textContent = provider === 'github' ? 'GH' : (provider === 'microsoft' ? 'MS' : 'G');
      avatar.classList.toggle('trial-avatar--github', provider === 'github');
      avatar.classList.toggle('trial-avatar--microsoft', provider === 'microsoft');
    }
    const providerName = provider === 'github' ? 'GitHub account' : (provider === 'microsoft' ? 'Microsoft account' : 'Google account');
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
      setStatus('Sign in with Google, GitHub, or Microsoft to create your trial.', 'neutral');
    }
  };

  const loadGoogle = (clientId) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(clientId);
    script.onerror = () => reject(new Error('Google sign-in could not be loaded.'));
    document.head.appendChild(script);
  });

  const initialize = async () => {
    try {
      const config = await request('/v1/auth/config', { method: 'GET', headers: {} });
      githubConfigured = Boolean(config.github_enabled);
      microsoftConfigured = Boolean(config.microsoft_enabled);

      let googleReady = false;
      if (config.google_client_id) {
        try {
          await loadGoogle(config.google_client_id);
          google.accounts.id.initialize({
            client_id: config.google_client_id,
            callback: async ({ credential }) => {
              setStatus('Verifying your Google sign-in…');
              try {
                const result = await request('/v1/auth/google', {
                  method: 'POST',
                  body: JSON.stringify({ credential }),
                });
                window.location.assign('/accounts/overview/');
              } catch (error) {
                setStatus(error.message, 'error');
              }
            },
          });
          google.accounts.id.renderButton(googleMount, {
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rect',
            width: 320,
          });
          googleReady = true;
        } catch (error) {
          googleMount.hidden = true;
          if (!githubConfigured && !microsoftConfigured) throw error;
        }
      } else {
        googleMount.hidden = true;
      }

      googleConfigured = googleReady;
      syncProviderVisibility();
      if (!googleReady && !githubConfigured && !microsoftConfigured) throw new Error('No sign-in provider is configured yet.');
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
      const result = await request('/v1/trial', { method: 'POST', body: '{}' });
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
    setStatus('Signed out. Sign in with Google, GitHub, or Microsoft to continue.', 'neutral');
  });

  initialize();
})();
