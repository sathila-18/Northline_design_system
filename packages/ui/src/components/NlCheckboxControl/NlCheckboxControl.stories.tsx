import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlCheckboxControl } from './NlCheckboxControl';

const meta = {
  title: 'Internal/Checkbox control',
  component: NlCheckboxControl,
  args: { 'aria-label': 'Member 0042', defaultChecked: false, indeterminate: false, disabled: false },
  argTypes: {
    defaultChecked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    'aria-label': { control: 'text' },
  },
} satisfies Meta<typeof NlCheckboxControl>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One checkbox with every option as a control. Hover, press and tab to it to see the states. */
export const Default: Story = {
  // Remount when defaultChecked changes, so the control takes effect.
  render: (args) => <NlCheckboxControl key={String(args.defaultChecked)} {...args} />,
};

/** The three types: unselected, selected and indeterminate. */
export const Types: Story = {
  render: () => (
    <div className="nl:flex nl:items-center nl:gap-m">
      <NlCheckboxControl aria-label="Unselected" />
      <NlCheckboxControl aria-label="Selected" defaultChecked />
      <NlCheckboxControl aria-label="Indeterminate" indeterminate />
    </div>
  ),
};

/** The three types disabled. Not focusable, no hover or press. */
export const Disabled: Story = {
  render: () => (
    <div className="nl:flex nl:items-center nl:gap-m">
      <NlCheckboxControl aria-label="Unselected" disabled />
      <NlCheckboxControl aria-label="Selected" defaultChecked disabled />
      <NlCheckboxControl aria-label="Indeterminate" indeterminate disabled />
    </div>
  ),
};

/** With a wrapping label, as NlCheckbox will use it. The label names it, and clicking the text toggles it. */
export const WithLabel: Story = {
  name: 'With a label',
  render: () => (
    <label className="nl:inline-flex nl:items-center nl:gap-s nl:text-body-m nl:text-primary">
      <NlCheckboxControl />
      Member 0042
    </label>
  ),
};
