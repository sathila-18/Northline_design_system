import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlIcon } from '../../icons';
import { NlInputBase } from './NlInputBase';

/** Disabled text is under 4.5:1 by design (inactive control, WCAG 1.4.3): known issue K3. */
const knownIssue = (disabled: boolean | undefined) => (disabled ? { 'data-a11y-known-issue': 'K3' } : {});

const meta = {
  title: 'Internal/Input base',
  component: NlInputBase,
  args: {
    label: 'Member number',
    size: 'large',
    error: false,
    disabled: false,
    helperText: 'On the member card.',
  },
  argTypes: {
    label: { control: 'text' },
    size: { control: 'inline-radio', options: ['large', 'small'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    helperText: { control: 'text' },
    prefix: { control: 'text' },
    suffix: { control: 'text' },
    leading: { control: false },
    trailing: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="nl:w-full nl:max-w-320 nl:pt-m">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <div {...knownIssue(args.disabled)}>
      <NlInputBase {...args} />
    </div>
  ),
} satisfies Meta<typeof NlInputBase>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Every option as a control. Click in: the label floats up and the box stays empty. Type: the border turns strong. */
export const Default: Story = {};

/** Empty, filled and with helper text. Focus a field to see the ring and the floating label. */
export const States: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <NlInputBase label="Member number" />
      <NlInputBase label="Member number" defaultValue="Member 0042" />
      <NlInputBase label="Member number" defaultValue="Member 0042" helperText="On the member card." />
    </div>
  ),
};

/** Large (48) and small (40). */
export const Sizes: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <NlInputBase label="Member number" defaultValue="Member 0042" />
      <NlInputBase label="Member number" defaultValue="Member 0042" size="small" />
    </div>
  ),
};

/** Leading and trailing slots with icons (24 large, 20 small, fg-secondary). */
export const LeadingAndTrailing: Story = {
  name: 'Leading and trailing',
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <NlInputBase label="Search members" leading={<NlIcon name="search" size={24} tone="inherit" />} />
      <NlInputBase
        label="Start date"
        size="small"
        defaultValue="19 Nov 2026"
        trailing={<NlIcon name="calendar_today" size={20} tone="inherit" />}
      />
    </div>
  ),
};

/** Prefix and suffix: short text around the value. */
export const PrefixAndSuffix: Story = {
  name: 'Prefix and suffix',
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <NlInputBase label="Bonus points" prefix="+" suffix="pts" defaultValue="250" />
    </div>
  ),
};

/** Error (border, helper with icon, aria-invalid) and disabled (K3 for the disabled text). */
export const ErrorAndDisabled: Story = {
  name: 'Error and disabled',
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <NlInputBase label="Member number" error helperText="Enter a member number." />
      <NlInputBase label="Member number" error defaultValue="00x2" helperText="Use numbers only." />
      <div {...knownIssue(true)} className="nl:flex nl:flex-col nl:gap-xl">
        <NlInputBase label="Member number" disabled helperText="Can’t be changed." />
        <NlInputBase label="Member number" disabled defaultValue="Member 0042" />
      </div>
    </div>
  ),
};
