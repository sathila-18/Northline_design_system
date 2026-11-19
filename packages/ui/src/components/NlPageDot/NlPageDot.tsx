import type { ComponentPropsWithRef } from 'react';
import * as styles from './NlPageDot.styles';

export interface NlPageDotProps extends Omit<ComponentPropsWithRef<'span'>, 'children' | 'className'> {
  /** The current page: a longer pill in fg-brand. */
  current?: boolean;
  /** Placement only. */
  className?: string;
}

/**
 * One dot in a page indicator (DESIGN.md §9, NlPageDot). Internal (§7.2): only NlPageDots uses it, and gives the
 * indicator its accessible text ("Page 2 of 5"), so the dot is decorative (`aria-hidden`) and not interactive (OD-39).
 * The current page is longer as well as coloured, so colour isn't the only signal. Presentational, so no 'use client'.
 */
export function NlPageDot({ current = false, className, ...rest }: NlPageDotProps) {
  const classes = [styles.root, current ? styles.type.current : styles.type.default, className]
    .filter(Boolean)
    .join(' ');
  return <span {...rest} aria-hidden="true" className={classes} data-current={current || undefined} />;
}
