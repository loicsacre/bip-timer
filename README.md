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

The root `index.html`, the three language pages, the format pages, `sitemap.xml`, `robots.txt` and `llms.txt` are generated:
edit `tools/pages.mjs` (titles, descriptions, site address), `tools/presets.mjs` (format pages) or the strings in
`js/i18n.js`, then run

```bash
npm run pages
```

The link-preview images (`og-image*.png`) are drawn from `icons/logo.svg` by `python3 tools/og.py` (needs Pillow).

## Search

`npm run seo` prints the Search Console report: the sitemap as Google last read it, the tracked queries, the top
queries and pages of the last four weeks, and every page that is not indexed with the reason. Add `-- --submit-sitemap`
to submit the sitemap again. Google's data runs two to three days behind.

It reads a service account key, kept out of the repository at `~/.config/bip-timer/search-console.json` (or the path
in `GSC_KEY`). To create one: in Google Cloud, enable the **Google Search Console API** in a project, create a service
account and download a JSON key for it; then in Search Console, **Settings > Users and permissions**, add the account's
e-mail, with **Restricted** access for the report or **Full** to submit the sitemap.

`npm run indexnow`, once a deploy is live, tells Bing and the other IndexNow engines that every page changed. The
key is public by design: it is in `tools/indexnow.mjs` and served as `<key>.txt` at the root. Google ignores IndexNow
and asking it to index a page stays a manual step in Search Console.

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

The beeps mix with music already playing, and the iPhone silent switch mutes them. On iPhone (iOS 17+) a Silent mode
setting, shown only there, can declare them as playback instead: they get through the switch, but iOS then stops the
music. Vibration is Android only.

## Layout

- `js/sequence.js`: expands the settings into steps.
- `js/run.js`: the run, computed from absolute timestamps so it never drifts.
- `js/device.js`: sound (Web Audio), vibration, screen wake lock.
- `js/app.js`: the four screens (setup, help, session, end), in one column on a phone and two on a wide screen.
- `js/i18n.js`: French, English and Dutch; English is the root page, French and Dutch have `/fr/` and `/nl/`. The root
  sends a visitor whose last or browser language is French or Dutch on to that page; `/en/` only forwards to the root.
- `js/guide.js`: the how-to, written into each page by the generator; the help button reveals it.
- `js/settings.js`: the setup's bounds and validation, applied to storage, format pages and shared links alike.
- `js/share.js`: a session written into the address and read back (`?structure=circuit&unit=time&exercises=4…`).
- `tools/presets.mjs`: the format pages (Tabata, HIIT, circuit training, 30/30, strength by sets) in each language.
- `js/analytics.js`: anonymous counts sent to GoatCounter (https://biptimer.goatcounter.com): page views, sessions
  started and finished per format (`session-start/circuit-time`…), installs. No cookie, nothing personal; localhost is
  never counted.
- Fonts: Archivo, Saira Condensed, IBM Plex Mono (SIL Open Font License, see `fonts/`).
