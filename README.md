# bip minuteur

Interval timer for a whole training block: several exercises, several rounds or sets, and separate rests between
exercises and between rounds. It beeps, vibrates, keeps the screen on and works offline once opened. No store, no
account: a static web page installable on the home screen (PWA).

Same sequence rules as the bip app: circuit or by sets, time or repetitions, and a value of 0 removes the step.

## Run locally

```bash
python3 -m http.server 8765
```

Then open http://localhost:8765. The screen wake lock and the service worker need a secure context: `localhost` counts,
a LAN address such as `http://192.168.x.x:8765` does not, so on a phone the page works but the screen may sleep.

## Tests

```bash
npm test
```

Covers the sequence generator and the run engine (Node 20+, no dependencies).

## Publish on GitHub Pages

1. Create a **public** repository on GitHub (Pages is free for public repositories) and push `main`.
2. Repository **Settings > Pages**: source *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. The app is served at `https://<user>.github.io/<repository>/`. Every path is relative, so the subpath needs no
   configuration.

After changing a file, bump `VERSION` in `sw.js`: installed copies pick up the new version on the launch after the one
that downloaded it.

## Install on a phone

- iPhone (Safari): Share, then *Add to Home Screen*.
- Android (Chrome): browser menu, then *Install app*.

The iPhone silent switch mutes the beeps, and the sound mixes with music already playing. Vibration is Android only.

## Layout

- `js/sequence.js`: expands the settings into steps.
- `js/run.js`: the run, computed from absolute timestamps so it never drifts.
- `js/device.js`: sound (Web Audio), vibration, screen wake lock.
- `js/app.js`: the four screens (setup, help, session, end).
- `js/i18n.js`: French, English and Dutch, picked from the browser language.
- Fonts: Archivo, Saira Condensed, IBM Plex Mono (SIL Open Font License, see `fonts/`).
