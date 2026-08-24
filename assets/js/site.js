const button = document.querySelector('.nav-toggle');
const allNavs = document.querySelectorAll('.site-nav');

if (button && allNavs.length) {
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    allNavs.forEach((nav) => {
      if (!nav.hidden) nav.classList.toggle('is-open', !open);
    });
  });

  allNavs.forEach((nav) => {
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        button.setAttribute('aria-expanded', 'false');
        allNavs.forEach((n) => n.classList.remove('is-open'));
      });
    });
  });
}

const faqItems = Array.from(document.querySelectorAll('.faq-item'));
const faqLoadMore = document.querySelector('[data-faq-load-more]');
const initialFaqCount = 6;

if (faqLoadMore && faqItems.length > initialFaqCount) {
  const extraFaqs = faqItems.slice(initialFaqCount);
  let expanded = false;

  const updateFaqVisibility = () => {
    extraFaqs.forEach((item) => {
      item.hidden = !expanded;
      if (!expanded) item.removeAttribute('open');
    });
    faqLoadMore.hidden = false;
    faqLoadMore.setAttribute('aria-expanded', String(expanded));
    faqLoadMore.textContent = expanded
      ? 'Show fewer FAQs'
      : `Load more FAQs (${extraFaqs.length})`;
  };

  faqLoadMore.addEventListener('click', () => {
    expanded = !expanded;
    updateFaqVisibility();
    if (!expanded) {
      document.querySelector('#faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  updateFaqVisibility();
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealTargets = document.querySelectorAll(
  '.section-heading, .card, .step, .price-card, .faq-item, .notice, .platform-badge, .payment-badge, .lv-heading, .lv-feature, .lv-price-card, .lv-payment, .lv-steps li, .lv-notice'
);

if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px' });

  revealTargets.forEach((target, index) => {
    target.classList.add('scroll-reveal');
    target.style.setProperty('--reveal-delay', `${(index % 4) * 55}ms`);
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add('is-visible'));
}

const copyIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M15 9V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4"></path></svg>';
const checkIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"></path></svg>';

document.querySelectorAll('.doc-content pre').forEach((pre) => {
  if (pre.closest('.code-sample')) return;
  const code = pre.querySelector('code');
  if (!code) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'code-sample';
  pre.parentNode.insertBefore(wrapper, pre);
  wrapper.appendChild(pre);

  const language = [...code.classList].find((name) => name.startsWith('language-'))?.replace('language-', '') || 'code';
  const label = document.createElement('span');
  label.className = 'code-sample-label';
  label.textContent = language;
  wrapper.appendChild(label);

  const button = document.createElement('button');
  button.className = 'copy-code-button';
  button.type = 'button';
  button.setAttribute('aria-label', `Copy ${language} example`);
  button.innerHTML = copyIcon;

  button.addEventListener('click', async () => {
    const text = code.textContent;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }
    button.classList.add('is-copied');
    button.innerHTML = checkIcon;
    window.setTimeout(() => {
      button.classList.remove('is-copied');
      button.innerHTML = copyIcon;
    }, 1800);
  });
  wrapper.appendChild(button);
});


const httpMethods = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'DYNAMIC']);
document.querySelectorAll('.doc-content table').forEach((table) => {
  const headers = Array.from(table.querySelectorAll('thead th')).map((header) => header.textContent.trim().toLowerCase());
  const methodIndex = headers.indexOf('method');
  if (methodIndex === -1) return;
  table.querySelectorAll('tbody tr').forEach((row) => {
    const cell = row.cells[methodIndex];
    if (!cell || cell.querySelector('.http-method')) return;
    const method = cell.textContent.trim().toUpperCase();
    if (!httpMethods.has(method)) return;
    cell.innerHTML = `<span class="http-method http-method--${method.toLowerCase()}">${method}</span>`;
  });
});


const heroPreviewButtons = document.querySelectorAll('[data-hero-preview]');
if (heroPreviewButtons.length) {
  const lightbox = document.createElement('div');
  lightbox.className = 'image-lightbox';
  lightbox.hidden = true;
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Image preview');
  lightbox.innerHTML = '<button class="image-lightbox__close" type="button" aria-label="Close image preview">×</button><img class="image-lightbox__image" alt="">';
  document.body.appendChild(lightbox);
  const previewImage = lightbox.querySelector('.image-lightbox__image');
  const closeButton = lightbox.querySelector('.image-lightbox__close');
  let trigger = null;

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('image-lightbox-open');
    window.setTimeout(() => {
      lightbox.hidden = true;
      trigger?.focus();
    }, 220);
  };
  heroPreviewButtons.forEach((button) => button.addEventListener('click', () => {
    const image = button.querySelector('img');
    trigger = button;
    previewImage.src = image.currentSrc || image.src;
    previewImage.alt = image.alt;
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add('is-open'));
    document.body.classList.add('image-lightbox-open');
    closeButton.focus();
  }));
  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !lightbox.hidden) closeLightbox(); });
}


