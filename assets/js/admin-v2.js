(() => {
  const API = 'https://license.topup.eu.org';
  const iconBase = '/assets/icons/payments/';
  const root = document.querySelector('[data-admin-portal]');
  if (!root) return;

  const page = root.dataset.page;
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const formatIdr = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0));
  const formatAmount = (minor, currency) => currency === 'USD' ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(minor || 0) / 100) : formatIdr(minor);
  const formatDate = (value) => value ? new Date(value).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  const request = async (path, options = {}) => {
    const response = await fetch(`${API}${path}`, {
      credentials: 'include', ...options,
      headers: options.body ? { 'Content-Type': 'application/json', ...(options.headers || {}) } : options.headers,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { const error = new Error(data.message || 'Request failed.'); error.status = response.status; throw error; }
    return data;
  };
  const post = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) });
  const confirmAction = (options) => window.portalConfirm(options);
  const setStatus = (text, tone = 'neutral') => { const element = $('#admin-status'); if (element) { element.textContent = text || ''; element.dataset.tone = tone; } };

  const verifyAdmin = async () => {
    const account = await request('/v1/account');
    if (account.user.role !== 'admin') throw Object.assign(new Error('Administrator access required.'), { status: 403 });
    $('#admin-email').textContent = account.user.email;
    return account;
  };

  const bindLogout = () => $('#admin-logout')?.addEventListener('click', async () => {
    const approved = await confirmAction({ title: 'Leave admin mode?', message: 'You will be signed out of the member and admin portal.', confirmText: 'Sign out', tone: 'danger' });
    if (!approved) return;
    await post('/v1/auth/logout', {}).catch(() => {});
    location.replace('/trial/');
  });

  const loadLicenses = async () => {
    const data = await request('/v1/admin/licenses');
    const list = $('#admin-licenses');
    list.innerHTML = data.licenses.length ? data.licenses.map((license) => `
      <article class="portal-card admin-license-card"><div><strong>${escapeHtml(license.customer)}</strong><small>${escapeHtml(license.status)} · ${license.active_devices}/${license.max_devices} devices · expires ${formatDate(license.expires_at)}</small></div><div class="portal-actions"><button type="button" data-license-status="${escapeHtml(license.id)}" data-next="${license.status === 'active' ? 'revoked' : 'active'}">${license.status === 'active' ? 'Block' : 'Enable'}</button><button type="button" data-license-extend="${escapeHtml(license.id)}">Extend</button><button type="button" data-license-reset="${escapeHtml(license.id)}">Reset devices</button></div></article>`).join('') : '<p>No licenses found.</p>';

    list.querySelectorAll('[data-license-status]').forEach((button) => button.addEventListener('click', async () => {
      const next = button.dataset.next;
      const approved = await confirmAction({ title: `${next === 'active' ? 'Enable' : 'Block'} this license?`, message: 'The license status changes immediately for future validation checks.', confirmText: next === 'active' ? 'Enable license' : 'Block license', tone: next === 'active' ? 'primary' : 'danger' });
      if (!approved) return;
      await post(`/v1/admin/licenses/${button.dataset.licenseStatus}/status`, { status: next });
      window.portalToast('License status updated.');
      await loadLicenses();
    }));

    list.querySelectorAll('[data-license-extend]').forEach((button) => button.addEventListener('click', async () => {
      const days = await confirmAction({ title: 'Extend license', message: 'Enter the number of days to add.', confirmText: 'Extend license', prompt: { label: 'Additional days', type: 'number', value: 30, min: 1, max: 3650, step: 1 } });
      if (days === null || !Number(days)) return;
      await post(`/v1/admin/licenses/${button.dataset.licenseExtend}/extend`, { days: Number(days) });
      window.portalToast('License extended.');
      await loadLicenses();
    }));

    list.querySelectorAll('[data-license-reset]').forEach((button) => button.addEventListener('click', async () => {
      const approved = await confirmAction({ title: 'Reset all device activations?', message: 'Existing devices will need to activate again.', confirmText: 'Reset devices', tone: 'danger' });
      if (!approved) return;
      await post(`/v1/admin/licenses/${button.dataset.licenseReset}/reset-devices`, {});
      window.portalToast('Device activations reset.');
      await loadLicenses();
    }));
  };

  const initLicenses = async () => {
    $('#admin-create-license').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const body = { customer: form.get('customer'), days: Number(form.get('days')), max_devices: Number(form.get('max_devices')) };
      const approved = await confirmAction({ title: 'Create this license?', message: `${body.customer} · ${body.days} days · ${body.max_devices} device(s).`, confirmText: 'Create license' });
      if (!approved) return;
      try {
        const result = await post('/v1/admin/licenses', body);
        $('#admin-created').innerHTML = `<div class="license-key-row"><code>${escapeHtml(result.license_key)}</code><button id="copy-admin-created" class="button button--ghost" type="button">Copy key</button></div>`;
        $('#copy-admin-created').addEventListener('click', () => window.portalCopy(result.license_key, 'license key'));
        event.currentTarget.reset();
        await loadLicenses();
      } catch (error) { setStatus(error.message, 'error'); }
    });
    await loadLicenses();
  };

  const loadTopups = async () => {
    const data = await request('/v1/admin/topups');
    const list = $('#admin-topups');
    list.innerHTML = data.topups.length ? data.topups.map((topup) => `
      <article class="portal-card topup-admin-card"><div><strong>${escapeHtml(topup.email)} · ${formatAmount(topup.display_amount_minor ?? topup.amount_idr, topup.currency || 'IDR')}</strong><small>${escapeHtml(topup.method)} · ${escapeHtml(topup.reference || 'No reference')} · ${formatDate(topup.created_at)}</small><p>${escapeHtml(topup.confirmation_message || '')}</p></div><div><span class="status-pill status-pill--${escapeHtml(topup.status)}">${escapeHtml(topup.status)}</span>${topup.status === 'pending' ? `<div class="portal-actions"><button type="button" data-topup-action="approved" data-topup-id="${escapeHtml(topup.id)}">Approve</button><button type="button" data-topup-action="rejected" data-topup-id="${escapeHtml(topup.id)}">Reject</button></div>` : ''}</div></article>`).join('') : '<p>No top-up requests found.</p>';
    list.querySelectorAll('[data-topup-action]').forEach((button) => button.addEventListener('click', async () => {
      const approvedStatus = button.dataset.topupAction === 'approved';
      const approved = await confirmAction({ title: approvedStatus ? 'Approve this payment?' : 'Reject this top-up?', message: approvedStatus ? 'The converted IDR amount will be credited exactly once.' : 'The member balance will not change.', confirmText: approvedStatus ? 'Approve and credit' : 'Reject request', tone: approvedStatus ? 'primary' : 'danger' });
      if (!approved) return;
      await post(`/v1/admin/topups/${button.dataset.topupId}/status`, { status: button.dataset.topupAction });
      window.portalToast(approvedStatus ? 'Top-up approved.' : 'Top-up rejected.');
      await loadTopups();
    }));
  };

  const initPayments = async () => {
    let methods = [];
    const form = $('#payment-method-form');
    const resetEditor = () => {
      form.reset();
      form.elements.id.value = '';
      form.elements.currency.value = 'IDR';
      form.elements.icon.value = 'wallet';
      form.elements.min_amount.value = '10000';
      form.elements.is_active.checked = true;
      $('#payment-editor-title').textContent = 'Add payment method';
    };

    const populateEditor = (method) => {
      form.elements.id.value = method.id;
      form.elements.name.value = method.name;
      form.elements.currency.value = method.currency;
      form.elements.preset_amounts.value = method.preset_amounts.join(', ');
      form.elements.min_amount.value = method.min_amount;
      form.elements.icon.value = method.icon;
      form.elements.sort_order.value = method.sort_order;
      form.elements.description.value = method.description;
      form.elements.instructions.value = method.instructions;
      form.elements.confirmation_email.value = method.confirmation_email;
      form.elements.telegram_username.value = method.telegram_username;
      form.elements.is_active.checked = method.is_active;
      $('#payment-editor-title').textContent = `Edit ${method.name}`;
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const loadMethods = async () => {
      const data = await request('/v1/admin/payment-methods');
      methods = data.methods;
      $('#exchange-rate-form').elements.usd_to_idr_rate.value = data.usd_to_idr_rate;
      const list = $('#admin-payment-methods');
      list.innerHTML = methods.length ? methods.map((method) => `
        <article class="payment-admin-card"><img src="${iconBase}${escapeHtml(method.icon)}.svg" alt=""><div><strong>${escapeHtml(method.name)}</strong><small>${escapeHtml(method.currency)} · ${method.preset_amounts.map((amount) => method.currency === 'USD' ? `$${amount}` : formatIdr(amount)).join(' / ')}</small><p>${escapeHtml(method.description)}</p><span class="status-pill status-pill--${method.is_active ? 'active' : 'disabled'}">${method.is_active ? 'active' : 'disabled'}</span></div><button class="button button--ghost" type="button" data-edit-method="${escapeHtml(method.id)}">Edit method</button></article>`).join('') : '<p>No payment methods configured.</p>';
      list.querySelectorAll('[data-edit-method]').forEach((button) => button.addEventListener('click', async () => {
        const method = methods.find((item) => item.id === button.dataset.editMethod);
        const approved = await confirmAction({ title: `Edit ${method.name}?`, message: 'Open this payment method in the administrator editor.', confirmText: 'Open editor' });
        if (approved) populateEditor(method);
      }));
    };

    $('#payment-editor-reset').addEventListener('click', async () => {
      const approved = await confirmAction({ title: 'Start a new payment method?', message: 'Unsaved changes in the editor will be cleared.', confirmText: 'Clear editor' });
      if (approved) resetEditor();
    });

    $('#exchange-rate-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const rate = Number(new FormData(event.currentTarget).get('usd_to_idr_rate'));
      const approved = await confirmAction({ title: 'Update USD conversion rate?', message: `Future USD requests will credit balance using 1 USD = ${formatIdr(rate)}. Existing requests keep their stored conversion.`, confirmText: 'Save rate' });
      if (!approved) return;
      await post('/v1/admin/settings', { usd_to_idr_rate: rate });
      window.portalToast('Exchange rate updated.');
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const values = new FormData(form);
      const id = values.get('id');
      const body = {
        name: values.get('name'), currency: values.get('currency'),
        preset_amounts: String(values.get('preset_amounts')).split(',').map((item) => Number(item.trim())).filter(Boolean),
        min_amount: Number(values.get('min_amount')), icon: values.get('icon'), sort_order: Number(values.get('sort_order')),
        description: values.get('description'), instructions: values.get('instructions'),
        confirmation_email: values.get('confirmation_email'), telegram_username: values.get('telegram_username'),
        is_active: form.elements.is_active.checked,
      };
      const approved = await confirmAction({ title: id ? 'Save payment method changes?' : 'Create payment method?', message: `${body.name} · ${body.currency} · ${body.preset_amounts.length} selectable amount(s).`, confirmText: id ? 'Save changes' : 'Create method' });
      if (!approved) return;
      await post(id ? `/v1/admin/payment-methods/${id}` : '/v1/admin/payment-methods', body);
      window.portalToast(id ? 'Payment method updated.' : 'Payment method created.');
      resetEditor();
      await loadMethods();
    });

    await loadMethods();
  };

  document.addEventListener('DOMContentLoaded', async () => {
    bindLogout();
    try {
      await verifyAdmin();
      if (page === 'licenses') await initLicenses();
      if (page === 'topups') await loadTopups();
      if (page === 'payments') await initPayments();
    } catch (error) {
      if (error.status === 401) return location.replace('/trial/');
      if (error.status === 403) return location.replace('/accounts/overview/');
      setStatus(error.message, 'error');
    }
  });
})();
