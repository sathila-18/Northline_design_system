'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentPropsWithRef,
  type KeyboardEvent,
} from 'react';
import { NlButton } from '../NlButton';
import { NlCalendarDay, type NlCalendarDayType } from '../NlCalendarDay';
import { NlLabel } from '../NlLabel';
import * as styles from './NlCalendar.styles';
import {
  addDays,
  addMonths,
  dateLabel,
  dayOf,
  defaultNames,
  firstOfMonth,
  lastOfMonth,
  localISO,
  monthGrid,
  monthLabel,
  monthOf,
  sameDayIn,
  startOfWeek,
  type NlCalendarNames,
} from './dates';

export type { NlCalendarNames } from './dates';

/** A date range. `end` is null while the end is being chosen. */
export interface NlCalendarRange {
  start: string | null;
  end: string | null;
}

interface NlCalendarCommonProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'defaultValue' | 'onChange' | 'className'
> {
  /** The month shown (the first one in a range), 'YYYY-MM'. Controlled. */
  month?: string;
  /** The month shown first when uncontrolled. Default: the value's month, else today's. */
  defaultMonth?: string;
  /** Called when the shown month changes (buttons, Page Up / Down, arrows past the edge). */
  onMonthChange?: (month: string) => void;
  /** Earliest selectable date, ISO. */
  minDate?: string;
  /** Latest selectable date, ISO. */
  maxDate?: string;
  /** Marks more dates unavailable. */
  isDateDisabled?: (date: string) => boolean;
  /** First day of the week, 0 = Sunday. Default 1 (Monday). */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Today, ISO. Without it, today is found after mount, so server and browser render the same. */
  today?: string;
  /** Month and weekday names. Default English. */
  names?: NlCalendarNames;
  /** Placement only. */
  className?: string;
}

export type NlCalendarProps = NlCalendarCommonProps &
  (
    | {
        /** One date (default). */
        mode?: 'single';
        value?: string | null;
        defaultValue?: string | null;
        onValueChange?: (value: string) => void;
      }
    | {
        /** A start and an end date, two months side by side. */
        mode: 'range';
        value?: NlCalendarRange;
        defaultValue?: NlCalendarRange;
        onValueChange?: (value: NlCalendarRange) => void;
      }
  );

const emptyRange: NlCalendarRange = { start: null, end: null };

/** Today never changes the render on its own, so there is nothing to subscribe to. */
const noSubscribe = () => () => undefined;
const readToday = () => localISO(new Date());
const noToday = () => null;

/**
 * A month grid for picking one date or a date range (DESIGN.md §9, NlCalendar). Each month is a `role="grid"`
 * labelled by its title (a polite live region); the whole calendar is one tab stop with roving focus. Arrows move a
 * day or a week, Home and End to the week's ends, Page Up and Page Down a month (with Shift a year), Enter or Space
 * selects. In a range, the first pick sets the start, the second the end (a day before the start restarts it), and
 * hovering or focusing previews the range. Unavailable days stay reachable but don't select. Dates are ISO strings;
 * names come from `names`, never locale formatting. 'use client' for state, refs and effects.
 */
