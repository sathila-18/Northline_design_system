import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlNavSubItem } from './NlNavSubItem';

/** The item lives in the side nav (bg-secondary), pages Space-XS apart and below their section row. */
const meta = {
  title: 'Internal/Nav sub item',
  component: NlNavSubItem,
  args: { children: 'Members', href: '#members', current: false, tree: 'none' },
  argTypes: {
    current: { control: 'boolean' },
    tree: { control: 'inline-radio', options: ['none', 'middle', 'last'] },
    children: { control: 'text' },
    as: { control: false },
  },
  decorators: [
    (Story) => (
      <nav aria-label="Side nav sample" className="nl:w-full nl:max-w-320 nl:bg-secondary nl:p-l">
        <Story />
      </nav>
    ),
  ],
} satisfies Meta<typeof NlNavSubItem>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One item with every option as a control. Hover, press and Tab to see the states. */
export const Default: Story = {};

/** Without a tree line: default and current page. */
export const States: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xs">
      <NlNavSubItem href="#members">Members</NlNavSubItem>
      <NlNavSubItem href="#tiers" current>
        Tiers
      </NlNavSubItem>
      <NlNavSubItem href="#rewards">Rewards</NlNavSubItem>
    </div>
  ),
};

/** Tree style: middle items carry the line on, the last one stops at the curve. */
export const Tree: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xs nl:pt-xs">
      <NlNavSubItem href="#members" tree="middle">
        Members
      </NlNavSubItem>
      <NlNavSubItem href="#tiers" tree="middle" current>
        Tiers
      </NlNavSubItem>
      <NlNavSubItem href="#rewards" tree="last">
        Rewards
      </NlNavSubItem>
    </div>
  ),
};

/** Text that doesn't fit is cut with an ellipsis and gets the full text as its title. */
export const LongText: Story = {
  name: 'Long text',
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xs">
      <NlNavSubItem href="#vouchers" tree="last">
        Track day vouchers waiting for approval by an admin
      </NlNavSubItem>
    </div>
  ),
};
