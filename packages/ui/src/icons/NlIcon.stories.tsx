import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlIcon } from './NlIcon';
import { nlIconNames } from './nlIcons';

const sizes = [16, 20, 24, 36, 48, 64] as const;
const tones = ['inherit', 'primary', 'secondary', 'disabled', 'success', 'warning', 'error', 'info'] as const;

const meta = {
  title: 'Components/Atoms L0/Icon',
  component: NlIcon,
  args: { name: 'info', size: 24, tone: 'inherit', filled: false },
  argTypes: {
    name: { control: 'select', options: nlIconNames },
    size: { control: 'inline-radio', options: sizes },
    tone: { control: 'select', options: tones },
    filled: { control: 'boolean' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof NlIcon>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One icon with every option as a control. Decorative unless a label is set. */
export const Default: Story = {};

/** The six sizes. The box and the glyph both come from Size-*. */
export const Sizes: Story = {
  render: (args) => (
    <div className="nl:flex nl:items-end nl:gap-xl">
      {sizes.map((size) => (
        <NlIcon key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

/** The seven named tones, plus inherit (currentColor). */
export const Tones: Story = {
  render: (args) => (
    <div className="nl:flex nl:items-center nl:gap-xl">
      {tones.map((tone) => (
        <NlIcon key={tone} {...args} tone={tone} />
      ))}
    </div>
  ),
};

/** Outlined (default) and filled, for active and selected states. Only some glyphs have a filled form. */
export const Filled: Story = {
  args: { name: 'check_circle' },
  render: (args) => (
    <div className="nl:flex nl:items-center nl:gap-xl">
      <NlIcon {...args} filled={false} />
      <NlIcon {...args} filled />
    </div>
  ),
};

/** With a label: role img and an accessible name. */
export const Labelled: Story = {
  args: { name: 'warning', tone: 'warning', label: 'Warning' },
};

/** Inherit takes the parent's colour, set by the parent through its own token. */
export const Inherit: Story = {
  args: { name: 'search', tone: 'inherit' },
  render: (args) => (
    <span className="nl:inline-flex nl:items-center nl:gap-xs nl:text-body-m nl:text-action">
      <NlIcon {...args} />
      Text in text-action
    </span>
  ),
};

/** Every icon in the nlIcons registry. */
export const Registry: Story = {
  render: (args) => (
    <ul className="nl:grid nl:grid-cols-5 nl:gap-xl">
      {nlIconNames.map((name) => (
        <li key={name} className="nl:flex nl:flex-col nl:items-center nl:gap-xs nl:text-body-s nl:text-secondary">
          <NlIcon {...args} name={name} tone="primary" />
          {name}
        </li>
      ))}
    </ul>
  ),
};
