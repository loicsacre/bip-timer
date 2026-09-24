// What the phone does beyond the page: sound, vibration, and keeping the screen awake.

let context = null;
let lock = null;
let wanted = false;

// Must run inside a tap (the Start button): iOS keeps an audio context silent until a user gesture
// has resumed it. The audio session is left to mix with whatever already plays, as bip does, which
// means the iPhone silent switch mutes the beeps.
export function unlockAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  context ??= new AudioContextClass();

  if (context.state === 'suspended') {
    context.resume();
  }
}

// A sine with a quarter of the octave above mixed in to carry outdoors, and a 6 ms fade at each end
// so it starts and stops without a click. The same recipe as bip's signal files.
function tone(frequency, start, duration) {
  const oscillator = context.createOscillator();
  const octave = context.createOscillator();
  const octaveLevel = context.createGain();
  const envelope = context.createGain();
  const fade = 0.006;
  const peak = 0.72;

  oscillator.frequency.value = frequency;
  octave.frequency.value = frequency * 2;
  octaveLevel.gain.value = 0.25;

  envelope.gain.setValueAtTime(0, start);
  envelope.gain.linearRampToValueAtTime(peak, start + fade);
  envelope.gain.setValueAtTime(peak, start + duration - fade);
  envelope.gain.linearRampToValueAtTime(0, start + duration);

  oscillator.connect(envelope);
  octave.connect(octaveLevel).connect(envelope);
  envelope.connect(context.destination);

  for (const source of [oscillator, octave]) {
    source.start(start);
    source.stop(start + duration);
  }
}

const SOUNDS = {
  effort: [
    [784, 0, 0.09],
    [1046, 0.12, 0.12],
  ],
  recovery: [[440, 0, 0.26]],
  countdown: [[660, 0, 0.07]],
  finish: [
    [784, 0, 0.12],
    [1046, 0.16, 0.12],
    [1318, 0.32, 0.6],
  ],
};

// Outdoors a vibration carries further than a sound, so it fires even when the sound is off.
const VIBRATIONS = {
  effort: [120],
  recovery: [60, 60, 60],
  countdown: [30],
  finish: [200, 100, 200],
};

export function signal(name, { sound }) {
  navigator.vibrate?.(VIBRATIONS[name]);

  if (!sound || !context || context.state !== 'running') {
    return;
  }

  const now = context.currentTime;

  for (const [frequency, offset, duration] of SOUNDS[name]) {
    tone(frequency, now + offset, duration);
  }
}

export const wakeLockSupported = 'wakeLock' in navigator;

// The browser releases the lock whenever the page is hidden, so it is taken again each time the
// page comes back while a run is on.
export async function keepAwake() {
  wanted = true;

  await acquire();
}

export async function allowSleep() {
  wanted = false;

  await lock?.release();
  lock = null;
}

async function acquire() {
  if (!wakeLockSupported || lock || document.visibilityState !== 'visible') {
    return;
  }

  try {
    lock = await navigator.wakeLock.request('screen');
    lock.addEventListener('release', () => {
      lock = null;
    });
  } catch {
    lock = null;
  }
}

document.addEventListener('visibilitychange', () => {
  if (wanted) {
    acquire();
  }
});