// License code examples: only the selected language panel is visible.
document.querySelectorAll('[data-license-examples]').forEach((exampleGroup) => {
  const tabs = Array.from(exampleGroup.querySelectorAll('[data-license-tab]'));
  const panels = Array.from(exampleGroup.querySelectorAll('[data-license-panel]'));
  const activate = (language, focusTab = false) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.licenseTab === language;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focusTab) tab.focus();
    });
    panels.forEach((panel) => { panel.hidden = panel.dataset.licensePanel !== language; });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab.dataset.licenseTab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      activate(tabs[nextIndex].dataset.licenseTab, true);
    });
  });
  activate(tabs.find((tab) => tab.classList.contains('is-active'))?.dataset.licenseTab || tabs[0]?.dataset.licenseTab);
});


// Product switcher: highlight the active product tab.
(function initProductSwitcher() {
  const nav = document.querySelector('.product-switcher');
  if (!nav) return;
  let active = nav.getAttribute('data-active');
  if (!active || active === 'smmo' || active === 'vhack') {
    // Use frontmatter value directly
  } else {
    active = null;
  }
  if (!active) {
    active = window.location.pathname.indexOf('/vhack/') !== -1 ? 'vhack' : 'smmo';
  }
  nav.querySelectorAll('.ps-tab').forEach((tab) => {
    tab.classList.toggle('ps-on', tab.getAttribute('data-product') === active);
  });
})();

// Session-aware navigation: toggle between guest nav and member nav.
const guestNav = document.querySelector('[data-nav="guest"]');
const memberNav = document.querySelector('[data-nav="member"]');
const navToggle = document.querySelector('.nav-toggle');

const showNav = (nav) => {
  if (guestNav) guestNav.hidden = nav !== 'guest';
  if (memberNav) memberNav.hidden = nav !== 'member';
  if (navToggle) {
    navToggle.setAttribute('aria-controls', nav === 'member' ? 'member-nav' : 'site-nav');
  }
};

if (guestNav || memberNav) {
  fetch('https://license.topup.eu.org/v1/account', {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  }).then((response) => {
    if (response.ok) return response.json();
    throw new Error('not authenticated');
  }).then((data) => {
    showNav('member');
    const adminLink = document.querySelector('#member-admin-link');
    if (adminLink && data.user?.role === 'admin') adminLink.hidden = false;
    const logoutBtn = document.querySelector('#header-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        try {
          await fetch('https://license.topup.eu.org/v1/auth/logout', {
            method: 'POST', credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: '{}',
          });
        } catch {}
        showNav('guest');
        location.replace('/trial/');
      });
    }
  }).catch(() => {
    showNav('guest');
  });
}

