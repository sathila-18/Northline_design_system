import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NlSlider } from './NlSlider';

const meta: Meta<typeof NlSlider> = {
  title: 'Components/Atoms L0/Slider',
  component: NlSlider,
  args: { 'aria-label': 'Points', defaultValue: 50, min: 0, max: 100, step: 1, disabled: false },
  argTypes: {
    defaultValue: { control: { type: 'number' } },
    min: { control: { type: 'number' } },
    max: { control: { type: 'number' } },
    step: { control: { type: 'number' } },
    disabled: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
  decorators: [
    // Half a thumb (Space-L) clear on both ends, as the spec asks of layouts.
    (Story) => (
      <div className="nl:px-l">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof NlSlider>;

/**
 * One slider with every option as a control. Hover, press and Tab to it to check the proposed states (OD-10).
 * Keyboard: arrows one step, Page Up / Page Down 10%, Home / End.
 */
export const Default: Story = {};

/** The reference's fill levels: 5, 25, 50, 75 and 100. These are values, not variants. */
export const Values: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      {[5, 25, 50, 75, 100].map((value) => (
        <NlSlider key={value} aria-label={`Points ${String(value)}`} defaultValue={value} />
      ))}
    </div>
  ),
};

/** Disabled (OD-10): bg-disabled track, fg-disabled-on_bg fill and thumb, no shadow, not focusable. */
export const Disabled: Story = { args: { disabled: true } };

/** Disabled at the extremes, to check the thumb half outside the track at both ends. */
export const DisabledEnds: Story = {
  name: 'Disabled, ends',
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <NlSlider aria-label="At the minimum" defaultValue={0} disabled />
      <NlSlider aria-label="At the maximum" defaultValue={100} disabled />
    </div>
  ),
};

/** Controlled, with the value shown next to it by the caller (OD-12: the slider shows no value itself). */
export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState(30);
    return (
      <div className="nl:flex nl:flex-col nl:gap-xs nl:text-body-m nl:text-primary">
        <span id="points-caption">Reward points: {value}</span>
        <NlSlider
          aria-labelledby="points-caption"
          aria-valuetext={`${String(value)} points`}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};
