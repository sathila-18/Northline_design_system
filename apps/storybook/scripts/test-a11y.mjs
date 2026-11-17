// pnpm test:a11y (S6). Runs axe on every story of the built Storybook (storybook-static) in all 3 brands and
// both themes, against WCAG 2.2 AA. Exits 1 on any violation.
//
// Contrast is checked in a second pass that leaves out anything inside [data-a11y-state="hover"] or
// [data-a11y-state="pressed"]: stories that show a forced hover or pressed state mark it that way, because
// contrast isn't checked on hover and pressed states (designer's decision, 17 Nov 2026, D17).
/* global document, window -- used inside page.evaluate, which runs in the browser */
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const staticDir = fileURLToPath(new URL('../storybook-static/', import.meta.url));
const BRANDS = ['northline', 'garnet', 'voltic'];
const THEMES = ['light', 'dark'];
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const CONTRAST_EXCLUDED = ['[data-a11y-state="hover"]', '[data-a11y-state="pressed"]'];

if (!existsSync(join(staticDir, 'index.json'))) {
  console.error('FAIL: storybook-static is missing. Run pnpm build-storybook first (pnpm test:a11y does both).');
  process.exit(1);
}

// A small static server for storybook-static.
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};
const server = createServer((request, response) => {
  const path = normalize(decodeURIComponent(new URL(request.url ?? '/', 'http://x').pathname)).replace(
    /^(\.\.[/\\])+/,
    '',
  );
  const file = join(staticDir, path.endsWith('/') ? `${path}index.html` : path);
  if (!file.startsWith(staticDir) || !existsSync(file) || !statSync(file).isFile()) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(response);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;

// Installed Chrome locally; Playwright's own Chromium elsewhere (npx playwright install chromium).
const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const index = JSON.parse(readFileSync(join(staticDir, 'index.json'), 'utf8'));
const stories = Object.values(index.entries).filter((entry) => entry.type === 'story');
const violations = [];

for (const story of stories) {
  for (const brand of BRANDS) {
    for (const theme of THEMES) {
      await page.goto(`${base}/iframe.html?id=${story.id}&viewMode=story&globals=brand:${brand};theme:${theme}`);
      await page.waitForFunction(() => (document.querySelector('#storybook-root')?.childElementCount ?? 0) > 0);
      await page.evaluate(() => document.fonts.ready);
      await page.addScriptTag({ content: axeSource });
      const found = await page.evaluate(
        async ({ tags, excluded }) => {
          const { axe } = window;
          const all = await axe.run(
            { include: [['#storybook-root']] },
            { runOnly: { type: 'tag', values: tags }, rules: { 'color-contrast': { enabled: false } } },
          );
          const contrast = await axe.run(
            { include: [['#storybook-root']], exclude: excluded.map((selector) => [selector]) },
            { runOnly: { type: 'rule', values: ['color-contrast'] } },
          );
          return [...all.violations, ...contrast.violations].map((v) => ({
            rule: v.id,
            impact: v.impact,
            help: v.help,
            targets: v.nodes.map((n) => n.target.join(' ')).slice(0, 5),
            count: v.nodes.length,
          }));
        },
        { tags: WCAG_TAGS, excluded: CONTRAST_EXCLUDED },
      );
      for (const v of found) violations.push({ story: story.id, brand, theme, ...v });
    }
  }
}

await browser.close();
server.close();

if (violations.length > 0) {
  console.error(`FAIL: ${violations.length} accessibility violation(s)`);
  for (const v of violations) {
    console.error(`  ${v.story} [${v.brand} ${v.theme}] ${v.rule} (${v.impact}, ${v.count} element(s)): ${v.help}`);
    for (const target of v.targets) console.error(`      ${target}`);
  }
  process.exit(1);
}
console.log(
  `OK: ${stories.length} stories × ${BRANDS.length * THEMES.length} brand and theme combinations, no WCAG 2.2 AA violations.`,
);
