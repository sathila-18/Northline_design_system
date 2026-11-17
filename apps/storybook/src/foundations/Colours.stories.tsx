import type { Meta, StoryObj } from '@storybook/react-vite';
import { aliasChains, semanticTokens, tokenList, type SemanticToken } from '@northline/tokens';
import {
  Code,
  Description,
  Page,
  Row,
  Section,
  TokenTable,
  Value,
  brandLabel,
  fromGlobals,
  useCssValues,
  type BrandTheme,
} from './docs';

const meta: Meta = { title: 'Foundations/Colours', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;

const groupBy = <T,>(items: readonly T[], key: (item: T) => string) =>
  items.reduce<Map<string, T[]>>(
    (groups, item) => groups.set(key(item), [...(groups.get(key(item)) ?? []), item]),
    new Map(),
  );

const swatchSize = {
  medium: 'nl:block nl:size-40 nl:rounded-xs nl:border nl:border-default',
  large: 'nl:block nl:size-48 nl:rounded-xs nl:border nl:border-default',
};

function Swatch({ cssVar, size = 'medium' }: { cssVar: string; size?: keyof typeof swatchSize }) {
  // The colour is the token's own variable: primitives and aliases have no Tailwind class (DESIGN.md §3.8).
  return <span className={swatchSize[size]} style={{ backgroundColor: `var(${cssVar})` }} />;
}

function PrimitivesPage(context: BrandTheme) {
  const primitives = tokenList.filter((t) => t.collection === 'Primitives' && t.type === 'color');
  const values = useCssValues(
    primitives.map((t) => t.cssVar),
    context,
  );
  return (
    <Page
      title="Colours: primitives"
      context={context}
      intro="The raw palette. Primitives never change with the brand or theme, and components never use them directly: aliases point at them."
    >
      {[...groupBy(primitives, (t) => t.group)].map(([scale, tokens]) => (
        <Section key={scale} title={scale === 'base' ? 'White and black' : scale}>
          <div className="nl:grid nl:grid-cols-5 nl:gap-l">
            {tokens.map((t) => (
              <div key={t.cssVar} className="nl:flex nl:items-center nl:gap-m">
                <Swatch cssVar={t.cssVar} size="large" />
                <div className="nl:flex nl:flex-col">
                  <Code>{t.cssVar}</Code>
                  <Value>{values[t.cssVar]}</Value>
                </div>
              </div>
            ))}
          </div>
        </Section>
      ))}
    </Page>
  );
}

function AliasesPage(context: BrandTheme) {
  const aliases = tokenList.filter((t) => t.collection === 'Alias Colors');
  const values = useCssValues(
    aliases.map((t) => t.cssVar),
    context,
  );
  const brand = brandLabel(context.brand) as 'Northline' | 'Garnet' | 'Voltic';
  return (
    <Page
      title="Colours: aliases"
      context={context}
      intro="Role scales per brand (Primary, Neutral, Info, Success, Warning, Error) and the Primary light and Primary dark steps each theme uses. Change the brand to see them point at another palette."
    >
      {[...groupBy(aliases, (t) => t.group)].map(([group, tokens]) => (
        <Section key={group} title={group}>
          <TokenTable headings={['Colour', 'Alias', `Points at (${brand})`, 'Value', 'Use']}>
            {tokens.map((t) => (
              <Row
                key={t.cssVar}
                cells={[
                  <Swatch key="s" cssVar={t.cssVar} />,
                  <Code key="n">{t.cssVar}</Code>,
                  <Code key="p">{aliasChains[t.cssVar]?.[brand]}</Code>,
                  <Value key="v">{values[t.cssVar]}</Value>,
                  <Description key="d" text={t.description} />,
                ]}
              />
            ))}
          </TokenTable>
        </Section>
      ))}
    </Page>
  );
}

// Text tokens meant for a filled surface are shown on that surface (DESIGN.md §3.3).
const textSurface: Partial<Record<string, string>> = {
  'text-white_both': '--nl-bg-action-primary',
  'text-white_subtle': '--nl-bg-brand',
  'text-dark_both': '--nl-bg-warning',
  'text-inverse': '--nl-bg-direct',
  'text-disabled-on_bg': '--nl-bg-disabled',
};
// Disabled text is exempt from contrast (WCAG 1.4.3), so its samples are marked disabled.
const disabledText = new Set(['text-disabled', 'text-disabled-on_bg']);

function SemanticSample({ token }: { token: SemanticToken }) {
  const color = `var(${token.cssVar})`;
  if (token.group === 'Text') {
    const surface = textSurface[token.name];
    return (
      <span
        className="nl:inline-block nl:rounded-xs nl:px-xs nl:text-title-l"
        style={{ color, backgroundColor: surface ? `var(${surface})` : undefined }}
        aria-disabled={disabledText.has(token.name) || undefined}
      >
        Aa
      </span>
    );
  }
  if (token.group === 'Border') {
    return <span className="nl:block nl:size-40 nl:rounded-xs nl:border-2" style={{ borderColor: color }} />;
  }
  return <Swatch cssVar={token.cssVar} />;
}

function SemanticPage(context: BrandTheme) {
  const tokens = Object.values(semanticTokens);
  const values = useCssValues(
    tokens.map((t) => t.cssVar),
    context,
  );
  const theme = context.theme === 'dark' ? 'Dark' : 'Light';
  return (
    <Page
      title="Colours: semantic tokens"
      context={context}
      intro="The only colours components use. Each one points at an alias, which changes with the theme; the alias changes with the brand."
    >
      {[...groupBy(tokens, (t) => t.group)].map(([group, items]) => (
        <Section key={group} title={group}>
          <TokenTable headings={['Sample', 'Token', 'Tailwind', `Alias (${theme})`, 'Value', 'Use']}>
            {items.map((t) => {
              const mode = t.modes[theme];
              return (
                <Row
                  key={t.name}
                  cells={[
                    <SemanticSample key="s" token={t} />,
                    <Code key="n">{t.cssVar}</Code>,
                    <span key="t" className="nl:flex nl:flex-col">
                      {t.tailwind.map((utility) => (
                        <Code key={utility}>{utility}</Code>
                      ))}
                    </span>,
                    <Code key="a">
                      {mode.alpha === undefined ? mode.alias : `${mode.alias} at ${mode.alpha * 100}%`}
                    </Code>,
                    <Value key="v">{values[t.cssVar]}</Value>,
                    <Description key="d" text={t.description} />,
                  ]}
                />
              );
            })}
          </TokenTable>
        </Section>
      ))}
    </Page>
  );
}

export const Primitives: Story = {
  render: (_, { globals }) => <PrimitivesPage {...fromGlobals(globals)} />,
};
export const Aliases: Story = {
  render: (_, { globals }) => <AliasesPage {...fromGlobals(globals)} />,
};
export const SemanticTokens: Story = {
  name: 'Semantic tokens',
  render: (_, { globals }) => <SemanticPage {...fromGlobals(globals)} />,
};
