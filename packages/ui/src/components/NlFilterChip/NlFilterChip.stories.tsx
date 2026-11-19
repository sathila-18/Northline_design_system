import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { nlIconNames } from '../../icons';
import { NlFilterChip } from './NlFilterChip';

const sizes = ['xsmall', 'small', 'large'] as const;

const meta = {
  title: 'Components/Atoms L1/Filter chip',
  component: NlFilterChip,
  args: { size: 'small', defaultSelected: false, disabled: false, children: 'Active members' },
  argTypes: {
    size: { control: 'inline-radio', options: sizes },
    defaultSelected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    leadingIcon: { control: 'select', options: [undefined, ...nlIconNames] },
    children: { control: 'text' },
    selected: { control: false },
    onSelectedChange: { control: false },
  },
} satisfies Meta<typeof NlFilterChip>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One chip with every option as a control. Click, hover, press and tab to it to see the states. */
export const Default: Story = {
  // Remount when defaultSelected changes, so the control takes effect.
  render: (args) => <NlFilterChip key={String(args.defaultSelected)} {...args} />,
};

/** Off and on, enabled and disabled. */
export const OffAndOn: Story = {
  name: 'Off and on',
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-m">
      {[false, true].map((disabled) => (
        <div key={String(disabled)} className="nl:flex nl:items-center nl:gap-m">
          <NlFilterChip size={args.size} disabled={disabled}>
            Off
          </NlFilterChip>
          <NlFilterChip size={args.size} defaultSelected disabled={disabled}>
            On
          </NlFilterChip>
          <NlFilterChip size={args.size} leadingIcon="check" disabled={disabled}>
            Off with icon
          </NlFilterChip>
          <NlFilterChip size={args.size} leadingIcon="check" defaultSelected disabled={disabled}>
            On with icon
          </NlFilterChip>
        </div>
      ))}
    </div>
  ),
};

/** The three sizes, off and on. */
export const Sizes: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-m">
      {sizes.map((size) => (
        <div key={size} className="nl:flex nl:items-center nl:gap-m">
          <NlFilterChip size={size} leadingIcon="calendar_today">
            This week
          </NlFilterChip>
          <NlFilterChip size={size} leadingIcon="calendar_today" defaultSelected>
            This week
          </NlFilterChip>
        </div>
      ))}
    </div>
  ),
};

/** Controlled: several filters can be on at once, for example above a table. */
export const Controlled: Story = {
  render: function Render() {
    const [on, setOn] = useState<Record<string, boolean>>({ 'Tier 1': false, 'Tier 2': true, 'Tier 3': false });
    return (
      <div className="nl:flex nl:flex-col nl:gap-m">
        <div className="nl:flex nl:items-center nl:gap-m">
          {Object.keys(on).map((tier) => (
            <NlFilterChip
              key={tier}
              selected={on[tier]}
              onSelectedChange={(value) => {
                setOn((current) => ({ ...current, [tier]: value }));
              }}
            >
              {tier}
            </NlFilterChip>
          ))}
        </div>
        <p className="nl:text-body-m nl:text-secondary">
          On:{' '}
          {Object.entries(on)
            .filter(([, value]) => value)
            .map(([tier]) => tier)
            .join(', ') || 'none'}
        </p>
      </div>
    );
  },
};
