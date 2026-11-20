import type { Meta, StoryObj } from '@storybook/react-vite';
import { nlIconNames } from '../../icons';
import { NlAvatar } from '../NlAvatar';
import { NlButton } from '../NlButton';
import { NlEmptyState } from './NlEmptyState';

const meta = {
  title: 'Components/Molecules/Empty state',
  component: NlEmptyState,
  args: {
    size: 'medium',
    icon: 'add',
    heading: 'No rewards yet',
    headingAs: 'h2',
    description: 'Rewards you add show here for every tier.',
    live: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'medium'] },
    icon: { control: 'select', options: [undefined, ...nlIconNames] },
    heading: { control: 'text' },
    headingAs: { control: 'select', options: ['h2', 'h3', 'h4', 'p'] },
    description: { control: 'text' },
    live: { control: 'boolean' },
    iconSlot: { control: false },
    action: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="nl:w-full nl:bg-primary nl:p-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NlEmptyState>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Every option as a control, with an action. */
export const Default: Story = {
  args: {
    action: (
      <NlButton variant="primary" size="small" icon="leading" iconName="add">
        Add reward
      </NlButton>
    ),
  },
};

/** Small (48 icon, Headline Small) and medium (64 icon, Headline Medium). */
export const Sizes: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-6xl">
      <NlEmptyState {...args} size="small" />
      <NlEmptyState {...args} size="medium" />
    </div>
  ),
};

/** A custom icon slot, and no icon at all (OD-173). */
export const IconOptions: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-6xl">
      <NlEmptyState
        {...args}
        iconSlot={<NlAvatar size="xlarge" initials="M4" />}
        heading="No activity yet"
        description="Member 0042 hasn't earned or spent points."
      />
      <NlEmptyState {...args} icon={undefined} heading="Nothing here" description={undefined} />
    </div>
  ),
};

/** After a search: announced with `live` (role status, OD-174), with a way back. */
export const NoResults: Story = {
  render: (args) => (
    <NlEmptyState
      {...args}
      live
      size="small"
      icon="search"
      heading="No results"
      description="No members match “Tier 9”. Check the spelling or clear the search."
      action={
        <NlButton variant="secondary" size="small">
          Clear search
        </NlButton>
      }
    />
  ),
};
