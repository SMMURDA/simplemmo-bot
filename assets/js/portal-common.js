(() => {
  const modal = document.querySelector('#portal-modal');
  if (!modal) return;

  const title = document.querySelector('#portal-modal-title');
  const message = document.querySelector('#portal-modal-message');
  const confirmButton = document.querySelector('#portal-modal-confirm');
  const cancelButton = document.querySelector('#portal-modal-cancel');
  const inputWrap = document.querySelector('#portal-modal-input-wrap');
  const inputLabel = document.querySelector('#portal-modal-input-label');
  const input = document.querySelector('#portal-modal-input');
  const toast = document.querySelector('#portal-toast');
  let finish = null;
  let promptMode = false;
  let previousFocus = null;

  const close = (value) => {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('portal-modal-open');
    const callback = finish;
    finish = null;
    callback?.(value);
    previousFocus?.focus?.();
  };

  const open = ({
    title: heading = 'Confirm action',
    message: detail = 'Are you sure you want to continue?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    tone = 'primary',
    prompt = null,
  } = {}) => new Promise((resolve) => {
    if (finish) close(false);
    finish = resolve;
    previousFocus = document.activeElement;
    promptMode = Boolean(prompt);
    title.textContent = heading;
    message.textContent = detail;
    confirmButton.textContent = confirmText;
    cancelButton.textContent = cancelText;
    confirmButton.classList.toggle('button--danger', tone === 'danger');
    inputWrap.hidden = !promptMode;
    if (promptMode) {
      inputLabel.textContent = prompt.label || 'Value';
      input.type = prompt.type || 'text';
      input.value = prompt.value ?? '';
      input.min = prompt.min ?? '';
      input.max = prompt.max ?? '';
      input.step = prompt.step ?? '';
      input.placeholder = prompt.placeholder || '';
    }
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('portal-modal-open');
    requestAnimationFrame(() => (promptMode ? input : confirmButton).focus());
  });

  confirmButton.addEventListener('click', () => close(promptMode ? input.value : true));
  cancelButton.addEventListener('click', () => close(promptMode ? null : false));
  modal.querySelector('[data-modal-cancel]').addEventListener('click', () => close(promptMode ? null : false));
  document.addEventListener('keydown', (event) => {
    if (modal.hidden) return;
    if (event.key === 'Escape') close(promptMode ? null : false);
    if (event.key === 'Enter' && document.activeElement !== cancelButton) close(promptMode ? input.value : true);
  });

  const showToast = (text, tone = 'success') => {
    toast.textContent = text;
    toast.dataset.tone = tone;
    toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => { toast.hidden = true; }, 3200);
  };

  const copyWithConfirmation = async (text, label = 'license key') => {
    const approved = await open({
      title: `Copy ${label}`,
      message: `Copy this ${label} to your clipboard?`,
      confirmText: 'Copy now',
    });
    if (!approved) return false;
    await navigator.clipboard.writeText(String(text));
    showToast(`${label[0].toUpperCase()}${label.slice(1)} copied.`);
    return true;
  };

  window.portalConfirm = open;
  window.portalToast = showToast;
  window.portalCopy = copyWithConfirmation;
})();
