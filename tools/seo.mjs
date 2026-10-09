// Search Console report: how each page is indexed, which queries bring the site up and where it ranks.
// Usage: npm run seo [-- --submit-sitemap]
// Needs a service account key added as a user of the Search Console property (see README).
import { createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE } from './pages.mjs';

const KEY_PATH = process.env.GSC_KEY ?? join(homedir(), '.config', 'bip-timer', 'search-console.json');
const TRACKED = ['beep timer', 'bip timer', 'biptimer', 'interval timer', 'minuteur intervalle'];
const API = 'https://searchconsole.googleapis.com';
const submitSitemap = process.argv.includes('--submit-sitemap');

function readKey() {
  try {
    return JSON.parse(readFileSync(KEY_PATH, 'utf8'));
  } catch (error) {
    console.error(`No service account key at ${KEY_PATH} (${error.message}). Set GSC_KEY to its path.`);
    process.exit(1);
  }
}

const base64url = (value) => Buffer.from(value).toString('base64url');

// A service account signs its own token request: no OAuth library needed.
async function accessToken(key, scope) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(
    JSON.stringify({ iss: key.client_email, scope, aud: key.token_uri, iat: now, exp: now + 3600 }),
  );
  const signature = createSign('RSA-SHA256').update(`${header}.${claims}`).sign(key.private_key, 'base64url');
  const response = await fetch(key.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claims}.${signature}`,
    }),
  });
  const body = await response.json();

  if (!response.ok) {
    throw new Error(`Token refused: ${body.error_description ?? body.error}`);
  }

  return body.access_token;
}

function client(token) {
  return async (method, path, body) => {
    const response = await fetch(`${API}${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: body && JSON.stringify(body),
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(`${method} ${path}: ${data.error?.message ?? response.status}`);
    }

    return data;
  };
}

// The property is either the domain (sc-domain:biptimer.app) or the URL prefix, whichever was verified.
async function findProperty(call) {
  const { siteEntry = [] } = await call('GET', '/webmasters/v3/sites');
  const host = new URL(SITE).hostname;
  const property = siteEntry.find(({ siteUrl }) => siteUrl === `sc-domain:${host}` || siteUrl === SITE);

  if (!property) {
    const seen = siteEntry.map(({ siteUrl }) => siteUrl).join(', ') || 'none';
    throw new Error(`The service account sees no property for ${host} (it sees: ${seen}). Add it as a user in Search Console.`);
  }

  return property.siteUrl;
}

const day = (offset) => new Date(Date.now() - offset * 86400000).toISOString().slice(0, 10);
const site = (property) => `/webmasters/v3/sites/${encodeURIComponent(property)}`;

async function sitemaps(call, property) {
  const feed = `${SITE}sitemap.xml`;

  if (submitSitemap) {
    await call('PUT', `${site(property)}/sitemaps/${encodeURIComponent(feed)}`);
    console.log(`Sitemap submitted: ${feed}`);
  }

  const { sitemap = [] } = await call('GET', `${site(property)}/sitemaps`);

  console.log('\nSITEMAPS');

  for (const entry of sitemap) {
    const counts = (entry.contents ?? []).map((content) => `${content.submitted} submitted`).join(', ');
    const problems = Number(entry.errors) || Number(entry.warnings) ? `, ${entry.errors} errors, ${entry.warnings} warnings` : '';

    console.log(`  ${entry.path}  last read ${entry.lastDownloaded?.slice(0, 10) ?? 'never'}  ${counts}${problems}`);
  }
}

// Inspected a few at a time: the API allows 600 a minute, the site has a few dozen pages.
async function indexing(call, property) {
  const pages = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'pages.json'), 'utf8'));
  const urls = pages.map((page) => new URL(page, SITE).href);
  const results = [];

  for (let start = 0; start < urls.length; start += 5) {
    const batch = urls.slice(start, start + 5).map(async (url) => {
      const { inspectionResult } = await call('POST', '/v1/urlInspection/index:inspect', {
        inspectionUrl: url,
        siteUrl: property,
      });

      return { url, status: inspectionResult.indexStatusResult };
    });

    results.push(...(await Promise.all(batch)));
  }

  const indexed = results.filter(({ status }) => status.verdict === 'PASS');

  console.log(`\nINDEXING  ${indexed.length}/${results.length} pages indexed`);

  for (const { url, status } of results.filter(({ status }) => status.verdict !== 'PASS')) {
    const crawled = status.lastCrawlTime ? `, crawled ${status.lastCrawlTime.slice(0, 10)}` : '';

    console.log(`  ${url.replace(SITE, '/')}  ${status.coverageState}${crawled}`);
  }
}

async function performance(call, property) {
  const range = { startDate: day(30), endDate: day(2) };
  const query = (body) => call('POST', `${site(property)}/searchAnalytics/query`, { ...range, ...body });
  const line = (row) =>
    `${String(row.clicks).padStart(5)} ${String(row.impressions).padStart(6)} ${row.position.toFixed(1).padStart(6)}  ${row.keys.join(' · ')}`;
  const header = `  clicks   impr    pos`;
  const [queries, pages] = await Promise.all([
    query({ dimensions: ['query'], rowLimit: 1000 }),
    query({ dimensions: ['page'], rowLimit: 10 }),
  ]);
  const rows = queries.rows ?? [];

  console.log(`\nTRACKED QUERIES  ${range.startDate} to ${range.endDate}\n${header}`);

  for (const term of TRACKED) {
    const matches = rows.filter((row) => row.keys[0].includes(term));

    console.log(matches.length ? matches.map((row) => `  ${line(row)}`).join('\n') : `                      -  ${term}`);
  }

  console.log(`\nTOP QUERIES\n${header}`);
  rows.slice(0, 15).forEach((row) => console.log(`  ${line(row)}`));

  console.log(`\nTOP PAGES\n${header}`);
  (pages.rows ?? []).forEach((row) => console.log(`  ${line({ ...row, keys: [row.keys[0].replace(SITE, '/')] })}`));
}

try {
  const key = readKey();
  const scope = `https://www.googleapis.com/auth/${submitSitemap ? 'webmasters' : 'webmasters.readonly'}`;
  const call = client(await accessToken(key, scope));
  const property = await findProperty(call);

  console.log(`Search Console: ${property}`);
  await sitemaps(call, property);
  await performance(call, property);
  await indexing(call, property);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
