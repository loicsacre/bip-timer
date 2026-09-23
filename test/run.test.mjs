import assert from 'node:assert/strict';
import { beforeEach, describe, test } from 'node:test';

import { Run } from '../js/run.js';
import { DEFAULT_SETTINGS, StepKind, buildSteps } from '../js/sequence.js';

// The same cases as bip's timer engine tests, against an injected clock.
let clock;
let signals;

const run = (overrides = {}) => {
  const steps = buildSteps({ ...DEFAULT_SETTINGS, exercises: 1, rounds: 1, ...overrides });
  const created = new Run(steps, { now: () => clock, onSignal: (signal) => signals.push(signal) });

  created.start();

  return created;
};

const advance = (seconds) => {
  clock += seconds * 1000;
};

beforeEach(() => {
  clock = Date.UTC(2026, 8, 22, 18);
  signals = [];
});

describe('the clock', () => {
  test('starts on the preparation step and counts down from it', () => {
    const current = run();

    assert.equal(current.step.kind, StepKind.prep);
    assert.equal(current.remaining(), 10_000);

    advance(4);

    assert.equal(current.remaining(), 6_000);
  });

  test('moves to the next step on its own once the time is up', () => {
    const current = run();

    advance(10);
    current.tick();

    assert.equal(current.step.kind, StepKind.work);
    assert.equal(current.remaining(), 40_000);
  });

  test('does not drift: a step that overran hands the overflow to the next one', () => {
    const current = run();

    advance(13);
    current.tick();

    assert.equal(current.step.kind, StepKind.work);
    assert.equal(current.remaining(), 37_000);
  });

  test('lands on the right step after a long interruption, and announces only that one', () => {
    const current = run({ exercises: 2, rounds: 2 });

    // prep 10 + work 40 + rec 20 + work 40 + recRound 60 = 170 s of the first round.
    advance(175);
    current.tick();

    assert.equal(current.step.kind, StepKind.work);
    assert.equal(current.step.round, 2);
    assert.equal(current.step.index, 0);
    assert.equal(current.remaining(), 35_000);
    assert.deepEqual(signals, ['effort']);
  });

  test('freezes while paused and shifts the origin on resume', () => {
    const current = run();

    advance(4);
    current.togglePause();
    advance(180);

    assert.equal(current.remaining(), 6_000);

    current.togglePause();
    advance(2);

    assert.equal(current.remaining(), 4_000);
  });

  test('never advances on a tick while paused', () => {
    const current = run();

    current.togglePause();
    advance(300);
    current.tick();

    assert.equal(current.step.kind, StepKind.prep);
  });
});

describe('the commands', () => {
  test('next and previous restart the step from now', () => {
    const current = run();

    advance(6);
    current.next();

    assert.equal(current.step.kind, StepKind.work);
    assert.equal(current.remaining(), 40_000);

    advance(12);
    current.previous();

    assert.equal(current.step.kind, StepKind.prep);
    assert.equal(current.remaining(), 10_000);
  });

  test('a counted step waits for a validation and never expires', () => {
    const current = run({ unit: 'reps', prep: 0 });

    advance(600);
    current.tick();

    assert.equal(current.step.reps, 12);

    current.validate();

    assert.equal(current.finished, true);
  });

  test('finishes after the last step and keeps the real duration', () => {
    const current = run({ prep: 0 });

    advance(45);
    current.tick();

    assert.equal(current.finished, true);
    assert.equal(current.elapsed(), 40_000);
    assert.ok(signals.includes('finish'));
  });
});

describe('the signals', () => {
  test('announce an effort and a recovery as each one starts', () => {
    const current = run({ exercises: 2 });

    advance(10);
    current.tick();

    assert.ok(signals.includes('effort'));

    signals.length = 0;
    advance(40);
    current.tick();

    assert.ok(signals.includes('recovery'));
  });

  test('tick once for each of the last three seconds, never twice for the same one', () => {
    const current = run();

    advance(7);
    current.tick();
    current.tick();

    assert.equal(signals.filter((signal) => signal === 'countdown').length, 1);

    advance(1);
    current.tick();
    advance(1);
    current.tick();

    assert.equal(signals.filter((signal) => signal === 'countdown').length, 3);
  });

  test('stay quiet while the run is paused', () => {
    const current = run();

    advance(7);
    current.togglePause();
    current.tick();

    assert.deepEqual(signals, []);
  });
});
