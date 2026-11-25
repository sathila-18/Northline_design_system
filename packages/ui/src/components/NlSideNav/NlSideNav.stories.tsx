import type { Meta, StoryObj } from '@storybook/react-vite';
// Story-only logo, kept in the Storybook app with its artwork.
import { BrandLogo } from '../../../../../apps/storybook/src/pages/_shared/BrandLogo';
import { NlListItem } from '../NlListItem';
import { NlSideNav, type NlSideNavItem } from './NlSideNav';

const items: NlSideNavItem[] = [
  { icon: 'person', label: 'Members', href: '#members' },
  {
    icon: 'check_circle',
    label: 'Rewards',
    pages: [
      { label: 'All rewards', href: '#rewards' },
      { label: 'Track day voucher', href: '#rewards-track-day' },
      { label: 'Reward X', href: '#rewards-x' },
    ],
  },
  { icon: 'calendar_today', label: 'Events', href: '#events' },
  { icon: 'notifications', label: 'Messages', href: '#messages' },
  { icon: 'info', label: 'Help', href: '#help' },
];

const user = {
  name: 'Member 0042',
  email: 'm0042@example.test',
  avatar: { initials: 'M4' },
  menu: (
    <>
      <NlListItem role="menuitem" title="Profile" size="small" density="compact" divider={false} />
      <NlListItem role="menuitem" title="Sign out" size="small" density="compact" divider={false} />
    </>
  ),
};

/** The story-only logo for the current brand (Storybook artwork, not part of the library). */
const logo = <BrandLogo />;

const meta = {
  title: 'Components/Navigation/Side nav',
  tags: ['organism'],
  component: NlSideNav,
  parameters: { layout: 'fullscreen' },
  args: { items, logo, user, currentHref: '#rewards-track-day', variant: 'default' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'tree'] },
    minimized: { control: 'boolean' },
    currentHref: { control: 'text' },
    items: { control: false },
    logo: { control: false },
    user: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="nl:flex nl:h-dvh">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NlSideNav>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Follows the window: expanded from Breakpoint-1280, minimized below; the collapse button toggles it. */
export const Default: Story = {};

/** Tree style: lines from the open section to its pages. */
export const Tree: Story = { args: { variant: 'tree', defaultMinimized: false } };

/** Expanded, whatever the window width. */
export const Expanded: Story = { args: { defaultMinimized: false } };

/** Minimized: icons only, names as tooltips, a section's pages in a menu; the user is an avatar. */
export const Minimized: Story = { args: { defaultMinimized: true } };

/** Without a user. */
export const NoUser: Story = { args: { user: undefined, defaultMinimized: false } };
