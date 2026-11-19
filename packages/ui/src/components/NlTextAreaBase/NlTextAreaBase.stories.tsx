import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlTextAreaBase } from './NlTextAreaBase';

/** Disabled text is under 4.5:1 by design (inactive control, WCAG 1.4.3): known issue K3. */
const knownIssue = (disabled: boolean | undefined) => (disabled ? { 'data-a11y-known-issue': 'K3' } : {});

const meta = {
  title: 'Internal/Text area base',
  component: NlTextAreaBase,
  args: {
    label: 'Notes',
    rows: 4,
    error: false,
    disabled: false,
    helperText: 'Visible to admins only.',
  },
  argTypes: {
    label: { control: 'text' },
    rows: { control: { type: 'number', min: 1, max: 12 } },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    helperText: { control: 'text' },
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
      <NlTextAreaBase {...args} />
    </div>
  ),
} satisfies Meta<typeof NlTextAreaBase>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Every option as a control. Click in: the label floats up and the box stays empty. Drag the corner to resize. */
export const Default: Story = {};

/** Empty, filled and with helper text. Focus a field to see the ring and the floating label. */
export const States: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <NlTextAreaBase label="Notes" />
      <NlTextAreaBase label="Notes" defaultValue="Track day voucher sent to Member 0042." />
      <NlTextAreaBase
        label="Notes"
        defaultValue={
          'Track day voucher sent to Member 0042.\nTier 2 upgrade pending.\nReward X claimed.\nCall back next week.\nCheck the event list.'
        }
        helperText="Visible to admins only."
      />
    </div>
  ),
};

/** Height from rows (OD-85): 2, 4 (default, 128) and 6. */
export const Rows: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <NlTextAreaBase label="Short note" rows={2} />
      <NlTextAreaBase label="Notes" />
      <NlTextAreaBase label="Long note" rows={6} />
    </div>
  ),
};

/** Error (border, helper with icon, aria-invalid) and disabled (K3 for the disabled text; no resize). */
export const ErrorAndDisabled: Story = {
  name: 'Error and disabled',
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <NlTextAreaBase label="Notes" error helperText="Add a note before saving." />
      <NlTextAreaBase label="Notes" error defaultValue="Too short" helperText="Use at least 20 characters." />
      <div {...knownIssue(true)} className="nl:flex nl:flex-col nl:gap-xl">
        <NlTextAreaBase label="Notes" disabled helperText="Can’t be changed." />
        <NlTextAreaBase label="Notes" disabled defaultValue="Track day voucher sent to Member 0042." />
      </div>
    </div>
  ),
};
