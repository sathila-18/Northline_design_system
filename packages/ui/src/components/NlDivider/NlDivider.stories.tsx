import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlDivider } from './NlDivider';

const meta = {
  title: 'Components/Layout/Divider',
  tags: ['atom-l0'],
  component: NlDivider,
  args: { type: 'divider', decorative: false },
  argTypes: {
    type: { control: 'inline-radio', options: ['divider', 'section'] },
    decorative: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="nl:flex nl:flex-col nl:gap-xl nl:text-body-m nl:text-primary">
        <p>Content above</p>
        <Story />
        <p>Content below</p>
      </div>
    ),
  ],
} satisfies Meta<typeof NlDivider>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One divider with every option as a control. The parent sets the spacing with its gap. */
export const Default: Story = {};

/** divider: a 1px line in border-default that fills its container. */
export const Divider: Story = { args: { type: 'divider' } };

/** section: a Size-8 band in border-default, between page sections. */
export const Section: Story = { args: { type: 'section' } };

/** Decorative: a hidden <div> instead of an <hr>, for lines that are only visual. Looks the same. */
export const Decorative: Story = { args: { decorative: true } };
