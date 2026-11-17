import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Code, Page, Row, Section, TokenTable, Value, fromGlobals, useCssValues, type BrandTheme } from './docs';
import { motion } from './data';

const meta: Meta = { title: 'Foundations/Motion', parameters: { layout: 'fullscreen' } };
export default meta;

const durations = motion.filter((m) => m.name.startsWith('--nl-duration-') && m.name !== '--nl-duration-pulse');

function MotionPage(context: BrandTheme) {
  const values = useCssValues(
    motion.map((m) => m.name),
    context,
  );
  const [moved, setMoved] = useState(false);
  return (
    <Page
      title="Motion"
      context={context}
      intro="Three durations and one easing curve. With reduced motion turned on in the system settings, every duration becomes 0ms, so changes happen at once."
    >
      <Section title="Motion tokens">
        <TokenTable headings={['Variable', 'Value', 'Use']}>
          {motion.map((m) => (
            <Row
              key={m.name}
              cells={[
                <Code key="n">{m.name}</Code>,
                <Value key="v">{values[m.name]}</Value>,
                <Value key="u">{m.use}</Value>,
              ]}
            />
          ))}
        </TokenTable>
      </Section>
      <Section title="Try it" description="Each bar moves with its own duration and the standard easing.">
        <div className="nl:flex nl:flex-col nl:gap-l">
          <button
            type="button"
            onClick={() => {
              setMoved(!moved);
            }}
            // A plain native button for this page only, deliberately not styled like NlButton (not built yet).
            className="nl:self-start nl:rounded-xs nl:border nl:border-strong nl:px-l nl:py-xs nl:text-label-m nl:text-primary nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused"
          >
            {moved ? 'Move back' : 'Move'}
          </button>
          {durations.map((m) => (
            <div key={m.name} className="nl:flex nl:items-center nl:gap-xl">
              <span className="nl:w-120">
                <Code>{m.name.replace('--nl-duration-', '')}</Code>
              </span>
              <span className="nl:block nl:h-8 nl:grow nl:rounded-full nl:bg-tertiary">
                {/* Position and timing come from the motion tokens being shown. */}
                <span
                  className="nl:block nl:size-8 nl:rounded-full nl:bg-brand"
                  style={{
                    transform: moved ? 'translateX(var(--nl-size-320))' : 'none',
                    transition: `transform var(${m.name}) var(--nl-ease-standard)`,
                  }}
                />
              </span>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  );
}

export const Motion: StoryObj = {
  render: (_, { globals }) => <MotionPage {...fromGlobals(globals)} />,
};
