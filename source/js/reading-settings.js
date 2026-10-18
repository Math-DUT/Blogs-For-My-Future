(() => {
  'use strict';
  if (window.__readingSettingsInitialized) return;
  window.__readingSettingsInitialized = true;

  const storageKey = 'tessera-reading-settings';
  const defaults = { text: 19, code: 18 };
  const limits = { text: [14, 28], code: [12, 26] };
  const root = document.documentElement;
  let sizes = { ...defaults };

  const normalize = (value, kind) => Number.isInteger(value)
    ? Math.min(limits[kind][1], Math.max(limits[kind][0], value))
    : defaults[kind];

  const apply = () => {
    root.style.setProperty('--global-font-size', `${sizes.text}px`);
    root.style.setProperty('--reading-code-size', `${sizes.code}px`);
  };

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && typeof saved === 'object') {
      sizes = { text: normalize(saved.text, 'text'), code: normalize(saved.code, 'code') };
    }
  } catch (_) {
    // Reading controls also work when browser storage is unavailable.
  }
  apply();

  const mount = () => {
    const container = document.getElementById('reading-settings');
    if (!container || container.dataset.initialized) return;
    container.dataset.initialized = 'true';

    const toggle = document.getElementById('reading-settings-toggle');
    const panel = document.getElementById('reading-settings-panel');
    const controls = {};

    const sync = () => {
      for (const kind of ['text', 'code']) {
        controls[kind].value = sizes[kind];
        document.getElementById(`reading-${kind}-size-value`).value = `${sizes[kind]}px`;
      }
    };
    const save = () => {
      apply();
      sync();
      try { localStorage.setItem(storageKey, JSON.stringify(sizes)); } catch (_) { /* Optional storage. */ }
    };
    const setOpen = open => {
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      if (open) controls.text.focus();
    };

    for (const kind of ['text', 'code']) {
      controls[kind] = document.getElementById(`reading-${kind}-size`);
      controls[kind].addEventListener('input', () => {
        sizes[kind] = normalize(Number(controls[kind].value), kind);
        save();
      });
    }
    sync();
    toggle.addEventListener('click', () => setOpen(panel.hidden));
    document.getElementById('reading-settings-close').addEventListener('click', () => {
      setOpen(false);
      toggle.focus();
    });
    document.getElementById('reading-settings-reset').addEventListener('click', () => {
      sizes = { ...defaults };
      save();
    });
  };

  document.addEventListener('click', event => {
    const container = document.getElementById('reading-settings');
    if (!container || container.contains(event.target)) return;
    document.getElementById('reading-settings-panel').hidden = true;
    document.getElementById('reading-settings-toggle').setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('keydown', event => {
    const panel = document.getElementById('reading-settings-panel');
    if (event.key !== 'Escape' || !panel || panel.hidden) return;
    panel.hidden = true;
    const toggle = document.getElementById('reading-settings-toggle');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  });
  document.addEventListener('pjax:complete', mount);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
