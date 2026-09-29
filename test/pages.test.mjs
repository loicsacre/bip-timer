import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { pages } from '../tools/pages.mjs';

test('the generated pages are up to date with the strings and the generator', () => {
  for (const [path, content] of Object.entries(pages())) {
    assert.equal(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'), content, `${path} is stale: run npm run pages`);
  }
});