export function NlCalendar(props: NlCalendarProps) {
  const {
    mode = 'single',
    value: valueProp,
    defaultValue,
    onValueChange,
    month: monthProp,
    defaultMonth,
    onMonthChange,
    minDate,
    maxDate,
    isDateDisabled,
    weekStartsOn = 1,
    today: todayProp,
    names = defaultNames,
    className,
    ...rest
  } = props;
  const range = mode === 'range';
  const ownId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  // Today: from the prop, or read in the browser only. The server snapshot is null, so server and hydration output
  // match and the today marker appears once hydrated.
  const foundToday = useSyncExternalStore(noSubscribe, readToday, noToday);
  const today = todayProp ?? foundToday;

  // Value: one date, or a range.
  const [ownValue, setOwnValue] = useState<string | NlCalendarRange | null>(
    defaultValue ?? (range ? emptyRange : null),
  );
  const value = valueProp !== undefined ? valueProp : ownValue;
  const single = range ? null : (value as string | null);
  const span = range ? ((value as NlCalendarRange | null) ?? emptyRange) : emptyRange;
  const anchor = range ? span.start : single;

  // Shown month: controlled, or the default, the value's month, then today's.
  const [ownMonth, setOwnMonth] = useState<string | null>(
    defaultMonth ?? (anchor ? monthOf(anchor) : todayProp ? monthOf(todayProp) : null),
  );
  const month = monthProp ?? ownMonth ?? (today ? monthOf(today) : null);
  const months = month ? (range ? [month, addMonths(month, 1)] : [month]) : [];

  const changeMonth = (next: string) => {
    if (monthProp === undefined) setOwnMonth(next);
    onMonthChange?.(next);
  };

  // Roving focus, and the range preview end (hover or focus while the end is open).
  const [focusDate, setFocusDate] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const moveFocus = useRef(false);

  const visible = (iso: string) => months.includes(monthOf(iso));
  const disabled = (iso: string) =>
    (minDate !== undefined && iso < minDate) ||
    (maxDate !== undefined && iso > maxDate) ||
    (isDateDisabled?.(iso) ?? false);

  // The tab stop: the focused date if shown, else the selection, today, or the first shown day.
  const tabStop = (() => {
    if (!month) return null;
    const candidates = [focusDate, anchor, range ? span.end : null, today];
    return candidates.find((c): c is string => c !== null && visible(c)) ?? firstOfMonth(month);
  })();

  useEffect(() => {
    if (!moveFocus.current || !tabStop) return;
    moveFocus.current = false;
    rootRef.current?.querySelector<HTMLButtonElement>(`button[data-date="${tabStop}"]`)?.focus();
  });

  const goTo = (iso: string) => {
    if (!month) return;
    // Past the shown months: going back, the date's month comes first; going forward, it comes last.
    if (!visible(iso)) {
      changeMonth(iso < firstOfMonth(month) ? monthOf(iso) : addMonths(monthOf(iso), -(months.length - 1)));
    }
    setFocusDate(iso);
    if (range && span.start && !span.end) setPreview(iso);
    moveFocus.current = true;
  };

  const select = (iso: string) => {
    if (disabled(iso)) return;
    setFocusDate(iso);
    if (!range) {
      if (valueProp === undefined) setOwnValue(iso);
      (onValueChange as ((v: string) => void) | undefined)?.(iso);
      if (!visible(iso)) changeMonth(monthOf(iso));
      return;
    }
    const next: NlCalendarRange =
      span.start && !span.end && iso >= span.start ? { start: span.start, end: iso } : { start: iso, end: null };
    setPreview(null);
    if (valueProp === undefined) setOwnValue(next);
    (onValueChange as ((v: NlCalendarRange) => void) | undefined)?.(next);
  };

  const onDayKeyDown = (iso: string) => (event: KeyboardEvent<HTMLButtonElement>) => {
    const moves: Record<string, () => string> = {
      ArrowLeft: () => addDays(iso, -1),
      ArrowRight: () => addDays(iso, 1),
      ArrowUp: () => addDays(iso, -7),
      ArrowDown: () => addDays(iso, 7),
      Home: () => startOfWeek(iso, weekStartsOn),
      End: () => addDays(startOfWeek(iso, weekStartsOn), 6),
      PageUp: () => sameDayIn(iso, addMonths(monthOf(iso), event.shiftKey ? -12 : -1)),
      PageDown: () => sameDayIn(iso, addMonths(monthOf(iso), event.shiftKey ? 12 : 1)),
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    goTo(move());
  };

  // The range drawn: the chosen one, or the preview while the end is open.
  const drawnEnd = span.end ?? (span.start && preview && preview > span.start ? preview : null);

  const dayType = (iso: string, inMonth: boolean): NlCalendarDayType => {
    if (disabled(iso)) return 'disabled';
    if (!range) {
      if (inMonth && iso === single) return 'selected';
      return inMonth ? 'default' : 'outside';
    }
    const { start } = span;
    if (!start) return 'default';
    if (!drawnEnd) return iso === start ? 'selected' : 'default';
    if (start === drawnEnd) return iso === start ? 'selected' : 'default';
    if (iso === start) return 'range-start';
    if (iso === drawnEnd) return span.end ? 'range-end' : 'range-middle';
    if (iso > start && iso < drawnEnd) return 'range-middle';
    return 'default';
  };

  const firstMonth = months[0];
  const lastMonth = months[months.length - 1];
  const prevDisabled = !!firstMonth && minDate !== undefined && lastOfMonth(addMonths(firstMonth, -1)) < minDate;
  const nextDisabled = !!lastMonth && maxDate !== undefined && firstOfMonth(addMonths(lastMonth, 1)) > maxDate;

  const weekdayOrder = Array.from({ length: 7 }, (_, i) => (weekStartsOn + i) % 7);

  return (
    <div
      {...rest}
      ref={rootRef}
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-mode={mode}
      onMouseLeave={() => {
        setPreview(null);
      }}
    >
      {months.map((shown, index) => {
        const titleId = `${ownId}-title-${String(index)}`;
        const showPrev = !range || index === 0;
        const showNext = !range || index === months.length - 1;
        const dates = monthGrid(shown, weekStartsOn);
        return (
          <div key={shown} className={styles.month}>
            <div className={styles.header}>
              {showPrev ? (
                <NlButton
                  variant="tertiary"
                  contentTone="secondary"
                  size="small"
                  icon="only-icon"
                  iconName="chevron_left"
                  disabled={prevDisabled}
                  onClick={() => {
                    changeMonth(addMonths(month ?? shown, -1));
                  }}
                >
                  Previous month
                </NlButton>
              ) : (
                <span className={styles.navSpacer} />
              )}
              <span id={titleId} aria-live="polite" className={styles.title}>
                {monthLabel(shown, names)}
              </span>
              {showNext ? (
                <NlButton
                  variant="tertiary"
                  contentTone="secondary"
                  size="small"
                  icon="only-icon"
                  iconName="chevron_right"
                  disabled={nextDisabled}
                  onClick={() => {
                    changeMonth(addMonths(month ?? shown, 1));
                  }}
                >
                  Next month
                </NlButton>
              ) : (
                <span className={styles.navSpacer} />
              )}
            </div>
            <div role="grid" aria-labelledby={titleId} className={styles.grid}>
              <div role="row" className={styles.weekdayRow}>
                {weekdayOrder.map((day) => (
                  <div key={day} role="columnheader" className={styles.weekdayCell}>
                    <NlLabel size="small" tone="secondary" aria-hidden="true">
                      {names.weekdaysShort[day] ?? ''}
                    </NlLabel>
                    <span className={styles.srOnly}>{names.weekdays[day]}</span>
                  </div>
                ))}
              </div>
              {Array.from({ length: 6 }, (_, week) => (
                <div key={week} role="row" className={styles.weekRow}>
                  {dates.slice(week * 7, week * 7 + 7).map((iso) => {
                    const inMonth = monthOf(iso) === shown;
                    if (range && !inMonth) return <div key={iso} role="gridcell" className={styles.emptyCell} />;
                    const type = dayType(iso, inMonth);
                    return (
                      <NlCalendarDay
                        key={iso}
                        day={dayOf(iso)}
                        date={iso}
                        label={type === 'disabled' ? `${dateLabel(iso, names)}, unavailable` : dateLabel(iso, names)}
                        type={type}
                        today={iso === today}
                        tabIndex={iso === tabStop ? 0 : -1}
                        data-date={iso}
                        onSelect={select}
                        onKeyDown={onDayKeyDown(iso)}
                        onFocus={() => {
                          setFocusDate(iso);
                          if (range && span.start && !span.end) setPreview(iso);
                        }}
                        onMouseEnter={() => {
                          if (range && span.start && !span.end) setPreview(iso);
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
