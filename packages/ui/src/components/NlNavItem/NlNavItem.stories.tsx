import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { nlIconNames } from '../../icons';
import { NlNavItem } from './NlNavItem';

const rewardPages = [
  { label: 'All rewards', href: '#rewards' },
  { label: 'Track day voucher', href: '#rewards-track-day' },
  { label: 'Reward X', href: '#rewards-x' },
];

/** The side nav's column: full width (up to Size-320), or just the icons when minimized. */
function Frame({ minimized = false, children }: { minimized?: boolean; children: ReactNode }) {
  return (
    <nav
      aria-label={minimized ? 'Minimized side nav sample' : 'Side nav sample'}
      className={
        minimized
          ? 'nl:inline-flex nl:flex-col nl:gap-xs nl:bg-secondary nl:p-l'
          : 'nl:flex nl:w-full nl:max-w-320 nl:flex-col nl:gap-xs nl:bg-secondary nl:p-l'
      }
    >
      {children}
    </nav>
  );
}

const meta = {
  title: 'Components/Molecules/Nav item',
  component: NlNavItem,
  args: { children: 'Members', icon: 'person', href: '#members', minimized: false },
  argTypes: {
    children: { control: 'text' },
    icon: { control: 'select', options: nlIconNames },
    current: { control: 'inline-radio', options: [undefined, 'page', 'section'] },
    minimized: { control: 'boolean' },
    pages: { control: false },
    as: { control: false },
  },
} satisfies Meta<typeof NlNavItem>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One row with every option as a control. */
export const Default: Story = {
  render: (args) => (
    <Frame minimized={args.minimized}>
      <NlNavItem {...args} />
    </Frame>
  ),
};

/** Link rows: default, current page (white row), and a long name cut with an ellipsis. Hover and press the rows. */
export const States: Story = {
  render: () => (
    <Frame>
      <NlNavItem icon="person" href="#members">
        Members
      </NlNavItem>
      <NlNavItem icon="calendar_today" href="#events" current="page">
        Events
      </NlNavItem>
      <NlNavItem icon="notifications" href="#messages">
        Messages and notifications for every member
      </NlNavItem>
    </Frame>
  ),
};

/** A section with pages: toggle it; the section holding the open page starts open and is current="section". */
export const WithPages: Story = {
  render: () => (
    <Frame>
      <NlNavItem icon="check_circle" pages={rewardPages}>
        Rewards
      </NlNavItem>
      <NlNavItem
        icon="info"
        pages={[
          { label: 'Overview', href: '#help' },
          { label: 'Contact', href: '#help-contact', current: true },
        ]}
      >
        Help
      </NlNavItem>
    </Frame>
  ),
};

/** Controlled expansion. */
export const Controlled: Story = {
  render: function ControlledStory() {
    const [open, setOpen] = useState(true);
    return (
      <Frame>
        <NlNavItem icon="check_circle" pages={rewardPages} expanded={open} onExpandedChange={setOpen}>
          Rewards
        </NlNavItem>
      </Frame>
    );
  },
};

/** Minimized: icon only; the name shows in a tooltip; a section's pages open in a menu to the end (OD-118). */
export const Minimized: Story = {
  render: () => (
    <Frame minimized>
      <NlNavItem minimized icon="person" href="#members">
        Members
      </NlNavItem>
      <NlNavItem minimized icon="calendar_today" href="#events" current="page">
        Events
      </NlNavItem>
      <NlNavItem
        minimized
        icon="check_circle"
        pages={[...rewardPages.slice(0, 2), { label: 'Reward X', href: '#rewards-x', current: true }]}
      >
        Rewards
      </NlNavItem>
    </Frame>
  ),
};
