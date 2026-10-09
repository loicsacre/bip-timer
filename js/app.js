import { SECONDS_PER_REPETITION, StepKind, buildSteps, exerciseValue, isCounted } from './sequence.js';
import { Run } from './run.js';
import { allowSleep, keepAwake, signal, silentSwitch, unlockAudio, wakeLockSupported } from './device.js';
import { track } from './analytics.js';
import { LANGUAGES, lang, setLanguage, t } from './i18n.js';
import { FIELDS, OWN_VALUES, clamp, normalized, ownValues, sanitize, varies, withoutOwnValues } from './settings.js';
import { settingsFromQuery, settingsToQuery } from './share.js';

const STORAGE_KEY = 'bip-timer-settings';

// The sound preferences belong to the phone, whatever page is open; the block belongs to the setup.
const PREFERENCES = ['sound', 'throughSilent', 'countdown'];

const PHASE_COLORS = { prep: 'var(--phase-prep)', effort: 'var(--phase-effort)', recovery: 'var(--phase-recovery)' };

const HOLD_DELAY = 450;
const HOLD_INTERVAL = 90;

const app = document.getElementById('app');

// A format page (Tabata, HIIT…) describes itself: its heading, its intro and the block it sets.
const page = JSON.parse(app.dataset.page ?? 'null');

const state = {
  settings: initialSettings(),
  screen: 'setup',
  help: false,
  confirm: false,
  resumeAfterConfirm: false,
  run: null,
  runSettings: null,
  result: null,
  sessionView: null,
  perExercise: false,
};

saveSettings();

