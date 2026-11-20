import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';
import { NlIcon, type NlIconName } from '../../icons';
import * as styles from './NlButtonBase.styles';

export type NlButtonBaseVariant = keyof typeof styles.variant;
export type NlButtonBaseSize = keyof typeof styles.size;
export type NlButtonBaseIcon = 'none' | 'leading' | 'trailing' | 'only-icon';

/** Whole class strings from the mapped component's styles file. Replaces the variant's resting colours. */
export interface NlButtonBaseAppearance {
  /** Background, inset ring (border) and label colour, with any state classes. */
  button: string;
  /** Icon colour, with any state classes (follow the root through the `button` group). */
  icon: string;
  /** Label decoration, with any state classes (for example the link underline, label only, never under the icon). */
  label?: string;
}

interface NlButtonBaseCommonProps extends Omit<ComponentPropsWithRef<'button'>, 'children'> {
  /** Height, padding, radius, text style and icon size. */
  size?: NlButtonBaseSize;
  /** The label. Always required: for icon-only it is the accessible name, visually hidden. */
  children: ReactNode;
  /** Colours set by the mapped component (NlButton). Without it, the variant's resting colours. */
  appearance?: NlButtonBaseAppearance;
  /** The element to render: a native button (default), 'a', or a component such as a router link. */
  as?: ElementType;
  /** Link target, when `as` renders a link. */
  href?: string;
  /** Link variant only: no side padding, so the label lines up with the text around it. */
  flush?: boolean;
}

type NlButtonBaseIconProps =
  | { variant?: NlButtonBaseVariant; icon?: 'none'; iconName?: undefined }
  | { variant?: NlButtonBaseVariant; icon: 'leading' | 'trailing'; iconName: NlIconName }
  | { variant?: Exclude<NlButtonBaseVariant, 'link'>; icon: 'only-icon'; iconName: NlIconName };

export type NlButtonBaseProps = NlButtonBaseCommonProps & NlButtonBaseIconProps;

/**
 * The base for normal-tone buttons: primary, secondary, tertiary and link (DESIGN.md §9, NlButtonBase, D12).
 * Internal (§7.2): shared anatomy, sizes, icon options and resting colours. No colour states of its own.
 * Presentational, so no 'use client'.
 */
export function NlButtonBase({
  variant = 'primary',
  size = 'medium',
  icon = 'none',
  iconName,
  children,
  appearance,
  as,
  flush = false,
  className,
  ...rest
}: NlButtonBaseProps) {
  const Element: ElementType = as ?? 'button';
  const colours = appearance ?? styles.variant[variant];
  const onlyIcon = icon === 'only-icon';
  const classes = [
    styles.root,
    onlyIcon ? styles.iconOnly[size] : flush && variant === 'link' ? styles.labelledFlush[size] : styles.labelled[size],
    styles.size[size],
    colours.button,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const iconSlot = [styles.iconSlot, colours.icon].filter(Boolean).join(' ');

  const glyph = (slot: 'leading' | 'trailing' | 'only') =>
    iconName && (
      <span className={iconSlot} data-slot={slot}>
        <NlIcon name={iconName} size={styles.iconSize[size]} tone="inherit" />
      </span>
    );

  return (
    <Element
      {...(Element === 'button' ? { type: 'button' } : {})}
      {...rest}
      className={classes}
      data-variant={variant}
      data-size={size}
      data-icon={icon}
    >
      {icon === 'leading' && glyph('leading')}
      {onlyIcon ? (
        <>
          {glyph('only')}
          <span className={styles.hiddenLabel}>{children}</span>
        </>
      ) : (
        <span className={'label' in colours ? colours.label : undefined} data-slot="label">
          {children}
        </span>
      )}
      {icon === 'trailing' && glyph('trailing')}
    </Element>
  );
}
