import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import {
  aliasChains,
  primitiveColors,
  semanticTokenNames,
  semanticTokens,
  tokenList,
  type SemanticToken,
  type SemanticTokenName,
} from '@northline/tokens';
import { Code, Description, Value, brandLabel, fromGlobals, themeLabel, useCssValues, type BrandTheme } from './docs';

interface Args {
  token: SemanticTokenName;
}

const meta: Meta<Args> = {
  title: 'Foundations/Token pipeline',
  parameters: { layout: 'fullscreen' },
  args: { token: 'bg-action-primary' },
  argTypes: { token: { name: 'Semantic token', control: 'select', options: semanticTokenNames } },
};
export default meta;

type BrandName = 'Northline' | 'Garnet' | 'Voltic';
const pathOf = new Map(tokenList.map((t) => [t.cssVar as string, t.path]));
const groups = ['Background', 'Text', 'Border', 'Foreground', 'Alpha'] as const;

/** Follows a semantic token through its aliases to the primitive, for one brand and theme. */
function chainOf(token: SemanticToken, brand: BrandName, theme: 'Light' | 'Dark') {
  const aliases: string[] = [];
  let current: string = token.modes[theme].alias;
  while (current.startsWith('--nl-color-')) {
    aliases.push(current);
    current = aliasChains[current]?.[brand] ?? '';
  }
  return { primitive: current, hex: primitiveColors[current] ?? '', aliases: aliases.reverse() };
}

const property: Record<string, string> = {
  'bg-': 'background-color',
  'text-': 'color',
  'border-': 'border-color',
  'outline-': 'outline-color',
  'inset-ring-': 'inset ring colour',
  'fill-': 'fill',
  'stroke-': 'stroke',
};
const propertyOf = (utility: string) =>
  Object.entries(property).find(([prefix]) => utility.replace('nl:', '').startsWith(prefix))?.[1] ?? '';

/*
 * The rendered result uses the token's real Tailwind class, read from the token data, to show the whole chain working.
 * This is the one place a class name is not a whole literal string (CLAUDE.md Tailwind rule 1): a documentation-only
 * exception for this page. Tailwind generates the classes because storybook.css scans tokens.js.
 */
function Result({ token }: { token: SemanticToken }) {
  const [first = '', second = ''] = token.tailwind;
  switch (token.group) {
    case 'Text':
      return <p className={`nl:text-title-xl ${first}`}>Track day voucher 0042</p>;
    case 'Border':
      return <div className={`nl:h-96 nl:w-120 nl:rounded-s nl:border-2 ${first}`} />;
    case 'Foreground':
      return (
        <div className="nl:flex nl:items-center nl:gap-xl">
          <span className={`nl:text-display-small-h3 ${first}`}>Aa</span>
          <span className={`nl:block nl:size-48 nl:rounded-full ${second}`} />
        </div>
      );
    case 'Alpha':
      return (
        <div className="nl:relative nl:h-96 nl:w-320 nl:overflow-hidden nl:rounded-s nl:border nl:border-default">
          <p className="nl:p-l nl:text-body-m nl:text-primary">Content underneath the tint. Member 0042, Tier 2.</p>
          <div className={`nl:absolute nl:inset-y-none nl:right-none nl:w-1/2 ${first}`} />
        </div>
      );
    default:
      return <div className={`nl:h-96 nl:w-120 nl:rounded-s nl:border nl:border-default ${first}`} />;
  }
}

function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <li className="nl:flex nl:gap-xl">
      <span className="nl:flex nl:size-32 nl:shrink-0 nl:items-center nl:justify-center nl:rounded-full nl:bg-active nl:text-label-m nl:text-action">
        {number}
      </span>
      <div className="nl:flex nl:grow nl:flex-col nl:gap-s nl:rounded-s nl:border nl:border-default nl:p-xl">
        <h2 className="nl:text-title-s nl:text-secondary">{title}</h2>
        {children}
      </div>
    </li>
  );
}

function ColourLine({ cssVar, note }: { cssVar: string; note?: ReactNode }) {
  return (
    <div className="nl:flex nl:items-center nl:gap-l">
      <span
        className="nl:block nl:size-40 nl:shrink-0 nl:rounded-xs nl:border nl:border-default"
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <div className="nl:flex nl:flex-col">
        <Code>{cssVar}</Code>
        <Value>{pathOf.get(cssVar)}</Value>
        {note ? <Value>{note}</Value> : null}
      </div>
    </div>
  );
}

