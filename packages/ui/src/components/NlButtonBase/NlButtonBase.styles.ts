// NlButtonBase classes (DESIGN.md §9, NlButtonBase). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).

/**
 * The button: a centred row on one line that hugs its content, gap Space-M. Carries the named group `button`, so the
 * icon slots can follow the states NlButton adds. The focus ring is the standard one, in the base so no button can
 * miss it (designer's choice, 18 Nov 2026). No colour states of its own (§7.2).
 */
export const root =
  'nl:group/button nl:inline-flex nl:shrink-0 nl:cursor-pointer nl:items-center nl:justify-center nl:gap-m nl:whitespace-nowrap nl:no-underline nl:disabled:cursor-default nl:aria-disabled:cursor-default nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused nl:focus:not-focus-visible:outline-none';

/** Height and padding per size for a labelled button. Heights are fixed so labelled and icon-only buttons line up. */
export const labelled = {
  large: 'nl:h-56 nl:px-3xl nl:py-xl',
  medium: 'nl:h-48 nl:px-3xl nl:py-l',
  small: 'nl:h-40 nl:px-xl nl:py-m',
  xsmall: 'nl:h-36 nl:px-xl nl:py-s',
} as const;

/**
 * Flush link (`flush`, link only): the labelled height with no side padding, so the label lines up with the text
 * around it (designer's choice for NlBanner, 20 Nov 2026).
 */
export const labelledFlush = {
  large: 'nl:h-56 nl:px-none nl:py-xl',
  medium: 'nl:h-48 nl:px-none nl:py-l',
  small: 'nl:h-40 nl:px-none nl:py-m',
  xsmall: 'nl:h-36 nl:px-none nl:py-s',
} as const;

/** Icon-only: a square with no padding. Small and xsmall are smaller than their labelled heights, as in the reference. */
export const iconOnly = {
  large: 'nl:size-56 nl:p-none',
  medium: 'nl:size-48 nl:p-none',
  small: 'nl:size-36 nl:p-none',
  xsmall: 'nl:size-32 nl:p-none',
} as const;

/** Radius and text style per size. Radius-S for large and medium, Radius-XS for small and xsmall (D19). */
export const size = {
  large: 'nl:rounded-s nl:text-button-xl',
  medium: 'nl:rounded-s nl:text-button-l',
  small: 'nl:rounded-xs nl:text-button-m',
  xsmall: 'nl:rounded-xs nl:text-button-m',
} as const;

/** NlIcon size per button size. */
export const iconSize = {
  large: 24,
  medium: 24,
  small: 20,
  xsmall: 20,
} as const;

/**
 * Resting colours per variant: `button` (background, 2px inside border as an inset ring, label) and `icon`. NlButton
 * replaces the whole set through `appearance` when it adds states or a content tone.
 */
export const variant = {
  primary: { button: 'nl:bg-action-primary nl:text-white-both', icon: 'nl:text-fg-white-both' },
  secondary: { button: 'nl:inset-ring-2 nl:inset-ring-active nl:text-action', icon: 'nl:text-fg-action' },
  tertiary: { button: 'nl:text-action', icon: 'nl:text-fg-action' },
  link: { button: 'nl:text-action', icon: 'nl:text-fg-action' },
} as const;

/** The icon slot: carries the icon colour; the NlIcon inside inherits it. */
export const iconSlot = 'nl:inline-flex nl:shrink-0';

/** Icon-only: the label stays as the accessible name, visually hidden. */
export const hiddenLabel = 'nl:sr-only';
