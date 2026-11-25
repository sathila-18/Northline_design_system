import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { NlSegmentSize } from '../NlSegment';
import { NlSegmentedButton } from './NlSegmentedButton';

const sizes = ['medium', 'small', 'xsmall'] as const;

/** Flat controls for Storybook. */
interface StoryArgs {
  size: NlSegmentSize;
  iconOnly: boolean;
  disabled: boolean;
}

const meta = {
  title: 'Components/Actions/Segmented button',
  tags: ['molecule'],
  args: { size: 'medium', iconOnly: false, disabled: false },
  argTypes: {
    size: { control: 'inline-radio', options: sizes },
    iconOnly: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  render: ({ iconOnly, ...rest }) =>
    iconOnly ? (
      <NlSegmentedButton
        {...rest}
        aria-label="View"
        iconOnly
        options={[
          { value: 'list', label: 'List view', icon: 'menu' },
          { value: 'panel', label: 'Panel view', icon: 'dock_to_right' },
        ]}
      />
    ) : (
      <div className="nl:w-full nl:max-w-320">
        <NlSegmentedButton
          {...rest}
          aria-label="Period"
          defaultValue="week"
          options={[
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
          ]}
        />
      </div>
    ),
} satisfies Meta<StoryArgs>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Every option as a control. Tab in, then arrow keys, Home and End. */
export const Default: Story = {};

/** The three sizes. Labelled tracks fill their container; segments share the width. */
export const Sizes: Story = {
  render: () => (
    <div className="nl:flex nl:w-full nl:max-w-320 nl:flex-col nl:gap-m">
      {sizes.map((size) => (
        <NlSegmentedButton
          key={size}
          aria-label={`Period, ${size}`}
          size={size}
          defaultValue="week"
          options={[
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
          ]}
        />
      ))}
    </div>
  ),
};

/** Two or three options, with icons. */
export const TwoAndThree: Story = {
  name: 'Two and three options',
  render: () => (
    <div className="nl:flex nl:w-full nl:max-w-320 nl:flex-col nl:gap-m">
      <NlSegmentedButton
        aria-label="Members"
        options={[
          { value: 'all', label: 'All', icon: 'person' },
          { value: 'search', label: 'Search', icon: 'search' },
        ]}
      />
      <NlSegmentedButton
        aria-label="Period"
        options={[
          { value: 'day', label: 'Day', icon: 'calendar_today' },
          { value: 'week', label: 'Week', icon: 'calendar_today' },
          { value: 'month', label: 'Month', icon: 'calendar_today' },
        ]}
      />
    </div>
  ),
};

/** Icon only: the track hugs its segments; hover or Tab to a segment to see its label in a tooltip. */
export const IconOnly: Story = {
  name: 'Icon only',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="nl:flex nl:flex-col nl:items-start nl:gap-m nl:p-3xl">
      {sizes.map((size) => (
        <NlSegmentedButton
          key={size}
          aria-label={`View, ${size}`}
          size={size}
          iconOnly
          options={[
            { value: 'list', label: 'List view', icon: 'menu' },
            { value: 'panel', label: 'Panel view', icon: 'dock_to_right' },
          ]}
        />
      ))}
    </div>
  ),
};

/** The whole group disabled: every segment uses its disabled look. */
export const Disabled: Story = {
  render: () => (
    <div className="nl:flex nl:w-full nl:max-w-320 nl:flex-col nl:gap-m">
      {sizes.map((size) => (
        <NlSegmentedButton
          key={size}
          aria-label={`Period, ${size}`}
          size={size}
          disabled
          defaultValue="week"
          options={[
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
          ]}
        />
      ))}
    </div>
  ),
};

/** Controlled: a theme switch. */
export const Controlled: Story = {
  render: function Render() {
    const [theme, setTheme] = useState('system');
    return (
      <div className="nl:flex nl:w-full nl:max-w-320 nl:flex-col nl:gap-m">
        <NlSegmentedButton
          aria-label="Theme"
          value={theme}
          onValueChange={setTheme}
          options={[
            { value: 'system', label: 'System' },
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]}
        />
        <p className="nl:text-body-m nl:text-secondary">Chosen: {theme}</p>
      </div>
    );
  },
};
