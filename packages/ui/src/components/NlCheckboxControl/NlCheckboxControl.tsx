'use client';

import { useCallback, useEffect, useRef, type ChangeEvent, type ComponentPropsWithRef, type Ref } from 'react';
import { NlIcon } from '../../icons';
import * as styles from './NlCheckboxControl.styles';

/**
 * Native checkbox attributes (`checked` / `defaultChecked`, `name`, `value`, `disabled`, `onChange` …) and `ref` go
 * to the input. It needs a name: `aria-label`, `aria-labelledby`, or a wrapping `<label>` from the caller. The type
 * can't require it, because a wrapping label is valid.
 */
export interface NlCheckboxControlProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'children'> {
  /** Shows the dash and is announced as "mixed". Set on the input in code: HTML has no attribute for it. */
  indeterminate?: boolean;
}

/** Sets a caller's ref, callback or object. */
function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

/**
 * The bare checkbox: a rounded square that is empty, ticked or shows a dash (DESIGN.md §9, NlCheckboxControl).
 * Internal: used by NlCheckbox, the checkbox list items and table cells. A native <input type="checkbox"> keeps the
 * semantics and keyboard; the box and icons are drawn and follow the input through CSS, so uncontrolled use shows the
 * right look too. `className` goes to the 24 × 24 root, for placement only. 'use client' for the indeterminate effect.
 */
export function NlCheckboxControl({
  indeterminate = false,
  className,
  ref,
  onChange,
  ...rest
}: NlCheckboxControlProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  // Runs after every render, so the element always matches the prop.
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  });

  // Activating a mixed checkbox clears `indeterminate` on the element. Put the prop back straight away: if the caller
  // keeps it true there may be no re-render, and if the caller clears it, the re-render's effect sets it to false.
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    event.currentTarget.indeterminate = indeterminate;
  };

  const classes = [styles.root, className].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      <input {...rest} ref={setRefs} onChange={handleChange} type="checkbox" className={styles.input} />
      <span aria-hidden="true" className={styles.box}>
        <span className={styles.check} data-slot="check">
          <NlIcon name="check" size={16} tone="inherit" />
        </span>
        <span className={styles.dash} data-slot="dash">
          <NlIcon name="remove" size={16} tone="inherit" />
        </span>
      </span>
    </span>
  );
}
