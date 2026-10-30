/* Structural smoke tests of the _site directory produced by GitHub Pages Jekyll. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = path.resolve('_site');
const file = (name) => path.join(root, name);
const content = (name) => fs.readFileSync(file(name), 'utf8');
const manifest = JSON.parse(content('manifest.webmanifest'));
assert.equal(manifest.start_url, '/appunti/');
assert.equal(manifest.scope, '/appunti/');
assert.equal(manifest.display, 'standalone');
assert.equal(manifest.icons.length, 3);
for (const icon of manifest.icons) {
  const name = icon.src.replace(/^\/appunti\//, '');
  const bytes = fs.readFileSync(file(name));
  assert.equal(bytes.toString('hex', 0, 8), '89504e470d0a1a0a', name);
  const expected = Number(icon.sizes.split('x')[0]);
  assert.equal(bytes.readUInt32BE(16), expected, name + ' width');
  assert.equal(bytes.readUInt32BE(20), expected, name + ' height');
}
const sw = content('sw.js');
assert.ok(!sw.includes('{{') && !sw.includes('{%'), 'Liquid should be compiled');
const context = {
  self: { addEventListener() {}, location: { origin: 'https://francescomammana.github.io' } }
};
vm.runInNewContext(sw + '\nthis.__sw = { PAGE_URLS, ASSET_URLS, SCOPE, VERSION };', context);
const data = context.__sw;
assert.equal(data.SCOPE, '/appunti/');
assert.ok(data.VERSION.length >= 12);
assert.ok(data.PAGE_URLS.length >= 12, 'Expected home, info, series, offline and 8 articles');
assert.equal(new Set(data.PAGE_URLS).size, data.PAGE_URLS.length, 'No duplicate precache URLs');
for (const rawUrl of [...data.PAGE_URLS, ...data.ASSET_URLS]) {
  assert.ok(rawUrl.startsWith('/appunti/'), 'URL outside PWA scope: ' + rawUrl);
  const pathname = rawUrl.slice('/appunti/'.length);
  const target = pathname.endsWith('/') || pathname === '' ? pathname + 'index.html' : pathname;
  assert.ok(fs.existsSync(file(target)), 'Unpublished precache URL: ' + rawUrl);
}
const home = content('index.html');
assert.ok(home.includes('manifest.webmanifest'), 'Home missing PWA manifest');
assert.ok(home.includes('data-sw-src="/appunti/sw.js"'), 'Home missing SW registration URL');
const report = content('articoli/ai-coding-2026/index.html');
assert.ok(report.includes('site-header'), 'Report missing shared site navigation');
assert.ok(report.includes('ai-coding.css'), 'Report missing isolated styles');
assert.ok(report.includes('ai-coding.js'), 'Report missing interactive script');
assert.ok(report.includes('id="bars"'), 'Cost calculator missing');
assert.ok(report.includes('data-theme-toggle'), 'Theme toggle missing');
assert.ok(report.includes('site-footer'), 'Report missing shared footer');
assert.equal((report.match(/<html\b/gi) || []).length, 1, 'Report must have exactly one HTML root');
for (let n = 1; n <= 7; n++) {
  const chapter = data.PAGE_URLS.find(url => url.startsWith('/appunti/serie/ai-engineering/' + String(n).padStart(2, '0') + '-'));
  assert.ok(chapter, 'Missing series chapter ' + n);
  const html = content(chapter.slice('/appunti/'.length) + 'index.html');
  assert.ok(html.includes('series-progress'), 'Missing chapter navigation ' + n);
  assert.ok(html.includes('manifest.webmanifest'), 'Missing manifest in chapter ' + n);
}
console.log('PWA build check passed:', data.PAGE_URLS.length, 'pages and', data.ASSET_URLS.length, 'assets precached.');
