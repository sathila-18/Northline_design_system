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
import { NlIcon } from '@northline/ui';
import {
  Code,
  Description,
  Page,
  Section,
  TokenTable,
  Value,
  brandLabel,
  fromGlobals,
  themeLabel,
  useCssValues,
  type BrandTheme,
} from './docs';

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
const groups = ['Background', 'Text', 'Border', 'Foreground', 'Alpha', 'Chart'] as const;

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
    case 'Chart':
      // A bar in the chart colour (its bg- utility); Recharts reads the same CSS variable (D9).
      return (
        <div className="nl:flex nl:h-96 nl:w-120 nl:items-end nl:rounded-s nl:border nl:border-default nl:p-l">
          <div className={`nl:h-48 nl:w-24 nl:rounded-xs ${first}`} />
        </div>
      );
    default:
      return <div className={`nl:h-96 nl:w-120 nl:rounded-s nl:border nl:border-default ${first}`} />;
  }
}

const brands: BrandName[] = ['Northline', 'Garnet', 'Voltic'];
const themes = ['Light', 'Dark'] as const;

/** The name without its CSS prefix: --nl-palette-royal-blue-500 → royal-blue-500. */
const shortName = (cssVar: string) => cssVar.replace(/^--nl-(palette-|color-)?/, '');

/** A colour sample. Inline style, because primitives and aliases have no Tailwind class (§3.8). */
function Swatch({ color, size = 'medium' }: { color: string; size?: 'small' | 'medium' }) {
  const box = { small: 'nl:size-24', medium: 'nl:size-48' };
  return (
    <span
      className={`nl:block nl:shrink-0 nl:rounded-xs nl:border nl:border-default ${box[size]}`}
      style={{ backgroundColor: color }}
    />
  );
}

const withAlpha = (cssVar: string, alpha?: number) =>
  alpha === undefined ? `var(${cssVar})` : `color-mix(in srgb, var(${cssVar}) ${alpha * 100}%, transparent)`;

/** One layer of the chain: who decides it, then the token at that layer. */
function Layer({
  step,
  decidedBy,
  title,
  children,
}: {
  step: number;
  decidedBy: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="nl:flex nl:min-w-0 nl:flex-1 nl:flex-col nl:gap-l nl:rounded-m nl:border nl:border-default nl:bg-primary nl:p-xl">
      <div className="nl:flex nl:flex-col nl:gap-xs">
        <span className="nl:text-caption-s nl:text-tertiary">Step {step}</span>
        <h3 className="nl:text-title-m nl:text-primary">{title}</h3>
        <span className="nl:self-start nl:rounded-full nl:bg-active nl:px-m nl:py-xxs nl:text-label-s nl:text-action">
          {decidedBy}
        </span>
      </div>
      <div className="nl:flex nl:flex-col nl:gap-m">{children}</div>
    </li>
  );
}

function LayerToken({ color, name, detail }: { color?: string; name: string; detail?: ReactNode }) {
  return (
    <div className="nl:flex nl:min-w-0 nl:items-center nl:gap-m">
      {color ? <Swatch color={color} size="small" /> : null}
      <div className="nl:flex nl:min-w-0 nl:flex-col">
        <span className="nl:text-label-m nl:wrap-break-word nl:text-primary">{name}</span>
        {detail ? <Value>{detail}</Value> : null}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <li aria-hidden className="nl:flex nl:shrink-0 nl:items-center nl:text-tertiary">
      <NlIcon name="chevron_right" size={24} tone="secondary" />
    </li>
  );
}

