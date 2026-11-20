import type { ComponentPropsWithRef } from 'react';
import * as styles from './NlRadio.styles';

/**
 * Native radio attributes (`checked` / `defaultChecked`, `name`, `value`, `disabled`, `onChange` …) and `ref` go to
 * the input. It needs a name: `aria-label`, `aria-labelledby`, or a wrapping `<label>` from the caller. The type can't
 * require it, because a wrapping label is valid.
 */
export interface NlRadioProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'children'> {
  /** Inside a list row (NlListItemBase `controlRow`): the row draws the focus ring and its hover shows here. */
  inRow?: boolean;
}

/**
 * The bare radio control: a ring with a dot when selected (DESIGN.md §9, NlRadio). No label of its own (D13).
 * A native <input type="radio"> keeps the semantics, grouping and keyboard; the ring and dot are drawn.
 * `className` goes to the 24 × 24 root, for placement only. No state or handlers of its own, so no 'use client'.
 */
export function NlRadio({ inRow = false, className, ...rest }: NlRadioProps) {
  const classes = [inRow ? styles.rootInRow : styles.root, className].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      <input {...rest} type="radio" className={styles.input} />
      <span aria-hidden="true" className={inRow ? styles.ringInRow : styles.ring} />
      <span aria-hidden="true" className={inRow ? styles.dotInRow : styles.dot} />
    </span>
  );
}
