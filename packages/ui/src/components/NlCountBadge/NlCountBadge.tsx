import type { ComponentPropsWithRef } from 'react';
import * as styles from './NlCountBadge.styles';

export type NlCountBadgeSize = keyof typeof styles.form;
export type NlCountBadgeTone = keyof typeof styles.tone;
export type NlCountBadgeDigits = keyof (typeof styles.form)['small'];

export interface NlCountBadgeProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** The number to show. Without it (or if it isn't a whole number of 0 or more) the badge is a plain dot. 0 renders nothing. */
  count?: number;
  /** Highest number shown. Above it the badge shows `${max}+`. */
  max?: number;
  /** Height, padding and text style. */
  size?: NlCountBadgeSize;
  /** Background colour. */
  tone?: NlCountBadgeTone;
  /** What the badge means, for screen readers, for example "3 unread notifications". */
  label?: string;
}

const isCount = (count: number | undefined): count is number =>
  count !== undefined && Number.isInteger(count) && count >= 0;

/**
 * A small pill that shows a count (1 to 99+), or a plain dot when there is no number (DESIGN.md §9, NlCountBadge).
 * Not interactive and never focusable. Presentational, so no 'use client'.
 */
export function NlCountBadge({
  count,
  max = 99,
  size = 'small',
  tone = 'error',
  label,
  className,
  ...rest
}: NlCountBadgeProps) {
  if (count === 0) return null; // nothing to show (designer's choice, 18 Nov 2026)

  const text = isCount(count) ? (count > max ? `${String(max)}+` : String(count)) : undefined;
  const digits: NlCountBadgeDigits = text === undefined ? 'none' : text.length === 1 ? 'single' : 'double';
  const classes = [styles.root, styles.form[size][digits], styles.tone[tone], className].filter(Boolean).join(' ');
  // Decorative when there is nothing to read. With a label, the label is read instead of the digits.
  const hidden = label === undefined && text === undefined;

  return (
    <span
      {...rest}
      aria-hidden={hidden || undefined}
      className={classes}
      data-size={size}
      data-tone={tone}
      data-digits={digits}
    >
      {text !== undefined && <span aria-hidden={label !== undefined || undefined}>{text}</span>}
      {label !== undefined && <span className={styles.label}>{label}</span>}
    </span>
  );
}
