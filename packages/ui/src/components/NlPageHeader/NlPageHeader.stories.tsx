import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { NlBadge } from '../NlBadge';
import { NlButton } from '../NlButton';
import { NlPageHeader } from './NlPageHeader';

/** The content panel's top, on the page background (the app shell leaves Space-XS under the header). */
function Frame({ children }: { children: ReactNode }) {
  return <div className="nl:w-full nl:bg-secondary nl:pb-xs">{children}</div>;
}

const meta = {
  title: 'Components/Organisms/Page header',
  component: NlPageHeader,
  args: { title: 'Rewards', children: 'Manage the rewards members can claim' },
  argTypes: {
    title: { control: 'text' },
    children: { control: 'text' },
    backLabel: { control: 'text' },
    notifications: { control: 'object' },
    headingAs: { control: 'select', options: ['h1', 'h2', 'h3', 'p'] },
  },
} satisfies Meta<typeof NlPageHeader>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Title, a line under it and the notification button. */
export const Default: Story = {
  args: { notifications: { count: 3 } },
  render: (args) => (
    <Frame>
      <NlPageHeader {...args} />
    </Frame>
  ),
};

/** With a back link ("Back to rewards") on a detail page. */
export const WithBack: Story = {
  args: {
    title: 'Track day voucher',
    children: 'Reward X · Tier 2 and up',
    backHref: '#rewards',
    backLabel: 'Back to rewards',
    notifications: { count: 0 },
  },
  render: (args) => (
    <Frame>
      <NlPageHeader {...args} />
    </Frame>
  ),
};

/** Title only. */
export const TitleOnly: Story = {
  args: { title: 'Members', children: undefined },
  render: (args) => (
    <Frame>
      <NlPageHeader {...args} />
    </Frame>
  ),
};

/** A body slot instead of text. */
export const BodySlot: Story = {
  args: { title: 'Member 0042', notifications: { count: 120 } },
  render: (args) => (
    <Frame>
      <NlPageHeader {...args}>
        <span>
          <NlBadge tone="success">Active</NlBadge>
        </span>
      </NlPageHeader>
    </Frame>
  ),
};

/** A long title in a narrow panel (Size-560) is cut with an ellipsis; hover it for the full text. */
export const LongTitle: Story = {
  args: {
    title: 'Track day voucher for members in Tier 2 and up, valid at every partner circuit this season',
    onBack: () => undefined,
    notifications: { count: 3 },
  },
  render: (args) => (
    <div className="nl:max-w-560">
      <Frame>
        <NlPageHeader {...args} />
      </Frame>
    </div>
  ),
};

/** New notifications are announced politely ("4 new notifications") when the count rises. */
export const NewNotifications: Story = {
  render: function Render() {
    const [count, setCount] = useState(3);
    return (
      <div className="nl:flex nl:flex-col nl:gap-xl">
        <Frame>
          <NlPageHeader title="Rewards" notifications={{ count }} />
        </Frame>
        <span>
          <NlButton
            variant="secondary"
            size="small"
            onClick={() => {
              setCount(count + 1);
            }}
          >
            Add a notification
          </NlButton>
        </span>
      </div>
    );
  },
};
