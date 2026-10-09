// Tells Bing (and the other IndexNow engines) that every page changed. Run after a deploy is live:
// npm run indexnow. Google does not take part; it reads the sitemap instead.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE } from './pages.mjs';

// Public by design: the engines check that the site serves this key at its root.
const KEY = '1b5f961517a35ca939cf03a5788ad1f9';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = JSON.parse(readFileSync(join(root, 'pages.json'), 'utf8'));
const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: new URL(SITE).hostname,
    key: KEY,
    keyLocation: `${SITE}${KEY}.txt`,
    urlList: pages.map((page) => new URL(page, SITE).href),
  }),
});

if (!response.ok) {
  console.error(`IndexNow refused the list: ${response.status} ${await response.text()}`);
  process.exit(1);
}

console.log(`IndexNow: ${pages.length} pages sent (${response.status}).`);