const cellStyle = {
  current: 'nl:flex nl:items-center nl:gap-l nl:rounded-s nl:border-2 nl:border-action-primary nl:p-l',
  other: 'nl:flex nl:items-center nl:gap-l nl:rounded-s nl:border nl:border-default nl:p-l',
};

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

  const alpha = mode.alpha === undefined ? '' : ` at ${mode.alpha * 100}%`;
  const sources = [
    { layer: 'Primitive', cssVar: primitive },
    ...aliases.map((alias) => ({ layer: 'Brand alias', cssVar: alias })),
    { layer: 'Semantic token', cssVar: token.cssVar },
  ];

  return (
    <Page
      title="Token pipeline"
      context={context}
      intro="How one design decision reaches the screen: a raw colour, chosen by the brand, given a job by the theme, then used through a Tailwind class. Pick a token to follow it."
    >
      {/* The token and what it looks like */}
      <section className="nl:grid nl:grid-cols-2 nl:gap-3xl nl:rounded-m nl:border nl:border-default nl:bg-secondary nl:p-3xl">
        <div className="nl:flex nl:flex-col nl:gap-xl">
          <label className="nl:flex nl:flex-col nl:gap-xs">
            <span className="nl:text-label-m nl:text-primary">Semantic token</span>
            {/* The browser's own arrow sits against the edge, so it is hidden and NlIcon draws one with Space-L inset. */}
            <span className="nl:relative nl:flex nl:w-320 nl:items-center">
              <select
                value={name}
                onChange={(event) => {
                  onChange(event.target.value as SemanticTokenName);
                }}
                className="nl:h-40 nl:w-full nl:appearance-none nl:rounded-s nl:border nl:border-strong nl:bg-primary nl:pr-5xl nl:pl-l nl:text-body-m nl:text-primary nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused"
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
              <NlIcon
                name="keyboard_arrow_down"
                size={20}
                tone="secondary"
                className="nl:pointer-events-none nl:absolute nl:right-l"
              />
            </span>
          </label>
          <div className="nl:flex nl:flex-col nl:gap-s">
            <h2 className="nl:text-headline-medium-h5">{token.name}</h2>
            <Description text={token.description} />
          </div>
          <dl className="nl:flex nl:flex-col nl:gap-xxs">
            <dt className="nl:text-caption-m nl:text-tertiary">
              Value in {brand}, {theme}
            </dt>
            <dd className="nl:text-data-l nl:text-primary">{values[token.cssVar]}</dd>
          </dl>
        </div>
        <div className="nl:flex nl:flex-col nl:gap-s">
          <span className="nl:text-label-s nl:text-secondary">Result, rendered with the class</span>
          <div className="nl:flex nl:h-240 nl:items-center nl:justify-center nl:rounded-s nl:border nl:border-default nl:bg-primary">
            <Result token={token} />
          </div>
        </div>
      </section>

      <Section
        title="How it resolves"
        description="Each step only knows about the one before it, so a brand or theme change touches one layer and everything after it follows."
      >
        <ol className="nl:flex nl:items-stretch nl:gap-m">
          <Layer step={1} title="Primitive" decidedBy="Same everywhere">
            <LayerToken color={`var(${primitive})`} name={shortName(primitive)} detail={hex} />
          </Layer>
          <Arrow />
          <Layer step={2} title="Brand alias" decidedBy={`Set by ${brand}`}>
            {aliases.map((alias) => (
              <LayerToken key={alias} color={`var(${alias})`} name={shortName(alias)} />
            ))}
          </Layer>
          <Arrow />
          <Layer step={3} title="Semantic token" decidedBy={`Set by ${theme} theme`}>
            <LayerToken color={`var(${token.cssVar})`} name={token.name} detail={alpha ? `Alias${alpha}` : undefined} />
          </Layer>
          <Arrow />
          <Layer step={4} title="Tailwind class" decidedBy="Used in components">
            {token.tailwind.map((utility) => (
              <LayerToken key={utility} name={utility} detail={propertyOf(utility)} />
            ))}
          </Layer>
        </ol>
      </Section>

      <Section
        title="Every brand and theme"
        description="The same token, resolved six ways. Components never change; only the chain behind the token does."
      >
        <ul className="nl:grid nl:grid-cols-3 nl:gap-l">
          {brands.flatMap((b) =>
            themes.map((t) => {
              const chain = chainOf(token, b, t);
              const a = token.modes[t].alpha;
              return (
                <li key={`${b}-${t}`} className={b === brand && t === theme ? cellStyle.current : cellStyle.other}>
                  <Swatch color={withAlpha(chain.primitive, a)} />
                  <div className="nl:flex nl:min-w-0 nl:flex-col">
                    <span className="nl:text-label-m nl:text-primary">
                      {b}, {t}
                      {b === brand && t === theme ? (
                        <span className="nl:text-caption-m nl:text-action"> · showing</span>
                      ) : null}
                    </span>
                    <span className="nl:text-caption-l nl:text-secondary">
                      {chain.hex}
                      {a === undefined ? '' : ` at ${a * 100}%`}
                    </span>
                    <Value>{shortName(chain.primitive)}</Value>
                  </div>
                </li>
              );
            }),
          )}
        </ul>
      </Section>

      <Section title="In code" description="What the token build writes, and where each layer lives in the token JSON.">
        <pre className="nl:overflow-x-auto nl:rounded-s nl:bg-secondary nl:p-xl nl:text-caption-l nl:text-primary">
          <code>
            {`/* tokens.css: [data-brand="${context.brand}"][data-theme="${context.theme}"] */\n`}
            {`${token.cssVar}: ${declaration};\n\n`}
            {`/* Tailwind theme */\n`}
            {token.tailwind
              .map((utility) => `.${utility.replace(':', '\\:')} { ${propertyOf(utility)}: var(${token.cssVar}); }`)
              .join('\n')}
          </code>
        </pre>
        <TokenTable headings={['Layer', 'CSS variable', 'Path in design.tokens.json']}>
          {sources.map(({ layer, cssVar }) => (
            <tr key={cssVar} className="nl:border-b nl:border-subtle">
              <td className="nl:py-s nl:pr-xl nl:text-label-m nl:text-primary">{layer}</td>
              <td className="nl:py-s nl:pr-xl">
                <Code>{cssVar}</Code>
              </td>
              <td className="nl:py-s">
                <Value>{pathOf.get(cssVar)}</Value>
              </td>
            </tr>
          ))}
        </TokenTable>
      </Section>
    </Page>
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
