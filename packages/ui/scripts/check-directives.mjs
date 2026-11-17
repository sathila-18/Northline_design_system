// Checks that the library build keeps 'use client' at the top of each output file (DESIGN.md §7.4).
// Builds the fixture src/__fixtures__/DirectiveProbe.tsx with the same settings as the library
// (vite.config.ts) into a temporary folder, then reads the output.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build, mergeConfig } from 'vite';
import baseConfig from '../vite.config.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = fileURLToPath(new URL('../node_modules/.cache/directive-check', import.meta.url));

await build(
  mergeConfig(baseConfig, {
    root,
    logLevel: 'warn',
    build: {
      outDir,
      lib: { entry: fileURLToPath(new URL('../src/__fixtures__/DirectiveProbe.tsx', import.meta.url)) },
      sourcemap: false,
    },
  }),
);

const output = await readFile(`${outDir}/__fixtures__/DirectiveProbe.js`, 'utf8');
const firstStatement = output.replace(/^\s*(\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\s*)*/, '').trimStart();
if (!/^["']use client["'];?/.test(firstStatement)) {
  console.error("FAIL: 'use client' is not the first statement of the built DirectiveProbe.js");
  console.error(output.slice(0, 300));
  process.exit(1);
}
console.log("OK: 'use client' survives the library build (preserveModules).");
