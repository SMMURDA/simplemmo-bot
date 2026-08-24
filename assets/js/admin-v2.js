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
  const put = (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) });
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
      const isBlock = next === 'revoked';
      const result = await confirmAction({
        title: `${isBlock ? 'Block' : 'Enable'} this license?`,
        message: isBlock
          ? 'The license will be revoked immediately. Optionally include a message visible to the user explaining why.'
          : 'The license status changes immediately for future validation checks.',
        confirmText: isBlock ? 'Block license' : 'Enable license',
        tone: isBlock ? 'danger' : 'primary',
        prompt: isBlock ? { label: 'Revoke message (optional)', type: 'text', value: '', placeholder: 'e.g. Abuse detected, multiple accounts on same device' } : null,
      });
      if (isBlock ? result === null : !result) return;
      const body = { status: next };
      if (isBlock) body.message = String(result || '').trim();
      await post(`/v1/admin/licenses/${button.dataset.licenseStatus}/status`, body);
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
    const iconSelect = form.elements.icon;
    const iconWarning = $('#icon-deploy-warning');
    const legacyIcons = new Set(['wallet', 'bank', 'paypal', 'crypto', 'telegram', 'email']);
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
      const backendReportsIcons = Array.isArray(data.allowed_icons) && data.allowed_icons.length > 0;
      const supportedIcons = new Set(backendReportsIcons ? data.allowed_icons : [...legacyIcons]);
      iconSelect.querySelectorAll('option').forEach((option) => {
        option.disabled = !supportedIcons.has(option.value);
        option.title = option.disabled ? 'Deploy Worker terbaru untuk mengaktifkan icon ini.' : '';
      });
      iconWarning.hidden = backendReportsIcons;
      if (!backendReportsIcons) setStatus('Frontend sudah baru, tetapi Worker backend masih versi lama. Deploy ulang Worker sebelum memakai icon tambahan.', 'error');
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
      const saved = id ? methods.find((method) => method.id === id) : null;
      if (saved && saved.icon !== body.icon) throw new Error(`Worker menyimpan icon '${saved.icon}', bukan '${body.icon}'. Deploy ulang Worker terbaru lalu simpan kembali.`);
    });

    await loadMethods();
  };

  const loadUsers = async () => {
    const users = await request('/v1/admin/users');
    const table = $('#users-table');
    if (!users.users || !users.users.length) {
      table.innerHTML = '<p style="color:var(--muted)">No users found.</p>';
      return;
    }
    const rows = users.users.map(u => `
      <tr>
        <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${escapeHtml(u.email)}">${escapeHtml(u.email)}</td>
        <td>${escapeHtml(u.display_name || '—')}</td>
        <td>${u.role === 'admin' ? '👑 Admin' : 'Member'}</td>
        <td>${u.trial_license_id ? '✅ Yes' : '—'}</td>
        <td>${u.email_verified_at ? '✅' : '❌'}</td>
        <td>${formatDate(u.created_at)}</td>
        <td style="display:flex;gap:4px;flex-wrap:wrap">
          <button class="button button--small" data-action="reset" data-id="${u.id}" title="Reset trial">↺ Reset</button>
          <button class="button button--small button--danger" data-action="delete" data-id="${u.id}" title="Delete user">🗑 Delete</button>
        </td>
      </tr>`).join('');
    table.innerHTML = `<table style="width:100%;border-collapse:collapse"><thead><tr><th>Email</th><th>Name</th><th>Role</th><th>Trial</th><th>Verified</th><th>Joined</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table>`;
    table.querySelectorAll('[data-action="reset"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        if (!await confirmAction({ title: 'Reset trial?', message: 'Revoke trial license + clear devices. User can create new trial.', confirmText: 'Reset', tone: 'danger' })) return;
        try { await post(`/v1/admin/users/${id}/reset-trial`, {}); setStatus('Trial reset.', 'success'); loadUsers(); }
        catch (e) { setStatus(e.message, 'error'); }
      });
    });
    table.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        if (!await confirmAction({ title: 'Delete user?', message: 'This will delete all user data: licenses, devices, topups. Cannot be undone.', confirmText: 'Delete permanently', tone: 'danger' })) return;
        try { await request(`/v1/admin/users/${id}`, { method: 'DELETE' }); setStatus('User deleted.', 'success'); loadUsers(); }
        catch (e) { setStatus(e.message, 'error'); }
      });
    });
  };

  const initPricing = async () => {
    const form = $('#pricing-form');
    const updatedLabel = $('#pricing-updated');
    const saveBtn = $('#pricing-save-btn');
    try {
      const response = await fetch('https://license.topup.eu.org/v1/pricing', { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Failed to load pricing.');
      const data = await response.json();
      form.elements.price_usd.value = data.price_usd ?? 5;
      form.elements.price_idr.value = data.price_idr ?? 75000;
      form.elements.duration_days.value = data.duration_days ?? 30;
      if (data.updated_at && updatedLabel) {
        updatedLabel.textContent = 'Last updated: ' + formatDate(data.updated_at);
      }
    } catch (error) {
      setStatus(error.message, 'error');
    }
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const values = new FormData(form);
      const body = {
        price_usd: Number(values.get('price_usd')),
        price_idr: Number(values.get('price_idr')),
        duration_days: Number(values.get('duration_days')),
      };
      const approved = await confirmAction({
        title: 'Update license pricing?',
        message: `$${body.price_usd} USD / Rp${new Intl.NumberFormat('id-ID').format(body.price_idr)} IDR for ${body.duration_days} days. This change is visible to all visitors immediately.`,
        confirmText: 'Save pricing',
      });
      if (!approved) return;
      saveBtn.disabled = true;
      try {
        const result = await put('/v1/admin/pricing', body);
        window.portalToast('Pricing updated successfully.');
        if (result.pricing?.updated_at && updatedLabel) {
          updatedLabel.textContent = 'Last updated: ' + formatDate(result.pricing.updated_at);
        }
      } catch (error) { setStatus(error.message, 'error'); }
      finally { saveBtn.disabled = false; }
    });
  };

  document.addEventListener('DOMContentLoaded', async () => {
    bindLogout();
    try {
      await verifyAdmin();
      if (page === 'licenses') await initLicenses();
      if (page === 'topups') await loadTopups();
      if (page === 'payments') await initPayments();
      if (page === 'pricing') await initPricing();
      if (page === 'users') {
        await loadUsers();
        const overrideBtn = $('#override-btn');
        overrideBtn?.addEventListener('click', async () => {
          const email = $('#override-email')?.value.trim();
          if (!email) { $('#override-status').textContent = 'Enter email.'; return; }
          overrideBtn.disabled = true;
          try {
            const res = await post('/v1/admin/trial-override', { email });
            $('#override-status').textContent = res.message; $('#override-status').style.color = '#22c55e';
            loadUsers();
          } catch (e) { $('#override-status').textContent = e.message; $('#override-status').style.color = '#ef4444'; }
          finally { overrideBtn.disabled = false; }
        });
      }
    } catch (error) {
      if (error.status === 401) return location.replace('/trial/');
      if (error.status === 403) return location.replace('/accounts/overview/');
      setStatus(error.message, 'error');
    }
  });
})();
