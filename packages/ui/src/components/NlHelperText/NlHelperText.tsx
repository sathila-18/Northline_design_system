import type { ComponentPropsWithRef, ReactNode } from 'react';
import { NlIcon, type NlIconName } from '../../icons';
import * as styles from './NlHelperText.styles';

export type NlHelperTextTone = keyof typeof styles.tone;

/** Glyph per tone. Error uses `error` so it differs from warning in shape too (OD-69). */
const glyph: Record<NlHelperTextTone, NlIconName> = {
  default: 'info',
  success: 'check_circle',
  warning: 'warning',
  error: 'error',
  disabled: 'info',
};

export interface NlHelperTextProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** Hint (default), success, warning, error or disabled. */
  tone?: NlHelperTextTone;
  /** Show the leading icon. Default on. */
  showIcon?: boolean;
  /** The message. */
  children: ReactNode;
}

/**
 * A short line under a form field: a hint, or a success, warning or error message (DESIGN.md §9, NlHelperText).
 * Give it an `id` and point the field at it with `aria-describedby`. Not a live region: the field announces errors
 * (NlInputBase). The icon is decorative. Presentational, so no 'use client'.
 */
export function NlHelperText({ tone = 'default', showIcon = true, children, className, ...rest }: NlHelperTextProps) {
  const colours = styles.tone[tone];
  const classes = [styles.root, colours.text, className].filter(Boolean).join(' ');

  return (
    <div {...rest} className={classes} data-tone={tone}>
      {showIcon && (
        <span className={`${styles.iconSlot} ${colours.icon}`} data-slot="icon">
          <NlIcon name={glyph[tone]} size={20} tone="inherit" />
        </span>
      )}
      <span>{children}</span>
    </div>
  );
}
