# BIP Timer

Interval timer for a whole training block: several exercises, several rounds or sets, and separate rests between
exercises and between rounds. It beeps, vibrates, keeps the screen on and works offline once opened. No store, no
account: a static web page installable on the home screen (PWA).

Same sequence rules as the bip app: circuit or by sets, time or repetitions, and a value of 0 removes the step.

## Run locally

```bash
python3 -m http.server 8765
```

Then open http://localhost:8765: it sends you to `/fr/`, `/en/` or `/nl/`. The screen wake lock and the service worker need a secure context: `localhost` counts,
a LAN address such as `http://192.168.x.x:8765` does not, so on a phone the page works but the screen may sleep.

## Tests

```bash
npm test
```

Covers the sequence generator, the run engine, and that the generated pages are up to date (Node 20+, no
dependencies).

## Pages and preview images

The root `index.html`, the three language pages, `sitemap.xml` and `robots.txt` are generated: edit
`tools/pages.mjs` (titles, descriptions, site address) or the strings in `js/i18n.js`, then run

```bash
npm run pages
```

The link-preview images (`og-image*.png`) are drawn from `icons/logo.svg` by `python3 tools/og.py` (needs Pillow).

## Publish

Served by GitHub Pages from `main` (folder `/`) at https://biptimer.app, the custom domain set in **Settings > Pages**
(it lives in `CNAME`). The DNS zone points the domain at GitHub: four `A` records (`185.199.108.153` to
`185.199.111.153`), four `AAAA` records (`2606:50c0:8000::153` to `2606:50c0:8003::153`) and `www` as a `CNAME` to
`loicsacre.github.io`. The address also appears once, as `SITE` in `tools/pages.mjs`.

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
- `js/app.js`: the four screens (setup, help, session, end), in one column on a phone and two on a wide screen.
- `js/i18n.js`: French, English and Dutch; each has its own page, the root picks one from the browser languages.
- `js/guide.js`: the how-to, shared by the help screen and the pages search engines read.
- Fonts: Archivo, Saira Condensed, IBM Plex Mono (SIL Open Font License, see `fonts/`).
