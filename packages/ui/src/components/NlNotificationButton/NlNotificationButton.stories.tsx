import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlNotificationButton } from './NlNotificationButton';

const meta = {
  title: 'Components/Actions/Notification button',
  tags: ['atom-l1'],
  component: NlNotificationButton,
  parameters: { layout: 'centered' },
  args: { count: 3, showCount: true, disabled: false, label: 'Notifications' },
  argTypes: {
    count: { control: { type: 'number', min: 0, step: 1 } },
    showCount: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof NlNotificationButton>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Every option as a control. Hover, press and tab to it to see the states. */
export const Default: Story = {};

/** None, dot, a number, two digits and over 99. The badge isn't clipped by the circle. */
export const Notifications: Story = {
  render: () => (
    <div className="nl:flex nl:items-center nl:gap-3xl nl:p-m">
      <NlNotificationButton />
      <NlNotificationButton count={3} showCount={false} />
      <NlNotificationButton count={3} />
      <NlNotificationButton count={42} />
      <NlNotificationButton count={120} />
    </div>
  ),
};

/** Disabled: no badge. */
export const Disabled: Story = {
  render: () => (
    <div className="nl:flex nl:items-center nl:gap-3xl nl:p-m">
      <NlNotificationButton disabled />
      <NlNotificationButton disabled count={3} />
    </div>
  ),
};

/** Expanded (it opened a panel): the pressed look. */
export const Expanded: Story = {
  args: { 'aria-expanded': true },
};
