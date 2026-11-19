'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';
import { NlCheckboxControl } from '../NlCheckboxControl';
import { NlTextBlock } from '../NlTextBlock';
import * as styles from './NlCheckbox.styles';

export interface NlCheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'children'> {
  /** The text, also the checkbox's name. */
  children: ReactNode;
  /** Shows a dash and is announced as "mixed". Clear it in onChange. */
  indeterminate?: boolean;
  /** Hides the text visually; it stays the checkbox's name. */
  hideLabel?: boolean;
}

/**
 * A checkbox with its text, for single options in forms (DESIGN.md §9, NlCheckbox). A <label> row holding
 * NlCheckboxControl and an NlTextBlock (type body: Body L, text-secondary; text-disabled when disabled), so clicking
 * the text toggles it and the text names it. Native checkbox attributes (`checked` / `defaultChecked`, `name`,
 * `value`, `disabled`, `onChange`) and `ref` go to the input; `className` (placement only) to the row.
 * 'use client' through NlCheckboxControl's indeterminate effect.
 */
export function NlCheckbox({
  children,
  indeterminate,
  hideLabel = false,
  disabled,
  className,
  ...rest
}: NlCheckboxProps) {
  const classes = [styles.root, className].filter(Boolean).join(' ');

  return (
    <label className={classes} data-disabled={disabled ? true : undefined}>
      <NlCheckboxControl {...rest} disabled={disabled} indeterminate={indeterminate} />
      <span className={hideLabel ? styles.hiddenText : styles.text}>
        <NlTextBlock type="body" description={children} disabled={disabled} />
      </span>
    </label>
  );
}
