import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NlProgressBar } from './NlProgressBar';

const meta = {
  title: 'Components/Atoms L0/Progress bar',
  component: NlProgressBar,
  args: { value: 50, size: 'small', label: 'Upload' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: 'inline-radio', options: ['small', 'large'] },
    label: { control: 'text' },
  },
} satisfies Meta<typeof NlProgressBar>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One bar with every option as a control. Drag the value to see the fill animate (not under reduced motion). */
export const Default: Story = {};

/** The two sizes: small (Size-4, the default) and large (Size-8). */
export const Sizes: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <NlProgressBar value={args.value} size="small" label="Small" />
      <NlProgressBar value={args.value} size="large" label="Large" />
    </div>
  ),
};

/** Values 0, 25, 50, 75 and 100 (a four-step task). At 0 no fill is drawn. */
export const Values: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      {[0, 25, 50, 75, 100].map((value) => (
        <NlProgressBar key={value} size={args.size} value={value} label={`${String(value)}%`} />
      ))}
    </div>
  ),
};

/** Named by a visible caption (aria-labelledby) instead of label. A caller places any text next to the bar. */
export const WithVisibleLabel: Story = {
  name: 'With visible label',
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-xs nl:text-body-m nl:text-primary">
      <span id="progress-caption">Import members</span>
      <NlProgressBar size={args.size} value={args.value} aria-labelledby="progress-caption" />
    </div>
  ),
};

/** Steps the value by 25 with a button, to show the width animation (Duration base, Ease standard). */
export const Animated: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(0);
    return (
      <div className="nl:flex nl:flex-col nl:gap-xl">
        <button
          type="button"
          onClick={() => {
            setValue((v) => (v >= 100 ? 0 : v + 25));
          }}
        >
          Next step
        </button>
        <NlProgressBar {...args} value={value} />
      </div>
    );
  },
};