// Dynamic pricing: fetch from license server and update landing page price card.
(() => {
  const card = document.querySelector('[data-dynamic-pricing]');
  if (!card) return;
  const formatIdr = (value) => 'Rp' + new Intl.NumberFormat('id-ID').format(Number(value || 0));
  fetch('https://license.topup.eu.org/v1/pricing', { headers: { Accept: 'application/json' } })
    .then((r) => { if (!r.ok) throw new Error('pricing fetch failed'); return r.json(); })
    .then((data) => {
      const usdEl = document.getElementById('smmo-price-usd');
      const durEl = document.getElementById('smmo-price-duration');
      const idrEl = document.getElementById('smmo-price-idr');
      const isFree = Number(data.price_usd) === 0 && Number(data.price_idr) === 0;
      if (isFree) {
        if (usdEl) usdEl.textContent = 'FREE';
        if (durEl) durEl.textContent = '/ ' + (data.duration_days ?? 30) + ' days';
        if (idrEl) idrEl.innerHTML = 'FREE <span>IDR</span>';
      } else {
        if (usdEl) usdEl.textContent = '$' + (data.price_usd ?? 5);
        if (durEl) durEl.textContent = 'USD / ' + (data.duration_days ?? 30) + ' days';
        if (idrEl) idrEl.innerHTML = (Number(data.price_idr) === 0 ? 'FREE' : formatIdr(data.price_idr ?? 75000)) + ' <span>IDR</span>';
      }
    })
    .catch(() => { /* keep hardcoded defaults on error */ });
})();

// License checker: paste key, press check, see result.
(() => {
  const form = document.getElementById('license-check-form');
  if (!form) return;
  const input = document.getElementById('license-check-input');
  const btn = document.getElementById('license-check-btn');
  const result = document.getElementById('license-check-result');
  const esc = (s) => { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; };
  const formatDate = (iso) => { if (!iso) return '—'; const d = new Date(iso); return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const key = (input.value || '').trim();
    if (!key) return;
    btn.disabled = true;
    btn.textContent = 'Checking…';
    result.hidden = true;
    result.className = 'license-checker__result';
    try {
      const res = await fetch('https://license.topup.eu.org/v1/license-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ license_key: key }),
      });
      const data = await res.json();
      if (!res.ok) {
        result.classList.add('license-checker__result--error');
        result.innerHTML = `<div class="license-checker__status"><span class="license-checker__status-icon">❌</span> Error</div><p>${esc(data.message || 'Something went wrong.')}</p>`;
      } else if (data.active) {
        const lic = data.license || {};
        result.classList.add('license-checker__result--success');
        result.innerHTML = `<div class="license-checker__status"><span class="license-checker__status-icon">✅</span> Active</div><dl class="license-checker__details"><dt>Key</dt><dd>${esc(lic.key_masked || '—')}</dd><dt>Expires</dt><dd>${formatDate(lic.expires_at)} (${lic.expires_in_days ?? '?'} days left)</dd><dt>Created</dt><dd>${formatDate(lic.created_at)}</dd><dt>Devices</dt><dd>${lic.active_devices ?? 0} / ${lic.max_devices ?? '?'}</dd></dl>`;
      } else {
        const lic = data.license || {};
        const warn = data.status === 'expired' || data.status === 'revoked';
        result.classList.add(warn ? 'license-checker__result--warning' : 'license-checker__result--error');
        const icon = data.status === 'expired' ? '⏰' : data.status === 'revoked' ? '🚫' : '❌';
        const label = (data.status || 'inactive').charAt(0).toUpperCase() + (data.status || 'inactive').slice(1);
        let details = '';
        if (lic.key_masked) {
          details = `<dl class="license-checker__details"><dt>Key</dt><dd>${esc(lic.key_masked)}</dd><dt>Expires</dt><dd>${formatDate(lic.expires_at)}</dd><dt>Created</dt><dd>${formatDate(lic.created_at)}</dd><dt>Devices</dt><dd>${lic.active_devices ?? 0} / ${lic.max_devices ?? '?'}</dd></dl>`;
        }
        result.innerHTML = `<div class="license-checker__status"><span class="license-checker__status-icon">${icon}</span> ${esc(label)}</div><p>${esc(data.message || 'License is not active.')}</p>${details}`;
      }
      result.hidden = false;
    } catch (err) {
      result.classList.add('license-checker__result--error');
      result.innerHTML = `<div class="license-checker__status"><span class="license-checker__status-icon">❌</span> Connection Error</div><p>Could not reach the license server. Please try again later.</p>`;
      result.hidden = false;
    }
    btn.disabled = false;
    btn.textContent = 'Check';
  });
})();
