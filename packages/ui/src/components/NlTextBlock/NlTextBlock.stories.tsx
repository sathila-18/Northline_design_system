import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlTextBlock, type NlTextBlockHeadingType } from './NlTextBlock';

const headingTypes: NlTextBlockHeadingType[] = [
  'display-large',
  'display-medium',
  'display-small',
  'headline-large',
  'headline-medium',
  'headline-small',
  'label',
];

const meta: Meta<typeof NlTextBlock> = {
  title: 'Components/Atoms L0/Text block',
  component: NlTextBlock,
  args: {
    type: 'headline-small',
    align: 'start',
    tone: 'default',
    disabled: false,
    heading: 'Track day voucher',
    description: 'Reward X for members in Tier 2. Valid for twelve months from the day it is issued.',
  },
  argTypes: {
    type: { control: 'select', options: headingTypes },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    tone: { control: 'inline-radio', options: ['default', 'inverse'] },
    headingAs: { control: 'select', options: ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
    disabled: { control: 'boolean' },
    heading: { control: 'text' },
    description: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof NlTextBlock>;

/** One text block with every option as a control. */
export const Default: Story = {};

/** The six heading types and the list-row label type (OD-14), each with its description style and gap. */
export const Types: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-3xl">
      {headingTypes.map((type) => (
        <NlTextBlock key={type} type={type} heading={`Heading, ${type}`} description={`Description, ${type}`} />
      ))}
    </div>
  ),
};

/** Body type (OD-41): a description in Body L, no heading. For checkbox and dialog body text. */
export const Body: Story = {
  render: () => <NlTextBlock type="body" description="Send me offers and reward updates by email." />,
};

/** Body M type (OD-238): a description in Body M, no heading. For small checkbox text. */
export const BodyM: Story = {
  name: 'Body M',
  render: () => <NlTextBlock type="body-m" description="Remember me on this device." />,
};

/** The three alignments. Alignment also lines up the label slot. */
export const Alignment: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-3xl">
      {(['start', 'center', 'end'] as const).map((align) => (
        <NlTextBlock
          key={align}
          align={align}
          label={<span className="nl:text-label-s nl:text-tertiary">Label slot</span>}
          heading={`Aligned ${align}`}
          description="Member 0042 joined Tier 2 this month."
        />
      ))}
    </div>
  ),
};

/**
 * With a label slot. NlLabel (#30) isn't built yet, so this story passes plain text styled like it; the slot takes
 * any node.
 */
export const WithLabel: Story = {
  name: 'With label',
  args: { label: <span className="nl:text-label-s nl:text-tertiary">Placeholder for NlLabel</span> },
};

/** Inverse tone on a dark surface (bg-direct), as in a rich tooltip. */
export const Inverse: Story = {
  args: { tone: 'inverse' },
  decorators: [
    (Story) => (
      <div className="nl:rounded-m nl:bg-direct nl:p-xl">
        <Story />
      </div>
    ),
  ],
};

/**
 * Disabled (OD-15): heading and description in text-disabled, as in a disabled list row. Under 4.5:1 by design and
 * exempt as part of an inactive control (WCAG 1.4.3); accepted as known issue K3, so the contrast check skips it.
 */
export const Disabled: Story = {
  args: { disabled: true },
  decorators: [
    (Story) => (
      <div data-a11y-known-issue="K3">
        <Story />
      </div>
    ),
  ],
};

/** Heading only, and description only. */
export const SinglePart: Story = {
  name: 'Single part',
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-3xl">
      <NlTextBlock heading="Heading only" />
      <NlTextBlock description="Description only." />
    </div>
  ),
};
