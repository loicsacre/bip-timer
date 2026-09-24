// The same rules as bip's sequence generator: a block's settings expand into the steps a run goes
// through, and a value of 0 produces no step at all rather than flashing by.

export const StepKind = Object.freeze({
  prep: 'prep',
  work: 'work',
  recExercise: 'recExercise',
  recSet: 'recSet',
  recRound: 'recRound',
});

// What one repetition is worth when estimating a duration: a counted step waits for a human.
export const SECONDS_PER_REPETITION = 3;

export const DEFAULT_SETTINGS = Object.freeze({
  structure: 'circuit',
  unit: 'time',
  exercises: 4,
  rounds: 3,
  prep: 10,
  effort: 40,
  reps: 12,
  recExercise: 20,
  recSet: 45,
  recRound: 60,
});

export function isRecovery(step) {
  return step.kind === StepKind.recExercise || step.kind === StepKind.recSet || step.kind === StepKind.recRound;
}

export function isCounted(step) {
  return step.reps > 0;
}

// What exercise `index` works for: its own value when one is set, else the block's.
export function exerciseValue(settings, key, index) {
  const own = settings[key === 'reps' ? 'exerciseReps' : 'exerciseEfforts']?.[index];

  return Number.isFinite(own) ? own : settings[key];
}

// Every exercise carries the block's value unless it has its own: this is a quick tool, not the
// block editor.
export function buildSteps(settings) {
  const exercises = Math.max(0, settings.exercises);

  if (exercises === 0 || settings.rounds < 1) {
    return [];
  }

  const counted = settings.unit === 'reps';
  const steps = [];

  const push = (step) => {
    if (step.seconds > 0 || step.reps > 0) {
      steps.push(step);
    }
  };

  const work = (round, index, next) => ({
    kind: StepKind.work,
    round,
    index,
    next,
    seconds: counted ? 0 : exerciseValue(settings, 'effort', index),
    reps: counted ? exerciseValue(settings, 'reps', index) : 0,
  });

  const rest = (kind, round, index, next, seconds) => ({ kind, round, index, next, seconds, reps: 0 });

  push(rest(StepKind.prep, 1, 0, 0, settings.prep));

  if (settings.structure === 'circuit') {
    for (let round = 1; round <= settings.rounds; round++) {
      for (let index = 0; index < exercises; index++) {
        const lastOfRound = index + 1 === exercises;
        const next = lastOfRound ? (round < settings.rounds ? 0 : null) : index + 1;

        push(work(round, index, next));

        if (!lastOfRound) {
          push(rest(StepKind.recExercise, round, index, next, settings.recExercise));
        }
      }

      if (round < settings.rounds) {
        push(rest(StepKind.recRound, round, exercises - 1, 0, settings.recRound));
      }
    }
  } else {
    for (let index = 0; index < exercises; index++) {
      const lastItem = index + 1 === exercises;

      for (let set = 1; set <= settings.rounds; set++) {
        const next = set < settings.rounds ? index : lastItem ? null : index + 1;

        push({ ...work(set, index, next), sameNext: set < settings.rounds });

        if (set < settings.rounds) {
          push({ ...rest(StepKind.recSet, set, index, index, settings.recSet), sameNext: true });
        }
      }

      if (!lastItem) {
        push(rest(StepKind.recExercise, settings.rounds, index, index + 1, settings.recExercise));
      }
    }
  }

  return steps;
}

export function plannedSeconds(steps) {
  return steps.reduce((total, step) => total + (isCounted(step) ? step.reps * SECONDS_PER_REPETITION : step.seconds), 0);
}
