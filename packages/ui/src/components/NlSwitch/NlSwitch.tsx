'use client';

import { useState, type ComponentPropsWithRef, type MouseEvent } from 'react';
import * as styles from './NlSwitch.styles';

export type NlSwitchSize = keyof typeof styles.trackSize;

interface NlSwitchBaseProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'type' | 'role' | 'aria-checked' | 'children' | 'onChange' | 'aria-label' | 'aria-labelledby'
> {
  /** Controlled on (true) or off (false). */
  checked?: boolean;
  /** Starting state when uncontrolled. Default off. */
  defaultChecked?: boolean;
  /** Called with the new state when the switch is toggled. */
  onCheckedChange?: (checked: boolean) => void;
  /** Track and handle size. Default large (OD-13d). */
  size?: NlSwitchSize;
  /** Inside a list row (NlListItemBase `controlRow`): the row draws the focus ring. */
  inRow?: boolean;
}

/** An accessible name is required: either aria-label, or the id of a visible label. */
export type NlSwitchProps = NlSwitchBaseProps &
  (
    | {
        /** The switch's accessible name. Use it, or `aria-labelledby`. */
        'aria-label': string;
        /** The id of visible text that names the switch. */
        'aria-labelledby'?: never;
      }
    | { 'aria-label'?: never; 'aria-labelledby': string }
  );

/**
 * The bare on/off switch: a track with a sliding handle (DESIGN.md §9, NlSwitch). No label of its own (D13).
 * A native <button role="switch" aria-checked>: Tab focuses, Space or Enter toggles. Controlled (`checked`) or
 * uncontrolled (`defaultChecked`). `ref`, `className` and native button attributes go to the button.
 * An `onClick` that calls preventDefault() stops the toggle.
 */
export function NlSwitch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  size = 'large',
  inRow = false,
  onClick,
  className,
  ...rest
}: NlSwitchProps) {
  const [inner, setInner] = useState(defaultChecked);
  const controlled = checked !== undefined;
  const on = controlled ? checked : inner;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (!controlled) setInner(!on);
    onCheckedChange?.(!on);
  };

  const classes = [inRow ? styles.trackInRow : styles.track, styles.trackSize[size], className]
    .filter(Boolean)
    .join(' ');
  const handleClasses = [styles.handle, styles.handleSize[size]].join(' ');

  return (
    <button
      {...rest}
      type="button"
      role="switch"
      aria-checked={on}
      onClick={handleClick}
      className={classes}
      data-size={size}
      data-state={on ? 'on' : 'off'}
    >
      <span aria-hidden="true" className={handleClasses} />
    </button>
  );
}
