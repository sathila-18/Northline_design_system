'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';
import { NlCheckboxControl } from '../NlCheckboxControl';
import { NlTextBlock } from '../NlTextBlock';
import * as styles from './NlCheckbox.styles';

export type NlCheckboxSize = keyof typeof styles.size;

/** NlTextBlock type per size: Body L (medium) or Body M (small, OD-237). */
const textType = { medium: 'body', small: 'body-m' } as const;

export interface NlCheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'children' | 'size'> {
  /** The text, also the checkbox's name. */
  children: ReactNode;
  /** Text size. Medium (default): Body L, top-aligned. Small: Body M, centred on the control (OD-237). */
  size?: NlCheckboxSize;
  /** Shows a dash and is announced as "mixed". Clear it in onChange. */
  indeterminate?: boolean;
  /** Hides the text visually; it stays the checkbox's name. */
  hideLabel?: boolean;
}

/**
 * A checkbox with its text, for single options in forms (DESIGN.md §9, NlCheckbox). A <label> row holding
 * NlCheckboxControl and an NlTextBlock (body: Body L, or body-m: Body M when small; text-secondary; text-disabled
 * when disabled), so clicking
 * the text toggles it and the text names it. Native checkbox attributes (`checked` / `defaultChecked`, `name`,
 * `value`, `disabled`, `onChange`) and `ref` go to the input; `className` (placement only) to the row.
 * 'use client' through NlCheckboxControl's indeterminate effect.
 */
export function NlCheckbox({
  children,
  size = 'medium',
  indeterminate,
  hideLabel = false,
  disabled,
  className,
  ...rest
}: NlCheckboxProps) {
  const classes = [styles.root, styles.size[size], className].filter(Boolean).join(' ');

  return (
    <label className={classes} data-size={size} data-disabled={disabled ? true : undefined}>
      <NlCheckboxControl {...rest} disabled={disabled} indeterminate={indeterminate} />
      <span className={hideLabel ? styles.hiddenText : styles.text}>
        <NlTextBlock type={textType[size]} description={children} disabled={disabled} />
      </span>
    </label>
  );
}
