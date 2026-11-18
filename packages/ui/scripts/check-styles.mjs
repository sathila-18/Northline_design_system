// Checks the stylesheet apps import (S4): builds src/styles/index.css with the same settings as the package
// (vite.styles.config.ts) into a temporary folder and checks fonts, tokens, base styles and font files.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { build, mergeConfig } from 'vite';
import stylesConfig from '../vite.styles.config.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = fileURLToPath(new URL('../node_modules/.cache/styles-check/', import.meta.url));
await build(
  mergeConfig(stylesConfig, { root, configFile: false, logLevel: 'warn', build: { outDir, emptyOutDir: true } }),
);

const css = readFileSync(`${outDir}index.css`, 'utf8');
const failures = [];
const check = (ok, message) => ok || failures.push(message);

// The build may drop the quotes around family names, so match with or without them.
const faces = [...css.matchAll(/@font-face\s*{([^}]*)}/g)].map((m) => m[1] ?? '');
const hasFamily = (body, family) => new RegExp(`font-family:\\s*["']?${family}["']?;`).test(body);
for (const family of ['Inter', 'IBM Plex Sans', 'Space Grotesk']) {
  for (const weight of [400, 500, 600, 700]) {
    const found = faces.filter(
      (body) => hasFamily(body, family) && new RegExp(`font-weight:\\s*${weight};`).test(body),
    ).length;
    check(found === 2, `${family} ${weight}: expected Latin and Latin Extended, found ${found} faces`);
  }
}
check(
  faces.some((body) => hasFamily(body, 'Material Symbols Rounded')),
  'Material Symbols Rounded @font-face is missing',
);
// The icon font is the registry subset (DESIGN.md §6), never the full 5 MB font.
const iconFaces = faces.filter((body) => hasFamily(body, 'Material Symbols Rounded'));
check(iconFaces.length === 1, `Expected one Material Symbols Rounded face, found ${iconFaces.length}`);
const iconUrl = iconFaces[0]?.match(/url\("?(\.\/[^")]+)"?\)/)?.[1];
check(
  iconUrl !== undefined && existsSync(`${outDir}${iconUrl}`) && statSync(`${outDir}${iconUrl}`).size < 200 * 1024,
  'The icon font is missing or is not the registry subset (over 200 KB)',
);
for (const utility of ['.nl\\:font-icon', '.nl\\:icon-24', '.nl\\:icon-filled']) {
  check(css.includes(utility), `Icon utility ${utility} is missing`);
}

for (const url of new Set([...css.matchAll(/url\("?(\.\/[^")]+)"?\)/g)].map((m) => m[1]))) {
  check(existsSync(`${outDir}${url}`), `Font file missing next to index.css: ${url}`);
}
check(!/url\("?\//.test(css), 'A font URL is absolute; it must be relative to index.css');

for (const selector of ['[data-brand="garnet"]', '[data-brand="voltic"]', '[data-theme="dark"]']) {
  check(css.includes(selector), `Token variables for ${selector} are missing`);
}
check(css.includes('--nl-shadow-menu:') && css.includes('prefers-reduced-motion'), 'Foundation styles are missing');
check(/@layer base\s*{[\s\S]*font: var\(--nl-font-body-m\)/.test(css), 'Base styles (reset.css) are missing');
check(!/\.nl\\:[\w-]+-(red|blue|gray)-\d+/.test(css), 'A Tailwind default colour utility is in the library CSS');

if (failures.length > 0) {
  console.error(`FAIL: ${failures.length} problem(s) in the built stylesheet`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(
  'OK: index.css has every font (3 families × 4 weights × 2 subsets, and the icon subset), tokens and base styles.',
);
