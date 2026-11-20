import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlStatCard } from './NlStatCard';

const meta = {
  title: 'Components/Molecules/Stat card',
  component: NlStatCard,
  args: { label: 'Total points', value: '806,400', inList: false },
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    inList: { control: false },
    as: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="nl:w-full nl:bg-primary nl:p-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NlStatCard>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One card with its options as controls. */
export const Default: Story = {
  render: (args) => (
    <div className="nl:max-w-320">
      <NlStatCard {...args} />
    </div>
  ),
};

/** A row of cards in a description list (OD-175); the page sets the Space-4XL gap and the grid. */
export const Group: Story = {
  render: () => (
    <dl className="nl:m-none nl:grid nl:grid-cols-4 nl:gap-4xl">
      <NlStatCard inList label="Total points" value="806,400" />
      <NlStatCard inList label="Members" value="12,480" />
      <NlStatCard inList label="Rewards redeemed" value="3,215" />
      <NlStatCard inList label="Tier 2 members" value="1,200" />
    </dl>
  ),
};

/** A value wider than its column wraps rather than being cut off (OD-176). */
export const LongValue: Story = {
  render: () => (
    <div className="nl:max-w-320">
      <NlStatCard label="Points issued this year" value="1,204,806,400,000" />
    </div>
  ),
};
