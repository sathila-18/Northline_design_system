import type { ComponentPropsWithRef } from 'react';
import * as styles from './NlRadio.styles';

/**
 * Native radio attributes (`checked` / `defaultChecked`, `name`, `value`, `disabled`, `onChange` …) and `ref` go to
 * the input. It needs a name: `aria-label`, `aria-labelledby`, or a wrapping `<label>` from the caller. The type can't
 * require it, because a wrapping label is valid.
 */
export type NlRadioProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'children'>;

/**
 * The bare radio control: a ring with a dot when selected (DESIGN.md §9, NlRadio). No label of its own (D13).
 * A native <input type="radio"> keeps the semantics, grouping and keyboard; the ring and dot are drawn.
 * `className` goes to the 24 × 24 root, for placement only. No state or handlers of its own, so no 'use client'.
 */
export function NlRadio({ className, ...rest }: NlRadioProps) {
  const classes = [styles.root, className].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      <input {...rest} type="radio" className={styles.input} />
      <span aria-hidden="true" className={styles.ring} />
      <span aria-hidden="true" className={styles.dot} />
    </span>
  );
}
