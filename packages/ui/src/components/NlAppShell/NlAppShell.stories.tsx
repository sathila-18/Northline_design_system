import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlListItem } from '../NlListItem';
import { NlPageHeader } from '../NlPageHeader';
import { NlSideNav, type NlSideNavItem } from '../NlSideNav';
import { NlTextBlock } from '../NlTextBlock';
import { NlAppShell } from './NlAppShell';

const items: NlSideNavItem[] = [
  { icon: 'person', label: 'Members', href: '#members' },
  {
    icon: 'check_circle',
    label: 'Rewards',
    pages: [
      { label: 'All rewards', href: '#rewards' },
      { label: 'Track day voucher', href: '#rewards-track-day' },
    ],
  },
  { icon: 'calendar_today', label: 'Events', href: '#events' },
  { icon: 'notifications', label: 'Messages', href: '#messages' },
];

const nav = (
  <NlSideNav
    items={items}
    currentHref="#rewards"
    logo={<span className="nl:text-headline-small-h6 nl:text-primary">Northline</span>}
    user={{
      name: 'Member 0042',
      email: 'm0042@example.test',
      avatar: { initials: 'M4' },
      menu: <NlListItem role="menuitem" title="Sign out" size="small" density="compact" divider={false} />,
    }}
  />
);

const header = (
  <NlPageHeader title="Rewards" notifications={{ count: 3 }}>
    Manage the rewards members can claim
  </NlPageHeader>
);

/** Page blocks, Space-4XL apart (the page sets that gap). */
function Blocks({ count }: { count: number }) {
  return (
    <div className="nl:flex nl:flex-col nl:gap-4xl">
      {Array.from({ length: count }, (_, index) => (
        <NlTextBlock
          key={index}
          type="headline-small"
          heading={`Block ${String(index + 1)}`}
          description="Track day voucher, Reward X and event passes for members in every tier."
        />
      ))}
    </div>
  );
}

const meta = {
  title: 'Components/Layout/App shell',
  tags: ['atom-l0'],
  component: NlAppShell,
  parameters: { layout: 'fullscreen' },
  args: { nav, header, skipLink: true, children: <Blocks count={4} /> },
  argTypes: {
    skipLink: { control: 'boolean' },
    skipLinkLabel: { control: 'text' },
    nav: { control: false },
    header: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof NlAppShell>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Side nav, page header and content. Press Tab first to see the skip link. */
export const Default: Story = {};

/** Long content: only the content scrolls; the header and nav stay put. Tab to the content to scroll by keyboard. */
export const LongContent: Story = { args: { children: <Blocks count={16} /> } };

/** Without a header: the content fills the panel. */
export const NoHeader: Story = { args: { header: undefined } };
