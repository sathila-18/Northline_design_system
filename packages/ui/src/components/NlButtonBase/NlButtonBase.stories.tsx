import type { Meta, StoryObj } from '@storybook/react-vite';
import { nlIconNames } from '../../icons';
import { NlButtonBase } from './NlButtonBase';

const variants = ['primary', 'secondary', 'tertiary', 'link'] as const;
const sizes = ['large', 'medium', 'small', 'xsmall'] as const;

const meta = {
  title: 'Internal/Button base',
  component: NlButtonBase,
  args: { variant: 'primary', size: 'medium', icon: 'none', children: 'Save changes' },
  argTypes: {
    variant: { control: 'inline-radio', options: variants },
    size: { control: 'inline-radio', options: sizes },
    icon: { control: 'inline-radio', options: ['none', 'leading', 'trailing', 'only-icon'] },
    iconName: { control: 'select', options: [undefined, ...nlIconNames] },
    children: { control: 'text' },
    appearance: { control: false },
    as: { control: false },
  },
} satisfies Meta<typeof NlButtonBase>;
export default meta;

type Story = StoryObj<typeof meta>;

/** The variant from the controls, minus link, which has no icon-only form. */
const variantOf = (args: { variant?: string }) =>
  args.variant === 'secondary' || args.variant === 'tertiary' ? args.variant : 'primary';

/** One button with every option as a control. Resting colours only: states come with NlButton. */
export const Default: Story = {};

/** The four variants at rest. Secondary has a 2px inside border; link uses tertiary's sizes. */
export const Variants: Story = {
  render: (args) => (
    <div className="nl:flex nl:items-center nl:gap-m">
      {variants.map((variant) => (
        <NlButtonBase key={variant} size={args.size} variant={variant}>
          {variant === 'link' ? 'View details' : 'Save changes'}
        </NlButtonBase>
      ))}
    </div>
  ),
};

/** The four sizes, each beside its icon-only square, so the heights can be compared. */
export const Sizes: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-m">
      {sizes.map((size) => (
        <div key={size} className="nl:flex nl:items-center nl:gap-m">
          <NlButtonBase variant={variantOf(args)} size={size}>
            {args.children}
          </NlButtonBase>
          <NlButtonBase variant={variantOf(args)} size={size} icon="leading" iconName="add">
            {args.children}
          </NlButtonBase>
          <NlButtonBase variant={variantOf(args)} size={size} icon="only-icon" iconName="add">
            Add
          </NlButtonBase>
        </div>
      ))}
    </div>
  ),
};

/** Leading and trailing icons in every variant. Icons are decorative; the label is the name. */
export const IconPositions: Story = {
  name: 'Icon positions',
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-m">
      {variants.map((variant) => (
        <div key={variant} className="nl:flex nl:items-center nl:gap-m">
          <NlButtonBase size={args.size} variant={variant} icon="leading" iconName="add">
            {args.children}
          </NlButtonBase>
          <NlButtonBase size={args.size} variant={variant} icon="trailing" iconName="chevron_right">
            {args.children}
          </NlButtonBase>
        </div>
      ))}
    </div>
  ),
};

/** Icon-only squares (primary, secondary, tertiary) at every size. The label is visually hidden. */
export const IconOnly: Story = {
  name: 'Icon only',
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-m">
      {(['primary', 'secondary', 'tertiary'] as const).map((variant) => (
        <div key={variant} className="nl:flex nl:items-center nl:gap-m">
          {sizes.map((size) => (
            <NlButtonBase key={size} variant={variant} size={size} icon="only-icon" iconName="more_vert">
              More actions
            </NlButtonBase>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Rendered as a link with `as="a"` and `href`. */
export const AsLink: Story = {
  name: 'As a link',
  args: { as: 'a', href: '#', variant: 'link', children: 'View details' },
};
