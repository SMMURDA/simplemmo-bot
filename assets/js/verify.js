(() => {
  const API = 'https://license.topup.eu.org';
  const root = document.querySelector('[data-page="verify"]');
  if (!root) return;

  const $ = (sel) => document.querySelector(sel);
  const request = async (path, options = {}) => {
    const response = await fetch(`${API}${path}`, {
      credentials: 'include',
      ...options,
      headers: options.body ? { 'Content-Type': 'application/json', ...(options.headers || {}) } : options.headers,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.message || 'Request failed.');
      error.status = response.status;
      throw error;
    }
    return data;
  };

  const hydrateProfile = async () => {
    const account = await request('/v1/account');
    $('#portal-name').textContent = account.user.name || 'Member';
    $('#portal-email').textContent = account.user.email;
    const adminLink = $('#admin-link');
    if (adminLink) adminLink.hidden = account.user.role !== 'admin';
    return account;
  };

  const bindLogout = () => {
    $('#portal-logout')?.addEventListener('click', async () => {
      if (window.portalConfirm) {
        const approved = await window.portalConfirm({
          title: 'Sign out of your account?',
          message: 'You will need to sign in again.',
          confirmText: 'Sign out', tone: 'danger',
        });
        if (!approved) return;
      }
      await request('/v1/auth/logout', { method: 'POST', body: '{}' }).catch(() => {});
      location.replace('/trial/');
    });
  };

  const initVerify = (account) => {
    if (account.otp_verified) {
      location.replace(account.license && account.license.status === 'active' ? '/accounts/overview/' : '/accounts/trial-license/');
      return;
    }
    const rawEmail = account.user.email || '';
    const isTelegram = rawEmail.startsWith('Telegram ID');
    const emailInput = $('#verify-email');
    const sendBtn = $('#verify-send-otp');
    const otpSection = $('#verify-otp-section');
    const otpInput = $('#verify-otp-input');
    const verifyBtn = $('#verify-confirm');
    const status = $('#verify-status');

    if (!isTelegram && rawEmail) {
      emailInput.value = rawEmail;
      emailInput.readOnly = true;
    }

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
      if (!em.endsWith('@gmail.com')) { status.textContent = 'Only @gmail.com addresses are accepted.'; status.style.color = '#ef4444'; return; }
      sendBtn.disabled = true; status.textContent = 'Sending verification code…'; status.style.color = '#94a3b8';
      try {
        const res = await request('/v1/trial/request-otp', { method: 'POST', body: JSON.stringify({ email: em }) });
        if (res.already_verified) {
          status.textContent = 'Already verified! Redirecting…'; status.style.color = '#22c55e';
          setTimeout(() => location.replace('/accounts/trial-license/'), 1000);
          return;
        }
        status.textContent = res.message || 'Code sent. Check your inbox.'; status.style.color = '#22c55e';
        otpSection.hidden = false; otpInput.focus();
        startCooldown();
      } catch (err) {
        status.textContent = err.message; status.style.color = '#ef4444';
        sendBtn.disabled = false;
      }
    });

    verifyBtn.addEventListener('click', async () => {
      const otp = otpInput.value.trim();
      if (otp.length !== 6) { status.textContent = 'Enter the 6-digit code.'; status.style.color = '#ef4444'; return; }
      verifyBtn.disabled = true; status.textContent = 'Verifying…'; status.style.color = '#94a3b8';
      try {
        const body = { email: emailInput.value.trim().toLowerCase(), otp };
        if (window._turnstileToken) body.turnstile_token = window._turnstileToken;
        await request('/v1/trial/verify-otp', { method: 'POST', body: JSON.stringify(body) });
        if (cooldownTimer) clearInterval(cooldownTimer);
        status.textContent = '';
        document.getElementById('verify-card').innerHTML = '<div style="text-align:center;padding:20px 0"><svg width="48" height="48" viewBox="0 0 24 24" fill="#22c55e"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><h3 style="color:#22c55e;margin:12px 0 4px">Email Verified!</h3><p style="color:#94a3b8">Redirecting to your dashboard…</p></div>';
        const ts = document.getElementById('turnstile-container');
        if (ts) ts.hidden = true;
        setTimeout(() => location.replace('/accounts/trial-license/'), 1500);
      } catch (err) {
        status.textContent = err.message; status.style.color = '#ef4444';
      } finally { verifyBtn.disabled = false; }
    });
  };

  document.addEventListener('DOMContentLoaded', async () => {
    bindLogout();
    try {
      const account = await hydrateProfile();
      initVerify(account);
    } catch (error) {
      if (error.status === 401) return location.replace('/trial/');
      if (window.portalConfirm) {
        window.portalConfirm({
          title: error.message || 'An unexpected error occurred.',
          message: 'Need help? Contact us directly.',
          confirmText: 'Telegram', cancelText: 'Email', tone: 'danger',
        }).then((result) => {
          if (result === true) window.open('https://t.me/bovalone', '_blank');
          else if (result === false) window.location.href = 'mailto:ask@topup.eu.org';
        });
      }
    }
  });
})();
