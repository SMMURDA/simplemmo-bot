(() => {
  const API = 'https://license.topup.eu.org';
  const root = document.querySelector('[data-page="verify"]');
  if (!root) return;

  const RESEND_COOLDOWN_SEC = 60;
  const $ = (sel) => document.querySelector(sel);

  const setStatus = (message, tone = 'muted') => {
    const el = $('#portal-status');
    if (!el) return;
    el.textContent = message || '';
    el.style.color = tone === 'error' ? '#f87171' : tone === 'success' ? '#22c55e' : '#94a3b8';
  };

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
      error.data = data;
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

  const createResendButton = (container) => {
    const btn = document.createElement('button');
    btn.id = 'verify-resend';
    btn.type = 'button';
    btn.textContent = 'Resend code';
    btn.style.cssText = 'width:100%;margin-top:10px;padding:12px 20px;border-radius:10px;border:1px solid var(--border,#334155);background:transparent;color:inherit;font-size:14px;font-weight:500;cursor:pointer';
    container.appendChild(btn);
    return btn;
  };

  const startCooldown = (btn, seconds) => {
    let left = Math.max(0, Math.ceil(Number(seconds) || 0));
    const tick = () => {
      if (left <= 0) {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        btn.textContent = 'Resend code';
        return;
      }
      btn.disabled = true;
      btn.style.opacity = '.6';
      btn.style.cursor = 'not-allowed';
      btn.textContent = `Resend code (${left}s)`;
      left -= 1;
      setTimeout(tick, 1000);
    };
    tick();
  };

  const shake = (el) => {
    el.classList.add('verify-shake');
    setTimeout(() => el.classList.remove('verify-shake'), 450);
  };

  const initVerify = (account) => {
    if (account.otp_verified) {
      try { sessionStorage.removeItem('otp_email'); } catch {}
      location.replace(account.license && account.license.status === 'active' ? '/accounts/overview/' : '/accounts/trial-license/');
      return;
    }

    const email = String(account.user.email || '').trim().toLowerCase();
    const isTelegram = /^telegram id/i.test(email);
    const otpSection = $('#verify-otp-section');
    const otpInput = $('#verify-otp-input');
    const verifyBtn = $('#verify-confirm');

    // Akun Telegram tidak punya alamat email, jadi OTP email tidak mungkin dikirim.
    if (isTelegram || !email.endsWith('@gmail.com')) {
      otpSection.hidden = true;
      setStatus('Akun ini belum punya alamat email @gmail.com, jadi kode verifikasi tidak bisa dikirim. Tambahkan email Gmail di profil Anda atau hubungi kami di Telegram @bovalone.', 'error');
      return;
    }

    otpSection.hidden = false;
    otpInput.focus();
    const resendBtn = createResendButton(otpSection);

    const sendOtp = async () => {
      startCooldown(resendBtn, RESEND_COOLDOWN_SEC);
      try {
        const res = await request('/v1/trial/request-otp', { method: 'POST', body: JSON.stringify({ email }) });
        if (res.already_verified) {
          try { sessionStorage.removeItem('otp_email'); } catch {}
          setStatus('Email sudah terverifikasi. Mengalihkan…', 'success');
          setTimeout(() => location.replace('/accounts/trial-account/'), 1000);
          return;
        }
        setStatus(res.message || 'Kode verifikasi dikirim ke email Anda. Periksa juga folder spam.', 'success');
        if (res.retry_after_sec) startCooldown(resendBtn, res.retry_after_sec);
      } catch (err) {
        if (err.status === 429) {
          setStatus(err.message || 'Terlalu banyak permintaan. Coba lagi nanti.', 'error');
          startCooldown(resendBtn, err.data?.retry_after_sec || RESEND_COOLDOWN_SEC);
          return;
        }
        // Jangan pernah menelan error diam-diam: user harus tahu emailnya gagal dikirim.
        setStatus(`${err.message || 'Gagal mengirim kode verifikasi.'} Coba kirim ulang, atau hubungi kami di Telegram @bovalone jika terus gagal.`, 'error');
        startCooldown(resendBtn, 15);
      }
    };

    resendBtn.addEventListener('click', () => {
      setStatus('Mengirim kode…');
      sendOtp();
    });

    sendOtp();

    verifyBtn.addEventListener('click', async () => {
      const otp = otpInput.value.trim();
      if (!/^\d{6}$/.test(otp)) {
        shake(otpInput);
        setStatus('Masukkan 6 digit kode dari email Anda.', 'error');
        return;
      }
      verifyBtn.disabled = true;
      verifyBtn.textContent = 'Verifying…';
      setStatus('');
      try {
        const body = { email, otp };
        if (window._turnstileToken) body.turnstile_token = window._turnstileToken;
        await request('/v1/trial/verify-otp', { method: 'POST', body: JSON.stringify(body) });
        try { sessionStorage.removeItem('otp_email'); } catch {}
        document.getElementById('verify-card').innerHTML = '<div style="text-align:center;padding:20px 0"><svg width="48" height="48" viewBox="0 0 24 24" fill="#22c55e"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><h3 style="color:#22c55e;margin:12px 0 4px">Email Verified!</h3><p style="color:#94a3b8">Redirecting to your dashboard…</p></div>';
        const ts = document.getElementById('turnstile-container');
        if (ts) ts.hidden = true;
        setTimeout(() => location.replace('/accounts/trial-account/'), 1500);
      } catch (err) {
        shake(otpInput);
        setStatus(err.message || 'Kode verifikasi salah atau sudah kedaluwarsa.', 'error');
      } finally {
        verifyBtn.disabled = false;
        verifyBtn.textContent = 'Verify code';
      }
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
