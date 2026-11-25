import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { NlListItem } from '../NlListItem';
import { NlSideNavUser } from './NlSideNavUser';

/** The account menu's rows. */
const accountMenu = (
  <>
    <NlListItem role="menuitem" title="Profile" size="small" density="compact" divider={false} />
    <NlListItem role="menuitem" title="Settings" size="small" density="compact" divider={false} />
    <NlListItem role="menuitem" title="Sign out" size="small" density="compact" divider={false} />
  </>
);

/** The bottom of the side nav's column (up to Size-320), or just the avatar when minimized. Room above for the menu. */
function Frame({ minimized = false, children }: { minimized?: boolean; children: ReactNode }) {
  return (
    <nav
      aria-label={minimized ? 'Minimized side nav sample' : 'Side nav sample'}
      className={
        minimized
          ? 'nl:inline-flex nl:flex-col nl:bg-secondary nl:p-l nl:pt-12xl'
          : 'nl:flex nl:w-full nl:max-w-320 nl:flex-col nl:bg-secondary nl:p-l nl:pt-12xl'
      }
    >
      {children}
    </nav>
  );
}

const meta = {
  title: 'Components/Navigation/Side nav user',
  tags: ['molecule'],
  component: NlSideNavUser,
  args: {
    name: 'Member 0042',
    email: 'm0042@example.test',
    avatar: { initials: 'M4' },
    menu: accountMenu,
    minimized: false,
  },
  argTypes: {
    name: { control: 'text' },
    email: { control: 'text' },
    menuLabel: { control: 'text' },
    minimized: { control: 'boolean' },
    menu: { control: false },
    avatar: { control: 'object' },
  },
} satisfies Meta<typeof NlSideNavUser>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Every option as a control. Click the row to open the account menu above it; Escape closes it. */
export const Default: Story = {
  render: (args) => (
    <Frame minimized={args.minimized}>
      <NlSideNavUser {...args} />
    </Frame>
  ),
};

/** Minimized: the avatar only, the name in a tooltip; the menu opens to the end, along the bottom. */
export const Minimized: Story = {
  args: { minimized: true },
  render: (args) => (
    <Frame minimized>
      <NlSideNavUser {...args} />
    </Frame>
  ),
};

/** Menu open from the start (controlled), to check the open fill and the chevron. */
export const Open: Story = {
  args: { open: true },
  render: (args) => (
    <Frame>
      <NlSideNavUser {...args} />
    </Frame>
  ),
};

/** No menu: not a button, no hover, no side padding, no chevron. */
export const NoMenu: Story = {
  args: { menu: undefined },
  render: (args) => (
    <Frame>
      <NlSideNavUser {...args} />
    </Frame>
  ),
};

/** A long name and email: one line each, cut with an ellipsis; hover for the full text. */
export const LongText: Story = {
  args: {
    name: 'Member 0042 with a much longer display name',
    email: 'member0042.with.a.long.address@example.test',
  },
  render: (args) => (
    <Frame>
      <NlSideNavUser {...args} />
    </Frame>
  ),
};