function loadSettings() {
  try {
    return sanitize(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null'));
  } catch {
    // A private window or blocked storage starts from the defaults.
    return sanitize(null);
  }
}

// What the page brings on top of the last setup: a format page always opens on its own block,
// and a shared link sets the session it describes, then leaves the address so a reload keeps the
// user's changes.
function initialSettings() {
  let settings = loadSettings();

  if (page?.settings) {
    const preferences = Object.fromEntries(PREFERENCES.map((key) => [key, settings[key]]));

    settings = { ...sanitize(page.settings, withoutOwnValues(settings)), ...preferences };

    // A page made to set the countdown (the beep timer) wins over the phone's preference.
    if ('countdown' in page.settings) {
      settings.countdown = page.settings.countdown;
    }
  }

  const shared = settingsFromQuery(location.search, settings);

  if (shared) {
    settings = shared;
    history.replaceState(null, '', location.pathname);
  }

  return settings;
}

// A format page keeps its block to itself, so a passing visit never replaces the setup saved on the
// main page; only the sound preferences carry over.
function saveSettings() {
  try {
    const saved = page?.settings
      ? { ...loadSettings(), ...Object.fromEntries(PREFERENCES.filter((key) => key !== 'countdown').map((key) => [key, state.settings[key]])) }
      : state.settings;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {
    // Not remembering the setup is acceptable.
  }
}

function clock(seconds) {
  const whole = Math.max(0, seconds);

  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

function timedSeconds(steps) {
  return steps.reduce((total, step) => total + step.seconds, 0);
}

// Setup

function setupRows(settings) {
  const circuit = settings.structure === 'circuit';
  const rows = [
    ['exercises', t.exercises],
    ['rounds', circuit ? t.rounds : t.sets],
    ['prep', t.prep],
    ['work'],
  ];

  if (settings.exercises > 1) {
    rows.push(['recExercise', t.recExercise]);
  }

  if (settings.rounds > 1) {
    rows.push(circuit ? ['recRound', t.recRound] : ['recSet', t.recSet]);
  }

  return rows;
}

function fieldValue(key, value) {
  const { type } = FIELDS[key];

  if (type === 'seconds') {
    if (value === 0) {
      return { text: t.zero, unit: '', off: true };
    }

    return value < 60 ? { text: String(value), unit: t.seconds } : { text: clock(value), unit: '' };
  }

  return { text: String(value), unit: type === 'reps' ? t.repUnit : '' };
}

function segmented(key, options) {
  const buttons = options
    .map(
      ([value, label]) =>
        `<button type="button" data-action="set" data-key="${key}" data-value="${value}" aria-pressed="${state.settings[key] === value}">${label}</button>`,
    )
    .join('');

  return `<div class="segmented" role="group">${buttons}</div>`;
}

// Every value the row stands for: the block's, one exercise's (`effort.2`), or all the exercises'.
function rowValues(target) {
  const [key, position] = target.split('.');

  if (position !== undefined) {
    return [exerciseValue(state.settings, key, Number(position))];
  }

  return OWN_VALUES[key] ? ownValues(state.settings, key) : [state.settings[key]];
}

// A row whose exercises differ shows the spread in whole units, short enough for the value box.
function rangeValue(key, low, high) {
  return { text: `${low}-${high}`, unit: FIELDS[key].type === 'reps' ? t.repUnit : t.seconds, range: true };
}

// The phase each timed row sets, so its label carries the colour the run will show.
const ROW_PHASES = { prep: 'prep', effort: 'effort', reps: 'effort', recExercise: 'recovery', recRound: 'recovery', recSet: 'recovery' };

function stepperRow(target, label, { caption = '', sub = false } = {}) {
  const key = target.split('.')[0];
  const field = FIELDS[key];
  const values = rowValues(target);
  const low = Math.min(...values);
  const high = Math.max(...values);
  const shown = low === high ? fieldValue(key, low) : rangeValue(key, low, high);
  const phase = sub ? null : ROW_PHASES[key];
  const dot = phase ? `<i class="phase-dot" style="background: ${PHASE_COLORS[phase]}"></i>` : '';
  const title = `<span class="mono label">${dot}<span>${label}</span></span>`;
  const heading = caption ? `<div class="caption">${title}${caption}</div>` : title;

  return `
    <div class="field number${sub ? ' sub' : ''}">
      ${heading}
      <div class="stepper">
        <button type="button" data-step="${target}" data-direction="-1" aria-label="${t.less} ${label}"${high <= field.min ? ' disabled' : ''}><i></i></button>
        <div class="value" aria-live="polite">
          <span class="display${shown.off ? ' off' : ''}${shown.range ? ' range' : ''}">${shown.text}</span>
          <span class="mono">${shown.unit}</span>
        </div>
        <button type="button" data-step="${target}" data-direction="1" aria-label="${t.more} ${label}"${low >= field.max ? ' disabled' : ''}><i></i><i></i></button>
      </div>
    </div>`;
}

// The work row, with the per-exercise values folded under it: out of the way, one tap to open.
function workRows(settings) {
  const key = settings.unit === 'reps' ? 'reps' : 'effort';
  const label = key === 'reps' ? t.repsCount : t.effort;

  if (settings.exercises < 2) {
    return stepperRow(key, label);
  }

  const open = state.perExercise;
  const toggle = `<button type="button" class="toggle" data-action="per-exercise" aria-expanded="${open}">${open ? t.hidePerExercise : t.perExercise}</button>`;
  let rows = stepperRow(key, label, { caption: toggle });

  if (open) {
    for (let index = 0; index < settings.exercises; index++) {
      rows += stepperRow(`${key}.${index}`, t.exerciseShort(index + 1), { sub: true });
    }

    if (varies(settings, key)) {
      rows += `<div class="field sub reset"><button type="button" class="toggle" data-action="same-for-all">${t.sameForAll}</button></div>`;
    }
  }

  return rows;
}

// The sound, then with the sound on its countdown and, on iPhone only, whether the beeps may get
// through the silent switch.
function soundRows(settings) {
  const rows = [`<div class="field number"><span class="mono">${t.sound}</span>${segmented('sound', [[true, t.on], [false, t.off]])}</div>`];

  if (settings.sound) {
    rows.push(`
      <div class="field choice">
        <div class="caption"><span class="mono">${t.countdown}</span><span class="hint">${t.countdownHint}</span></div>
        ${segmented('countdown', [[true, t.on], [false, t.off]])}
      </div>`);
  }

  if (settings.sound && silentSwitch) {
    rows.push(`
      <div class="field choice">
        <div class="caption"><span class="mono">${t.silentMode}</span><span class="hint">${t.silentHint}</span></div>
        ${segmented('throughSilent', [[false, t.silentRespect], [true, t.silentRing]])}
      </div>`);
  }

  rows[rows.length - 1] = rows[rows.length - 1].replace('class="field ', 'class="field last ');

  return rows.join('');
}

function summary(settings) {
  const steps = buildSteps(settings);
  const total = timedSeconds(steps);
  const duration = total < 60 ? `${total} ${t.seconds}` : t.minutes(Math.round(total / 60));

  return `${t.steps(steps.length)} · ${duration}${settings.unit === 'reps' ? t.plusReps : ''}`;
}

// The run at a glance, each step as wide as it lasts.
function timeline(settings) {
  const steps = buildSteps(settings);
  const weight = (step) => (isCounted(step) ? step.reps * SECONDS_PER_REPETITION : step.seconds);
  const segments = steps
    .map((step) => `<i style="flex-grow: ${weight(step)}; background: ${PHASE_COLORS[phaseOf(step)]}"></i>`)
    .join('');

  return `<div class="timeline${steps.length > 60 ? ' dense' : ''}" aria-hidden="true">${segments}</div>`;
}

// The brand is the page's heading, except on a format page whose heading is the format's name.
function brandbar(right, tag = 'h1') {
  return `
    <header class="brandbar">
      <${tag} class="brand"><span class="display">BIP</span><span class="mono">${t.title}</span></${tag}>
      ${right}
    </header>`;
}

const SHARE_ICON = '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2v11M6 6l4-4 4 4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 10v8h12v-8" fill="none" stroke="currentColor" stroke-width="2"/></svg>';

const PLAY_ICON = '<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><polygon points="4,2 20,11 4,20" fill="currentColor"/></svg>';

// One tap to a ready-made block: each template is its own page, so these are plain links.
function picker() {
  if (!page?.picker) {
    return '';
  }

  const links = page.picker.links
    .map(({ label, href, current }) => `<a href="${href}"${current ? ' aria-current="page"' : ''}>${label}</a>`)
    .join('');

  return `<nav class="picker" aria-label="${page.picker.label}"><span class="mono">${page.picker.label}</span>${links}</nav>`;
}

function renderSetup() {
  const settings = state.settings;
  const circuit = settings.structure === 'circuit';
  const reps = settings.unit === 'reps';

  const languages = LANGUAGES.map(
    (code) =>
      `<button type="button" data-action="language" data-value="${code}" aria-pressed="${code === lang}" lang="${code}">${code.toUpperCase()}</button>`,
  ).join('');
  const tools = `
    <div class="tools">
      <div class="languages" role="group" aria-label="${t.language}">${languages}</div>
      <button type="button" class="help-button" data-action="help" aria-label="${t.help}"><span class="label">${t.help}</span><span class="mark">?</span></button>
    </div>`;

  return `
    <section class="screen setup">
      ${brandbar(tools, page?.heading ? 'div' : 'h1')}
      <div class="scroll">
      <div class="lede">
        ${page?.heading ? `<h1 class="display intro-title">${page.heading}</h1>` : ''}
        <p class="intro">${page?.intro ?? t.intro} <button type="button" class="inline-link" data-action="help">${t.howItWorks}</button></p>
        ${picker()}
      </div>
      <div class="fields">
        <div class="field choice">
          <div class="caption"><span class="mono">${t.structure}</span><span class="hint">${circuit ? t.circuitHint : t.seriesHint}</span></div>
          ${segmented('structure', [['circuit', t.circuit], ['series', t.series]])}
        </div>
        <div class="field choice">
          <div class="caption"><span class="mono">${t.unit}</span><span class="hint">${reps ? t.repsHint : t.timeHint}</span></div>
          ${segmented('unit', [['time', t.time], ['reps', t.reps]])}
        </div>
        ${setupRows(settings).map(([key, label]) => (key === 'work' ? workRows(settings) : stepperRow(key, label))).join('')}
        ${soundRows(settings)}
      </div>
      </div>
      <footer class="launch">
        ${timeline(settings)}
        <div class="summary">
          <span class="mono">${t.summary}</span><strong>${summary(settings)}</strong>
          <button type="button" class="share" data-action="share" aria-label="${t.share}">${SHARE_ICON}</button>
        </div>
        ${wakeLockSupported ? '' : `<p class="notice">${t.noWakeLock}</p>`}
        <button type="button" class="primary" data-action="start">${PLAY_ICON}<span class="display">${t.start}</span></button>
      </footer>
    </section>`;
}

// Session

function phaseOf(step) {
  if (step.kind === StepKind.prep) {
    return 'prep';
  }

  return step.kind === StepKind.work ? 'effort' : 'recovery';
}

function subtitle(step) {
  switch (step.kind) {
    case StepKind.prep:
      return t.beforeFirst;
    case StepKind.work:
      return isCounted(step) ? t.validateAtEnd : t.exerciseRunning(step.index + 1);
    case StepKind.recExercise:
      return t.betweenExercises;
    case StepKind.recRound:
      return t.betweenRounds;
    default:
      return t.betweenSets;
  }
}

function nextText(run, circuit) {
  const { steps, index, step } = run;
  const lastWork = steps.findLastIndex((candidate) => candidate.kind === StepKind.work);
  const upcoming = steps[index + 1];

  if (step.kind === StepKind.work && index === lastWork) {
    return t.lastEffort;
  }

  if (!upcoming) {
    return t.lastStep;
  }

  if (upcoming.kind === StepKind.work) {
    const where = circuit
      ? upcoming.round !== step.round
        ? t.nextRound(upcoming.round)
        : ''
      : t.nextSet(upcoming.round);

    const amount = isCounted(upcoming) ? ` · ${upcoming.reps} ${t.repUnit}` : ` · ${clock(upcoming.seconds)}`;
    const differs = varies(state.runSettings, isCounted(upcoming) ? 'reps' : 'effort');

    return t.nextExercise(upcoming.index + 1) + where + (differs ? amount : '');
  }

  return t.nextRecovery(clock(upcoming.seconds));
}

// Fixed-width boxes per character; the stylesheet sizes them from the text's width in em so the
// widest figure still fits the screen.
function digits(text, counted) {
  const size = counted ? 260 : text.length <= 4 ? 184 : 150;
  const width = [...text].reduce((total, character) => total + (character === ':' ? 0.28 : 0.54), 0);
  const boxes = [...text].map((character) => `<span${character === ':' ? ' class="colon"' : ''}>${character}</span>`).join('');

  return `<div class="digits" style="--size: ${size}; --width: ${width.toFixed(2)}; --label: ${counted ? 28 : 0}px">${boxes}</div>`;
}

function frise(step, rounds) {
  const current = step.round - 1;

  return Array.from({ length: rounds }, (_, position) => {
    const done = position < current || (position === current && step.kind === StepKind.recRound);
    const className = done ? 'done' : position === current ? 'current' : '';

    return `<i class="${className}"></i>`;
  }).join('');
}

function sessionView() {
  const { run, runSettings: settings } = state;
  const step = run.step;
  const counted = isCounted(step);
  const circuit = settings.structure === 'circuit';

  return {
    phase: phaseOf(step),
    counted,
    paused: run.paused,
    header: run.paused ? t.paused : t.stepOf(run.index + 1, run.steps.length),
    name: { prep: t.phasePrep, effort: t.phaseEffort, recovery: t.phaseRecovery }[phaseOf(step)],
    subtitle: subtitle(step),
    text: counted ? String(step.reps) : clock(Math.ceil(run.remaining() / 1000)),
    exercise: `${step.index + 1} / ${settings.exercises}`,
    roundLabel: circuit ? t.round : t.set,
    round: `${step.round} / ${settings.rounds}`,
    frise: frise(step, settings.rounds),
    next: nextText(run, circuit),
    center: run.paused ? 'resume' : counted ? 'validate' : 'pause',
    confirm: state.confirm,
  };
}

const CENTER_ICONS = {
  pause: '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><rect x="4" y="3" width="6" height="20" fill="currentColor"/><rect x="16" y="3" width="6" height="20" fill="currentColor"/></svg>',
  resume: '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><polygon points="5,3 23,13 5,23" fill="currentColor"/></svg>',
  validate: '<svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true"><polyline points="4,15 11,22 24,6" fill="none" stroke="currentColor" stroke-width="4"/></svg>',
};

const sheet = () => `
  <div class="sheet-backdrop">
    <div class="sheet" role="alertdialog" aria-modal="true" aria-labelledby="quit-title">
      <span class="mono">${t.stopped}</span>
      <span class="display" id="quit-title">${t.quitTitle}</span>
      <p>${t.quitMessage}</p>
      <div class="choices">
        <button type="button" class="leave" data-action="leave">${t.quit}</button>
        <button type="button" class="stay" data-action="stay">${t.keepGoing}</button>
      </div>
    </div>
  </div>`;

// Built once per run: the clock then only rewrites text inside it, because a button replaced
// between a finger's down and up swallows the tap.
function renderSessionShell() {
  return `
    <section class="screen session">
      <div class="statusbar"></div>
      <div class="content">
        <div class="top">
          <button type="button" class="quit" data-action="quit"><i></i><i></i>${t.quit}</button>
          <span class="ink" data-slot="header"></span>
        </div>
        <div class="heading">
          <span class="display phase-name" data-slot="name"></span>
          <span class="ink soft" data-slot="subtitle"></span>
        </div>
        <div class="gauge"><span></span></div>
        <div class="clock" role="timer" aria-live="off" data-slot="clock"></div>
        <div class="position">
          <div><span class="ink soft">${t.exercise}</span><span class="display" data-slot="exercise"></span></div>
          <div>
            <span class="ink soft" data-slot="roundLabel"></span><span class="display" data-slot="round"></span>
            <div class="frise" style="gap: ${state.runSettings.rounds <= 12 ? 4 : 1}px" data-slot="frise"></div>
          </div>
        </div>
        <div class="next" data-slot="next"></div>
      </div>
      <nav class="commands">
        <div class="row">
          <button type="button" class="side" data-action="previous">
            <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><rect x="2" y="3" width="4" height="20" fill="currentColor"/><polygon points="24,3 8,13 24,23" fill="currentColor"/></svg>
            ${t.previous}
          </button>
          <button type="button" class="center" data-action="center" data-slot="center"></button>
          <button type="button" class="side" data-action="next">
            <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><polygon points="2,3 18,13 2,23" fill="currentColor"/><rect x="20" y="3" width="4" height="20" fill="currentColor"/></svg>
            ${t.next}
          </button>
        </div>
      </nav>
    </section>`;
}

function updateSession(view, previous) {
  const section = app.querySelector('.session');
  const slot = (name) => section.querySelector(`[data-slot="${name}"]`);
  const changed = (key) => !previous || previous[key] !== view[key];

  section.classList.toggle('paused', view.paused);
  section.style.setProperty('--phase', PHASE_COLORS[view.phase]);

  for (const key of ['header', 'name', 'subtitle', 'exercise', 'roundLabel', 'round', 'next']) {
    if (changed(key)) {
      slot(key).textContent = view[key];
    }
  }

  if (changed('frise')) {
    slot('frise').innerHTML = view.frise;
  }

  if (changed('text') || changed('counted')) {
    slot('clock').innerHTML = `${digits(view.text, view.counted)}${view.counted ? `<span class="ink reps-label">${t.repsCount}</span>` : ''}`;
  }

  if (changed('center')) {
    slot('center').innerHTML = `${CENTER_ICONS[view.center]}<span class="display">${t[view.center]}</span>`;
  }

  if (changed('confirm')) {
    section.querySelector('.sheet-backdrop')?.remove();

    if (view.confirm) {
      section.insertAdjacentHTML('beforeend', sheet());
      section.querySelector('.stay').focus({ preventScroll: true });
    }
  }
}

// End

function renderEnd() {
  const { result } = state;
  const settings = result.settings;
  const structure = settings.structure === 'circuit' ? t.circuit : t.series;

  return `
    <section class="screen end">
      <div class="band"></div>
      ${brandbar(`<span class="mono">${t.end}</span>`)}
      <div class="body">
        <div class="stack">
          <span class="mono">${t.steps(result.steps)} · ${structure} · ${settings.exercises} × ${settings.rounds}</span>
          <span class="display title">${t.finished}</span>
        </div>
        <div class="times">
          <div><span class="mono">${t.realDuration}</span><span class="display">${clock(Math.round(result.elapsed / 1000))}</span></div>
          <div>
            <span class="mono">${settings.unit === 'reps' ? t.plannedWithoutReps : t.plannedDuration}</span>
            <span class="display planned">${clock(result.planned)}</span>
          </div>
        </div>
      </div>
      <div class="actions">
        <button type="button" class="primary" data-action="start">${PLAY_ICON}<span class="display">${t.restart}</span></button>
        <button type="button" class="secondary" data-action="settings">${t.settings}</button>
      </div>
    </section>`;
}

// Rendering keeps the setup list's scroll and the focused control across a redraw.
function render() {
  // A phone scrolls the intro and the settings together; a wide screen scrolls the settings alone.
  const scrolled = ['.scroll', '.fields'].map((selector) => [selector, app.querySelector(selector)?.scrollTop]);
  const focused = document.activeElement?.closest?.('[data-action], [data-step]');
  const focusKey = focused ? focusSelector(focused) : null;

  if (state.screen === 'setup') {
    app.innerHTML = renderSetup();
  } else if (state.screen === 'session') {
    renderSessionFrame();

    return;
  } else {
    app.innerHTML = renderEnd();
  }

  for (const [selector, top] of scrolled) {
    const element = app.querySelector(selector);

    if (element && top) {
      element.scrollTop = top;
    }
  }

  if (focusKey) {
    app.querySelector(focusKey)?.focus({ preventScroll: true });
  }
}

function focusSelector(element) {
  if (element.dataset.step) {
    return `[data-step="${element.dataset.step}"][data-direction="${element.dataset.direction}"]`;
  }

  if (element.dataset.key) {
    return `[data-action="set"][data-key="${element.dataset.key}"][data-value="${element.dataset.value}"]`;
  }

  return `[data-action="${element.dataset.action}"]`;
}

function renderSessionFrame() {
  if (!app.querySelector('.session')) {
    app.innerHTML = renderSessionShell();
    state.sessionView = null;
  }

  const view = sessionView();

  updateSession(view, state.sessionView);
  state.sessionView = view;
  paintGauge();
}

function paintGauge() {
  const gauge = app.querySelector('.gauge span');

  if (gauge && state.run) {
    gauge.style.transform = `scaleX(${state.run.fraction()})`;
  }
}

// Run lifecycle

function start() {
  unlockAudio();

  state.runSettings = { ...state.settings };
  state.run = new Run(buildSteps(state.runSettings), {
    onSignal: (name) => {
      if (name !== 'countdown' || state.runSettings.countdown) {
        signal(name, state.runSettings);
      }
    },
  });
  state.run.start();
  state.screen = 'session';
  track(`session-start/${format(state.runSettings)}`);
  showGuide(false);
  state.confirm = false;

  keepAwake();

  if (state.run.step.kind === StepKind.prep) {
    signal('countdown', state.runSettings);
  } else {
    state.run.announce();
  }

  render();
  requestAnimationFrame(loop);
}

// The four formats a block can take, as analytics reports them.
function format(settings) {
  return `${settings.structure}-${settings.unit}`;
}

function finish() {
  const { run, runSettings } = state;

  state.result = {
    settings: runSettings,
    steps: run.steps.length,
    elapsed: run.elapsed(),
    planned: timedSeconds(run.steps),
  };
  state.run = null;
  state.confirm = false;
  state.screen = 'end';
  track(`session-finish/${format(runSettings)}`);

  allowSleep();
  render();
}

function frame() {
  if (state.screen !== 'session' || !state.run) {
    return;
  }

  state.run.tick();

  if (state.run.finished) {
    finish();

    return;
  }

  renderSessionFrame();
}

function loop() {
  if (state.screen !== 'session') {
    return;
  }

  frame();
  requestAnimationFrame(loop);
}

// Animation frames stop when the page is hidden; this keeps the signals going as far as the
// browser lets a background tab run.
setInterval(frame, 250);

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    frame();
  }
});

