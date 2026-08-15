(() => {
  const API = 'https://license.topup.eu.org';
  const iconBase = '/assets/icons/payments/';
  const root = document.querySelector('[data-member-portal]');
  if (!root) return;

  const page = root.dataset.page;
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
  const formatIdr = (value) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(Number(value || 0));
  const formatDisplayAmount = (minor, currency) => currency === 'USD'
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(minor || 0) / 100)
    : formatIdr(minor);
  const formatDate = (value) => value ? new Date(value).toLocaleString('en-GB', {
    dateStyle: 'medium', timeStyle: 'short',
  }) : '—';

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

  const setStatus = (text, tone = 'neutral') => {
    const element = $('#portal-status');
    if (!element) return;
    if (tone === 'error' && window.portalConfirm) {
      window.portalConfirm({
        title: text || 'An unexpected error occurred.',
        message: 'Need help? Contact us directly.',
        confirmText: 'Telegram',
        cancelText: 'Email',
        tone: 'danger',
      }).then((result) => {
        if (result === true) window.open('https://t.me/bovalone', '_blank');
        else if (result === false) window.location.href = 'mailto:ask@topup.eu.org';
      });
      return;
    }
    element.textContent = text || '';
    element.dataset.tone = tone;
  };

  const confirmAction = (options) => window.portalConfirm(options);
  const copyValue = (value, label) => window.portalCopy(value, label);

  const hydrateProfile = async () => {
    const account = await request('/v1/account');
    const profile = account.user;
    $('#portal-name').textContent = profile.name || 'Member';
    $('#portal-email').textContent = profile.email;
    const adminLink = $('#admin-link');
    if (adminLink) adminLink.hidden = profile.role !== 'admin';
    return account;
  };

  const bindLogout = () => {
    $('#portal-logout')?.addEventListener('click', async () => {
      const approved = await confirmAction({
        title: 'Sign out of your account?',
        message: 'You will need to sign in again to access licenses and balance.',
        confirmText: 'Sign out',
        tone: 'danger',
      });
      if (!approved) return;
      await request('/v1/auth/logout', { method: 'POST', body: '{}' }).catch(() => {});
      location.replace('/trial/');
    });
  };

  const trialCard = (license) => {
    if (!license) return `
      <div class="license-hero-card__empty">
        <span class="license-orb">24h</span>
        <div><p class="eyebrow">Available once</p><h2>Your trial is ready</h2><p>Create a one-day license linked permanently to this account.</p></div>
      </div>
      <button id="create-trial" class="button button--primary" type="button">Create trial license</button>`;
    const active = license.status === 'active';
    return `
      <div class="license-hero-card__head"><div><p class="eyebrow">Account trial</p><h2>${active ? 'Active trial license' : escapeHtml(license.status)}</h2></div><span class="status-pill status-pill--${escapeHtml(license.status)}">${escapeHtml(license.status)}</span></div>
      <div class="license-detail-grid"><div><small>Expires</small><strong>${formatDate(license.expires_at)}</strong></div><div><small>Device limit</small><strong>${Number(license.max_devices || 1)}</strong></div></div>
      ${license.license_key ? `<div class="license-key-row"><code>${escapeHtml(license.license_key)}</code><button id="copy-trial" class="button button--ghost" type="button">Copy license</button></div>` : '<p class="license-hidden-note">The key is hidden because this license is no longer active.</p>'}`;
  };

  const initTrial = async (account) => {
    const card = $('#trial-license-card');
    card.innerHTML = trialCard(account.license);
    const turnstileContainer = document.getElementById('turnstile-container');
    if (turnstileContainer) turnstileContainer.hidden = false;
    if (!account.license) {
      try {
        if (localStorage.getItem('smmo_trial_created') === '1') {
          card.innerHTML = `
            <div class="license-hero-card__empty">
              <span class="license-orb">!</span>
              <div><p class="eyebrow">Device limit reached</p><h2>Trial already created</h2><p>A trial was already created from this device. Contact support if you believe this is an error.</p></div>
            </div>`;
          if (turnstileContainer) turnstileContainer.hidden = true;
          return;
        }
      } catch {}
      const rawEmail = account.user.email || '';
      const isTelegram = rawEmail.startsWith('Telegram ID');
      const prefillEmail = isTelegram ? '' : rawEmail;
      card.innerHTML += `
        <div id="portal-email-verify" style="margin-top:20px;padding:20px;border:1px solid var(--border,#334155);border-radius:12px;background:var(--surface,#1e293b)">
          <p class="eyebrow">Step 2</p><h3 style="margin:4px 0 8px">Verify your email</h3>
          <p style="font-size:13px;color:var(--muted,#94a3b8);margin:0 0 12px">Only @gmail.com accepted. A 6-digit code will be sent.</p>
          <input id="portal-otp-email" type="email" placeholder="yourname@gmail.com" value="${escapeHtml(prefillEmail)}" ${prefillEmail && !isTelegram ? 'readonly' : ''} style="width:100%;padding:12px 14px;border-radius:8px;border:1px solid var(--border,#334155);background:var(--card,#0f172a);color:inherit;margin-bottom:10px;font-size:16px;box-sizing:border-box">
          <button id="portal-send-otp" class="button button--primary" type="button">Send verification code</button>
          <div id="portal-otp-section" hidden style="margin-top:14px">
            <input id="portal-otp-input" type="text" inputmode="numeric" maxlength="6" placeholder="6-digit code" style="width:100%;padding:14px;border-radius:8px;border:1px solid var(--border,#334155);background:var(--card,#0f172a);color:inherit;font-size:22px;letter-spacing:8px;text-align:center;box-sizing:border-box;margin-bottom:10px">
            <button id="portal-verify-otp" class="button button--primary" type="button">Verify code</button>
          </div>
          <p id="portal-otp-status" style="font-size:13px;margin:8px 0 0"></p>
        </div>`;
      const sendBtn = $('#portal-send-otp');
      const otpSection = $('#portal-otp-section');
      const otpInput = $('#portal-otp-input');
      const verifyBtn = $('#portal-verify-otp');
      const otpStatus = $('#portal-otp-status');
      const emailInput = $('#portal-otp-email');
      let cooldownTimer = null;
      const startCooldown = () => {
        let seconds = 60;
        sendBtn.disabled = true;
        sendBtn.textContent = `Resend (${seconds}s)`;
        cooldownTimer = setInterval(() => {
          seconds--;
          sendBtn.textContent = `Resend (${seconds}s)`;
          if (seconds <= 0) {
            clearInterval(cooldownTimer); cooldownTimer = null;
            sendBtn.disabled = false; sendBtn.textContent = 'Resend code';
          }
        }, 1000);
      };
      sendBtn?.addEventListener('click', async () => {
        const em = emailInput.value.trim().toLowerCase();
        if (!em.endsWith('@gmail.com')) { otpStatus.textContent = 'Only @gmail.com addresses are accepted.'; otpStatus.style.color = '#ef4444'; return; }
        sendBtn.disabled = true; otpStatus.textContent = 'Sending…'; otpStatus.style.color = '#94a3b8';
        try {
          const res = await request('/v1/trial/request-otp', { method: 'POST', body: JSON.stringify({ email: em }) });
          otpStatus.textContent = res.message || 'Code sent!'; otpStatus.style.color = '#22c55e';
          otpSection.hidden = false; otpInput.focus();
          startCooldown();
        } catch (err) { otpStatus.textContent = err.message; otpStatus.style.color = '#ef4444'; sendBtn.disabled = false; }
      });
      verifyBtn?.addEventListener('click', async () => {
        const otp = otpInput.value.trim();
        if (otp.length !== 6) { otpStatus.textContent = 'Enter the 6-digit code.'; otpStatus.style.color = '#ef4444'; return; }
        verifyBtn.disabled = true; otpStatus.textContent = 'Verifying…'; otpStatus.style.color = '#94a3b8';
        try {
          const verifyBody = { email: emailInput.value.trim().toLowerCase(), otp };
          if (window._turnstileToken) verifyBody.turnstile_token = window._turnstileToken;
          await request('/v1/trial/verify-otp', { method: 'POST', body: JSON.stringify(verifyBody) });
          otpStatus.textContent = '';
          if (cooldownTimer) clearInterval(cooldownTimer);
          document.getElementById('portal-email-verify').innerHTML = '<p style="color:#22c55e;font-weight:600">✓ Email verified. You can now create your trial.</p>';
          const createBtn = document.createElement('button');
          createBtn.id = 'create-trial'; createBtn.className = 'button button--primary'; createBtn.type = 'button';
          createBtn.textContent = 'Create trial license';
          card.appendChild(createBtn);
          createBtn.addEventListener('click', async () => {
            const approved = await confirmAction({ title: 'Create your one-day trial?', message: 'A trial can only be created once per device.', confirmText: 'Create trial' });
            if (!approved) return;
            try {
              await request('/v1/trial', { method: 'POST', body: '{}' });
              try { localStorage.setItem('smmo_trial_created', '1'); } catch {}
              window.portalToast('Trial license created.'); location.reload();
            } catch (error) { setStatus(error.message, 'error'); }
          });
        } catch (err) { otpStatus.textContent = err.message; otpStatus.style.color = '#ef4444'; }
        finally { verifyBtn.disabled = false; }
      });
      return;
    }
    $('#create-trial')?.addEventListener('click', async () => {
      const approved = await confirmAction({
        title: 'Create your one-day trial?',
        message: 'A trial can only be created once per device, even with different accounts.',
        confirmText: 'Create trial',
      });
      if (!approved) return;
      try {
        await request('/v1/trial', { method: 'POST', body: '{}' });
        try { localStorage.setItem('smmo_trial_created', '1'); } catch {}
        window.portalToast('Trial license created.');
        location.reload();
      } catch (error) { setStatus(error.message, 'error'); }
    });
    $('#copy-trial')?.addEventListener('click', () => copyValue(account.license.license_key, 'trial license key'));
  };

  const initOverview = (account) => {
    $('#balance').textContent = formatIdr(account.user.balance_idr);
    $('#member-since').textContent = formatDate(account.user.member_since);
    $('#member-email').textContent = account.user.email;
    $('#member-role').textContent = account.user.role === 'admin' ? 'Administrator' : 'Member';
    const memberEmail = $('#member-email');
    if (memberEmail && account.otp_verified) {
      const badge = document.createElement('span');
      badge.style.cssText = 'display:inline-flex;align-items:center;gap:4px;color:#3b82f6;font-size:12px;font-weight:600;margin-top:2px';
      badge.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Verified';
      memberEmail.parentNode.insertBefore(badge, memberEmail.nextSibling);
    }
  };

  const initBuy = async (account) => {
    const data = await request('/v1/account/packages');
    const pkg = data.packages[0];
    const card = $('#package-card');
    card.innerHTML = `
      <div class="purchase-card__icon"><img src="${iconBase}wallet.svg" alt=""></div>
      <div class="purchase-card__copy"><p class="eyebrow">${escapeHtml(pkg.name)}</p><h2>${formatIdr(pkg.price_idr)}</h2><p>${pkg.days} days · ${pkg.max_devices} device${pkg.max_devices === 1 ? '' : 's'}</p><small>Current balance: ${formatIdr(account.user.balance_idr)}</small></div>
      <button id="buy-license" class="button button--primary" type="button">Buy license</button>`;
    $('#buy-license').addEventListener('click', async () => {
      const approved = await confirmAction({
        title: 'Confirm license purchase',
        message: `${formatIdr(pkg.price_idr)} will be deducted from your balance for ${pkg.days} days of access.`,
        confirmText: `Pay ${formatIdr(pkg.price_idr)}`,
      });
      if (!approved) return;
      try {
        const result = await request('/v1/account/licenses', {
          method: 'POST', body: JSON.stringify({ package_id: pkg.id }),
        });
        card.innerHTML = `<div class="purchase-success"><p class="eyebrow">Purchase complete</p><h2>Your license is ready</h2><p>Expires ${formatDate(result.expires_at)}</p><div class="license-key-row"><code>${escapeHtml(result.license_key)}</code><button id="copy-purchased" class="button button--ghost" type="button">Copy license</button></div><a class="button button--primary" href="/accounts/my-licenses/">Open My licenses</a></div>`;
        $('#copy-purchased').addEventListener('click', () => copyValue(result.license_key, 'license key'));
      } catch (error) { setStatus(error.message, 'error'); }
    });
  };

  const licenseCard = (license) => `
    <article class="license-card">
      <div class="license-card__top"><span class="license-type">${license.source === 'trial' ? 'Trial license' : 'Member license'}</span><span class="status-pill status-pill--${escapeHtml(license.status)}">${escapeHtml(license.status)}</span></div>
      <div class="license-card__meta"><div><small>Expires</small><strong>${formatDate(license.expires_at)}</strong></div><div><small>Devices</small><strong>${Number(license.max_devices || 1)}</strong></div></div>
      ${license.license_key ? `<div class="license-key-row"><code>${escapeHtml(license.license_key)}</code><button class="button button--ghost" type="button" data-copy-license="${escapeHtml(license.id)}">Copy</button></div>` : '<p class="license-hidden-note">License key unavailable for this status.</p>'}
      ${license.revoke_message ? `<div class="license-revoke-message"><strong>Message from admin:</strong><p>${escapeHtml(license.revoke_message)}</p></div>` : ''}
    </article>`;

  const initLicenses = async (account) => {
    const data = await request('/v1/account/licenses');
    const licenses = [...data.licenses];
    if (account.license && !licenses.some((item) => item.id === account.license.id)) {
      licenses.unshift({ ...account.license, source: 'trial', amount_idr: 0 });
    }
    const list = $('#license-list');
    list.innerHTML = licenses.length ? licenses.map(licenseCard).join('') : '<div class="portal-empty"><h2>No licenses yet</h2><p>Create a trial or buy a member license.</p></div>';
    list.querySelectorAll('[data-copy-license]').forEach((button) => {
      const license = licenses.find((item) => item.id === button.dataset.copyLicense);
      button.addEventListener('click', () => copyValue(license.license_key, 'license key'));
    });
  };

  const initTopup = async () => {
    const [methodData, historyData] = await Promise.all([
      request('/v1/account/payment-methods'), request('/v1/account/topups'),
    ]);
    const methods = methodData.methods;
    const methodList = $('#payment-method-list');
    const methodDetails = $('#payment-method-details');
    const amountSelect = $('#topup-amount');
    const conversion = $('#topup-conversion');
    let selectedMethod = null;

    methodList.innerHTML = methods.length ? methods.map((method, index) => `
      <label class="payment-method-card">
        <input type="radio" name="payment_method_id" value="${escapeHtml(method.id)}" ${index === 0 ? 'checked' : ''}>
        <span class="payment-method-card__icon"><img src="${iconBase}${escapeHtml(method.icon)}.svg" alt=""></span>
        <span><strong>${escapeHtml(method.name)}</strong><small>${escapeHtml(method.description)}</small><em>${escapeHtml(method.currency)}</em></span>
      </label>`).join('') : '<div class="portal-empty"><p>No payment methods are currently available.</p></div>';

    const selectMethod = (method) => {
      selectedMethod = method;
      methodDetails.hidden = false;
      methodDetails.innerHTML = `
        <div class="payment-method-details__head">
          <span class="payment-method-details__icon"><img src="${iconBase}${escapeHtml(method.icon)}.svg" alt=""></span>
          <div><p class="eyebrow">Payment details</p><h2>${escapeHtml(method.name)}</h2><span class="status-pill status-pill--active">${escapeHtml(method.currency)}</span></div>
        </div>
        ${method.description ? `<p class="payment-method-details__description">${escapeHtml(method.description)}</p>` : ''}
        <div class="payment-method-details__instructions"><strong>Transfer / payment destination</strong><p>${escapeHtml(method.instructions || 'Contact the administrator for payment destination details.')}</p></div>
        <div class="payment-method-details__contacts">${method.confirmation_email ? `<span>Email confirmation: <b>${escapeHtml(method.confirmation_email)}</b></span>` : ''}${method.telegram_username ? `<span>Telegram: <b>@${escapeHtml(method.telegram_username)}</b></span>` : ''}</div>`;
      amountSelect.innerHTML = '<option value="">Choose amount</option>' + method.preset_amounts.map((amount) => `<option value="${amount}">${method.currency === 'USD' ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount) : formatIdr(amount)}</option>`).join('');
      conversion.textContent = method.currency === 'USD' ? `Estimated balance credit uses 1 USD = ${formatIdr(methodData.usd_to_idr_rate)}.` : 'The approved amount is credited directly to your IDR balance.';
    };

    methodList.querySelectorAll('input[name="payment_method_id"]').forEach((input) => {
      input.addEventListener('change', () => selectMethod(methods.find((item) => item.id === input.value)));
    });
    if (methods[0]) selectMethod(methods[0]);

    const renderHistory = () => {
      const list = $('#topup-list');
      list.innerHTML = historyData.topups.length ? historyData.topups.map((topup) => `
        <article class="portal-card"><div><strong>${formatDisplayAmount(topup.display_amount_minor ?? topup.amount_idr, topup.currency || 'IDR')}</strong><small>${escapeHtml(topup.method)} · ${formatDate(topup.created_at)}</small></div><span class="status-pill status-pill--${escapeHtml(topup.status)}">${escapeHtml(topup.status)}</span></article>`).join('') : '<p>No top-up requests yet.</p>';
    };
    renderHistory();

    $('#topup-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const amount = Number(formData.get('amount'));
      if (!selectedMethod || !amount) return setStatus('Choose a payment method and amount.', 'error');
      const amountLabel = selectedMethod.currency === 'USD' ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount) : formatIdr(amount);
      const approved = await confirmAction({
        title: 'Submit top-up request?',
        message: `${amountLabel} via ${selectedMethod.name}. You must confirm the payment with the administrator after submitting.`,
        confirmText: 'Submit request',
      });
      if (!approved) return;
      try {
        const result = await request('/v1/account/topups', {
          method: 'POST',
          body: JSON.stringify({ payment_method_id: selectedMethod.id, amount, reference: formData.get('reference') }),
        });
        const confirmation = $('#topup-confirmation');
        const mailto = result.confirmation.email ? `mailto:${encodeURIComponent(result.confirmation.email)}?subject=${encodeURIComponent('SimpleMMO top-up confirmation')}&body=${encodeURIComponent(result.confirmation.message)}` : '';
        const telegram = result.confirmation.telegram_username ? 'https://t.me/' + encodeURIComponent(result.confirmation.telegram_username) : '';
        confirmation.hidden = false;
        confirmation.innerHTML = `<div class="confirmation-card__icon"><img src="${iconBase}${escapeHtml(selectedMethod.icon)}.svg" alt=""></div><div><p class="eyebrow">Request created</p><h2>Confirm your payment</h2><p>${escapeHtml(selectedMethod.instructions)}</p><code>${escapeHtml(result.confirmation.message)}</code><div class="confirmation-links">${mailto ? `<a class="button button--ghost" href="${mailto}"><img src="${iconBase}email.svg" alt="">Email admin</a>` : ''}${telegram ? `<a class="button button--ghost" href="${telegram}" target="_blank" rel="noopener"><img src="${iconBase}telegram.svg" alt="">Open Telegram</a>` : ''}<button id="copy-confirmation" class="button button--primary" type="button">Copy confirmation</button></div></div>`;
        $('#copy-confirmation').addEventListener('click', () => copyValue(result.confirmation.message, 'confirmation message'));
        confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setStatus('Top-up request saved as pending.', 'success');
      } catch (error) { setStatus(error.message, 'error'); }
    });
  };

  document.addEventListener('DOMContentLoaded', async () => {
    bindLogout();
    try {
      const account = await hydrateProfile();
      if (page === 'overview') initOverview(account);
      if (page === 'trial') await initTrial(account);
      if (page === 'buy') await initBuy(account);
      if (page === 'licenses') await initLicenses(account);
      if (page === 'topup') await initTopup();
    } catch (error) {
      if (error.status === 401) return location.replace('/trial/');
      setStatus(error.message, 'error');
    }
  });
})();
