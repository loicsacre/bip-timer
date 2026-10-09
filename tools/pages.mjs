// Writes one page per language (English at the root), the format pages, the sitemap, robots.txt and llms.txt.
// Run `npm run pages` after changing a string, the site address or this file.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { guideSections } from '../js/guide.js';
import { LANGUAGES, STRINGS, homePath } from '../js/i18n.js';

import { BEEP_LABEL, FREE_CHIP, FREE_SETUP_LABEL, PICKER_LABEL, PRESETS, PRESETS_LABEL } from './presets.mjs';

// The only place the address lives: change it here when the site moves to its own domain.
export const SITE = 'https://biptimer.app/';

const META = {
  fr: {
    locale: 'fr_FR',
    name: 'Français',
    title: 'BIP Timer · Minuteur d’intervalles gratuit : HIIT, circuit, séries',
    description:
      'Minuteur d’intervalles pour un bloc complet : exercices, tours et récupérations. Réglé en dix secondes, lancé en un tap. Sans installation, hors ligne.',
    image: 'og-image.png',
    imageAlt: 'Le logo BIP Timer et l’aperçu coloré d’une séance',
  },
  en: {
    locale: 'en_GB',
    name: 'English',
    title: 'BIP Timer · Free interval timer: HIIT, circuit, sets',
    description:
      'Interval timer for a whole block: exercises, rounds and rests. Set in ten seconds, started in one tap. No install, works offline.',
    image: 'og-image-en.png',
    imageAlt: 'The BIP Timer logo and a colour preview of a session',
  },
  nl: {
    locale: 'nl_BE',
    name: 'Nederlands',
    title: 'BIP Timer · Gratis intervaltimer: HIIT, circuit, reeksen',
    description:
      'Intervaltimer voor een volledig blok: oefeningen, rondes en rust. Ingesteld in tien seconden, gestart met één tik. Zonder installatie, werkt offline.',
    image: 'og-image-nl.png',
    imageAlt: 'Het BIP Timer-logo en een kleurrijk overzicht van een sessie',
  },
};

// Each page lists the same page in every language; `fallback` is where any other language goes.
function alternates(paths, fallback) {
  return [
    ...LANGUAGES.map((code) => `    <link rel="alternate" hreflang="${code}" href="${SITE}${paths[code]}" />`),
    `    <link rel="alternate" hreflang="x-default" href="${SITE}${fallback}" />`,
  ].join('\n');
}

function sharing({ address, title, description, image, imageAlt, locale }) {
  return `    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="BIP Timer" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${address}" />
    <meta property="og:image" content="${SITE}${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${imageAlt}" />
    <meta property="og:locale" content="${locale}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${SITE}${image}" />
    <meta name="twitter:image:alt" content="${imageAlt}" />`;
}

function head({ root, title, description, address, links }) {
  return `    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#0e0d0b" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${address}" />
${links}
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="BIP Timer" />
    <link rel="manifest" href="${root}manifest.webmanifest" />
    <link rel="icon" href="${root}icons/icon.svg" type="image/svg+xml" />
    <link rel="icon" href="${root}icons/favicon-32.png" type="image/png" sizes="32x32" />
    <link rel="apple-touch-icon" href="${root}icons/apple-touch-icon.png" />`;
}

// Who stands behind the site, for search engines and assistants answering a question about the brand.
const publisher = {
  '@type': 'Organization',
  '@id': `${SITE}#organization`,
  name: 'BIP Timer',
  url: SITE,
  logo: `${SITE}icons/icon-512.png`,
};

// Names the site in search results, so a search for its name is not read as "beep timer".
const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BIP Timer',
  alternateName: ['BIPTimer', 'Beep Timer', 'biptimer.app'],
  url: SITE,
  publisher,
};

const presetPath = (code, preset) => `${code}/${preset[code].slug}/`;

