import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlSkeleton } from './NlSkeleton';

const meta = {
  title: 'Components/Atoms L0/Skeleton',
  component: NlSkeleton,
  args: { shape: 'text' },
  argTypes: {
    shape: { control: 'inline-radio', options: ['text', 'rect', 'circle'] },
  },
} satisfies Meta<typeof NlSkeleton>;
export default meta;

type Story = StoryObj<typeof meta>;

/**
 * One skeleton with every option as a control. It pulses from 100% to 60% opacity; with reduced motion it holds at
 * full opacity.
 */
export const Default: Story = {};

/** text: a Size-12 line with Radius-XS. Fills its container. */
export const Text: Story = { args: { shape: 'text' } };

/** rect: a Size-24 block with Radius-S. Fills its container. */
export const Rect: Story = { args: { shape: 'rect' } };

/** circle: a Size-24 circle. */
export const Circle: Story = { args: { shape: 'circle' } };

/**
 * Composed: a loading row. The region sets aria-busy; each skeleton is hidden. text and rect fill their container,
 * so a caller sets a narrower width with a width class in className (placement only).
 */
export const LoadingRow: Story = {
  name: 'Loading row',
  render: () => (
    <div aria-busy="true" className="nl:flex nl:items-center nl:gap-m">
      <NlSkeleton shape="circle" />
      <div className="nl:flex nl:grow nl:flex-col nl:gap-xs">
        <NlSkeleton />
        <NlSkeleton />
      </div>
    </div>
  ),
};
