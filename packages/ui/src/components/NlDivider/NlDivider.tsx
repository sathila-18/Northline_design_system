import type { ComponentPropsWithoutRef, Ref } from 'react';
import * as styles from './NlDivider.styles';

export type NlDividerType = keyof typeof styles.type;

export interface NlDividerProps extends Omit<ComponentPropsWithoutRef<'hr'>, 'children'> {
  /** divider: a 1px line. section: a thick band between page sections. */
  type?: NlDividerType;
  /** Only visual (between list rows, inside menus): renders a hidden <div> instead of a separator. */
  decorative?: boolean;
  /** The root element: an <hr>, or a <div> when decorative. */
  ref?: Ref<HTMLElement>;
}

/**
 * A horizontal line that separates content (DESIGN.md §9, NlDivider). Horizontal only (OD-5).
 * Renders <hr> (role separator); `decorative` renders <div aria-hidden="true">.
 * Not interactive. Presentational, so no 'use client'.
 */
export function NlDivider({ type = 'divider', decorative = false, className, ref, ...rest }: NlDividerProps) {
  const classes = [styles.root, styles.type[type], className].filter(Boolean).join(' ');

  if (decorative) {
    return <div {...rest} ref={ref as Ref<HTMLDivElement>} aria-hidden="true" className={classes} data-type={type} />;
  }
  return <hr {...rest} ref={ref as Ref<HTMLHRElement>} className={classes} data-type={type} />;
}
