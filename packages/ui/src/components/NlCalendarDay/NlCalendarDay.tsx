'use client';

import type { ComponentPropsWithRef } from 'react';
import * as styles from './NlCalendarDay.styles';

export type NlCalendarDayType = keyof typeof styles.type;

export interface NlCalendarDayProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'type' | 'children' | 'onSelect' | 'disabled' | 'className'
> {
  /** The visible day number. */
  day: number;
  /** The full date, ISO (YYYY-MM-DD). Passed back in `onSelect`. */
  date: string;
  /** The accessible name: the full date as NlCalendar formats it, for example "Monday 3 March". */
  label: string;
  /** Default `default`. A one-day range is `selected`. */
  type?: NlCalendarDayType;
  /** Today: `aria-current="date"` and a border, combined with any type (OD-27). */
  today?: boolean;
  /** Called with `date` on click, Enter or Space. Never for a disabled day. */
  onSelect?: (date: string) => void;
}

/** Types that fill the day: today's border is left off them. */
const filled = new Set<NlCalendarDayType>(['selected', 'range-start', 'range-end']);
/** Types announced as selected (on the cell). */
const selectedTypes = new Set<NlCalendarDayType>(['selected', 'range-start', 'range-middle', 'range-end']);
/** The band per type. */
const bandFor = {
  'range-start': styles.band.start,
  'range-middle': styles.band.middle,
  'range-end': styles.band.end,
} as Partial<Record<NlCalendarDayType, string>>;

/**
 * One day in the calendar grid (DESIGN.md §9, NlCalendarDay). Internal (§7.2): only NlCalendar uses it, and owns the
 * grid, the roving tab index and arrow keys; `tabIndex`, `ref` and key handlers go to the button for that. The cell is
 * a `gridcell` (with `aria-selected` for selected and range days) that draws the range band; the day is a native
 * button named by `label`. Disabled days use `aria-disabled` (not `disabled`), so they stay reachable but never
 * select. 'use client' for the click handler.
 */
export function NlCalendarDay({
  day,
  date,
  label,
  type = 'default',
  today = false,
  onSelect,
  onClick,
  ...rest
}: NlCalendarDayProps) {
  const disabled = type === 'disabled';
  const todayRing = today && !filled.has(type) ? (disabled ? styles.today.disabled : styles.today.normal) : '';
  const cellClasses = [styles.cell, bandFor[type] ?? styles.band.none].filter(Boolean).join(' ');
  const dayClasses = [styles.day, styles.type[type], todayRing].filter(Boolean).join(' ');

  return (
    <div
      role="gridcell"
      aria-selected={selectedTypes.has(type) || undefined}
      className={cellClasses}
      data-type={type}
      data-today={today || undefined}
    >
      <button
        {...rest}
        type="button"
        aria-label={label}
        aria-current={today ? 'date' : undefined}
        aria-disabled={disabled || undefined}
        className={dayClasses}
        onClick={(event) => {
          onClick?.(event);
          if (!disabled && !event.defaultPrevented) onSelect?.(date);
        }}
      >
        {day}
      </button>
    </div>
  );
}
