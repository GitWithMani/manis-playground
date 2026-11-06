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

  let scrollFrame = null;
  let savedSnap = '';

  function stopGlide() {
    if (scrollFrame === null) return;
    cancelAnimationFrame(scrollFrame);
    scrollFrame = null;
    track.style.scrollSnapType = savedSnap;
  }

  function goTo(left) {
    stopGlide();
    const destination = Math.max(0, Math.min(left, track.scrollWidth - track.clientWidth));
    if (reducedMotion.matches) {
      track.scrollTo({ left: destination, behavior: 'auto' });
      return;
    }
    const start = track.scrollLeft;
    const started = performance.now();
    savedSnap = track.style.scrollSnapType;
    // Avoid snap fighting the easing; restore normal snapping at the end.
    track.style.scrollSnapType = 'none';
    function step(now) {
      const progress = Math.min(1, (now - started) / 500);
      const eased = 1 - Math.pow(1 - progress, 3);
      track.scrollLeft = start + (destination - start) * eased;
      if (progress < 1) scrollFrame = requestAnimationFrame(step);
      else {
        track.scrollLeft = destination;
        track.style.scrollSnapType = savedSnap;
        scrollFrame = null;
        updateControls();
      }
    }
    scrollFrame = requestAnimationFrame(step);
  }

  // A hand gesture always takes over from an arrow glide immediately.
  ['pointerdown', 'touchstart', 'wheel'].forEach(name => {
    track.addEventListener(name, stopGlide, { passive: true });
  });
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', stopGlide);
  else if (reducedMotion.addListener) reducedMotion.addListener(stopGlide);
  window.addEventListener('resize', stopGlide);

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
  // Selection loads one official player; it never requests playback.
  const player = document.getElementById('featured-player');
  const playerHeading = document.getElementById('featured-heading');
  const status = document.querySelector('.room-listening .player-status');
  const selections = Array.from(document.querySelectorAll('.room-listening .playlist-select'));

  selections.forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      if (button.getAttribute('aria-pressed') === 'true') return;
      const title = button.dataset.playlistTitle;
      player.title = `Apple Music playlist: ${title}`;
      player.src = button.dataset.embedUrl;
      playerHeading.textContent = title;
      status.textContent = `Selected: ${title}. Start playback in the player.`;
      selections.forEach(choice => {
        choice.setAttribute('aria-pressed', String(choice === button));
        choice.closest('.playlist-card').classList.toggle('is-selected', choice === button);
      });
      // Keep focus on the selecting button; native buttons support Enter/Space.
    });
  });
})();



