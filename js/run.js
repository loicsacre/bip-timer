import { StepKind, isCounted, isRecovery } from './sequence.js';

// A run held as absolute instants, never as a counter a ticker decrements: the time left is always
// recomputed from when the step started, so a throttled tab, a dropped frame or a page brought back
// to the front lands on the right step instead of drifting.
export class Run {
  constructor(steps, { now = () => Date.now(), onSignal = () => {} } = {}) {
    this.steps = steps;
    this.now = now;
    this.onSignal = onSignal;
    this.index = 0;
    this.startedAt = 0;
    this.stepStartedAt = 0;
    this.pausedAt = null;
    this.finishedAt = null;
    this.lastCountdown = 0;
  }

  get step() {
    return this.steps[this.index] ?? null;
  }

  get finished() {
    return this.finishedAt !== null;
  }

  get paused() {
    return this.pausedAt !== null;
  }

  start() {
    const now = this.now();

    this.startedAt = now;
    this.stepStartedAt = now;
    this.index = 0;
    this.pausedAt = null;
    this.finishedAt = null;
    this.lastCountdown = 0;

    if (this.steps.length === 0) {
      this.finishedAt = now;
    }
  }

  // Milliseconds left on a timed step; a counted step waits for a human and has none.
  remaining() {
    const step = this.step;

    if (!step || isCounted(step)) {
      return 0;
    }

    const reference = this.pausedAt ?? this.now();
    const left = step.seconds * 1000 - (reference - this.stepStartedAt);

    return Math.max(0, left);
  }

  // How full the gauge is: it empties as the step runs out, and stays full on a counted step.
  fraction() {
    const step = this.step;

    if (!step || isCounted(step) || step.seconds === 0) {
      return 1;
    }

    return Math.min(1, Math.max(0, this.remaining() / (step.seconds * 1000)));
  }

  elapsed() {
    const end = this.finishedAt ?? this.now();

    return Math.max(0, end - this.startedAt);
  }

  // Advances from each step's exact boundary rather than from now, and loops: coming back after
  // several steps' worth of time lands where the clock says, and only that step is announced.
  tick() {
    if (this.finished || this.paused) {
      return;
    }

    let moved = false;

    while (!this.finished) {
      const step = this.step;

      if (!step || isCounted(step)) {
        break;
      }

      const boundary = this.stepStartedAt + step.seconds * 1000;

      if (this.now() < boundary) {
        break;
      }

      this.advance(boundary, { signal: false });
      moved = true;
    }

    if (moved) {
      this.announce();
    }

    this.countdown();
  }

  next() {
    if (!this.finished) {
      this.advance(this.now());
    }
  }

  // The one control inside a block where the run waits for the user.
  validate() {
    if (this.step && isCounted(this.step)) {
      this.advance(this.now());
    }
  }

  previous() {
    if (this.finished) {
      return;
    }

    this.index = Math.max(0, this.index - 1);
    this.pausedAt = null;
    this.stepStartedAt = this.now();
    this.lastCountdown = 0;
  }

  // Resuming shifts the origin instead of tracking how long the pause lasted.
  togglePause() {
    if (this.finished) {
      return;
    }

    const now = this.now();

    if (this.pausedAt === null) {
      this.pausedAt = now;
    } else {
      this.stepStartedAt += now - this.pausedAt;
      this.pausedAt = null;
    }
  }

  advance(origin, { signal = true } = {}) {
    if (this.index + 1 >= this.steps.length) {
      this.finishedAt = origin;
      this.onSignal('finish');

      return;
    }

    this.index += 1;
    this.stepStartedAt = origin;
    this.pausedAt = null;
    this.lastCountdown = 0;

    if (signal) {
      this.announce();
    }
  }

  announce() {
    const step = this.step;

    if (!step || this.finished) {
      return;
    }

    if (step.kind === StepKind.work) {
      this.onSignal('effort');
    } else if (isRecovery(step)) {
      this.onSignal('recovery');
    }
  }

  // One tick for each of the last three seconds, never twice for the same one. Rounded up like the
  // figure on screen: at exactly three seconds left, the screen reads 3.
  countdown() {
    const step = this.step;

    if (!step || isCounted(step) || this.paused || this.finished) {
      return;
    }

    const left = Math.ceil(this.remaining() / 1000);

    if (left > 3 || left < 1 || left === this.lastCountdown) {
      return;
    }

    this.lastCountdown = left;
    this.onSignal('countdown');
  }
}
