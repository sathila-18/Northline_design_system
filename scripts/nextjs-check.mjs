// pnpm nextjs-check (S7). Proves the libraries work in a Next.js App Router app, installed the way an app installs
// them. Must pass before every release.
//   1. Builds @northline/tokens and @northline/ui and packs them (pnpm pack).
//   2. Copies apps/nextjs-check to node_modules/.cache/nextjs-check and installs it there with npm, against the
//      two tarballs (outside the pnpm workspace, so nothing is linked).
//   3. Runs next build, then checks the built CSS has the tokens for every brand and theme, and the font files.
import { execFileSync } from 'node:child_process';
import { copyFileSync, cpSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const app = join(root, 'apps/nextjs-check');
const work = join(root, 'node_modules/.cache/nextjs-check');
const packs = join(work, 'packs');
const run = (command, args, cwd, env = {}) =>
  execFileSync(command, args, { cwd, stdio: 'inherit', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1', ...env } });

console.log('1/3 Building and packing @northline/tokens and @northline/ui');
run('pnpm', ['--filter', '@northline/tokens', '--filter', '@northline/ui', 'build'], root);
mkdirSync(packs, { recursive: true });
for (const [pkg, name] of [
  ['packages/tokens', 'northline-tokens'],
  ['packages/ui', 'northline-ui'],
]) {
  const output = execFileSync('pnpm', ['pack', '--pack-destination', packs, '--json'], {
    cwd: join(root, pkg),
    encoding: 'utf8',
  });
  const { filename } = JSON.parse(output);
  copyFileSync(filename, join(packs, `${name}.tgz`)); // fixed names, as apps/nextjs-check/package.json expects
}

console.log('2/3 Installing the packed libraries into a copy of apps/nextjs-check');
// The tarballs keep the same name and version (0.0.0), so npm would call an earlier install "up to date" and keep
// the old libraries. Remove only those and the last build output from this cache; Next.js stays installed.
for (const stale of ['node_modules/@northline', '.next']) rmSync(join(work, stale), { recursive: true, force: true });
cpSync(app, work, {
  recursive: true,
  filter: (source) => !/[/\\](node_modules|\.next|packs)([/\\]|$)/.test(source.slice(app.length)),
});
run('npm', ['install', '--no-package-lock', '--no-audit', '--no-fund', '--loglevel=error'], work);

// The installed library must be the one just built, not an older copy.
const built = readFileSync(join(root, 'packages/ui/dist/index.css'), 'utf8');
const installed = readFileSync(join(work, 'node_modules/@northline/ui/dist/index.css'), 'utf8');
if (built !== installed) {
  console.error('FAIL: the installed @northline/ui is not the one just built.');
  process.exit(1);
}

console.log('3/3 next build');
run('npx', ['--no-install', 'next', 'build'], work);

const files = (dir) =>
  readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name));
const staticFiles = files(join(work, '.next/static'));
const css = staticFiles
  .filter((file) => file.endsWith('.css'))
  .map((file) => readFileSync(file, 'utf8'))
  .join('\n');
const failures = [];
for (const selector of ['[data-brand=garnet]', '[data-brand=voltic]', '[data-theme=dark]']) {
  if (!css.replace(/"/g, '').includes(selector)) failures.push(`CSS for ${selector} is missing`);
}
if (!css.includes('--nl-bg-primary')) failures.push('Token variables are missing from the CSS');
const fonts = staticFiles.filter((file) => file.endsWith('.woff2')).length;
if (fonts < 25) failures.push(`Expected at least 25 font files, found ${fonts}`);

if (failures.length > 0) {
  console.error(`FAIL: ${failures.join('; ')}`);
  process.exit(1);
}
console.log(
  `OK: next build passed with the packed libraries; tokens for all brands and themes and ${fonts} font files in the output.`,
);
