import type { Meta, StoryObj } from '@storybook/react-vite';
import { tokenList } from '@northline/tokens';
import { Code, Page, Section, Value, fromGlobals, useCssValues, type BrandTheme } from './docs';

const meta: Meta = { title: 'Foundations/Radius', parameters: { layout: 'fullscreen' } };
export default meta;

const radius = tokenList.filter((t) => t.group === 'Radius');

function RadiusPage(context: BrandTheme) {
  const values = useCssValues(
    radius.map((t) => t.cssVar),
    context,
  );
  return (
    <Page title="Radius" context={context} intro="Corner radius. Radius-Full makes pills and circles.">
      <Section title="Radius tokens">
        <div className="nl:grid nl:grid-cols-4 nl:gap-3xl">
          {radius.map((t) => (
            <figure key={t.cssVar} className="nl:flex nl:flex-col nl:gap-m">
              <span
                className="nl:block nl:h-96 nl:w-120 nl:border-2 nl:border-action-primary nl:bg-active"
                style={{ borderRadius: `var(${t.cssVar})` }}
              />
              <figcaption className="nl:flex nl:flex-col">
                <Code>{`nl:rounded-${t.cssVar.replace('--nl-radius-', '')}`}</Code>
                <Value>
                  {t.name}, {values[t.cssVar]}. {t.description}
                </Value>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>
    </Page>
  );
}

export const Radius: StoryObj = {
  render: (_, { globals }) => <RadiusPage {...fromGlobals(globals)} />,
};
