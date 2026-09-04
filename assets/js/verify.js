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
    const pn = $('#portal-name');
    const pe = $('#portal-email');
    if (pn) pn.textContent = account.user.name || 'Member';
    if (pe) pe.textContent = account.user.email;
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
      try { sessionStorage.removeItem('otp_email'); } catch {}
      location.replace(account.license && account.license.status === 'active' ? '/accounts/overview/' : '/accounts/trial-license/');
      return;
    }
    const rawEmail = account.user.email || '';
    const isTelegram = rawEmail.startsWith('Telegram ID');
    const otpSection = $('#verify-otp-section');
    const otpInput = $('#verify-otp-input');
    const verifyBtn = $('#verify-confirm');
    const status = $('#verify-status');

    // OTP dikirim otomatis saat login/daftar dan berlaku 24 jam.
    // Tidak ada tombol "Send OTP" lagi. Input langsung ditampilkan.
    otpSection.hidden = false;
    status.textContent = '';
    otpInput.focus();

    // Jika belum ada kode valid (mis. kedaluwarsa setelah logout+login), minta otomatis.
    const ensureOtp = async () => {
      try {
        const res = await request('/v1/trial/request-otp', { method: 'POST', body: JSON.stringify({ email: rawEmail.trim().toLowerCase() }) });
        if (res.already_verified) {
          try { sessionStorage.removeItem('otp_email'); } catch {}
          status.textContent = 'Already verified! Redirecting…'; status.style.color = '#22c55e';
          setTimeout(() => location.replace('/accounts/trial-license/'), 1000);
          return;
        }
        // Tampilkan notice "Valid for 24 Hours" hanya sekali per sesi (bukan setiap refresh).
        let shown = false;
        try { shown = sessionStorage.getItem('otp_notice_shown') === '1'; } catch {}
        if (!shown) {
          status.textContent = 'Valid for 24 Hours';
          status.style.color = '#94a3b8';
          try { sessionStorage.setItem('otp_notice_shown', '1'); } catch {}
        }
      } catch (err) {
        // Kode masih valid → tidak perlu kirim ulang; tampilkan pesan netral.
        status.textContent = 'Enter the 6-digit code from your email.';
        status.style.color = '#94a3b8';
      }
    };
    ensureOtp();

    verifyBtn.addEventListener('click', async () => {
      const otp = otpInput.value.trim();
      if (otp.length !== 6) { status.textContent = 'Enter the 6-digit code.'; status.style.color = '#ef4444'; return; }
      verifyBtn.disabled = true; status.textContent = 'Verifying…'; status.style.color = '#94a3b8';
      try {
        const body = { email: rawEmail.trim().toLowerCase(), otp };
        if (window._turnstileToken) body.turnstile_token = window._turnstileToken;
        await request('/v1/trial/verify-otp', { method: 'POST', body: JSON.stringify(body) });
        try { sessionStorage.removeItem('otp_email'); } catch {}
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