import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NlSwitch } from './NlSwitch';

const meta: Meta<typeof NlSwitch> = {
  title: 'Components/Atoms L0/Switch',
  component: NlSwitch,
  args: { 'aria-label': 'Email updates', defaultChecked: false, size: 'large', disabled: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['large', 'small'] },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onCheckedChange: { action: 'checked change' },
  },
};
export default meta;

type Story = StoryObj<typeof NlSwitch>;

/** One switch with every option as a control. Click, or Tab to it and press Space or Enter. */
export const Default: Story = {};

/** Off and on, in both sizes: large (Size-56 × Size-32) and small (Size-40 × Size-24). */
export const OffAndOn: Story = {
  name: 'Off and on',
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <div className="nl:flex nl:items-center nl:gap-xl">
        <NlSwitch aria-label="Large, off" />
        <NlSwitch aria-label="Large, on" defaultChecked />
      </div>
      <div className="nl:flex nl:items-center nl:gap-xl">
        <NlSwitch aria-label="Small, off" size="small" />
        <NlSwitch aria-label="Small, on" size="small" defaultChecked />
      </div>
    </div>
  ),
};

/** Disabled, off and on: border-disabled / bg-disabled track, fg-disabled / fg-disabled-on_bg handle. */
export const Disabled: Story = {
  render: () => (
    <div className="nl:flex nl:items-center nl:gap-xl">
      <NlSwitch aria-label="Disabled, off" disabled />
      <NlSwitch aria-label="Disabled, on" disabled defaultChecked />
      <NlSwitch aria-label="Small disabled, off" size="small" disabled />
      <NlSwitch aria-label="Small disabled, on" size="small" disabled defaultChecked />
    </div>
  ),
};

/** Controlled, named by visible text next to it. */
export const WithVisibleLabel: Story = {
  name: 'With visible label',
  render: function Render() {
    const [on, setOn] = useState(true);
    return (
      <div className="nl:inline-flex nl:items-center nl:gap-xs nl:text-body-m nl:text-primary">
        <NlSwitch aria-labelledby="updates-caption" checked={on} onCheckedChange={setOn} />
        <span id="updates-caption">Email updates</span>
      </div>
    );
  },
};
