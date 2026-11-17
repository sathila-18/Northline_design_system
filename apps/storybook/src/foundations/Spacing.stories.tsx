import type { Meta, StoryObj } from '@storybook/react-vite';
import { tokenList } from '@northline/tokens';
import { Code, Page, Row, Section, TokenTable, Value, fromGlobals, useCssValues, type BrandTheme } from './docs';

const meta: Meta = { title: 'Foundations/Spacing and sizes', parameters: { layout: 'fullscreen' } };
export default meta;

const spacing = tokenList.filter((t) => t.group === 'Spacing');
const sizes = tokenList.filter((t) => t.group === 'Sizes' && t.name !== 'Size-full');
const short = (cssVar: string, prefix: string) => cssVar.replace(prefix, '');

function Bar({ cssVar }: { cssVar: string }) {
  // Bar length is the token itself.
  return <span className="nl:block nl:h-8 nl:rounded-xs nl:bg-brand" style={{ width: `var(${cssVar})` }} />;
}

function SpacingPage(context: BrandTheme) {
  const values = useCssValues(
    [...spacing, ...sizes].map((t) => t.cssVar),
    context,
  );
  return (
    <Page
      title="Spacing and sizes"
      context={context}
      intro="Spacing (Space-*) is for padding, margin and gaps. Sizes (Size-*) are for widths and heights of icons, avatars and controls. Both point at the same Size primitives, but never mix: a gap is never a Size, a control height is never a Space."
    >
      <Section title="Spacing">
        <TokenTable headings={['Length', 'Token', 'Tailwind', 'Value']}>
          {spacing.map((t) => (
            <Row
              key={t.cssVar}
              cells={[
                <Bar key="b" cssVar={t.cssVar} />,
                <Code key="n">{t.name}</Code>,
                <Code key="t">{`nl:p-${short(t.cssVar, '--nl-space-')}  nl:gap-${short(t.cssVar, '--nl-space-')}`}</Code>,
                <Value key="v">{values[t.cssVar]}</Value>,
              ]}
            />
          ))}
        </TokenTable>
      </Section>
      <Section
        title="Sizes"
        description="Size-full (9999) is left out: it exists only for Radius-Full. Size-320 is a maximum width only."
      >
        <TokenTable headings={['Length', 'Token', 'Tailwind', 'Value']}>
          {sizes.map((t) => (
            <Row
              key={t.cssVar}
              cells={[
                <Bar key="b" cssVar={t.cssVar} />,
                <Code key="n">{t.name}</Code>,
                <Code key="t">{`nl:size-${short(t.cssVar, '--nl-size-')}  nl:w-…  nl:h-…`}</Code>,
                <Value key="v">{values[t.cssVar]}</Value>,
              ]}
            />
          ))}
        </TokenTable>
      </Section>
    </Page>
  );
}

export const SpacingAndSizes: StoryObj = {
  name: 'Spacing and sizes',
  render: (_, { globals }) => <SpacingPage {...fromGlobals(globals)} />,
};
