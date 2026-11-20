import type { Meta, StoryObj } from '@storybook/react-vite';
import { nlIconNames, type NlIconName } from '../../icons';
import type { NlButtonBaseIcon, NlButtonBaseSize } from '../NlButtonBase';
import {
  NlButton,
  type NlButtonContentTone,
  type NlButtonProps,
  type NlButtonTone,
  type NlButtonVariant,
} from './NlButton';

const tones = ['normal', 'white', 'destructive'] as const;
const variants = ['primary', 'secondary', 'tertiary', 'link'] as const;
const sizes = ['large', 'medium', 'small', 'xsmall'] as const;
const contentTones = ['default', 'inverse', 'primary', 'secondary', 'info', 'success', 'error', 'warning'] as const;

/**
 * Flat controls for Storybook. The props are a union (tone limits variant, an icon needs a name), which Storybook's
 * types can't infer through, so `toProps` turns any combination into a valid one.
 */
interface StoryArgs {
  tone: NlButtonTone;
  variant: NlButtonVariant;
  contentTone: NlButtonContentTone;
  size: NlButtonBaseSize;
  icon: NlButtonBaseIcon;
  iconName?: NlIconName;
  disabled: boolean;
  children: string;
}

/**
 * Valid props from the controls: white is primary only, destructive has no link, content tones are tertiary only,
 * link has no icon-only, and an icon needs a name.
 */
const toProps = ({ tone, variant, contentTone, icon, iconName, ...rest }: StoryArgs): NlButtonProps => {
  const iconProps =
    icon === 'none' || !iconName || (variant === 'link' && icon === 'only-icon' && tone === 'normal')
      ? { icon: 'none' as const }
      : { icon, iconName };
  if (tone === 'white') return { ...rest, ...iconProps, tone } as NlButtonProps;
  if (tone === 'destructive')
    return { ...rest, ...iconProps, tone, variant: variant === 'link' ? 'primary' : variant } as NlButtonProps;
  if (variant === 'tertiary') return { ...rest, ...iconProps, tone, variant, contentTone } as NlButtonProps;
  return { ...rest, ...iconProps, tone, variant } as NlButtonProps;
};

const meta = {
  title: 'Components/Atoms L1/Button',
  args: {
    tone: 'normal',
    variant: 'primary',
    contentTone: 'default',
    size: 'medium',
    icon: 'none',
    iconName: 'add',
    disabled: false,
    children: 'Save changes',
  },
  render: (args) => <NlButton {...toProps(args)} />,
  argTypes: {
    tone: { control: 'inline-radio', options: tones },
    variant: { control: 'inline-radio', options: variants },
    contentTone: { control: 'select', options: contentTones, if: { arg: 'variant', eq: 'tertiary' } },
    size: { control: 'inline-radio', options: sizes },
    icon: { control: 'inline-radio', options: ['none', 'leading', 'trailing', 'only-icon'] },
    iconName: { control: 'select', options: [undefined, ...nlIconNames] },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
} satisfies Meta<StoryArgs>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One button with every option as a control. Hover, press and tab to it to see the states. */
export const Default: Story = {};

/** The four normal-tone variants, enabled and disabled. */
export const Normal: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-m">
      {[false, true].map((disabled) => (
        <div key={String(disabled)} className="nl:flex nl:items-center nl:gap-m">
          <NlButton size={args.size} variant="primary" disabled={disabled}>
            Save changes
          </NlButton>
          <NlButton size={args.size} variant="secondary" disabled={disabled}>
            Save changes
          </NlButton>
          <NlButton size={args.size} variant="tertiary" disabled={disabled}>
            Save changes
          </NlButton>
          <NlButton size={args.size} variant="link" disabled={disabled}>
            View details
          </NlButton>
        </div>
      ))}
    </div>
  ),
};

