import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NlRadio } from './NlRadio';

const meta = {
  title: 'Components/Forms and inputs/Radio',
  tags: ['atom-l0'],
  component: NlRadio,
  args: { 'aria-label': 'Tier 2', defaultChecked: false, disabled: false },
  argTypes: {
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof NlRadio>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One radio with every option as a control. Hover, press and Tab to it to see the states. */
export const Default: Story = {};

/** Unselected: border-strong ring. */
export const Unselected: Story = { args: { defaultChecked: false } };

/** Selected: fg-action ring and dot. */
export const Selected: Story = { args: { defaultChecked: true } };

/** Disabled, unselected and selected: fg-disabled ring (and dot), not focusable. */
export const Disabled: Story = {
  render: () => (
    <div className="nl:flex nl:items-center nl:gap-xl">
      <NlRadio aria-label="Disabled, not selected" disabled />
      <NlRadio aria-label="Disabled, selected" disabled defaultChecked />
    </div>
  ),
};

/**
 * A group of three with visible labels. Tab moves into the group, arrow keys move and select, Space selects.
 * A screen reader hears, for example, "Tier 2, radio button, selected, 2 of 3".
 */
export const Group: Story = {
  render: function Render() {
    const [tier, setTier] = useState('tier-2');
    return (
      <div
        role="radiogroup"
        aria-labelledby="tier-heading"
        className="nl:flex nl:flex-col nl:gap-xs nl:text-body-m nl:text-primary"
      >
        <span id="tier-heading">Member tier</span>
        {['tier-1', 'tier-2', 'tier-3'].map((value, i) => (
          <label key={value} className="nl:inline-flex nl:items-center nl:gap-xs">
            <NlRadio
              name="tier"
              value={value}
              checked={tier === value}
              onChange={(e) => {
                setTier(e.target.value);
              }}
            />
            Tier {i + 1}
          </label>
        ))}
      </div>
    );
  },
};

/** Named by a wrapping label: clicking the text selects the radio. */
export const WrappingLabel: Story = {
  name: 'Wrapping label',
  render: () => (
    <label className="nl:inline-flex nl:items-center nl:gap-xs nl:text-body-m nl:text-primary">
      <NlRadio name="voucher" value="track-day" />
      Track day voucher
    </label>
  ),
};