function TokenPipelinePage({
  context,
  name,
  onChange,
}: {
  context: BrandTheme;
  name: SemanticTokenName;
  onChange: (name: SemanticTokenName) => void;
}) {
  const token = semanticTokens[name];
  const brand = brandLabel(context.brand) as BrandName;
  const theme = themeLabel(context.theme) as 'Light' | 'Dark';
  const { primitive, hex, aliases } = chainOf(token, brand, theme);
  const mode = token.modes[theme];
  const values = useCssValues([token.cssVar], context);
  const declaration =
    mode.alpha === undefined
      ? `var(${mode.alias})`
      : `color-mix(in srgb, var(${mode.alias}) ${mode.alpha * 100}%, transparent)`;

  return (
    <main className="nl:flex nl:flex-col nl:gap-3xl nl:p-4xl nl:text-primary">
      <header className="nl:flex nl:flex-col nl:gap-m">
        <p className="nl:text-caption-s nl:text-tertiary">Foundations</p>
        <h1 className="nl:text-display-small-h3">Token pipeline</h1>
        <p className="nl:text-body-l nl:text-secondary">
          How one design decision reaches the screen. Pick a semantic token to follow it from the raw palette, through
          the brand and the theme, to the CSS variable, the Tailwind class and the rendered result. Change the brand or
          theme in the toolbar and the chain updates.
        </p>
      </header>

      <div className="nl:flex nl:flex-wrap nl:items-end nl:gap-xl">
        <label className="nl:flex nl:flex-col nl:gap-xs">
          <span className="nl:text-label-m nl:text-primary">Semantic token</span>
          <select
            value={name}
            onChange={(event) => {
              onChange(event.target.value as SemanticTokenName);
            }}
            className="nl:h-40 nl:rounded-s nl:border nl:border-strong nl:bg-primary nl:px-l nl:text-body-m nl:text-primary nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused"
          >
            {groups.map((group) => (
              <optgroup key={group} label={group}>
                {semanticTokenNames
                  .filter((n) => semanticTokens[n].group === group)
                  .map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </label>
        <p className="nl:text-body-m nl:text-secondary">
          {brand}, {theme}: <strong className="nl:text-title-s nl:text-primary">{values[token.cssVar]}</strong>
        </p>
      </div>

      <ol className="nl:flex nl:flex-col nl:gap-l">
        <Step number={1} title="Primitive: the raw colour, the same in every brand and theme">
          <ColourLine cssVar={primitive} note={hex} />
        </Step>
        <Step number={2} title={`Alias: what the ${brand} brand uses${aliases.length > 1 ? ', in two steps' : ''}`}>
          {aliases.map((alias) => (
            <ColourLine key={alias} cssVar={alias} note={`Points at ${aliasChains[alias]?.[brand] ?? ''}`} />
          ))}
        </Step>
        <Step number={3} title={`Semantic token: what it is for, in the ${theme} theme`}>
          <div className="nl:flex nl:flex-col">
            <Code>{token.name}</Code>
            <Value>{pathOf.get(token.cssVar)}</Value>
            <Description text={token.description} />
          </div>
        </Step>
        <Step number={4} title="CSS variable: set on <html> by data-brand and data-theme">
          <Code>{`${token.cssVar}: ${declaration};`}</Code>
          <Value>Resolves to {values[token.cssVar]}</Value>
        </Step>
        <Step number={5} title="Tailwind class: what a component writes">
          {token.tailwind.map((utility) => (
            <div key={utility} className="nl:flex nl:flex-wrap nl:gap-s">
              <Code>{utility}</Code>
              <Value>
                {propertyOf(utility)}: var({token.cssVar})
              </Value>
            </div>
          ))}
        </Step>
        <Step number={6} title="Result: rendered with that class">
          <Result token={token} />
        </Step>
      </ol>
    </main>
  );
}

export const TokenPipeline: StoryObj<Args> = {
  name: 'Token pipeline',
  render: function Render(args, { globals }) {
    const [, updateArgs] = useArgs<Args>();
    return (
      <TokenPipelinePage
        context={fromGlobals(globals)}
        name={args.token}
        onChange={(token) => {
          updateArgs({ token });
        }}
      />
    );
  },
};
