import { FIELDS, OWN_VALUES, ownValues, sanitize, varies, withoutOwnValues } from './settings.js';

// A session travels in the address, readable by a human: ?structure=circuit&unit=time&exercises=4…
// A value per exercise is written as a dash-separated list (effort=30-60-45).
export function settingsToQuery(settings) {
  const circuit = settings.structure === 'circuit';
  const work = settings.unit === 'reps' ? 'reps' : 'effort';
  const params = new URLSearchParams({
    structure: settings.structure,
    unit: settings.unit,
    exercises: settings.exercises,
    rounds: settings.rounds,
    prep: settings.prep,
    [work]: varies(settings, work) ? ownValues(settings, work).join('-') : settings[work],
  });

  if (settings.exercises > 1) {
    params.set('recExercise', settings.recExercise);
  }

  if (settings.rounds > 1) {
    params.set(circuit ? 'recRound' : 'recSet', circuit ? settings.recRound : settings.recSet);
  }

  return params.toString();
}

// The settings a link describes, laid over `base`; null when the link carries none.
export function settingsFromQuery(search, base) {
  const params = new URLSearchParams(search);
  const input = {};

  for (const key of Object.keys(FIELDS)) {
    const raw = params.get(key);

    if (raw === null) {
      continue;
    }

    if (OWN_VALUES[key] && raw.includes('-')) {
      input[OWN_VALUES[key]] = raw.split('-').map(Number);
      input[key] = Number(raw.split('-')[0]);
    } else {
      input[key] = Number(raw);
    }
  }

  for (const key of ['structure', 'unit']) {
    if (params.has(key)) {
      input[key] = params.get(key);
    }
  }

  if (Object.keys(input).length === 0) {
    return null;
  }

  return sanitize(input, withoutOwnValues(base));
}
