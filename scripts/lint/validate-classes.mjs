// Prints which class names don't exist in the Northline Tailwind theme (CLAUDE.md: "theme utilities only").
// Usage: node scripts/lint/validate-classes.mjs '<JSON array of class names>'  → JSON array of the invalid ones.
// Loads Tailwind with the library's own tailwind.css (prefix nl:, Northline theme, Tailwind defaults removed).
// Needs the token build (packages/tokens/dist); `pnpm lint` runs it first.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const require = createRequire(`${root}packages/tokens/package.json`);
const { __unstable__loadDesignSystem: loadDesignSystem } = await import(
  pathToFileURL(require.resolve('@tailwindcss/node')).href
);

const stylesDir = `${root}packages/ui/src/styles`;
const design = await loadDesignSystem(readFileSync(`${stylesDir}/tailwind.css`, 'utf8'), { base: stylesDir });
const classes = JSON.parse(process.argv[2] ?? '[]');
const css = design.candidatesToCss(classes);
// group and peer are marker classes: they produce no CSS themselves, they name an element that group-* and peer-*
// variants follow (CLAUDE.md, Tailwind rule 3). Bare or named (nl:group/row, nl:peer/input).
const marker = /^nl:(group|peer)(\/[a-z][\w-]*)?$/;
process.stdout.write(JSON.stringify(classes.filter((name, index) => !css[index] && !marker.test(name))));
