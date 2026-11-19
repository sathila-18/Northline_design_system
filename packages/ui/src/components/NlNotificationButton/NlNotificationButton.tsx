import type { ComponentPropsWithRef } from 'react';
import { NlIcon } from '../../icons';
import { NlCountBadge } from '../NlCountBadge';
import * as styles from './NlNotificationButton.styles';

export interface NlNotificationButtonProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'type' | 'children' | 'aria-label'
> {
  /** Unread notifications. None, or 0, shows no badge. Over 99 shows "99+". */
  count?: number;
  /** Show the number. Off shows a dot instead. Default on. */
  showCount?: boolean;
  /** The button's name before the count. Default "Notifications". */
  label?: string;
}

/**
 * The bell button in the page header (DESIGN.md §9, NlNotificationButton). Its own native button (OD-40): a 40
 * circle with the `notifications` icon, and an NlCountBadge (error) as a dot or a number. The badge is decorative;
 * the button's name carries the count ("Notifications, 3 unread", or "Notifications, new" for the dot). Disabled
 * shows no badge. `aria-expanded` (passed through) uses the pressed look. Presentational, so no 'use client'.
 */
export function NlNotificationButton({
  count = 0,
  showCount = true,
  label = 'Notifications',
  disabled,
  className,
  ...rest
}: NlNotificationButtonProps) {
  const unread = Number.isInteger(count) && count > 0 && !disabled;
  // The name uses what the badge shows ("99+" over 99), so the visible text is part of it (WCAG 2.5.3).
  const shown = count > 99 ? '99+' : String(count);
  const name = !unread ? label : showCount ? `${label}, ${shown} unread` : `${label}, new`;
  const classes = [styles.root, className].filter(Boolean).join(' ');

  return (
    <button {...rest} type="button" disabled={disabled} aria-label={name} className={classes}>
      <span className={styles.icon} data-slot="icon">
        <NlIcon name="notifications" size={20} tone="inherit" />
      </span>
      {unread && (
        // Decorative: the button's name carries the count. The wrapper holds the placement and hides the badge.
        <span aria-hidden="true" className={showCount ? styles.badge.number : styles.badge.dot} data-slot="badge">
          <NlCountBadge size="small" tone="error" count={showCount ? count : undefined} />
        </span>
      )}
    </button>
  );
}