function askToQuit() {
  const { run } = state;

  state.confirm = true;
  state.resumeAfterConfirm = !run.paused;

  if (!run.paused) {
    run.togglePause();
  }

  render();
}

function closeConfirm(leave) {
  state.confirm = false;

  if (leave) {
    state.run = null;
    state.screen = 'setup';
    allowSleep();
  } else if (state.resumeAfterConfirm) {
    state.run.togglePause();
  }

  render();
}

function center() {
  const { run } = state;

  if (!run.paused && isCounted(run.step)) {
    run.validate();
  } else {
    run.togglePause();
  }

  frame();
  render();
}

// Controls

function applySettings(next) {
  const settings = normalized(next);

  if (JSON.stringify(settings) === JSON.stringify(state.settings)) {
    return false;
  }

  state.settings = settings;
  saveSettings();
  render();

  return true;
}

function changeSetting(key, value) {
  applySettings({ ...state.settings, [key]: value });
}

// One exercise moves alone; the shared row moves every exercise by the same step, keeping the gaps.
function stepSetting(target, direction) {
  const [key, position] = target.split('.');
  const field = FIELDS[key];
  const settings = state.settings;
  const move = (value) => clamp(value + direction * field.step, field);

  if (position !== undefined) {
    const values = ownValues(settings, key);

    values[Number(position)] = move(values[Number(position)]);

    return applySettings({ ...settings, [OWN_VALUES[key]]: values });
  }

  const next = { ...settings, [key]: move(settings[key]) };

  if (OWN_VALUES[key] && settings[OWN_VALUES[key]]) {
    next[OWN_VALUES[key]] = ownValues(settings, key).map(move);
  }

  return applySettings(next);
}

