(() => {
  const API = 'https://license.topup.eu.org';
  const status = document.querySelector('#trial-status');
  const googleMount = document.querySelector('#google-signin');
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
  const keyLabel = document.querySelector('label[for="trial-license-key"]');
  if (!status || !googleMount) return;

  const setStatus = (message, kind = '') => { status.textContent = message; status.className = `trial-status${kind ? ` trial-status--${kind}` : ''}`; };
  const request = async (path, options = {}) => {
    const response = await fetch(`${API}${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Request gagal. Coba lagi.');
    return data;
  };
  const showAccount = (data) => {
    googleMount.hidden = true; account.hidden = false;
    name.textContent = data.user.name || 'Google account'; email.textContent = data.user.email;
    if (data.license) {
      action.hidden = true; license.hidden = false;
      if (key) key.closest('.trial-key-row').hidden = true;
      if (keyLabel) keyLabel.hidden = true;
      document.querySelector('#trial-key-help').textContent = 'Your trial has already been created. The license key is intentionally not stored in readable form.';
      meta.textContent = `Status: ${data.license.status} · expires ${new Date(data.license.expires_at).toLocaleString()}`;
      setStatus('Your account already has a trial license.', 'success');
    } else { action.hidden = false; license.hidden = true; setStatus('Signed in. You can create your trial license.', 'success'); }
  };
  const loadAccount = async () => { try { showAccount(await request('/v1/account')); } catch { setStatus('Sign in with Google to create your trial.', 'neutral'); } };
  const loadGoogle = (clientId) => new Promise((resolve, reject) => { const script = document.createElement('script'); script.src = 'https://accounts.google.com/gsi/client'; script.async = true; script.defer = true; script.onload = () => resolve(clientId); script.onerror = () => reject(new Error('Google sign-in could not be loaded.')); document.head.appendChild(script); });
  const initialize = async () => {
    try {
      const config = await request('/v1/auth/config', { method: 'GET', headers: {} });
      if (!config.google_client_id) throw new Error('Google sign-in is not configured yet.');
      await loadGoogle(config.google_client_id);
      google.accounts.id.initialize({ client_id: config.google_client_id, callback: async ({ credential }) => { setStatus('Verifying your Google sign-in…'); try { const result = await request('/v1/auth/google', { method: 'POST', body: JSON.stringify({ credential }) }); showAccount({ user: result.user, license: null }); await loadAccount(); } catch (error) { setStatus(error.message, 'error'); } } });
      google.accounts.id.renderButton(googleMount, { theme: 'outline', size: 'large', text: 'continue_with', shape: 'rect', width: 320 });
      await loadAccount();
    } catch (error) { setStatus(error.message, 'error'); }
  };
  create?.addEventListener('click', async () => { create.disabled = true; setStatus('Creating your trial license…'); try { const result = await request('/v1/trial', { method: 'POST', body: '{}' }); action.hidden = true; license.hidden = false; if (key) key.closest('.trial-key-row').hidden = false; if (keyLabel) keyLabel.hidden = false; key.value = result.license_key; meta.textContent = `One device · expires ${new Date(result.expires_at).toLocaleString()}`; setStatus('Trial license created. Copy and save the key now.', 'success'); } catch (error) { setStatus(error.message, 'error'); } finally { create.disabled = false; } });
  copy?.addEventListener('click', async () => { try { await navigator.clipboard.writeText(key.value); copy.textContent = 'Copied'; setTimeout(() => { copy.textContent = 'Copy'; }, 1600); } catch { key.select(); document.execCommand('copy'); } });
  logout?.addEventListener('click', async () => { try { await request('/v1/auth/logout', { method: 'POST', body: '{}' }); } catch {} account.hidden = true; action.hidden = true; license.hidden = true; googleMount.hidden = false; setStatus('Signed out. Sign in with Google to continue.', 'neutral'); });
  initialize();
})();
