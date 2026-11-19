import type { Meta, StoryObj } from '@storybook/react-vite';
import { nlIconNames, type NlIconName } from '../../icons';
import { NlNavIcon } from './NlNavIcon';

const sample: NlIconName[] = ['person', 'calendar_today', 'search', 'info', 'dock_to_right'];

const meta = {
  title: 'Internal/Nav icon',
  component: NlNavIcon,
  args: { selected: false, name: 'person' },
  argTypes: {
    selected: { control: 'boolean' },
    name: { control: 'select', options: nlIconNames },
  },
} satisfies Meta<typeof NlNavIcon>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One icon with every option as a control. */
export const Default: Story = {};

/** Unselected (fg-secondary, outlined) and selected (fg-active, filled), for a few registry icons. */
export const UnselectedAndSelected: Story = {
  name: 'Unselected and selected',
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-m">
      {[false, true].map((selected) => (
        <div key={String(selected)} className="nl:flex nl:items-center nl:gap-xl">
          {sample.map((name) => (
            <NlNavIcon key={name} selected={selected} name={name} />
          ))}
        </div>
      ))}
    </div>
  ),
};
