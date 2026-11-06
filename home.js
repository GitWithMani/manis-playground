/* Progressive enhancement: never hide content while waiting for JavaScript. */
(() => {
  const root = document.querySelector('.home-page .lounge-home');
  if (!root || !('IntersectionObserver' in window) || !('animate' in Element.prototype)) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return;

  const styles = getComputedStyle(root);
  const distance = styles.getPropertyValue('--home-reveal-distance').trim() || '16px';
  const duration = parseFloat(styles.getPropertyValue('--home-reveal-duration')) || 600;
  const running = new Map();

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const section = entry.target;
      observer.unobserve(section); // One introduction per section, never a loop.
      if (reducedMotion.matches || section.contains(document.activeElement)) return;
      const animation = section.animate([
        { opacity: 0, transform: `translateY(${distance})` },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration, easing: 'ease-out' });
      // No fill mode: natural visible styles resume even if this script stops.
      running.set(section, animation);
      animation.onfinish = animation.oncancel = () => running.delete(section);
    });
  }, { threshold: 0.08 });

  root.querySelectorAll('[data-home-reveal]').forEach(section => observer.observe(section));

  // Tabbing into an animating section immediately reveals its focus target.
  root.addEventListener('focusin', event => {
    const section = event.target.closest('[data-home-reveal]');
    if (!section) return;
    observer.unobserve(section);
    const animation = running.get(section);
    if (animation) animation.cancel();
  });

  function motionChanged() {
    if (!reducedMotion.matches) return;
    observer.disconnect();
    running.forEach(animation => animation.cancel());
    running.clear();
  }
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', motionChanged);
  else if (reducedMotion.addListener) reducedMotion.addListener(motionChanged);
})();
