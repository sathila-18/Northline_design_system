import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { nlIconNames } from '../../icons';
import { NlBadge } from '../NlBadge';
import { NlSwitchListItem } from './NlSwitchListItem';

const meta = {
  title: 'Components/Forms and inputs/Switch list item',
  tags: ['molecule'],
  component: NlSwitchListItem,
  args: {
    title: 'Email updates',
    description: 'News about rewards and events',
    showBody: true,
    appearance: 'plain',
    size: 'large',
    density: 'default',
    divider: true,
    disabled: false,
    defaultChecked: false,
    icon: 'notifications',
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    showBody: { control: 'boolean' },
    icon: { control: 'select', options: [undefined, ...nlIconNames] },
    appearance: { control: 'inline-radio', options: ['plain', 'filled'] },
    size: { control: 'inline-radio', options: ['large', 'small'] },
    density: { control: 'inline-radio', options: ['default', 'compact'] },
    body: { control: false },
    checked: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="nl:w-full nl:bg-primary nl:p-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NlSwitchListItem>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One row with every option as a control. Click anywhere on the row; Tab for the ring round the row. */
export const Default: Story = {
  render: (args) => (
    <div {...(args.disabled ? { 'data-a11y-known-issue': 'K3' } : {})}>
      <NlSwitchListItem {...args} />
    </div>
  ),
};

/** Off and on look the same apart from the switch; disabled off and on. */
export const States: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col">
      <NlSwitchListItem {...args} title="Off" />
      <NlSwitchListItem {...args} title="On" defaultChecked />
      <div data-a11y-known-issue="K3">
        <NlSwitchListItem {...args} title="Disabled, off" disabled />
        <NlSwitchListItem {...args} title="Disabled, on" disabled defaultChecked />
      </div>
    </div>
  ),
};

/** A controlled settings list. */
export const Settings: Story = {
  render: function SettingsStory(args) {
    const [email, setEmail] = useState(true);
    const [push, setPush] = useState(false);
    return (
      <div className="nl:flex nl:flex-col">
        <NlSwitchListItem {...args} title="Email updates" checked={email} onCheckedChange={setEmail} />
        <NlSwitchListItem
          {...args}
          icon="info"
          title="Push alerts"
          description="On this device only"
          checked={push}
          onCheckedChange={setPush}
          divider={false}
        />
      </div>
    );
  },
};

/** Filled cards, Space-L apart (the list sets the gap). */
export const Filled: Story = {
  args: { appearance: 'filled' },
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-l">
      <NlSwitchListItem {...args} />
      <NlSwitchListItem {...args} title="Push alerts" defaultChecked />
    </div>
  ),
};

/** Large and small, in both densities; no icon. */
export const SizesAndDensity: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col">
      <NlSwitchListItem {...args} icon={undefined} title="Large, default" />
      <NlSwitchListItem {...args} icon={undefined} density="compact" title="Large, compact" />
      <NlSwitchListItem {...args} icon={undefined} size="small" title="Small, default" />
      <NlSwitchListItem
        {...args}
        icon={undefined}
        size="small"
        density="compact"
        title="Small, compact"
        divider={false}
      />
    </div>
  ),
};

/** Body in place of the description; showBody turns it (or the description) off. */
export const Body: Story = {
  render: (args) => <NlSwitchListItem {...args} title="Track day voucher" body={<NlBadge tone="info">New</NlBadge>} />,
};
