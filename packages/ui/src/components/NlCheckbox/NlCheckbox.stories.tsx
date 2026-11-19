import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NlCheckbox } from './NlCheckbox';

/** Disabled text is under 4.5:1 by design (inactive control, WCAG 1.4.3): known issue K3. */
const knownIssue = (disabled: boolean | undefined) => (disabled ? { 'data-a11y-known-issue': 'K3' } : {});

const meta = {
  title: 'Components/Molecules/Checkbox',
  component: NlCheckbox,
  args: {
    children: 'Send a welcome email',
    defaultChecked: false,
    indeterminate: false,
    disabled: false,
    hideLabel: false,
  },
  argTypes: {
    children: { control: 'text' },
    defaultChecked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
  },
  render: (args) => (
    <div className="nl:w-full nl:max-w-320" {...knownIssue(args.disabled)}>
      <NlCheckbox key={String(args.defaultChecked)} {...args} />
    </div>
  ),
} satisfies Meta<typeof NlCheckbox>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One checkbox with every option as a control. Click the text or Tab and press Space. */
export const Default: Story = {};

/** Unselected, selected and indeterminate. */
export const Types: Story = {
  render: () => (
    <div className="nl:flex nl:w-full nl:max-w-320 nl:flex-col nl:gap-m">
      <NlCheckbox>Send a welcome email</NlCheckbox>
      <NlCheckbox defaultChecked>Add to Tier 2</NlCheckbox>
      <NlCheckbox indeterminate>Select all members</NlCheckbox>
    </div>
  ),
};

/** Disabled: the control's disabled look and text-disabled text (K3). */
export const Disabled: Story = {
  render: () => (
    <div className="nl:flex nl:w-full nl:max-w-320 nl:flex-col nl:gap-m" {...knownIssue(true)}>
      <NlCheckbox disabled>Send a welcome email</NlCheckbox>
      <NlCheckbox disabled defaultChecked>
        Add to Tier 2
      </NlCheckbox>
      <NlCheckbox disabled indeterminate>
        Select all members
      </NlCheckbox>
    </div>
  ),
};

/** Long text wraps; the box stays on the first line. */
export const LongText: Story = {
  name: 'Long text',
  render: () => (
    <div className="nl:w-full nl:max-w-320">
      <NlCheckbox>
        Send the member a welcome email with their member number, their tier and how to book a track day voucher.
      </NlCheckbox>
    </div>
  ),
};

/** Hidden text: only the box shows, the text stays its name (for example in a table row). */
export const HiddenLabel: Story = {
  name: 'Hidden label',
  render: () => <NlCheckbox hideLabel>Select member 0042</NlCheckbox>,
};

/** Controlled: two options. */
export const Controlled: Story = {
  render: function Render() {
    const [email, setEmail] = useState(true);
    const [sms, setSms] = useState(false);
    return (
      <div className="nl:flex nl:w-full nl:max-w-320 nl:flex-col nl:gap-m">
        <NlCheckbox
          checked={email}
          onChange={(event) => {
            setEmail(event.target.checked);
          }}
        >
          Email updates
        </NlCheckbox>
        <NlCheckbox
          checked={sms}
          onChange={(event) => {
            setSms(event.target.checked);
          }}
        >
          Text message updates
        </NlCheckbox>
        <p className="nl:text-body-m nl:text-secondary">
          On: {[email && 'email', sms && 'text message'].filter(Boolean).join(', ') || 'none'}
        </p>
      </div>
    );
  },
};
