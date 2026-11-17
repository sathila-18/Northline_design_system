import type { Meta, StoryObj } from '@storybook/react-vite';
import { Code, Page, Row, Section, TokenTable, Value, fromGlobals, useCssValues, type BrandTheme } from './docs';
import { layers } from './data';

const meta: Meta = { title: 'Foundations/Layers', parameters: { layout: 'fullscreen' } };
export default meta;

function LayersPage(context: BrandTheme) {
  const values = useCssValues(
    layers.map((l) => `--nl-z-${l.name}`),
    context,
  );
  return (
    <Page
      title="Layers"
      context={context}
      intro="The z-index scale. Anything that floats uses one of these, never a number."
    >
      <Section title="Layer tokens">
        <TokenTable headings={['Tailwind', 'Variable', 'Value', 'Use']}>
          {layers.map((l) => (
            <Row
              key={l.name}
              cells={[
                <Code key="t">{`nl:z-${l.name}`}</Code>,
                <Code key="n">{`--nl-z-${l.name}`}</Code>,
                <Value key="v">{values[`--nl-z-${l.name}`]}</Value>,
                <Value key="u">{l.use}</Value>,
              ]}
            />
          ))}
        </TokenTable>
      </Section>
    </Page>
  );
}

export const Layers: StoryObj = {
  render: (_, { globals }) => <LayersPage {...fromGlobals(globals)} />,
};
