// NlSegment classes (DESIGN.md §9, NlSegment). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: a <label> root holding a transparent native <input type="radio"> that covers it, and the drawn icon and
// label. Selected comes from the group as a prop, so colours are picked per `selected` in the TSX (rule 2). States:
// hover:, active:, and has-disabled: (the input's disabled state; the root then has no pointer events, so hover and
// press never show). Focus: the standard ring on the root when the input has keyboard focus.

/** The root. Colour changes use Duration fast; none under reduced motion. */
export const root =
  'nl:relative nl:inline-flex nl:shrink-0 nl:cursor-pointer nl:items-center nl:justify-center nl:whitespace-nowrap nl:has-disabled:pointer-events-none nl:has-disabled:cursor-default nl:has-focus-visible:outline-2 nl:has-focus-visible:-outline-offset-1 nl:has-focus-visible:outline-focused nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';

/** The native radio, invisible but interactive, covering the segment. */
export const input =
  'nl:absolute nl:inset-none nl:m-none nl:size-full nl:cursor-pointer nl:appearance-none nl:opacity-0';

/**
 * Height, padding, gap, radius and text style per size, with a label. Radius-XS inside the padded medium and small
 * tracks; xsmall fills an unpadded track, so it matches the track's Radius-S (D19).
 */
export const labelled = {
  medium: 'nl:h-40 nl:py-m nl:px-3xl nl:gap-m nl:rounded-xs nl:text-button-m',
  small: 'nl:h-32 nl:py-xs nl:px-l nl:gap-xs nl:rounded-xs nl:text-button-s',
  xsmall: 'nl:h-24 nl:py-none nl:px-m nl:gap-xs nl:rounded-s nl:text-button-s',
} as const;

/**
 * Icon only: a square from size or padding. Medium Size-36 (Space-M), xsmall Size-24 (Space-XS). Small has no Size-28
 * token, so its 28 comes from Space-XS around the 20 icon (OD-67).
 */
export const iconOnly = {
  medium: 'nl:size-36 nl:p-m nl:rounded-xs',
  small: 'nl:p-xs nl:rounded-xs',
  xsmall: 'nl:size-24 nl:p-xs nl:rounded-s',
} as const;

/** NlIcon size per segment size. */
export const iconSize = {
  medium: 20,
  small: 20,
  xsmall: 16,
} as const;

/**
 * Colours per selected state: `segment` (background and label) and `icon`.
 * Selected: bg-primary, hover bg-secondary, pressed bg-tertiary, disabled bg-disabled; label text-primary (disabled
 * text-disabled-on_bg); icon fg-secondary, filled (disabled fg-disabled-on_bg).
 * Unselected: no background; label text-secondary, hover text-tertiary (OD-68), pressed text-primary, disabled
 * text-disabled; icon fg-secondary (disabled fg-disabled).
 */
export const selected = {
  on: {
    segment:
      'nl:bg-primary nl:text-primary nl:hover:bg-secondary nl:active:bg-tertiary nl:has-disabled:bg-disabled nl:has-disabled:text-disabled-on-bg',
    icon: 'nl:text-fg-secondary nl:group-has-disabled/segment:text-fg-disabled-on-bg',
  },
  off: {
    segment: 'nl:text-secondary nl:hover:text-tertiary nl:active:text-primary nl:has-disabled:text-disabled',
    icon: 'nl:text-fg-secondary nl:group-has-disabled/segment:text-fg-disabled',
  },
} as const;

/** Named group, so the icon slot can follow the input's disabled state. */
export const group = 'nl:group/segment';

/** The icon slot: carries the icon colour; the NlIcon inside inherits it. */
export const iconSlot = 'nl:pointer-events-none nl:inline-flex nl:shrink-0';

/** The label: visible, or visually hidden for icon-only. */
export const label = {
  visible: 'nl:pointer-events-none',
  hidden: 'nl:sr-only',
} as const;
