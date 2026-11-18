import type { Meta, StoryObj } from '@storybook/react-vite';
import { nlIconNames, type NlIconName } from '../../icons';
import type { NlButtonBaseIcon, NlButtonBaseSize } from '../NlButtonBase';
import {
  NlDestructiveButton,
  type NlDestructiveButtonProps,
  type NlDestructiveButtonVariant,
} from './NlDestructiveButton';

const variants = ['primary', 'secondary', 'tertiary'] as const;
const sizes = ['large', 'medium', 'small', 'xsmall'] as const;

/**
 * Flat controls for Storybook. The props are a union (iconName is required with an icon), which Storybook's types
 * can't infer through, so the Default story checks the combination at render time.
 */
interface StoryArgs {
  variant: NlDestructiveButtonVariant;
  size: NlButtonBaseSize;
  icon: NlButtonBaseIcon;
  iconName?: NlIconName;
  children: string;
}

/** Turns the flat controls into valid props: an icon needs a name, so without one it falls back to none. */
const toProps = ({ icon, iconName, ...rest }: StoryArgs): NlDestructiveButtonProps => {
  if (icon === 'none' || !iconName) return { ...rest, icon: 'none' };
  if (icon === 'only-icon') return { ...rest, icon, iconName };
  return { ...rest, icon, iconName };
};

const meta = {
  title: 'Internal/Destructive button',
  args: { variant: 'primary', size: 'medium', icon: 'none', iconName: 'delete', children: 'Delete reward' },
  render: (args) => <NlDestructiveButton {...toProps(args)} />,
  argTypes: {
    variant: { control: 'inline-radio', options: variants },
    size: { control: 'inline-radio', options: sizes },
    icon: { control: 'inline-radio', options: ['none', 'leading', 'trailing', 'only-icon'] },
    iconName: { control: 'select', options: [undefined, ...nlIconNames] },
    children: { control: 'text' },
  },
} satisfies Meta<StoryArgs>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One button with every option as a control. Resting colours only: states come with NlButton. */
export const Default: Story = {};

/** The three variants at rest. Secondary has a 2px inside border. There is no link form. */
export const Variants: Story = {
  render: (args) => (
    <div className="nl:flex nl:items-center nl:gap-m">
      {variants.map((variant) => (
        <NlDestructiveButton key={variant} variant={variant} size={args.size}>
          {args.children}
        </NlDestructiveButton>
      ))}
    </div>
  ),
};

/** The four sizes in each variant, each beside its icon-only square. */
export const Sizes: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-m">
      {sizes.map((size) => (
        <div key={size} className="nl:flex nl:items-center nl:gap-m">
          {variants.map((variant) => (
            <NlDestructiveButton key={variant} variant={variant} size={size}>
              {args.children}
            </NlDestructiveButton>
          ))}
          <NlDestructiveButton variant={args.variant} size={size} icon="only-icon" iconName="delete">
            {args.children}
          </NlDestructiveButton>
        </div>
      ))}
    </div>
  ),
};

/** Leading and trailing icons in every variant. Icons are decorative; the label names what is removed. */
export const IconPositions: Story = {
  name: 'Icon positions',
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-m">
      {variants.map((variant) => (
        <div key={variant} className="nl:flex nl:items-center nl:gap-m">
          <NlDestructiveButton variant={variant} size={args.size} icon="leading" iconName="delete">
            {args.children}
          </NlDestructiveButton>
          <NlDestructiveButton variant={variant} size={args.size} icon="trailing" iconName="close">
            Remove member
          </NlDestructiveButton>
        </div>
      ))}
    </div>
  ),
};
