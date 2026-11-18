// Subsets Material Symbols Rounded to the code points in the nlIcons registry (DESIGN.md §6).
// Writes src/styles/generated/material-symbols-rounded.woff2, which fonts.css loads. The file is not committed;
// `pnpm icons` runs this, and the build, test and Storybook scripts run it first.
// Every variable axis is kept (FILL, wght, GRAD, opsz), with the layout closure, so filled glyphs still work.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import subsetFont from 'subset-font';
import { nlIcons } from '../src/icons/nlIcons.ts';

const require = createRequire(import.meta.url);
const source = require.resolve('material-symbols/material-symbols-rounded.woff2');
const outDir = fileURLToPath(new URL('../src/styles/generated/', import.meta.url));
const outFile = `${outDir}material-symbols-rounded.woff2`;

const codePoints = Object.values(nlIcons);
const text = String.fromCodePoint(...codePoints);
const full = readFileSync(source);
const subset = await subsetFont(full, text, { targetFormat: 'woff2' });

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, subset);
const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;
console.log(`Icons: ${codePoints.length} glyphs, ${kb(full.length)} → ${kb(subset.length)} (${outFile})`);
