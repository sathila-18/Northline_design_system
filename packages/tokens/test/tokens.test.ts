// Token build tests (S2). Run after `node build.ts` (the package's test script does both).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { compile } from '@tailwindcss/node';
import { beforeAll, describe, expect, it } from 'vitest';
import { BRANDS, THEMES, cssName, tailwindKeys, textStyleName, type Brand, type Theme } from '../src/naming.ts';

type Json = Record<string, unknown>;
interface Token {
  $type: string;
  $value: unknown;
  $extensions?: { mode?: Record<string, unknown> } & Json;
}

const read = (relative: string) => readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf8');
const source = JSON.parse(read('../../../tokens/design.tokens.json')) as Json;
const css = read('../dist/tokens.css');
const distDir = fileURLToPath(new URL('../dist/', import.meta.url));

const tokens = new Map<string, Token>();
(function walk(node: unknown, path: string[]) {
  if (typeof node !== 'object' || node === null) return;
  if ('$value' in node) {
    tokens.set(path.join('.'), node as Token);
    return;
  }
  for (const [key, child] of Object.entries(node)) if (!key.startsWith('$')) walk(child, [...path, key]);
})(source, []);
const semantic = [...tokens.keys()].filter((p) => p.startsWith('Color collection.'));
const textStyles = [
  ...new Set([...tokens.keys()].filter((p) => p.startsWith('Alias Typography.')).map((p) => p.split('.')[1] ?? '')),
];

/** Resolves a token in the JSON to its final value, independently of the build. */
function resolveJson(path: string, brand: Brand, theme: Theme): unknown {
  const token = tokens.get(path);
  if (!token) throw new Error(`Missing ${path}`);
  const modes = token.$extensions?.mode ?? {};
  const value = brand in modes ? modes[brand] : theme in modes ? modes[theme] : token.$value;
  const match = typeof value === 'string' ? /^\{(.+)\}$/.exec(value) : null;
  return match?.[1] ? resolveJson(match[1], brand, theme) : value;
}

/** The CSS custom properties an <html data-brand data-theme> element gets from tokens.css. */
function cssEnvironment(brand: Brand, theme: Theme): Map<string, string> {
  const env = new Map<string, string>();
  for (const [, selectors = '', body = ''] of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const list = selectors
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split(',')
      .map((s) => s.trim());
    const applies = list.some(
      (s) =>
        s === ':root' || s === `[data-brand="${brand.toLowerCase()}"]` || s === `[data-theme="${theme.toLowerCase()}"]`,
    );
    if (!applies) continue;
    for (const [, name = '', value = ''] of body.matchAll(/(--[\w-]+):\s*([^;]+);/g)) env.set(name, value.trim());
  }
  return env;
}

function resolveCss(value: string, env: Map<string, string>, seen: string[] = []): string {
  return value.replace(/var\((--[\w-]+)\)/g, (_, name: string) => {
    if (seen.includes(name)) throw new Error(`Circular CSS variable: ${[...seen, name].join(' → ')}`);
    const next = env.get(name);
    if (next === undefined) throw new Error(`Undefined CSS variable ${name}`);
    return resolveCss(next, env, [...seen, name]);
  });
}

describe('tokens.css', () => {
  it('declares a CSS variable for every token in the JSON', () => {
    const missing = [...tokens.keys()].filter((path) => !css.includes(`--${cssName(path.split('.'))}:`));
    expect(missing).toEqual([]);
    expect(tokens.size).toBe(425);
  });

  it('declares a font shorthand for every text style', () => {
    const missing = textStyles.filter((style) => !css.includes(`--nl-font-${textStyleName(style)}:`));
    expect(missing).toEqual([]);
  });

  for (const brand of BRANDS) {
    for (const theme of THEMES) {
      it(`resolves every semantic token and text style in ${brand} ${theme}`, () => {
        const env = cssEnvironment(brand, theme);
        for (const path of semantic) {
          const token = tokens.get(path);
          const actual = resolveCss(`var(--${cssName(path.split('.'))})`, env);
          const hex = String(resolveJson(path, brand, theme));
          const alpha = (token?.$extensions?.['com.northline.alpha'] as Record<Theme, number> | undefined)?.[theme];
          const expected =
            alpha === undefined ? hex : `color-mix(in srgb, ${hex} ${+(alpha * 100).toFixed(2)}%, transparent)`;
          expect(actual.toLowerCase(), path).toBe(expected.toLowerCase());
        }
        for (const style of textStyles) {
          const actual = resolveCss(`var(--nl-font-${textStyleName(style)})`, env);
          const family = String(resolveJson(`Alias Typography.${style}.Font family`, brand, theme));
          expect(actual, style).toMatch(new RegExp(`^\\d{3} [\\d.]+px/[\\d.]+px "${family}", system-ui, sans-serif$`));
        }
      });
    }
  }
});

