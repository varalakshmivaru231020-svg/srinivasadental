// Holds the active Lenis instance so any component can scroll smoothly or pause scrolling.
let lenis = null;

export const setLenis = (instance) => { lenis = instance; };
export const getLenis = () => lenis;

const HEADER_OFFSET = -100;

/** Smoothly scrolls to a number (px), a CSS selector or an element. */
export function scrollToTarget(target, options = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset: typeof target === 'number' ? 0 : HEADER_OFFSET, duration: 1.2, ...options });
    return;
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: options.immediate ? 'auto' : 'smooth' });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: options.immediate ? 'auto' : 'smooth', block: 'start' });
}
