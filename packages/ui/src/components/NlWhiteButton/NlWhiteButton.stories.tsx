import type { Meta, StoryObj } from '@storybook/react-vite';
import { nlIconNames, type NlIconName } from '../../icons';
import type { NlButtonBaseIcon, NlButtonBaseSize } from '../NlButtonBase';
import { NlWhiteButton, type NlWhiteButtonProps } from './NlWhiteButton';

/**
 * Flat controls for Storybook. NlWhiteButton's props are a union (iconName is required with an icon), which
 * Storybook's types can't infer through, so the Default story checks the combination at render time.
 */
interface StoryArgs {
  size: NlButtonBaseSize;
  icon: NlButtonBaseIcon;
  iconName?: NlIconName;
  children: string;
}

/** Turns the flat controls into valid props: an icon needs a name, so without one it falls back to none. */
const toProps = ({ icon, iconName, ...rest }: StoryArgs): NlWhiteButtonProps => {
  if (icon === 'none' || !iconName) return { ...rest, icon: 'none' };
  if (icon === 'only-icon') return { ...rest, icon, iconName };
  return { ...rest, icon, iconName };
};

const sizes = ['large', 'medium', 'small', 'xsmall'] as const;

const meta = {
  title: 'Internal/White button',
  args: { size: 'medium', icon: 'none', iconName: 'add', children: 'Join now' },
  render: (args) => <NlWhiteButton {...toProps(args)} />,
  argTypes: {
    size: { control: 'inline-radio', options: sizes },
    icon: { control: 'inline-radio', options: ['none', 'leading', 'trailing', 'only-icon'] },
    iconName: { control: 'select', options: [undefined, ...nlIconNames] },
    children: { control: 'text' },
  },
  // The white button sits on brand-coloured backgrounds.
  decorators: [
    (Story) => (
      <div className="nl:inline-flex nl:rounded-m nl:bg-brand nl:p-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<StoryArgs>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One button with every option as a control. Resting colours only: states come with NlButton. */
export const Default: Story = {};

/** The four sizes, each beside its icon-only square. */
export const Sizes: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-m">
      {sizes.map((size) => (
        <div key={size} className="nl:flex nl:items-center nl:gap-m">
          <NlWhiteButton size={size}>{args.children}</NlWhiteButton>
          <NlWhiteButton size={size} icon="leading" iconName="add">
            {args.children}
          </NlWhiteButton>
          <NlWhiteButton size={size} icon="only-icon" iconName="add">
            Add
          </NlWhiteButton>
        </div>
      ))}
    </div>
  ),
};

/** Leading and trailing icons. Icons are decorative; the label is the name. */
export const IconPositions: Story = {
  name: 'Icon positions',
  render: (args) => (
    <div className="nl:flex nl:items-center nl:gap-m">
      <NlWhiteButton size={args.size} icon="leading" iconName="add">
        {args.children}
      </NlWhiteButton>
      <NlWhiteButton size={args.size} icon="trailing" iconName="chevron_right">
        {args.children}
      </NlWhiteButton>
    </div>
  ),
};