// Every page links to every format and every beep page, so each can be reached and ranked: the
// training formats with the free setup, then the beep timer and its intervals.
function formatsSection(code, current) {
  const link = (path, label) =>
    path === current ? `<a href="/${path}" aria-current="page">${label}</a>` : `<a href="/${path}">${label}</a>`;
  const group = (label, links) => `<section class="formats"><h3 class="mono">${label}</h3><nav>${links.join('')}</nav></section>`;
  const training = PRESETS.filter((preset) => preset.group !== 'beep');
  const beep = PRESETS.filter((preset) => preset.group === 'beep');

  return (
    group(PRESETS_LABEL[code], [
      link(homePath(code), FREE_SETUP_LABEL[code]),
      ...training.map((preset) => link(presetPath(code, preset), preset[code].heading)),
    ]) + group(BEEP_LABEL[code], beep.map((preset) => link(presetPath(code, preset), preset[code].heading)))
  );
}

// A format page answers the question its name raises, then any how-to, ideas and questions of its own.
function formatText(format) {
  const paragraphs = (texts) => texts.map((text) => `<p>${text}</p>`).join('');
  const sections = (format.sections ?? []).map(([title, texts]) => `<section><h3 class="mono">${title}</h3>${paragraphs(texts)}</section>`);
  const faq = format.faq
    ? `<section class="faq"><h3 class="mono">${format.faqTitle}</h3>${format.faq
        .map(([question, answer]) => `<h4 class="question">${question}</h4><p>${answer}</p>`)
        .join('')}</section>`
    : '';

  return [`<section><h3 class="mono">${format.question}</h3>${paragraphs(format.body)}</section>`, ...sections, faq].join('');
}

// The root is the English page: readers of another language go on to theirs, crawlers stay.
const sendOn = `
    <script type="module">
      import { homePath, preferredLanguage } from './js/i18n.js';

      const code = preferredLanguage();

      if (code !== 'en') {
        location.replace(\`\${homePath(code)}\${location.search}\`);
      }
    </script>`;

// The page data is JSON inside a single-quoted attribute: only & and ' need escaping.
const attribute = (value) => JSON.stringify(value).replace(/&/g, '&amp;').replace(/'/g, '&#39;');

function languagePage(code, preset = null) {
  const t = STRINGS[code];
  const format = preset?.[code];
  const path = preset ? presetPath(code, preset) : homePath(code);
  const root = '../'.repeat(path.split('/').filter(Boolean).length);
  const address = `${SITE}${path}`;
  const meta = { ...META[code], ...(format && { title: format.title, description: format.description }) };
  const paths = Object.fromEntries(LANGUAGES.map((other) => [other, preset ? presetPath(other, preset) : homePath(other)]));
  const links = alternates(paths, preset ? paths.en : '');
  const application = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'BIP Timer',
    url: address,
    description: meta.description,
    inLanguage: code,
    applicationCategory: 'SportsApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    image: `${SITE}${meta.image}`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    publisher: { '@id': publisher['@id'] },
  };
  const picker = {
    label: PICKER_LABEL[code],
    links: [
      { label: FREE_CHIP[code], href: `/${homePath(code)}` },
      ...PRESETS.filter((other) => other.picker !== false).map((other) => ({ label: other[code].chip, href: `/${presetPath(code, other)}` })),
    ].map((link) => ({ ...link, current: link.href === `/${path}` })),
  };
  const data = ` data-page='${attribute({ picker, ...(format && { heading: format.heading, intro: format.intro, settings: preset.settings }) })}'`;
  const lead = format
    ? `<h2 class="display">${format.heading}</h2>
        <p class="lead">${format.intro}</p>
        ${formatText(format)}`
    : `<h2 class="display">${t.guideTitle}</h2>
        <p class="lead">${t.guideIntro}</p>`;

  return `<!doctype html>
<html lang="${code}">
  <head>
${head({ root, title: meta.title, description: meta.description, address, links })}
${sharing({ address, ...meta })}
    <script type="application/ld+json">${JSON.stringify([website, application])}</script>
    <link rel="preload" href="${root}fonts/SairaCondensed-Bold.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="${root}css/style.css" />
    <script data-goatcounter="https://biptimer.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>${path ? '' : sendOn}
  </head>
  <body>
    <main id="app"${data}>
      <h1>${format ? format.heading : 'BIP Timer'}</h1>
      <p>${format ? format.intro : t.intro}</p>
    </main>
    <article id="guide" class="screen help" role="dialog" aria-modal="true" aria-labelledby="guide-title" hidden>
      <header class="brandbar">
        <span class="display" id="guide-title">${t.helpTitle}</span>
        <button type="button" class="close" data-action="close-help" aria-label="${t.close}"><i></i><i></i></button>
      </header>
      <div class="body guide">
        ${lead}
        ${formatsSection(code, path)}
        ${guideSections(t, 3)}
      </div>
      <div class="foot"><button type="button" class="secondary" data-action="close-help">${t.backToSetup}</button></div>
    </article>
    <script type="module" src="${root}js/app.js"></script>
  </body>
</html>
`;
}

