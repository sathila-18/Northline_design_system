'use client';

import type { ComponentPropsWithRef, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { NlIcon, type NlIconName } from '../../icons';
import { NlChipBase, type NlChipBaseSize } from '../NlChipBase';
import * as styles from './NlAssistChip.styles';

export type NlAssistChipPopup = 'menu' | 'listbox' | 'dialog';

interface NlAssistChipCommonProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'type' | 'children' | 'aria-haspopup' | 'aria-expanded'
> {
  /** Padding, gap, text style and icon size. Default small. */
  size?: NlChipBaseSize;
  /** The label, also the accessible name. */
  children: ReactNode;
  /** Optional decorative leading icon. */
  leadingIcon?: NlIconName;
}

/** Without `dropdown`, an action chip: no arrow, no open state. With it, the chip opens something and shows it. */
type NlAssistChipDropdownProps =
  | {
      /** The chip opens a menu or picker and shows a dropdown arrow. Without it, an action chip. */
      dropdown?: false;
      popup?: undefined;
      open?: undefined;
      onOpenChange?: undefined;
    }
  | {
      dropdown: true;
      /** What it opens, for `aria-haspopup`. Default menu. */
      popup?: NlAssistChipPopup;
      /** Whether the menu or picker is open. Set by the parent, kept in sync with the menu. */
      open?: boolean;
      /** Asks to open or close: a click asks for the opposite, Down arrow asks to open. Same as NlMenu's. */
      onOpenChange?: (open: boolean) => void;
    };

export type NlAssistChipProps = NlAssistChipCommonProps & NlAssistChipDropdownProps;

/**
 * A chip that runs an action or opens a menu or picker (DESIGN.md §9, NlAssistChip). Built on NlChipBase (look
 * unselected-bordered closed, selected open) with every state passed as `appearance`. A native <button type="button">:
 * Enter or Space activates. With `dropdown`: the arrow, `aria-haspopup`, `aria-expanded`; Down arrow asks to open.
 * Pass `aria-controls` with the menu's id. An `onClick` or `onKeyDown` that calls preventDefault() stops the request.
 * `ref`, `className` and native button attributes go to the button.
 */
export function NlAssistChip({
  dropdown = false,
  popup = 'menu',
  open = false,
  onOpenChange,
  size = 'small',
  leadingIcon,
  onClick,
  onKeyDown,
  ...rest
}: NlAssistChipProps) {
  const isOpen = dropdown && open;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (dropdown && !event.defaultPrevented) onOpenChange?.(!open);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (dropdown && !event.defaultPrevented && event.key === 'ArrowDown' && !open) {
      event.preventDefault();
      onOpenChange?.(true);
    }
  };

  const look = isOpen ? styles.state.open : styles.state.closed;
  const appearance = { ...look, chip: `${styles.interactive} ${look.chip}` };

  return (
    <NlChipBase
      {...rest}
      {...(dropdown ? { 'aria-haspopup': popup, 'aria-expanded': isOpen } : {})}
      as="button"
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      look={isOpen ? 'selected' : 'unselected-bordered'}
      size={size}
      appearance={appearance}
      leading={leadingIcon && <NlIcon name={leadingIcon} size={styles.iconSize[size]} tone="inherit" />}
      trailingIcon={dropdown ? (isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down') : undefined}
      data-open={dropdown ? isOpen : undefined}
    />
  );
}
