import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlIcon, nlIconNames, type NlIconName } from '../../icons';
import { NlChipBase, type NlChipBaseLook, type NlChipBaseSize } from './NlChipBase';

const looks = ['unselected', 'unselected-bordered', 'selected'] as const;
const sizes = ['xsmall', 'small', 'large'] as const;
const leadingSize = { xsmall: 16, small: 16, large: 20 } as const;

/** Flat controls for Storybook: the leading icon is picked by name and drawn at the chip's icon size. */
interface StoryArgs {
  look: NlChipBaseLook;
  size: NlChipBaseSize;
  leadingIcon?: NlIconName;
  trailingIcon?: NlIconName;
  children: string;
}

const meta = {
  title: 'Internal/Chip base',
  args: { look: 'unselected', size: 'small', children: 'Tier 2' },
  render: ({ leadingIcon, ...rest }) => (
    <NlChipBase
      {...rest}
      leading={leadingIcon && <NlIcon name={leadingIcon} size={leadingSize[rest.size]} tone="inherit" />}
    />
  ),
  argTypes: {
    look: { control: 'inline-radio', options: looks },
    size: { control: 'inline-radio', options: sizes },
    leadingIcon: { control: 'select', options: [undefined, ...nlIconNames] },
    trailingIcon: { control: 'select', options: [undefined, ...nlIconNames] },
    children: { control: 'text' },
  },
} satisfies Meta<StoryArgs>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One chip with every option as a control. Resting colours only: states come with the mapped chips. */
export const Default: Story = {};

/** The three looks at rest. Bordered has border-default and the resting shadow. */
export const Looks: Story = {
  render: (args) => (
    <div className="nl:flex nl:items-center nl:gap-m">
      {looks.map((look) => (
        <NlChipBase key={look} look={look} size={args.size}>
          {args.children}
        </NlChipBase>
      ))}
    </div>
  ),
};

/** The three sizes. Height and width hug the content. */
export const Sizes: Story = {
  render: (args) => (
    <div className="nl:flex nl:items-center nl:gap-m">
      {sizes.map((size) => (
        <NlChipBase key={size} look={args.look} size={size}>
          {args.children}
        </NlChipBase>
      ))}
    </div>
  ),
};

/** Leading and trailing icons in every look and size. Selected tints the leading icon fg-brand. */
export const WithIcons: Story = {
  name: 'With icons',
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-m">
      {looks.map((look) => (
        <div key={look} className="nl:flex nl:items-center nl:gap-m">
          {sizes.map((size) => (
            <NlChipBase
              key={size}
              look={look}
              size={size}
              leading={<NlIcon name="calendar_today" size={leadingSize[size]} tone="inherit" />}
              trailingIcon="keyboard_arrow_down"
            >
              This week
            </NlChipBase>
          ))}
        </div>
      ))}
    </div>
  ),
};
