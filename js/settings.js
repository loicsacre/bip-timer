import { DEFAULT_SETTINGS, exerciseValue } from './sequence.js';

export const FIELDS = {
  exercises: { min: 1, max: 30, step: 1, type: 'count' },
  rounds: { min: 1, max: 99, step: 1, type: 'count' },
  prep: { min: 0, max: 120, step: 5, type: 'seconds' },
  effort: { min: 5, max: 600, step: 5, type: 'seconds' },
  reps: { min: 1, max: 200, step: 1, type: 'reps' },
  recExercise: { min: 0, max: 600, step: 5, type: 'seconds' },
  recRound: { min: 0, max: 600, step: 5, type: 'seconds' },
  recSet: { min: 0, max: 600, step: 5, type: 'seconds' },
};

// The settings that can also be given per exercise, and where those values are kept.
export const OWN_VALUES = { effort: 'exerciseEfforts', reps: 'exerciseReps' };

export const INITIAL_SETTINGS = Object.freeze({ ...DEFAULT_SETTINGS, sound: true, throughSilent: false });

export function clamp(value, field) {
  return Math.min(field.max, Math.max(field.min, value));
}

export function ownValues(settings, key) {
  return Array.from({ length: settings.exercises }, (_, index) => exerciseValue(settings, key, index));
}

export function varies(settings, key) {
  const values = ownValues(settings, key);

  return values.some((value) => value !== values[0]);
}

// Values for exercises that no longer exist are dropped, and a list where every exercise ends up
// equal folds back into the block's value, so no hidden base can surprise the next exercise added.
export function normalized(settings) {
  const next = { ...settings };

  for (const [key, list] of Object.entries(OWN_VALUES)) {
    if (!next[list]) {
      continue;
    }

    next[list] = next[list].slice(0, next.exercises);

    if (varies(next, key)) {
      continue;
    }

    next[key] = exerciseValue(next, key, 0);
    delete next[list];
  }

  return next;
}

// Keeps only what is valid in settings from an untrusted source (storage, a shared link, a page
// preset), laid over `base`.
export function sanitize(input, base = INITIAL_SETTINGS) {
  const settings = { ...base };

  if (!input || typeof input !== 'object') {
    return normalized(settings);
  }

  for (const [key, field] of Object.entries(FIELDS)) {
    if (Number.isFinite(input[key])) {
      settings[key] = clamp(Math.round(input[key]), field);
    }
  }

  if (input.structure === 'circuit' || input.structure === 'series') {
    settings.structure = input.structure;
  }

  if (input.unit === 'time' || input.unit === 'reps') {
    settings.unit = input.unit;
  }

  for (const key of ['sound', 'throughSilent']) {
    if (typeof input[key] === 'boolean') {
      settings[key] = input[key];
    }
  }

  for (const [key, list] of Object.entries(OWN_VALUES)) {
    if (Array.isArray(input[list])) {
      settings[list] = input[list]
        .slice(0, FIELDS.exercises.max)
        .map((value) => (Number.isFinite(value) ? clamp(Math.round(value), FIELDS[key]) : settings[key]));
    }
  }

  return normalized(settings);
}

// The same settings with their per-exercise values dropped, for a source that sets the block anew.
export function withoutOwnValues(settings) {
  const next = { ...settings };

  for (const list of Object.values(OWN_VALUES)) {
    delete next[list];
  }

  return next;
}
