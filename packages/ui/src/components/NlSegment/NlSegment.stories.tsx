import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { nlIconNames, type NlIconName } from '../../icons';
import { NlSegment, type NlSegmentSize } from './NlSegment';

const sizes = ['medium', 'small', 'xsmall'] as const;

/** Flat controls for Storybook. The props are a union (icon-only needs an icon), checked in render. */
interface StoryArgs {
  selected: boolean;
  size: NlSegmentSize;
  iconOnly: boolean;
  icon?: NlIconName;
  disabled: boolean;
  children: string;
}

const meta = {
  title: 'Internal/Segment',
  args: { selected: true, size: 'medium', iconOnly: false, icon: 'calendar_today', disabled: false, children: 'Week' },
  render: ({ iconOnly, icon, ...rest }) =>
    iconOnly && icon ? <NlSegment {...rest} iconOnly icon={icon} /> : <NlSegment {...rest} icon={icon} />,
  argTypes: {
    selected: { control: 'boolean' },
    size: { control: 'inline-radio', options: sizes },
    iconOnly: { control: 'boolean' },
    icon: { control: 'select', options: [undefined, ...nlIconNames] },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  // Segments sit on the segmented button's track; a neutral surface shows the unselected look here.
  decorators: [
    (Story) => (
      <div className="nl:inline-flex nl:rounded-m nl:bg-tertiary nl:p-xs">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<StoryArgs>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One segment with every option as a control. Hover, press and tab to it to see the states. */
export const Default: Story = {};

/** Selected and unselected, enabled and disabled. Selected icons are filled. */
export const SelectedAndUnselected: Story = {
  name: 'Selected and unselected',
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-xs">
      {[false, true].map((disabled) => (
        <div key={String(disabled)} className="nl:flex nl:items-center nl:gap-xs">
          <NlSegment selected size={args.size} icon="calendar_today" disabled={disabled}>
            Selected
          </NlSegment>
          <NlSegment selected={false} size={args.size} icon="calendar_today" disabled={disabled}>
            Unselected
          </NlSegment>
        </div>
      ))}
    </div>
  ),
};

/** The three sizes, labelled and icon-only. Small icon-only is 28 from Space-XS padding (OD-67). */
export const Sizes: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xs">
      {sizes.map((size) => (
        <div key={size} className="nl:flex nl:items-center nl:gap-xs">
          <NlSegment selected size={size} icon="calendar_today">
            Week
          </NlSegment>
          <NlSegment selected={false} size={size}>
            Month
          </NlSegment>
          <NlSegment selected size={size} iconOnly icon="menu">
            List view
          </NlSegment>
          <NlSegment selected={false} size={size} iconOnly icon="dock_to_right">
            Panel view
          </NlSegment>
        </div>
      ))}
    </div>
  ),
};

/**
 * Three named radios in a radiogroup, only to show the keyboard: Tab in, then arrow keys move and select, skipping
 * the disabled one. NlSegmentedButton will provide the track, widths and group.
 */
export const InAGroup: Story = {
  name: 'In a group',
  render: function Render(args) {
    const [value, setValue] = useState('week');
    return (
      <div role="radiogroup" aria-label="Period" className="nl:flex nl:items-center nl:gap-xs">
        {['Day', 'Week', 'Month', 'Year'].map((option) => (
          <NlSegment
            key={option}
            name="story-period"
            value={option.toLowerCase()}
            size={args.size}
            selected={value === option.toLowerCase()}
            disabled={option === 'Year'}
            onChange={(event) => {
              setValue(event.target.value);
            }}
          >
            {option}
          </NlSegment>
        ))}
      </div>
    );
  },
};
