'use client';

import { useId, type ComponentPropsWithRef, type KeyboardEvent, type ReactNode } from 'react';
import { NlIcon } from '../../icons';
import { NlChipBase, type NlChipBaseSize } from '../NlChipBase';
import * as styles from './NlInputChip.styles';

export interface NlInputChipProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** Padding, gap, text style and icon size. Default small. */
  size?: NlChipBaseSize;
  /** Greys the chip out and leaves out the remove button. */
  disabled?: boolean;
  /** The chosen value. */
  children: ReactNode;
  /** Optional leading item, usually an NlIcon (sized by the caller; it inherits fg-secondary). Off by default. */
  leading?: ReactNode;
  /** Shows the remove button (default). false: a chip with no remove button (NlMultiSelect's "+N" chip, OD-136). */
  removable?: boolean;
  /** Called when the remove button is activated (click, Enter, Space) or gets Backspace or Delete. */
  onRemove?: () => void;
  /** The remove button's name. Default: "Remove" followed by the chip's label, for example "Remove Tier 2". */
  removeLabel?: string;
}

/**
 * A chosen value shown as a chip, with a remove button (DESIGN.md §9, NlInputChip). Used in NlMultiSelect. Built on
 * NlChipBase (look unselected-bordered) with the colours passed as `appearance` and the remove button in the
 * `trailing` slot. The chip is a non-interactive span; only the remove button is focusable. Moving focus after a
 * removal is the caller's job (NlMultiSelect). `ref`, `className` and native attributes go to the chip.
 */
export function NlInputChip({
  size = 'small',
  disabled = false,
  children,
  leading,
  onRemove,
  removeLabel,
  removable = true,
  ...rest
}: NlInputChipProps) {
  const labelId = useId();
  const removeWordId = useId();

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      onRemove?.();
    }
  };

  const removeButton =
    disabled || !removable ? undefined : (
      <button
        type="button"
        className={`${styles.remove} ${styles.removeMargin[size]}`}
        onClick={onRemove}
        onKeyDown={handleKeyDown}
        {...(removeLabel === undefined
          ? { 'aria-labelledby': `${removeWordId} ${labelId}` }
          : { 'aria-label': removeLabel })}
        data-slot="remove"
      >
        {removeLabel === undefined && (
          <span id={removeWordId} className={styles.hidden}>
            Remove
          </span>
        )}
        <NlIcon name="close" size={styles.iconSize[size]} tone="inherit" />
      </button>
    );

  return (
    <NlChipBase
      // The chip is a span; NlChipBase's types are button props (for the other chips), so the span props are widened.
      {...(rest as Omit<ComponentPropsWithRef<'button'>, 'children'>)}
      look="unselected-bordered"
      size={size}
      appearance={disabled ? styles.state.disabled : styles.state.enabled}
      leading={leading}
      trailing={removeButton}
      data-disabled={disabled || undefined}
    >
      <span id={labelId}>{children}</span>
    </NlChipBase>
  );
}
