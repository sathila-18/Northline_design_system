import type { Meta, StoryObj } from '@storybook/react-vite';
import { nlIconNames } from '../../icons';
import { NlBadgeBase, type NlBadgeBaseAppearance } from './NlBadgeBase';

/**
 * Story-only colours, so the shape is visible. The base has none; NlBadge sets them per tone. These are the neutral
 * tone's tokens.
 */
const preview: NlBadgeBaseAppearance = { badge: 'nl:bg-neutral nl:text-secondary', icon: 'nl:text-fg-secondary' };

/** Story-only colours with an inset ring, to show that a bordered tone keeps the same size. */
const bordered: NlBadgeBaseAppearance = {
  badge: 'nl:bg-success-secondary nl:inset-ring nl:inset-ring-success nl:text-success',
  icon: 'nl:text-fg-success',
};

const meta = {
  title: 'Internal/Badge base',
  component: NlBadgeBase,
  args: { size: 'small', children: 'Tier 2', appearance: preview },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'large'] },
    children: { control: 'text' },
    leadingIcon: { control: 'select', options: [undefined, ...nlIconNames] },
    trailingIcon: { control: 'select', options: [undefined, ...nlIconNames] },
    appearance: { control: false },
  },
} satisfies Meta<typeof NlBadgeBase>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One badge with every option as a control. */
export const Default: Story = {};

/** Small hugs its content (26 high). Large has a Size-32 minimum height. */
export const Sizes: Story = {
  render: (args) => (
    <div className="nl:flex nl:items-center nl:gap-m">
      <NlBadgeBase {...args} size="small" />
      <NlBadgeBase {...args} size="large" />
    </div>
  ),
};

/** Leading, trailing and both icons, in both sizes. The icons are decorative. */
export const WithIcons: Story = {
  name: 'With icons',
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-m">
      {(['small', 'large'] as const).map((size) => (
        <div key={size} className="nl:flex nl:items-center nl:gap-m">
          <NlBadgeBase {...args} size={size} leadingIcon="check_circle" />
          <NlBadgeBase {...args} size={size} trailingIcon="close" />
          <NlBadgeBase {...args} size={size} leadingIcon="check_circle" trailingIcon="close" />
        </div>
      ))}
    </div>
  ),
};

/** A bordered tone (inset ring) beside a borderless one: same height. */
export const Bordered: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-m">
      {(['small', 'large'] as const).map((size) => (
        <div key={size} className="nl:flex nl:items-center nl:gap-m">
          <NlBadgeBase {...args} size={size} />
          <NlBadgeBase {...args} size={size} appearance={bordered} leadingIcon="check_circle">
            Active
          </NlBadgeBase>
        </div>
      ))}
    </div>
  ),
};

/** A long label stays on one line and makes the badge wider. */
export const LongLabel: Story = {
  name: 'Long label',
  args: { children: 'Track day voucher, valid for one session' },
};