// The guide is part of the page itself, outside the app, so search engines read it; the help button
// only reveals it.
let guideOpener = null;

function showGuide(open) {
  const guide = document.getElementById('guide');

  if (!guide || guide.hidden === !open) {
    return;
  }

  state.help = open;
  guide.hidden = !open;

  if (open) {
    guideOpener = document.activeElement;
    guide.querySelector('.body').scrollTop = 0;
    guide.querySelector('.close').focus({ preventScroll: true });
  } else {
    const back = guideOpener?.isConnected && guideOpener !== document.body ? guideOpener : app.querySelector('.help-button');

    back?.focus({ preventScroll: true });
  }
}

// The phone's own share sheet where there is one; elsewhere the link is copied, and the button says so.
async function shareSession(button) {
  // To the main page of the language, where the session received is kept.
  const url = `${new URL(`../${lang}/`, import.meta.url).href}?${settingsToQuery(state.settings)}`;

  track('share');

  if (navigator.share) {
    try {
      await navigator.share({ title: 'BIP Timer', text: t.shareText, url });
    } catch {
      // Closing the share sheet is not an error.
    }

    return;
  }

  try {
    await navigator.clipboard.writeText(url);
    button.dataset.feedback = t.copied;
    setTimeout(() => delete button.dataset.feedback, 2000);
  } catch {
    window.prompt(t.share, url);
  }
}