// English moved from /en/ to the root: links and shares to the old address still land there, query
// included. GitHub Pages has no server redirect, so the page does it.
function movedPage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>BIP Timer</title>
    <link rel="canonical" href="${SITE}" />
    <script>location.replace('/' + location.search);</script>
    <meta http-equiv="refresh" content="0; url=/" />
  </head>
  <body>
    <a href="/">BIP Timer</a>
  </body>
</html>
`;
}

function sitemap() {
  const groups = [
    { paths: Object.fromEntries(LANGUAGES.map((code) => [code, homePath(code)])), fallback: '' },
    ...PRESETS.map((preset) => {
      const paths = Object.fromEntries(LANGUAGES.map((code) => [code, presetPath(code, preset)]));

      return { paths, fallback: paths.en };
    }),
  ];
  const entries = groups.flatMap(({ paths, fallback }) => {
    const links = [
      ...LANGUAGES.map((code) => `    <xhtml:link rel="alternate" hreflang="${code}" href="${SITE}${paths[code]}" />`),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${fallback}" />`,
    ].join('\n');

    return LANGUAGES.map((code) => `  <url>
    <loc>${SITE}${paths[code]}</loc>
${links}
  </url>`);
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
}

// The site summarised for language models, following llmstxt.org: what it is, then every page.
function llms() {
  const entry = (path, title, description) => `- [${title}](${SITE}${path}): ${description}`;
  const sections = LANGUAGES.map((code) =>
    [
      `## ${META[code].name}`,
      '',
      entry(homePath(code), META[code].title, META[code].description),
      ...PRESETS.map((preset) => entry(presetPath(code, preset), preset[code].title, preset[code].description)),
    ].join('\n'),
  );

  return `# BIP Timer

> ${META.en.description}

A free interval timer that runs in the browser, in French, English and Dutch. It plays a whole block of exercises: circuit or sets, by time or by reps, with preparation, effort and three kinds of rest. It beeps at each change, counts down the last seconds, keeps the screen awake and installs as an app that works offline. No account, no ads, settings stay on the phone.

${sections.join('\n\n')}
`;
}

export function pages() {
  const html = {
    ...Object.fromEntries(LANGUAGES.map((code) => [`${homePath(code)}index.html`, languagePage(code)])),
    'en/index.html': movedPage(),
    ...Object.fromEntries(
      PRESETS.flatMap((preset) => LANGUAGES.map((code) => [`${presetPath(code, preset)}index.html`, languagePage(code, preset)])),
    ),
  };

  return {
    ...html,
    // Every page for the service worker to keep offline, so an installed app opens any template
    // without a connection.
    'pages.json': `${JSON.stringify(Object.keys(html).map((file) => `./${file.replace(/index\.html$/, '')}`), null, 2)}\n`,
    'sitemap.xml': sitemap(),
    'llms.txt': llms(),
    'robots.txt': `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');

  for (const [path, content] of Object.entries(pages())) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
}
