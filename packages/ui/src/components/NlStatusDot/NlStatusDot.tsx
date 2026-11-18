import type { ComponentPropsWithRef } from 'react';
import * as styles from './NlStatusDot.styles';

export type NlStatusDotSize = keyof typeof styles.size;

export interface NlStatusDotProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** Diameter, from the Size-* tokens. */
  size?: NlStatusDotSize;
  /** Accessible name, for example "Online". Without it the dot is decorative and hidden from screen readers. */
  label?: string;
}

/**
 * A small round dot that shows presence (online) (DESIGN.md §9, NlStatusDot). Used on NlAvatar.
 * Colour alone never carries meaning: pair it with text nearby or give it a label.
 * Not interactive and never focusable. Presentational, so no 'use client'.
 */
export function NlStatusDot({ size = 'medium', label, className, ...rest }: NlStatusDotProps) {
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const };
  const classes = [styles.root, styles.size[size], className].filter(Boolean).join(' ');

  return <span {...rest} {...a11y} className={classes} data-size={size} />;
}
