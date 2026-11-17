import type { Meta, StoryObj } from '@storybook/react-vite';
import { textStyleNames, tokenList } from '@northline/tokens';
import { Code, Page, Row, Section, TokenTable, Value, useCssValues, type BrandTheme } from './docs';

const meta: Meta = { title: 'Foundations/Typography', parameters: { layout: 'fullscreen' } };
export default meta;

const styles = [...new Set(tokenList.filter((t) => t.collection === 'Alias Typography').map((t) => t.group))];

function TypographyPage(context: BrandTheme) {
  const values = useCssValues(
    textStyleNames.map((name) => `--nl-font-${name}`),
    context,
  );
  return (
    <Page
      title="Typography"
      context={context}
      intro="25 text styles. Only the font family changes with the brand: Inter (Northline), IBM Plex Sans (Garnet) and Space Grotesk (Voltic). Data L and Data M use tabular figures, so numbers line up."
    >
      <Section title="Text styles" description="Each style is one font shorthand. Components use the Tailwind class.">
        <TokenTable headings={['Sample', 'Style', 'Tailwind', 'Value']}>
          {textStyleNames.map((name, index) => (
            <Row
              key={name}
              cells={[
                // The sample uses the style's own shorthand variable, so every style shows without a class per row.
                <span key="s" style={{ font: `var(--nl-font-${name})` }}>
                  {name.startsWith('data') ? '1,234,567.89' : 'Track day voucher 0042'}
                </span>,
                <Value key="n">{styles[index]}</Value>,
                <Code key="t">nl:text-{name}</Code>,
                <Value key="v">{values[`--nl-font-${name}`]}</Value>,
              ]}
            />
          ))}
        </TokenTable>
      </Section>
    </Page>
  );
}

export const Typography: StoryObj = {
  render: (_, { globals }) => <TypographyPage brand={globals.brand} theme={globals.theme} />,
};
