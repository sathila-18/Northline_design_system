import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlListCaption } from './NlListCaption';

const meta = {
  title: 'Internal/List caption',
  component: NlListCaption,
  args: { size: 'medium', weight: 'heavy', disabled: false, children: '250 pts' },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    weight: { control: 'inline-radio', options: ['heavy', 'light'] },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  render: (args) => (
    <div {...(args.disabled ? { 'data-a11y-known-issue': 'K3' } : {})}>
      <NlListCaption {...args} />
    </div>
  ),
} satisfies Meta<typeof NlListCaption>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One caption with every option as a control. Heavy (Label) by default. */
export const Default: Story = {};

/** Heavy (Label S / M / L) and light (Body S / M / L) in each size. */
export const SizesAndWeights: Story = {
  name: 'Sizes and weights',
  render: () => (
    <div className="nl:grid nl:grid-cols-3 nl:items-center nl:gap-l">
      {(['heavy', 'light'] as const).map((weight) =>
        (['small', 'medium', 'large'] as const).map((size) => (
          <NlListCaption key={`${weight}-${size}`} weight={weight} size={size}>
            {`19 Nov · ${weight} ${size}`}
          </NlListCaption>
        )),
      )}
    </div>
  ),
};

/** In a disabled row, the row passes disabled: text-disabled (OD-29, K3). */
export const Disabled: Story = {
  render: () => (
    <div className="nl:flex nl:gap-xl" data-a11y-known-issue="K3">
      <NlListCaption disabled>Tier 2</NlListCaption>
      <NlListCaption disabled weight="light">
        3 rewards
      </NlListCaption>
    </div>
  ),
};