/** The destructive variants, enabled and disabled. No link form. */
export const Destructive: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-m">
      {[false, true].map((disabled) => (
        <div key={String(disabled)} className="nl:flex nl:items-center nl:gap-m">
          {(['primary', 'secondary', 'tertiary'] as const).map((variant) => (
            <NlButton key={variant} tone="destructive" variant={variant} size={args.size} disabled={disabled}>
              Delete reward
            </NlButton>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** The white button on a brand-coloured background, enabled and disabled. One look only (OD-54). */
export const White: Story = {
  render: (args) => (
    <div className="nl:inline-flex nl:items-center nl:gap-m nl:rounded-m nl:bg-brand nl:p-xl">
      <NlButton tone="white" size={args.size}>
        Join now
      </NlButton>
      <NlButton tone="white" size={args.size} icon="leading" iconName="add">
        Join now
      </NlButton>
      <NlButton tone="white" size={args.size} disabled>
        Join now
      </NlButton>
    </div>
  ),
};

/** The four sizes, labelled and icon-only. */
export const Sizes: Story = {
  render: (args) => {
    // Labelled, with a leading icon, and icon-only (link has no icon-only).
    const row = (size: NlButtonBaseSize) => [
      toProps({ ...args, size, icon: 'none' }),
      toProps({ ...args, size, icon: 'leading', iconName: 'add' }),
      ...(args.variant === 'link'
        ? []
        : [toProps({ ...args, size, icon: 'only-icon', iconName: 'add', children: 'Add' })]),
    ];
    return (
      <div className="nl:flex nl:flex-col nl:gap-m">
        {sizes.map((size) => (
          <div key={size} className="nl:flex nl:items-center nl:gap-m">
            {row(size).map((props) => (
              <NlButton key={props.icon} {...props} />
            ))}
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Tertiary content tones. Label and icon keep the tone in every state; hover and press share one alpha background
 * (OD-56). Inverse sits on bg-direct, as in the snackbar.
 */
export const ContentTones: Story = {
  name: 'Content tones',
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-m">
      {contentTones
        .filter((tone) => tone !== 'inverse')
        .map((contentTone) => (
          <div key={contentTone} className="nl:flex nl:items-center nl:gap-m">
            <NlButton variant="tertiary" contentTone={contentTone} size={args.size} icon="leading" iconName="info">
              Learn more
            </NlButton>
            <NlButton variant="tertiary" contentTone={contentTone} size={args.size} icon="only-icon" iconName="close">
              Close
            </NlButton>
            <NlButton variant="tertiary" contentTone={contentTone} size={args.size} disabled>
              Learn more
            </NlButton>
          </div>
        ))}
      <div className="nl:inline-flex nl:items-center nl:gap-m nl:self-start nl:rounded-m nl:bg-direct nl:p-m">
        <NlButton variant="tertiary" contentTone="inverse" size={args.size}>
          Undo
        </NlButton>
        <NlButton variant="tertiary" contentTone="inverse" size={args.size} icon="only-icon" iconName="close">
          Close
        </NlButton>
        <NlButton variant="tertiary" contentTone="inverse" size={args.size} disabled>
          Undo
        </NlButton>
      </div>
    </div>
  ),
};

/**
 * Link content tones: label and icon keep the tone, no background, underline on hover and press. `flush` drops the
 * side padding so the label lines up with the text above it (used by NlBanner).
 */
export const LinkContentTones: Story = {
  name: 'Link content tones',
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-m">
      {contentTones
        .filter((tone) => tone !== 'inverse')
        .map((contentTone) => (
          <div key={contentTone} className="nl:flex nl:items-center nl:gap-m">
            <NlButton variant="link" contentTone={contentTone} size={args.size}>
              View details
            </NlButton>
            <NlButton variant="link" contentTone={contentTone} size={args.size} flush>
              Flush
            </NlButton>
          </div>
        ))}
    </div>
  ),
};

/** `aria-expanded="true"` (a button that opened a menu) uses the pressed look (OD-57). */
export const Expanded: Story = {
  render: (args) => (
    <div className="nl:flex nl:items-center nl:gap-m">
      {(['primary', 'secondary', 'tertiary', 'link'] as const).map((variant) => (
        <NlButton
          key={variant}
          {...toProps({
            ...args,
            tone: 'normal',
            variant,
            icon: 'trailing',
            iconName: 'keyboard_arrow_down',
            children: 'Filters',
          })}
          aria-expanded="true"
        />
      ))}
    </div>
  ),
};

/** Rendered as a link with `as="a"` and `href`. Disabled, it loses `href` and gets `aria-disabled`. */
export const AsLink: Story = {
  name: 'As a link',
  render: () => (
    <div className="nl:flex nl:items-center nl:gap-m">
      <NlButton as="a" href="#" variant="link">
        View details
      </NlButton>
      <NlButton as="a" href="#" variant="link" disabled>
        View details
      </NlButton>
      <NlButton as="a" href="#" variant="secondary" icon="trailing" iconName="chevron_right">
        All rewards
      </NlButton>
    </div>
  ),
};
