// ============================================================================
// Quantify — Reference-Counted Body Scroll Lock (Desktop + Mobile Safe)
// ============================================================================
// Prevents background page scrolling while modals, command palettes, or
// mobile drawers are open—without layout shift on desktop scrollbars or
// iOS virtual keyboard jump glitches.
// ============================================================================

let activeLocks = 0;

interface SavedStyles {
  htmlOverflow: string;
  bodyOverflow: string;
  bodyPaddingRight: string;
  bodyOverscroll: string;
}

let saved: SavedStyles | null = null;

export function lockBodyScroll(): () => void {
  if (typeof window === 'undefined') return () => {};

  if (activeLocks === 0) {
    const html = document.documentElement;
    const body = document.body;
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    saved = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
      bodyOverscroll: body.style.overscrollBehavior,
    };

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';

    if (scrollbarWidth > 0) {
      const existingPad = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${existingPad + scrollbarWidth}px`;
    }
  }

  activeLocks += 1;
  let released = false;

  return () => {
    if (released) return;
    released = true;
    activeLocks = Math.max(0, activeLocks - 1);

    if (activeLocks === 0 && saved) {
      const html = document.documentElement;
      const body = document.body;
      html.style.overflow = saved.htmlOverflow;
      body.style.overflow = saved.bodyOverflow;
      body.style.paddingRight = saved.bodyPaddingRight;
      body.style.overscrollBehavior = saved.bodyOverscroll;
      saved = null;
    }
  };
}
