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
  '.section-heading, .card, .step, .price-card, .faq-item, .notice, .platform-badge, .payment-badge'
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
