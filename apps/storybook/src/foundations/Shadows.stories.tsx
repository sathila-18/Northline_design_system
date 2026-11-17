import type { Meta, StoryObj } from '@storybook/react-vite';
import { Code, Page, Section, Value, fromGlobals, useCssValues, type BrandTheme } from './docs';
import { shadows } from './data';

const meta: Meta = { title: 'Foundations/Shadows', parameters: { layout: 'fullscreen' } };
export default meta;

function ShadowsPage(context: BrandTheme) {
  const values = useCssValues(
    shadows.map((s) => `--nl-shadow-${s.name}`),
    context,
  );
  return (
    <Page title="Shadows" context={context} intro="Black at a low opacity, the same in both themes.">
      <Section title="Shadow tokens">
        <div className="nl:grid nl:grid-cols-3 nl:gap-4xl nl:bg-secondary nl:p-4xl">
          {shadows.map((s) => (
            <figure key={s.name} className="nl:flex nl:flex-col nl:gap-l">
              {/* The sample uses the shadow's own variable, so every shadow shows without a class per item. */}
              <span
                className="nl:block nl:h-96 nl:rounded-s nl:bg-primary"
                style={{ boxShadow: `var(--nl-shadow-${s.name})` }}
              />
              <figcaption className="nl:flex nl:flex-col">
                <Code>{`nl:shadow-${s.name}`}</Code>
                <Value>{s.use}</Value>
                <Value>{values[`--nl-shadow-${s.name}`]}</Value>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>
    </Page>
  );
}

export const Shadows: StoryObj = {
  render: (_, { globals }) => <ShadowsPage {...fromGlobals(globals)} />,
};
