// NlChipBase classes (DESIGN.md §9, NlChipBase). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).

/**
 * The chip: a row on one line that hugs its content, Radius-S. Carries the named group `chip`, so the slots can follow
 * the states a mapped chip adds. No states of its own (§7.2).
 */
export const root =
  'nl:group/chip nl:inline-flex nl:shrink-0 nl:items-center nl:whitespace-nowrap nl:rounded-s nl:no-underline';

/** Padding (block / inline), gap and text style per size. */
export const size = {
  xsmall: 'nl:py-xs nl:px-m nl:gap-xs nl:text-label-s',
  small: 'nl:py-s nl:px-l nl:gap-m nl:text-label-m',
  large: 'nl:py-m nl:px-l nl:gap-m nl:text-label-l',
} as const;

/** NlIcon size per chip size. */
export const iconSize = {
  xsmall: 16,
  small: 16,
  large: 20,
} as const;

/**
 * Resting colours per look: `chip` (background, 1px inside border as an inset ring, shadow, label), `leading` and
 * `trailing` (slot colours; an NlIcon inside inherits them). A mapped chip replaces the whole set through
 * `appearance` when it adds states.
 */
export const look = {
  unselected: {
    chip: 'nl:bg-primary nl:inset-ring nl:inset-ring-subtle nl:text-primary',
    leading: 'nl:text-fg-secondary',
    trailing: 'nl:text-fg-secondary',
  },
  'unselected-bordered': {
    chip: 'nl:bg-primary nl:inset-ring nl:inset-ring-default nl:shadow-resting nl:text-primary',
    leading: 'nl:text-fg-secondary',
    trailing: 'nl:text-fg-secondary',
  },
  selected: {
    chip: 'nl:bg-active nl:inset-ring nl:inset-ring-active nl:text-action',
    leading: 'nl:text-fg-brand',
    trailing: 'nl:text-fg-secondary',
  },
} as const;

/** A slot (leading or trailing): hugs its content, no gap of its own. */
export const slot = 'nl:inline-flex nl:shrink-0 nl:items-center';