const ACTIONS = {
  help: () => showGuide(true),
  'close-help': () => showGuide(false),
  set: (button) => {
    const { key, value } = button.dataset;
    const parsed = PREFERENCES.includes(key) ? value === 'true' : value;

    changeSetting(key, parsed);
  },
  'per-exercise': () => {
    state.perExercise = !state.perExercise;
    render();
  },
  'same-for-all': () => {
    const next = { ...state.settings };

    delete next[OWN_VALUES[next.unit === 'reps' ? 'reps' : 'effort']];
    applySettings(next);
  },
  share: (button) => shareSession(button),
  language: (button) => {
    if (button.dataset.value === lang) {
      return;
    }

    // The same page in the other language, as the page's own alternates list it.
    const alternate = document.querySelector(`link[rel="alternate"][hreflang="${button.dataset.value}"]`);

    setLanguage(button.dataset.value);
    location.href = alternate ? new URL(alternate.href).pathname : new URL(`../${button.dataset.value}/`, import.meta.url).href;
  },
  start,
  settings: () => {
    state.screen = 'setup';
    render();
  },
  quit: askToQuit,
  leave: () => closeConfirm(true),
  stay: () => closeConfirm(false),
  center,
  previous: () => {
    state.run.previous();
    render();
  },
  next: () => {
    state.run.next();
    frame();
    render();
  },
};

