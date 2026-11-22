'use client';

import { useEffect } from 'react';

const RIPPLE_SELECTOR = [
  '.btn',
  '.icon-btn',
  '.wb-chip',
  '.cat-pill',
  '.pulse-btn',
  '.seg-control__btn',
  '.rail-item',
  '.mobile-dock__btn',
  '.suite-tile',
  '.wk-tpl-card',
  '.recent-chip',
  '.readout-card__copy',
  '.wk-bind-btn',
  '.wk-picker__item',
  '.cmd-trigger',
].join(',');

export default function TapFeedback() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const onPointerDown = (event: PointerEvent) => {
      if (reducedMotion.matches) return;
      if (event.button !== 0 && event.pointerType === 'mouse') return;

      const rawTarget = event.target;
      if (!(rawTarget instanceof Element)) return;

      const host = rawTarget.closest<HTMLElement>(RIPPLE_SELECTOR);
      if (!host) return;
      if (
        host.hasAttribute('disabled') ||
        host.getAttribute('aria-disabled') === 'true'
      ) {
        return;
      }

      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const maxX = Math.max(x, rect.width - x);
      const maxY = Math.max(y, rect.height - y);
      const diameter = Math.ceil(Math.hypot(maxX, maxY) * 2);

      const wave = document.createElement('span');
      wave.className =
        event.pointerType === 'touch'
          ? 'tap-ripple tap-ripple--touch'
          : 'tap-ripple';
      wave.setAttribute('aria-hidden', 'true');
      wave.style.position = 'absolute';
      wave.style.pointerEvents = 'none';
      wave.style.width = `${diameter}px`;
      wave.style.height = `${diameter}px`;
      wave.style.left = `${x}px`;
      wave.style.top = `${y}px`;

      host.appendChild(wave);

      let cleaned = false;
      const cleanup = () => {
        if (cleaned) return;
        cleaned = true;
        wave.remove();
      };

      wave.addEventListener('animationend', cleanup, { once: true });
      window.setTimeout(cleanup, 560);
    };

    document.addEventListener('pointerdown', onPointerDown, { passive: true });
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  return null;
}
