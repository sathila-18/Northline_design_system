'use client';

import type { ComponentPropsWithRef, KeyboardEvent, MouseEvent } from 'react';
import { NlIcon } from '../../icons';
import * as styles from './NlRowsPerPage.styles';

export interface NlRowsPerPageProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'type' | 'children' | 'value' | 'aria-haspopup' | 'aria-expanded'
> {
  /** Rows per page now. */
  value: number;
  /** The text before the value. Default "Rows per page". */
  label?: string;
  /** Whether the options menu is open. Set by the parent (NlTable), kept in sync with the menu. */
  open?: boolean;
  /** Asks to open or close: a click asks for the opposite, Down arrow asks to open. Same as NlMenu's. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * The table footer trigger that shows how many rows a page holds (DESIGN.md §9, NlRowsPerPage). The trigger only:
 * NlTable owns the options and renders an NlMenu (kind="select") under it, then passes `value` back. A native
 * <button type="button" aria-haspopup="listbox" aria-expanded>; its name is its visible text ("Rows per page 10").
 * Pass `aria-controls` with the menu's id. An `onClick` or `onKeyDown` that calls preventDefault() stops the request.
 * `ref`, `className` and native button attributes go to the button.
 */
export function NlRowsPerPage({
  value,
  label = 'Rows per page',
  open = false,
  onOpenChange,
  onClick,
  onKeyDown,
  className,
  ...rest
}: NlRowsPerPageProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) onOpenChange?.(!open);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (!event.defaultPrevented && event.key === 'ArrowDown' && !open) {
      event.preventDefault();
      onOpenChange?.(true);
    }
  };

  const classes = [styles.root, open ? styles.open.open : styles.open.closed, className].filter(Boolean).join(' ');

  return (
    <button
      {...rest}
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={classes}
      data-open={open}
    >
      <span className={styles.label}>{label}</span>
      {/* A space, so the name reads "Rows per page 10"; between flex items it takes no room. */}{' '}
      <span className={styles.value}>{value}</span>
      <span className={styles.icon} data-slot="icon">
        <NlIcon name={open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} size={24} tone="inherit" />
      </span>
    </button>
  );
}
