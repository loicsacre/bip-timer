import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { INITIAL_SETTINGS, sanitize } from '../js/settings.js';
import { settingsFromQuery, settingsToQuery } from '../js/share.js';
import { PRESETS } from '../tools/presets.mjs';

const roundTrip = (settings) => settingsFromQuery(settingsToQuery(settings), INITIAL_SETTINGS);

describe('a shared link', () => {
  test('brings back the session it was made from', () => {
    const settings = sanitize({ structure: 'circuit', unit: 'time', exercises: 5, rounds: 4, prep: 15, effort: 45, recExercise: 10, recRound: 90 });

    assert.deepEqual(roundTrip(settings), settings);
  });

  test('keeps a value per exercise', () => {
    const settings = sanitize({ exercises: 3, exerciseEfforts: [30, 60, 45] });

    assert.match(settingsToQuery(settings), /effort=30-60-45/);
    assert.deepEqual(roundTrip(settings).exerciseEfforts, [30, 60, 45]);
  });

  test('carries only what the structure uses', () => {
    const query = settingsToQuery(sanitize({ structure: 'series', unit: 'reps', exercises: 1, rounds: 4, reps: 8 }));

    assert.match(query, /recSet=/);
    assert.doesNotMatch(query, /recRound|recExercise|effort=/);
  });

  test('replaces the per-exercise values of the setup it lands on', () => {
    const base = sanitize({ exercises: 3, exerciseEfforts: [30, 60, 45] });
    const shared = settingsFromQuery('exercises=3&effort=40', base);

    assert.equal(shared.effort, 40);
    assert.equal(shared.exerciseEfforts, undefined);
  });

  test('bounds what a hand-edited link asks for, and ignores an address without a session', () => {
    const shared = settingsFromQuery('exercises=500&effort=abc&structure=nonsense', INITIAL_SETTINGS);

    assert.equal(shared.exercises, 30);
    assert.equal(shared.effort, INITIAL_SETTINGS.effort);
    assert.equal(shared.structure, INITIAL_SETTINGS.structure);
    assert.equal(settingsFromQuery('?v=5', INITIAL_SETTINGS), null);
  });
});

test('every format page sets a block the timer accepts as it is', () => {
  for (const preset of PRESETS) {
    const settings = sanitize(preset.settings);

    for (const [key, value] of Object.entries(preset.settings)) {
      assert.equal(settings[key], value, `${preset.en.slug}: ${key}`);
    }
  }
});
