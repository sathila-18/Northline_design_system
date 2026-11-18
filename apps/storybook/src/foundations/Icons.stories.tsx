import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlIcon, nlIconNames, nlIcons } from '@northline/ui';
import { Code, Page, Row, Section, TokenTable, Value, fromGlobals, useCssValues, type BrandTheme } from './docs';
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
          only ever shown through <Code>NlIcon</Code> and the <Code>nlIcons</Code> registry, and the icon font is subset
          to the registry at build time. Never draw or substitute an icon.
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
      <Section
        title="Registry"
        description={
          <>
            Every icon in <Code>nlIcons</Code>, outlined and filled. To add one, add its name and code point to the
            registry (<Code>packages/ui/src/icons/nlIcons.ts</Code>) and run <Code>pnpm icons</Code>.
          </>
        }
      >
        <TokenTable headings={['Outlined', 'Filled', 'Name', 'Code point']}>
          {nlIconNames.map((name) => (
            <Row
              key={name}
              cells={[
                <NlIcon key="o" name={name} tone="primary" />,
                <NlIcon key="f" name={name} tone="primary" filled />,
                <Code key="n">{name}</Code>,
                <Value key="c">{`U+${nlIcons[name].toString(16).toUpperCase()}`}</Value>,
              ]}
            />
          ))}
        </TokenTable>
      </Section>
    </Page>
  );
}

export const Icons: StoryObj = {
  render: (_, { globals }) => <IconsPage {...fromGlobals(globals)} />,
};
