'use client';

import { useState, type ComponentPropsWithRef, type MouseEvent, type ReactNode } from 'react';
import { NlIcon, type NlIconName } from '../../icons';
import { NlChipBase, type NlChipBaseSize } from '../NlChipBase';
import * as styles from './NlFilterChip.styles';

export interface NlFilterChipProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'type' | 'aria-pressed' | 'children' | 'onChange'
> {
  /** Controlled on (true) or off (false). */
  selected?: boolean;
  /** Starting state when uncontrolled. Default off. */
  defaultSelected?: boolean;
  /** Called with the new state when the chip is toggled. */
  onSelectedChange?: (selected: boolean) => void;
  /** Padding, gap, text style and icon size. Default small. */
  size?: NlChipBaseSize;
  /** The label, also the accessible name. */
  children: ReactNode;
  /** Optional decorative leading icon. */
  leadingIcon?: NlIconName;
}

/**
 * An on/off filter, for example above a table (DESIGN.md §9, NlFilterChip). Built on NlChipBase (look unselected off,
 * selected on) with every state passed as `appearance`. A native <button type="button" aria-pressed>: Tab focuses,
 * Space or Enter toggles. Controlled (`selected`) or uncontrolled (`defaultSelected`). `ref`, `className` and native
 * button attributes go to the button. An `onClick` that calls preventDefault() stops the toggle.
 */
export function NlFilterChip({
  selected,
  defaultSelected = false,
  onSelectedChange,
  size = 'small',
  leadingIcon,
  onClick,
  ...rest
}: NlFilterChipProps) {
  const [inner, setInner] = useState(defaultSelected);
  const controlled = selected !== undefined;
  const on = controlled ? selected : inner;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (!controlled) setInner(!on);
    onSelectedChange?.(!on);
  };

  const look = on ? styles.selected.on : styles.selected.off;
  const appearance = { ...look, chip: `${styles.interactive} ${look.chip}` };

  return (
    <NlChipBase
      {...rest}
      as="button"
      type="button"
      aria-pressed={on}
      onClick={handleClick}
      look={on ? 'selected' : 'unselected'}
      size={size}
      appearance={appearance}
      leading={leadingIcon && <NlIcon name={leadingIcon} size={styles.iconSize[size]} tone="inherit" />}
      data-selected={on}
    />
  );
}
