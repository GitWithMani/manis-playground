/* Native overflow works without JavaScript; these controls are an enhancement. */
(() => {
  const track = document.querySelector('.room-listening .playlist-track');
  if (!track) return;

  const controls = document.querySelector('.room-listening .playlist-controls');
  const previous = controls.querySelector('.playlist-previous');
  const next = controls.querySelector('.playlist-next');
  const cards = Array.from(track.querySelectorAll('.playlist-card'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function updateControls() {
    const end = Math.max(0, track.scrollWidth - track.clientWidth);
    controls.hidden = end <= 2;
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= end - 2;
  }

  function goTo(left) {
    track.scrollTo({ left, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  }

  function move(direction) {
    // Measure real card positions, including responsive widths and gaps.
    const first = cards[0].getBoundingClientRect().left;
    const positions = cards.map(card => card.getBoundingClientRect().left - first);
    const position = track.scrollLeft;
    const destination = direction > 0
      ? positions.find(left => left > position + 2)
      : positions.slice().reverse().find(left => left < position - 2);
    goTo(destination === undefined ? (direction > 0 ? track.scrollWidth : 0) : destination);
  }

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', updateControls, { passive: true });
  track.addEventListener('keydown', event => {
    // Leave normal link keyboard behavior alone.
    if (event.target !== track) return;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') goTo(0);
    else if (event.key === 'End') goTo(track.scrollWidth);
    else move(event.key === 'ArrowRight' ? 1 : -1);
  });

  window.addEventListener('resize', updateControls);
  if ('ResizeObserver' in window) new ResizeObserver(updateControls).observe(track);
  updateControls();
})();
