import type { ComponentPropsWithRef } from 'react';
import * as styles from './NlListCaption.styles';

export type NlListCaptionSize = 'small' | 'medium' | 'large';
export type NlListCaptionWeight = keyof typeof styles.textStyle;

export interface NlListCaptionProps extends Omit<ComponentPropsWithRef<'span'>, 'className'> {
  /** Text size. Default medium. */
  size?: NlListCaptionSize;
  /** Heavy uses Label styles, light Body styles. Default heavy (designer's choice, 19 Nov 2026). */
  weight?: NlListCaptionWeight;
  /** Set by a disabled row: text-disabled (OD-29). */
  disabled?: boolean;
  /** Placement only. */
  className?: string;
}

/**
 * Short trailing text in a list row, such as a date, a count or a points value (DESIGN.md §9, NlListCaption).
 * Internal (§7.2): only NlListItem uses it. Plain text in a <span>, text-tertiary, one line, hugging its text. Don't
 * make it the only place important information appears. Presentational, so no 'use client'.
 */
export function NlListCaption({
  size = 'medium',
  weight = 'heavy',
  disabled = false,
  className,
  children,
  ...rest
}: NlListCaptionProps) {
  const classes = [
    styles.root,
    styles.textStyle[weight][size],
    disabled ? styles.tone.disabled : styles.tone.default,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <span {...rest} className={classes} data-size={size} data-weight={weight} data-disabled={disabled || undefined}>
      {children}
    </span>
  );
}