// A tap changes a value once; holding repeats after a short delay, so reaching ten minutes of
// rest is not forty taps. The first change waits for the tap so a scroll never nudges a value.
let hold = null;

function stopHold() {
  if (hold) {
    clearTimeout(hold.timer);
    clearInterval(hold.repeat);
  }
}

app.addEventListener('pointerdown', (event) => {
  const button = event.target.closest('[data-step]');

  if (!button || button.disabled) {
    return;
  }

  stopHold();

  const { step: key, direction } = button.dataset;

  hold = { key, held: false };
  hold.timer = setTimeout(() => {
    hold.held = true;
    hold.repeat = setInterval(() => {
      if (!stepSetting(key, Number(direction))) {
        stopHold();
      }
    }, HOLD_INTERVAL);
  }, HOLD_DELAY);
});

for (const type of ['pointerup', 'pointercancel']) {
  document.addEventListener(type, stopHold);
}

document.addEventListener('click', (event) => {
  const stepper = event.target.closest('[data-step]');

  if (stepper) {
    const alreadyHeld = hold?.held && hold.key === stepper.dataset.step && event.detail !== 0;

    hold = null;

    if (!alreadyHeld && !stepper.disabled) {
      stepSetting(stepper.dataset.step, Number(stepper.dataset.direction));
    }

    return;
  }

  const button = event.target.closest('[data-action]');

  if (!button) {
    return;
  }

  // Every tap is a chance to wake the audio context iOS keeps suspended.
  unlockAudio();
  ACTIONS[button.dataset.action]?.(button);
});

document.addEventListener('keydown', (event) => {
  if (state.screen === 'setup' && state.help && event.key === 'Escape') {
    ACTIONS['close-help']();
  }

  if (state.screen !== 'session' || !state.run) {
    return;
  }

  if (state.confirm) {
    if (event.key === 'Escape') {
      closeConfirm(false);
    }

    return;
  }

  const keys = { ' ': center, ArrowLeft: ACTIONS.previous, ArrowRight: ACTIONS.next, Escape: askToQuit };

  if (keys[event.key] && !event.target.closest('button')) {
    event.preventDefault();
    keys[event.key]();
  }
});

window.addEventListener('appinstalled', () => track('app-installed'));

// Safari only applies :active to a press when the page listens to touches.
document.addEventListener('touchstart', () => {}, { passive: true });

// Remembered so the root sends a returning visitor straight back to this language.
setLanguage(lang);
render();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(new URL('../sw.js', import.meta.url)).catch(() => {});
}
