/* Self-contained entrance: no access to the carousel or Apple Music player. */
(() => {
  const entrance = document.querySelector('.home-page .home-entrance');
  if (!entrance) return;
  const scene = entrance.querySelector('.entrance-scene');
  const replay = entrance.querySelector('.entrance-replay');
  const sound = entrance.querySelector('.entrance-sound');
  const status = entrance.querySelector('.entrance-status');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audio = null;
  let cleanupTimer = null;

  function replayVisual() {
    scene.classList.remove('entrance-playing');
    if (motion.matches) return;
    // Restart only the isolated tonearm animation, never a playlist record.
    void scene.offsetWidth;
    scene.classList.add('entrance-playing');
  }

  function closeSound() {
    window.clearTimeout(cleanupTimer);
    if (audio) {
      audio.close().catch(() => {});
      audio = null;
    }
  }

  replay.hidden = false;
  replay.addEventListener('click', replayVisual);
  if (AudioContext) {
    sound.hidden = false;
    sound.addEventListener('click', async () => {
      closeSound();
      let context;
      try {
        context = new AudioContext(); // Created only after a user gesture.
        audio = context;
        await context.resume();
        if (audio !== context) return;
        // An original, quiet noise tap, not a music recording or stream.
        const buffer = context.createBuffer(1, Math.floor(context.sampleRate * 0.22), context.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        const source = context.createBufferSource();
        source.buffer = buffer;
        const filter = context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1400;
        const gain = context.createGain();
        const start = context.currentTime;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.04, start + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.21);
        source.connect(filter); filter.connect(gain); gain.connect(context.destination);
        source.start(start); source.stop(start + 0.22);
        replayVisual();
        status.textContent = 'A brief needle-drop sound. Music stays off until you choose to play it.';
        cleanupTimer = window.setTimeout(closeSound, 600);
      } catch (error) {
        if (audio === context) closeSound();
        status.textContent = 'Sound is unavailable. You can still enter the collection.';
      }
    });
  }

  function motionChanged() {
    if (motion.matches) scene.classList.remove('entrance-playing');
  }
  if (motion.addEventListener) motion.addEventListener('change', motionChanged);
  else if (motion.addListener) motion.addListener(motionChanged);
  document.addEventListener('visibilitychange', () => { if (document.hidden) closeSound(); });
  window.addEventListener('pagehide', closeSound);
  replayVisual(); // One silent opening; no loop or automatic sound.
})();

