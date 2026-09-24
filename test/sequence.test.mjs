import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { DEFAULT_SETTINGS, SECONDS_PER_REPETITION, StepKind, buildSteps, plannedSeconds } from '../js/sequence.js';

// The same cases as bip's own sequence tests, so the two engines cannot drift apart.
const settings = (overrides) => ({ ...DEFAULT_SETTINGS, exercises: 2, rounds: 2, ...overrides });
const kinds = (steps) => steps.map((step) => step.kind);

describe('circuit on time', () => {
  test('runs the whole list, then repeats it', () => {
    const steps = buildSteps(settings({}));

    assert.deepEqual(kinds(steps), [
      StepKind.prep,
      StepKind.work,
      StepKind.recExercise,
      StepKind.work,
      StepKind.recRound,
      StepKind.work,
      StepKind.recExercise,
      StepKind.work,
    ]);
    assert.equal(steps[1].index, 0);
    assert.equal(steps[1].seconds, 40);
    assert.equal(steps[3].index, 1);
    assert.equal(steps.at(-1).round, 2);
  });

  test('announces the first exercise again on the last recovery of a round', () => {
    const recRound = buildSteps(settings({})).find((step) => step.kind === StepKind.recRound);

    assert.equal(recRound.next, 0);
  });

  test('closes the block with no next exercise', () => {
    assert.equal(buildSteps(settings({})).at(-1).next, null);
  });
});

describe('circuit on repetitions', () => {
  test('counts repetitions instead of seconds', () => {
    const work = buildSteps(settings({ unit: 'reps', exercises: 1, rounds: 1 })).find(
      (step) => step.kind === StepKind.work,
    );

    assert.equal(work.reps, 12);
    assert.equal(work.seconds, 0);
  });
});

describe('series', () => {
  test('runs every set of an exercise before moving to the next', () => {
    const steps = buildSteps(settings({ structure: 'series' }));

    assert.deepEqual(kinds(steps), [
      StepKind.prep,
      StepKind.work,
      StepKind.recSet,
      StepKind.work,
      StepKind.recExercise,
      StepKind.work,
      StepKind.recSet,
      StepKind.work,
    ]);
    assert.equal(steps[1].index, 0);
    assert.equal(steps[3].index, 0);
    assert.equal(steps[5].index, 1);
  });

  test('flags the step whose next set is the same exercise', () => {
    const steps = buildSteps(settings({ structure: 'series' }));

    assert.equal(steps[1].sameNext, true);
    assert.equal(steps[3].sameNext, false);
  });
});

describe('a value of zero', () => {
  test('drops the recovery it would have produced', () => {
    const steps = buildSteps(settings({ recExercise: 0 }));

    assert.ok(!kinds(steps).includes(StepKind.recExercise));
    assert.ok(kinds(steps).includes(StepKind.recRound));
  });

  test('drops the preparation step entirely', () => {
    assert.equal(buildSteps(settings({ exercises: 1, prep: 0 }))[0].kind, StepKind.work);
  });
});

describe('no exercise', () => {
  test('produces no step at all, not even a preparation', () => {
    assert.deepEqual(buildSteps(settings({ exercises: 0 })), []);
  });
});

describe('planned duration', () => {
  test('adds up the timed steps', () => {
    const steps = buildSteps(settings({ rounds: 1, prep: 15, recExercise: 25, effort: 40 }));

    assert.equal(plannedSeconds(steps), 15 + 40 + 25 + 40);
  });

  test('estimates a repetition at three seconds', () => {
    const steps = buildSteps(settings({ unit: 'reps', exercises: 1, rounds: 1, prep: 0 }));

    assert.equal(plannedSeconds(steps), 12 * SECONDS_PER_REPETITION);
  });
});

describe('a value per exercise', () => {
  test('gives each exercise its own effort, in every round', () => {
    const steps = buildSteps(settings({ exerciseEfforts: [30, 60] }));
    const efforts = steps.filter((step) => step.kind === StepKind.work).map((step) => step.seconds);

    assert.deepEqual(efforts, [30, 60, 30, 60]);
  });

  test('falls back to the block value for an exercise without one', () => {
    const steps = buildSteps(settings({ exercises: 3, exerciseEfforts: [30] }));
    const efforts = steps.filter((step) => step.kind === StepKind.work).map((step) => step.seconds);

    assert.deepEqual(efforts, [30, 40, 40, 30, 40, 40]);
  });

  test('counts each exercise its own repetitions, set after set', () => {
    const steps = buildSteps(settings({ structure: 'series', unit: 'reps', exerciseReps: [8, 15] }));
    const reps = steps.filter((step) => step.kind === StepKind.work).map((step) => step.reps);

    assert.deepEqual(reps, [8, 8, 15, 15]);
    assert.equal(plannedSeconds(steps), (8 + 8 + 15 + 15) * SECONDS_PER_REPETITION + 45 + 20 + 45 + 10);
  });
});
