import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlCountBadge } from './NlCountBadge';

const sizes = ['small', 'large'] as const;
const tones = ['error', 'warning', 'success'] as const;
const counts = [undefined, 3, 42, 120] as const;

const meta = {
  title: 'Components/Chips and labels/Count badge',
  tags: ['atom-l0'],
  component: NlCountBadge,
  args: { count: 3, max: 99, size: 'small', tone: 'error' },
  argTypes: {
    count: { control: 'number' },
    max: { control: 'number' },
    size: { control: 'inline-radio', options: sizes },
    tone: { control: 'inline-radio', options: tones },
    label: { control: 'text' },
  },
} satisfies Meta<typeof NlCountBadge>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One badge with every option as a control. A count of 0 renders nothing. */
export const Default: Story = {};

/** Both sizes with no count (dot), single and double digits, and over the maximum. */
export const SizesAndDigits: Story = {
  name: 'Sizes and digits',
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      {sizes.map((size) => (
        <div key={size} className="nl:flex nl:items-center nl:gap-xl">
          {counts.map((count) => (
            <NlCountBadge key={String(count)} {...args} size={size} count={count} />
          ))}
        </div>
      ))}
    </div>
  ),
};

/** The three tones, in both sizes. */
export const Tones: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      {sizes.map((size) => (
        <div key={size} className="nl:flex nl:items-center nl:gap-xl">
          {tones.map((tone) => (
            <NlCountBadge key={tone} {...args} size={size} tone={tone} />
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Above max the badge shows max followed by +. */
export const OverMax: Story = {
  name: 'Over max',
  args: { count: 1200 },
};

/** With a label, screen readers hear the label instead of the digits. */
export const Labelled: Story = {
  args: { count: 3, label: '3 unread notifications' },
};
