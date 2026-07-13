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
