import type { ComponentPropsWithRef, ReactNode } from 'react';
import { NlIcon, type NlIconName } from '../../icons';
import * as styles from './NlBadgeBase.styles';

export type NlBadgeBaseSize = keyof typeof styles.size;

/** Whole class strings from the mapped component's styles file, one set per tone. */
export interface NlBadgeBaseAppearance {
  /** Background, inset ring (border) and text colour. */
  badge: string;
  /** Icon colour. */
  icon: string;
}

export interface NlBadgeBaseProps extends ComponentPropsWithRef<'span'> {
  /** Small (Label S, 16 icons) or large (Label M, 20 icons). */
  size?: NlBadgeBaseSize;
  /** The label. */
  children: ReactNode;
  /** Decorative icon before the label. */
  leadingIcon?: NlIconName;
  /** Decorative icon after the label. */
  trailingIcon?: NlIconName;
  /** Colours, set by the mapped component (NlBadge) through a fixed lookup per tone. */
  appearance?: NlBadgeBaseAppearance;
}

/**
 * The shared shape of every badge: a small rounded tag with a label and optional icons (DESIGN.md §9, NlBadgeBase).
 * Internal base (§7.2): no colours or states of its own. Not interactive. Presentational, so no 'use client'.
 */
export function NlBadgeBase({
  size = 'small',
  children,
  leadingIcon,
  trailingIcon,
  appearance,
  className,
  ...rest
}: NlBadgeBaseProps) {
  const classes = [styles.root, styles.size[size], appearance?.badge, className].filter(Boolean).join(' ');
  const iconSlot = [styles.iconSlot, appearance?.icon].filter(Boolean).join(' ');

  const icon = (name: NlIconName, slot: 'leading' | 'trailing') => (
    <span className={iconSlot} data-slot={slot}>
      <NlIcon name={name} size={styles.iconSize[size]} tone="inherit" />
    </span>
  );

  return (
    <span {...rest} className={classes} data-size={size}>
      {leadingIcon && icon(leadingIcon, 'leading')}
      {children}
      {trailingIcon && icon(trailingIcon, 'trailing')}
    </span>
  );
}
