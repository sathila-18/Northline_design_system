import type { ComponentPropsWithRef } from 'react';
import { NlIcon, type NlIconName } from '../../icons';
import * as styles from './NlIconContainer.styles';

export type NlIconContainerSize = keyof typeof styles.size;
export type NlIconContainerTone = keyof typeof styles.tone;

export interface NlIconContainerProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** A name in the nlIcons registry. */
  icon: NlIconName;
  /** Circle size, from the Size-* tokens. 40 and 48 hold a 24 icon, 64 holds a 36 icon. */
  size?: NlIconContainerSize;
  /** Background tint and icon colour. */
  tone?: NlIconContainerTone;
  /** Accessible name, passed to NlIcon. Without it the icon is decorative and hidden from screen readers. */
  label?: string;
}

/**
 * An icon centred on a round tinted background (DESIGN.md §9, NlIconContainer). Used in empty states, file upload
 * and list rows. Not interactive and never focusable. Presentational, so no 'use client'.
 */
export function NlIconContainer({
  icon,
  size = 48,
  tone = 'primary',
  label,
  className,
  ...rest
}: NlIconContainerProps) {
  const classes = [styles.root, styles.size[size], styles.tone[tone], className].filter(Boolean).join(' ');

  return (
    <span {...rest} className={classes} data-size={size} data-tone={tone}>
      <NlIcon name={icon} size={styles.iconSize[size]} tone="inherit" label={label} />
    </span>
  );
}
