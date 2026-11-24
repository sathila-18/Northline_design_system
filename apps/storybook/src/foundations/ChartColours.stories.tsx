import type { Meta, StoryObj } from '@storybook/react-vite';
import { aliasChains, primitiveColors, semanticTokens, type SemanticToken } from '@northline/tokens';
import { Code, Page, Row, Section, TokenTable, Value, fromGlobals, type BrandTheme } from './docs';

/**
 * Chart colours (D9). Every brand in Light and Dark side by side, so the values are read from the token data
 * (semantic → alias → primitive) rather than from the page's own brand and theme. Swatches use those hex values:
 * a documentation-only exception, like the Token pipeline page.
 */
const meta: Meta = { title: 'Foundations/Chart colours', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;

type Brand = 'Northline' | 'Garnet' | 'Voltic';
type Theme = 'Light' | 'Dark';
const brands: Brand[] = ['Northline', 'Garnet', 'Voltic'];
const themes: Theme[] = ['Light', 'Dark'];

/** The hex a semantic token resolves to for a brand and theme. */
function hexOf(token: SemanticToken, brand: Brand, theme: Theme) {
  let current: string = token.modes[theme].alias;
  while (current.startsWith('--nl-color-')) current = aliasChains[current]?.[brand] ?? '';
  return primitiveColors[current] ?? '';
}

/** WCAG relative luminance and contrast ratio. */
function luminance(hex: string) {
  const [r = 0, g = 0, b = 0] = [1, 3, 5].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05);
}

const chartTokens = Object.values(semanticTokens).filter((t) => t.group === 'Chart');
const series = chartTokens.filter((t) => t.name.startsWith('chart-series-'));
const others = chartTokens.filter((t) => !t.name.startsWith('chart-series-'));
// Marks that must reach 3:1 (WCAG 1.4.11); the grid and cursor band are decorative, tooltip text is checked on its box.
const decorative = new Set(['chart-grid', 'chart-cursor']);

function Sample({ token, brand, theme }: { token: SemanticToken; brand: Brand; theme: Theme }) {
  const background = hexOf(semanticTokens['bg-primary'], brand, theme);
  const tooltipText = token.name === 'chart-tooltip-text';
  const surface = tooltipText ? hexOf(semanticTokens['chart-tooltip-bg'], brand, theme) : background;
  const colour = hexOf(token, brand, theme);
  const ratio = contrast(colour, surface);
  const required = tooltipText ? 4.5 : 3;
  return (
    <div className="nl:flex nl:items-center nl:gap-m">
      <span
        className="nl:flex nl:size-48 nl:shrink-0 nl:items-center nl:justify-center nl:rounded-xs nl:border nl:border-default"
        style={{ backgroundColor: surface }}
      >
        <span className="nl:block nl:h-24 nl:w-24 nl:rounded-xs" style={{ backgroundColor: colour }} />
      </span>
      <span className="nl:flex nl:flex-col">
        <Code>{colour}</Code>
        <Value>
          {decorative.has(token.name)
            ? `${ratio.toFixed(2)}:1, decorative`
            : `${ratio.toFixed(2)}:1 ${ratio >= required ? '✓' : '✗'} (${tooltipText ? 'on the tooltip, 4.5' : '3'}:1)`}
        </Value>
      </span>
    </div>
  );
}

function ChartTable({ tokens, theme }: { tokens: SemanticToken[]; theme: Theme }) {
  return (
    <TokenTable headings={['Token', ...brands, `Alias (${theme})`]}>
      {tokens.map((t) => (
        <Row
          key={t.name}
          cells={[
            <Code key="n">{t.name}</Code>,
            ...brands.map((brand) => <Sample key={brand} token={t} brand={brand} theme={theme} />),
            <Code key="a">{t.modes[theme].alias}</Code>,
          ]}
        />
      ))}
    </TokenTable>
  );
}

function ChartColoursPage(context: BrandTheme) {
  return (
    <Page
      title="Chart colours"
      context={context}
      intro="Series 1 is the brand primary, so it changes with the brand. Series 2 to 7 are one fixed set, the same in every brand. Every series and the axis line reach 3:1 on the chart background (WCAG 1.4.11). This page shows all three brands in both themes at once, whatever the toolbar says."
    >
      {themes.map((theme) => (
        <Section
          key={theme}
          title={`${theme}: series`}
          description={`On bg-primary (${theme === 'Light' ? 'White' : 'Neutral-900'}).`}
        >
          <ChartTable tokens={series} theme={theme} />
        </Section>
      ))}
      {themes.map((theme) => (
        <Section
          key={`${theme}-other`}
          title={`${theme}: axes, tooltip, highlight and status`}
          description="Gridlines and the cursor band are decorative. Tooltip text is checked on the tooltip background."
        >
          <ChartTable tokens={others} theme={theme} />
        </Section>
      ))}
    </Page>
  );
}

export const ChartColours: Story = {
  name: 'Chart colours',
  render: (_, { globals }) => <ChartColoursPage {...fromGlobals(globals)} />,
};
