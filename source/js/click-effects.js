/* Click verdicts use Tessera's clickShowText configuration; no extra libraries. */
(() => {
  'use strict';

  // The document listener survives PJAX navigation. Never register it twice.
  if (window.__verdictClickEffect) return;

  const settings = document.currentScript?.dataset || {};
  if (settings.mobile === 'false' && window.matchMedia('(pointer: coarse)').matches) return;

  const words = (settings.text || 'AC,WA,TLE,RE,MLE,CE,UK').split(',').filter(Boolean);
  if (!words.length) return;
  window.__verdictClickEffect = true;

  const colors = {
    AC: '#35ce8d',
    WA: '#ff677c',
    TLE: '#f3bd53',
    RE: '#b58aff',
    MLE: '#59baff',
    CE: '#ff9c59',
    UK: '#76cdd1'
  };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const activeEffects = new Set();
  let nextWord = 0;

  document.addEventListener('click', event => {
    // Ignore keyboard activation, secondary clicks, and text editing.
    if (event.button !== 0 || event.detail === 0 || event.ctrlKey || event.metaKey || event.altKey) return;
    if (!(event.target instanceof Element)) return;
    if (event.target.closest('#reading-settings')) return;
    if (event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]')) return;

    const index = settings.random === 'true' ? Math.floor(Math.random() * words.length) : nextWord;
    const word = words[index];
    nextWord = (nextWord + 1) % words.length;

    // Keep rapid clicking from accumulating an unbounded number of elements.
    if (activeEffects.size >= 24) {
      const oldest = activeEffects.values().next().value;
      oldest.remove();
      activeEffects.delete(oldest);
    }

    const effect = document.createElement('div');
    effect.className = 'verdict-click-effect';
    effect.setAttribute('aria-hidden', 'true');
    effect.style.left = `${event.clientX}px`;
    effect.style.top = `${event.clientY}px`;
    effect.style.setProperty('--verdict-color', colors[word] || '#76cdd1');
    effect.style.setProperty('--verdict-font-size', settings.fontsize || '20px');

    const label = document.createElement('span');
    label.className = 'verdict-click-label';
    label.textContent = word;
    effect.appendChild(label);

    if (!reducedMotion.matches) {
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.35;
        const distance = 24 + Math.random() * 42;
        const particle = document.createElement('span');
        particle.className = 'verdict-click-particle';
        particle.style.setProperty('--particle-x', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--particle-y', `${Math.sin(angle) * distance - 18}px`);
        particle.style.setProperty('--particle-rotation', `${Math.random() * 270 - 135}deg`);
        effect.appendChild(particle);
      }
    }

    document.body.appendChild(effect);
    activeEffects.add(effect);
    window.setTimeout(() => {
      effect.remove();
      activeEffects.delete(effect);
    }, reducedMotion.matches ? 450 : 1000);
  }, { capture: true, passive: true });
})();
