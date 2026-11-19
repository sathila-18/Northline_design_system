import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';
import { NlIcon, type NlIconName } from '../../icons';
import * as styles from './NlChipBase.styles';

export type NlChipBaseLook = keyof typeof styles.look;
export type NlChipBaseSize = keyof typeof styles.size;

/** Whole class strings from the mapped chip's styles file. Replaces the look's resting colours. */
export interface NlChipBaseAppearance {
  /** Background, inset ring (border), shadow and label colour, with any state classes. */
  chip: string;
  /** Leading slot colour, with any state classes (follow the root through the `chip` group). */
  leading: string;
  /** Trailing slot colour, with any state classes. */
  trailing: string;
}

// Button props, as NlButtonBase: the filter and assist chips render buttons (type, disabled); a span ignores them.
interface NlChipBaseCommonProps extends Omit<ComponentPropsWithRef<'button'>, 'children'> {
  /** Resting look. */
  look?: NlChipBaseLook;
  /** Padding, gap, text style and icon size. */
  size?: NlChipBaseSize;
  /** The label. */
  children: ReactNode;
  /** Optional leading item, usually an NlIcon (sized by the caller; it inherits the slot colour). */
  leading?: ReactNode;
  /** Colours set by the mapped chip. Without it, the look's resting colours. */
  appearance?: NlChipBaseAppearance;
  /** The element to render: a span (default), or a button or other element from the mapped chip. */
  as?: ElementType;
}

/**
 * The trailing end: a decorative registry icon, or a slot for something interactive (NlInputChip's remove button).
 * One or the other.
 */
type NlChipBaseTrailingProps =
  { trailingIcon?: NlIconName; trailing?: undefined } | { trailingIcon?: undefined; trailing?: ReactNode };

export type NlChipBaseProps = NlChipBaseCommonProps & NlChipBaseTrailingProps;

/**
 * The shared shape of every chip (DESIGN.md §9, NlChipBase). Internal (§7.2): anatomy, sizes and resting colours.
 * NlFilterChip, NlAssistChip and NlInputChip map onto it and add states, element and role. Presentational, so no
 * 'use client'.
 */
export function NlChipBase({
  look = 'unselected',
  size = 'small',
  children,
  leading,
  trailingIcon,
  trailing,
  appearance,
  as,
  className,
  ...rest
}: NlChipBaseProps) {
  const Element: ElementType = as ?? 'span';
  const colours = appearance ?? styles.look[look];
  const classes = [styles.root, styles.size[size], colours.chip, className].filter(Boolean).join(' ');
  const trailingContent =
    trailing ?? (trailingIcon && <NlIcon name={trailingIcon} size={styles.iconSize[size]} tone="inherit" />);

  return (
    <Element {...rest} className={classes} data-look={look} data-size={size}>
      {leading !== undefined && leading !== null && (
        <span className={`${styles.slot} ${colours.leading}`} data-slot="leading">
          {leading}
        </span>
      )}
      <span data-slot="label">{children}</span>
      {trailingContent && (
        <span className={`${styles.slot} ${colours.trailing}`} data-slot="trailing">
          {trailingContent}
        </span>
      )}
    </Element>
  );
}
