import type { ComponentPropsWithRef } from 'react';
import { nlIcons, type NlIconName } from './nlIcons';
import * as styles from './NlIcon.styles';

export type NlIconSize = keyof typeof styles.size;
export type NlIconTone = keyof typeof styles.tone;

export interface NlIconProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** A name in the nlIcons registry. */
  name: NlIconName;
  /** Box and glyph size, from the Size-* tokens. */
  size?: NlIconSize;
  /** Glyph colour. `inherit` uses the parent's colour (currentColor). */
  tone?: NlIconTone;
  /** Filled glyph, for active and selected states. */
  filled?: boolean;
  /** Accessible name. Without it the icon is decorative and hidden from screen readers. */
  label?: string;
}

/**
 * One Material Symbols Rounded glyph from the nlIcons registry at a fixed size and colour (DESIGN.md §9, NlIcon).
 * Not interactive and never focusable. Presentational, so no 'use client'.
 */
export function NlIcon({ name, size = 24, tone = 'inherit', filled = false, label, className, ...rest }: NlIconProps) {
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const };
  const classes = [
    styles.root,
    styles.size[size],
    styles.tone[tone],
    styles.fill[filled ? 'filled' : 'outlined'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      {...rest}
      {...a11y}
      className={classes}
      data-icon={name}
      data-size={size}
      data-tone={tone}
      data-filled={filled}
    >
      {String.fromCodePoint(nlIcons[name])}
    </span>
  );
}
