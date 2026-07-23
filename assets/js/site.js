const button = document.querySelector('.nav-toggle');
const navigation = document.querySelector('.site-nav');

if (button && navigation) {
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    navigation.classList.toggle('is-open', !open);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      button.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('is-open');
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


// Session-aware Trial/Dashboard navigation.
const accountNavLink = document.querySelector('#account-nav-link');
if (accountNavLink) {
  const trialHref = accountNavLink.dataset.trialHref || '/trial/';
  const dashboardHref = accountNavLink.dataset.dashboardHref || '/accounts/';
  let accountNavState = 'checking';
  const resolveAccountNavigation = fetch('https://license.topup.eu.org/v1/account', {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  }).then((response) => {
    accountNavState = response.ok ? 'authenticated' : 'guest';
    accountNavLink.textContent = response.ok ? 'Dashboard' : 'Trial';
    accountNavLink.href = response.ok ? dashboardHref : trialHref;
    return accountNavState;
  }).catch(() => {
    accountNavState = 'guest';
    accountNavLink.textContent = 'Trial';
    accountNavLink.href = trialHref;
    return accountNavState;
  });
  accountNavLink.addEventListener('click', async (event) => {
    if (accountNavState !== 'checking') return;
    event.preventDefault();
    await resolveAccountNavigation;
    window.location.assign(accountNavState === 'authenticated' ? dashboardHref : trialHref);
  });
}