describe('tailwind-theme.css', () => {
  let output = '';
  const all = new Set<string>();

  beforeAll(async () => {
    const compiler = await compile('@import "tailwindcss" prefix(nl);\n@import "./tailwind-theme.css";\n', {
      base: distDir,
      onDependency: () => undefined,
    });
    for (const path of semantic)
      for (const { utility } of tailwindKeys(path.split('.').at(-1) ?? '')) all.add(`nl:${utility}`);
    const probes = [
      'nl:p-xl',
      'nl:gap-3xl',
      'nl:m-none',
      'nl:w-24',
      'nl:h-40',
      'nl:size-40',
      'nl:max-w-320',
      'nl:min-h-48',
      'nl:rounded-s',
      'nl:rounded-full',
      'nl:shadow-menu',
      'nl:z-modal',
      'nl:text-body-m',
      'nl:text-data-l',
      // must not exist
      'nl:bg-red-500',
      'nl:text-sm',
      'nl:p-4',
      'nl:w-25',
      'nl:rounded-lg',
      'nl:shadow-md',
      'nl:font-bold',
      'nl:max-w-md',
      'nl:w-full-size',
      'bg-primary',
      'nl:dark:bg-primary',
    ];
    output = compiler.build([...all, ...probes]);
  });

  const rule = (className: string) => {
    const selector = `.${className.replace(/:/g, '\\:')}`;
    const start = output.indexOf(`${selector} {`);
    return start === -1 ? null : output.slice(start, output.indexOf('}', start) + 1);
  };

  it('generates a utility for every semantic token, pointing at its CSS variable', () => {
    const wrong = [];
    for (const path of semantic) {
      const name = path.split('.').at(-1) ?? '';
      for (const { utility } of tailwindKeys(name)) {
        const css = rule(`nl:${utility}`);
        if (!css?.includes(`var(--${cssName(path.split('.'))})`)) wrong.push(`nl:${utility}`);
      }
    }
    expect(wrong).toEqual([]);
  });

  it.each([
    ['nl:p-xl', 'padding: var(--nl-space-xl)'],
    ['nl:gap-3xl', 'gap: var(--nl-space-3xl)'],
    ['nl:w-24', 'width: var(--nl-size-24)'],
    ['nl:size-40', 'width: var(--nl-size-40)'],
    ['nl:max-w-320', 'max-width: var(--nl-size-320)'],
    ['nl:rounded-s', 'border-radius: var(--nl-radius-s)'],
    ['nl:rounded-full', 'border-radius: var(--nl-radius-full)'],
    ['nl:shadow-menu', 'var(--nl-shadow-menu)'],
    ['nl:z-modal', 'z-index: var(--nl-z-modal)'],
    ['nl:text-body-m', 'font: var(--nl-font-body-m)'],
    ['nl:text-data-l', 'font-variant-numeric: tabular-nums'],
    ['nl:outline-focused', 'outline-color: var(--nl-border-focused)'],
    ['nl:text-fg-secondary', 'color: var(--nl-fg-secondary)'],
  ])('%s gives %s', (className, declaration) => {
    expect(rule(className)).toContain(declaration);
  });

  it.each([
    'nl:bg-red-500',
    'nl:text-sm',
    'nl:p-4',
    'nl:w-25',
    'nl:rounded-lg',
    'nl:shadow-md',
    'nl:font-bold',
    'nl:max-w-md',
    'bg-primary',
  ])('has no Tailwind default or unprefixed utility: %s', (className) => {
    expect(rule(className)).toBeNull();
  });

  it('never matches dark:', () => {
    const css = output.slice(output.indexOf('.nl\\:dark\\:bg-primary'));
    if (output.includes('.nl\\:dark\\:bg-primary')) expect(css.slice(0, 80)).toContain(':not(*)');
  });

  it('never declares a token CSS variable, so it cannot overwrite one', () => {
    const declared = [...output.matchAll(/(--nl-[\w-]+)\s*:/g)].map((m) => m[1]);
    const tokenVars = new Set([...css.matchAll(/(--nl-[\w-]+):/g)].map((m) => m[1]));
    expect(declared.filter((name) => tokenVars.has(name))).toEqual([]);
  });
});

describe('styles.css (hand-written, S3)', () => {
  const styles = read('../dist/styles.css');
  const theme = read('../dist/tailwind-theme.css');
  const design = read('../../../DESIGN.md');
  const rootBlock = styles.slice(0, styles.indexOf('@media'));
  const reduced = styles.slice(styles.indexOf('@media (prefers-reduced-motion: reduce)'));
  const defined = new Set([...styles.matchAll(/(--nl-[\w-]+):/g), ...css.matchAll(/(--nl-[\w-]+):/g)].map((m) => m[1]));

  it('has every shadow, layer and motion value from DESIGN.md §4.1, §4.3 and §5', () => {
    const rows = [...design.matchAll(/^\| `(--nl-(?:shadow|z|duration|ease)-[\w-]+)` \| ([^|]+) \|/gm)];
    expect(rows.length).toBe(17);
    for (const [, name = '', value = ''] of rows) {
      const actual = new RegExp(`${name}: ([^;]+);`).exec(rootBlock)?.[1] ?? '';
      const expected = value
        .trim()
        .replace(/black at (\d+)%/, 'color-mix(in srgb, var(--nl-palette-black) $1%, transparent)');
      expect(actual, name).toBe(expected);
    }
  });

  it('only uses variables that exist', () => {
    const used = [...styles.matchAll(/var\((--nl-[\w-]+)\)/g)].map((m) => m[1]);
    expect(used.filter((name) => !defined.has(name))).toEqual([]);
  });

  it('defines every shadow and layer the Tailwind theme points at', () => {
    const used = [...theme.matchAll(/var\((--nl-(?:shadow|z)-[\w-]+)\)/g)].map((m) => m[1]);
    expect(used.length).toBe(12);
    expect(used.filter((name) => !defined.has(name))).toEqual([]);
  });

  it('turns every duration off for prefers-reduced-motion', () => {
    const durations = [...rootBlock.matchAll(/(--nl-duration-[\w-]+):/g)].map((m) => m[1]);
    expect(durations.length).toBe(4);
    for (const name of durations) expect(reduced, name).toContain(`${name}: 0ms;`);
  });
});
