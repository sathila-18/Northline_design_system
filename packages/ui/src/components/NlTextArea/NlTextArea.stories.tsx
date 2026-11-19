import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NlButton } from '../NlButton';
import { NlTextArea } from './NlTextArea';

/** Disabled text is under 4.5:1 by design (inactive control, WCAG 1.4.3): known issue K3. */
const knownIssue = (disabled: boolean | undefined) => (disabled ? { 'data-a11y-known-issue': 'K3' } : {});

const meta = {
  title: 'Components/Molecules/Text area',
  component: NlTextArea,
  args: {
    label: 'Notes',
    rows: 4,
    helperText: '',
    error: false,
    disabled: false,
    required: false,
  },
  argTypes: {
    label: { control: 'text' },
    rows: { control: { type: 'number', min: 1, max: 12 } },
    maxLength: { control: { type: 'number', min: 1 } },
    helperText: { control: 'text' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
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
      <NlTextArea key={String(args.maxLength)} {...args} />
    </div>
  ),
} satisfies Meta<typeof NlTextArea>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Every option as a control. Enter adds a new line. */
export const Default: Story = {};

/** Empty and filled, with helper text. */
export const States: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <NlTextArea label="Message" helperText="Sent to Member 0042." />
      <NlTextArea
        label="Message"
        defaultValue={'Your track day voucher is ready.\nShow it at the gate on the day.'}
        helperText="Sent to Member 0042."
      />
    </div>
  ),
};

/** Character count with maxLength (OD-89): with and without helper text, and at the limit. */
export const CharacterCount: Story = {
  name: 'Character count',
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <NlTextArea label="Description" maxLength={200} helperText="Shown on the reward page." />
      <NlTextArea label="Description" maxLength={200} defaultValue="Reward X: a track day voucher for Tier 2." />
      <NlTextArea label="Short note" rows={2} maxLength={24} defaultValue="Call back next week, ok." />
    </div>
  ),
};

/** Error and disabled (K3 for the disabled text). The count stays text-tertiary with an error. */
export const ErrorAndDisabled: Story = {
  name: 'Error and disabled',
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <NlTextArea label="Description" error maxLength={200} helperText="Add a description." />
      <div {...knownIssue(true)}>
        <NlTextArea label="Description" disabled maxLength={200} defaultValue="Reward X" helperText="Locked." />
      </div>
    </div>
  ),
};

/** Controlled: the value lives in the parent; the count follows it. */
export const Controlled: Story = {
  render: function Render() {
    const [text, setText] = useState('Tier 2 upgrade pending.');
    return (
      <div className="nl:flex nl:flex-col nl:gap-m">
        <NlTextArea
          label="Notes"
          maxLength={100}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
          }}
        />
        <div>
          <NlButton
            variant="secondary"
            size="small"
            onClick={() => {
              setText('');
            }}
          >
            Clear from the parent
          </NlButton>
        </div>
      </div>
    );
  },
};
