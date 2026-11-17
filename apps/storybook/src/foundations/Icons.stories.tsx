import type { Meta, StoryObj } from '@storybook/react-vite';
import { Code, Page, Row, Section, TokenTable, Value, useCssValues, type BrandTheme } from './docs';
import { iconSizes } from './data';

const meta: Meta = { title: 'Foundations/Icons', parameters: { layout: 'fullscreen' } };
export default meta;

function IconsPage(context: BrandTheme) {
  const values = useCssValues(
    iconSizes.map((size) => `--nl-size-${size}`),
    context,
  );
  return (
    <Page
      title="Icons"
      context={context}
      intro={
        <>
          Material Symbols Rounded, self-hosted. Outlined by default, filled for active and selected states. Icons are
          only ever shown through <Code>NlIcon</Code> and the <Code>nlIcons</Code> registry, so the catalogue appears
          here once those are built (DESIGN.md §8, NlIcon). Never draw or substitute an icon.
        </>
      }
    >
      <Section
        title="Sizes"
        description="Six sizes, mapped to the Size primitives (never to spacing). 24 is the default."
      >
        <TokenTable headings={['Area', 'Size', 'Tailwind', 'Value']}>
          {iconSizes.map((size) => (
            <Row
              key={size}
              cells={[
                // The area an icon of this size fills, from the size token.
                <span
                  key="a"
                  className="nl:block nl:rounded-xs nl:border nl:border-dashed nl:border-strong"
                  style={{ width: `var(--nl-size-${size})`, height: `var(--nl-size-${size})` }}
                />,
                <Code key="n">{`Size-${size}${size === 24 ? ' (default)' : ''}`}</Code>,
                <Code key="t">{`nl:size-${size}`}</Code>,
                <Value key="v">{values[`--nl-size-${size}`]}</Value>,
              ]}
            />
          ))}
        </TokenTable>
      </Section>
    </Page>
  );
}

export const Icons: StoryObj = {
  render: (_, { globals }) => <IconsPage brand={globals.brand} theme={globals.theme} />,
};
