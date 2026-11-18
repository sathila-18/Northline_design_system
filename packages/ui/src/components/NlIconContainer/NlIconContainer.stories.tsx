import type { Meta, StoryObj } from '@storybook/react-vite';
import { nlIcons, type NlIconName } from '../../icons';
import { NlIconContainer } from './NlIconContainer';

const sizes = [40, 48, 64] as const;
const tones = ['primary', 'secondary', 'disabled', 'success', 'warning', 'error', 'info'] as const;

const meta = {
  title: 'Components/Atoms L1/Icon container',
  component: NlIconContainer,
  args: { icon: 'search', size: 48, tone: 'primary' },
  argTypes: {
    icon: { control: 'select', options: Object.keys(nlIcons) as NlIconName[] },
    size: { control: 'inline-radio', options: sizes },
    tone: { control: 'select', options: tones },
    label: { control: 'text' },
  },
} satisfies Meta<typeof NlIconContainer>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One container with every option as a control. Decorative unless a label is set. */
export const Default: Story = {};

/** The three sizes. 40 and 48 hold a 24 icon, 64 holds a 36 icon. */
export const Sizes: Story = {
  render: (args) => (
    <div className="nl:flex nl:items-end nl:gap-xl">
      {sizes.map((size) => (
        <NlIconContainer key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const Primary: Story = { args: { tone: 'primary', icon: 'search' } };
export const Secondary: Story = { args: { tone: 'secondary', icon: 'search' } };
export const Disabled: Story = { args: { tone: 'disabled', icon: 'search' } };
export const Success: Story = { args: { tone: 'success', icon: 'check_circle' } };
export const Warning: Story = { args: { tone: 'warning', icon: 'warning' } };
export const Error: Story = { args: { tone: 'error', icon: 'error' } };
export const Info: Story = { args: { tone: 'info', icon: 'info' } };

/** Every tone at every size, for checking each brand and theme at a glance. */
export const AllTones: Story = {
  name: 'All tones',
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-l">
      {sizes.map((size) => (
        <div key={size} className="nl:flex nl:items-center nl:gap-l">
          {tones.map((tone) => (
            <NlIconContainer key={tone} {...args} size={size} tone={tone} />
          ))}
        </div>
      ))}
    </div>
  ),
};

/** With a label: the icon gets role img and an accessible name. Use it when no text nearby gives the meaning. */
export const Labelled: Story = {
  args: { tone: 'success', icon: 'check_circle', label: 'Upload complete' },
};
