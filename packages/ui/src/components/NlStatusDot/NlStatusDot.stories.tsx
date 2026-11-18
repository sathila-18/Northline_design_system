import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlStatusDot } from './NlStatusDot';

const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;

const meta = {
  title: 'Components/Atoms L0/Status dot',
  component: NlStatusDot,
  args: { size: 'medium' },
  argTypes: {
    size: { control: 'inline-radio', options: sizes },
    label: { control: 'text' },
  },
} satisfies Meta<typeof NlStatusDot>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One dot with every option as a control. Decorative unless a label is set. */
export const Default: Story = {};

/** The five sizes. Each diameter comes from Size-*; the 1px ring sits outside it. */
export const Sizes: Story = {
  render: (args) => (
    <div className="nl:flex nl:items-end nl:gap-xl">
      {sizes.map((size) => (
        <NlStatusDot key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

/** With a label: role img and an accessible name. Show the status in text nearby too. */
export const Labelled: Story = {
  args: { label: 'Online' },
  render: (args) => (
    <span className="nl:inline-flex nl:items-center nl:gap-xs nl:text-body-m nl:text-primary">
      <NlStatusDot {...args} />
      Online
    </span>
  ),
};

/** On a darker surface, so the ring that cuts the dot out is visible. */
export const OnASurface: Story = {
  name: 'On a surface',
  render: (args) => (
    <div className="nl:inline-flex nl:items-end nl:gap-xl nl:rounded-m nl:bg-secondary nl:p-xl">
      {sizes.map((size) => (
        <NlStatusDot key={size} {...args} size={size} />
      ))}
    </div>
  ),
};
