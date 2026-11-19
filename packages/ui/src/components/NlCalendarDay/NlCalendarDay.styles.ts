// NlCalendarDay classes (DESIGN.md §9, NlCalendarDay). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: cell (role="gridcell", draws the range band) → day (button, the number). The day is never natively
// disabled (a disabled day stays reachable by the calendar's arrow keys), so the disabled type simply has no state
// classes, and the others use enabled: like any button.

/** The cell: Size-40 square, no padding. */
export const cell = 'nl:size-40 nl:p-none';

/** The range band per type: bg-active, Radius-S on the start corners (range-start) or end corners (range-end). */
export const band = {
  none: '',
  start: 'nl:bg-active nl:rounded-s-s',
  middle: 'nl:bg-active',
  end: 'nl:bg-active nl:rounded-e-s',
} as const;

/**
 * The day: Size-40 square, Radius-S, number centred in Body M. Standard focus ring, keyboard only (OD-28). Colour
 * changes use Duration fast; none under reduced motion.
 */
export const day =
  'nl:flex nl:size-40 nl:cursor-pointer nl:items-center nl:justify-center nl:rounded-s nl:p-none nl:text-body-m nl:aria-disabled:cursor-default nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused nl:focus:not-focus-visible:outline-none nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';

/** Fill, number colour and states per type. */
export const type = {
  default: 'nl:text-primary nl:enabled:hover:bg-secondary nl:enabled:active:bg-tertiary',
  outside: 'nl:text-tertiary nl:enabled:hover:bg-secondary nl:enabled:active:bg-tertiary',
  selected:
    'nl:bg-action-primary nl:text-white-both nl:enabled:hover:bg-action-primary-hovered nl:enabled:active:bg-action-primary-pressed',
  'range-start':
    'nl:bg-action-primary nl:text-white-both nl:enabled:hover:bg-action-primary-hovered nl:enabled:active:bg-action-primary-pressed',
  'range-middle': 'nl:text-primary nl:enabled:hover:bg-active-hover nl:enabled:active:bg-active-hover',
  'range-end':
    'nl:bg-action-primary nl:text-white-both nl:enabled:hover:bg-action-primary-hovered nl:enabled:active:bg-action-primary-pressed',
  disabled: 'nl:text-disabled',
} as const;

/**
 * Today: a 1px inside border, border-strong (OD-27). Left off the filled types (selected, range-start, range-end),
 * where the fill is enough; border-disabled on a disabled day (designer's choice, 19 Nov 2026).
 */
export const today = {
  normal: 'nl:inset-ring nl:inset-ring-strong',
  disabled: 'nl:inset-ring nl:inset-ring-disabled',
} as const;
