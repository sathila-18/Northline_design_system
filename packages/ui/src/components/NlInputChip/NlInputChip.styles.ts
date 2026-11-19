// NlInputChip classes (DESIGN.md §9, NlInputChip). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
// Anatomy, sizes and the `chip` group come from NlChipBase; this file holds the colours per state, passed to the base
// as `appearance` (it replaces the resting colours, §7.2), and the remove button.

/** Enabled: bordered look with the resting shadow. Disabled: no border or shadow, and no remove button. */
export const state = {
  enabled: {
    chip: 'nl:bg-primary nl:inset-ring nl:inset-ring-default nl:shadow-resting nl:text-primary',
    leading: 'nl:text-fg-secondary',
    trailing: 'nl:text-fg-secondary',
  },
  disabled: {
    chip: 'nl:bg-disabled nl:text-disabled-on-bg',
    leading: 'nl:text-fg-disabled-on-bg',
    trailing: 'nl:text-fg-disabled-on-bg',
  },
} as const;

/**
 * The remove button: a Size-24 hit area centred on the icon, pulled back with a negative margin so the chip keeps its
 * size (Space-XS around the 16 icon, Space-XXS around the 20 icon). The icon inherits fg-secondary from the trailing
 * slot and turns fg-primary on hover and press. Focus: the standard ring around the hit area, Radius-XS (designer's
 * choice, 19 Nov 2026). A plain native button, not NlButton: NlButton's smallest icon-only size (32) would make the
 * chip taller than the spec (designer's choice, 19 Nov 2026).
 */
export const remove =
  'nl:inline-flex nl:size-24 nl:shrink-0 nl:cursor-pointer nl:items-center nl:justify-center nl:rounded-xs nl:hover:text-fg-primary nl:active:text-fg-primary nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused nl:focus:not-focus-visible:outline-none nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';

/** Negative margin per chip size, so the 24 hit area doesn't grow the chip. */
export const removeMargin = {
  xsmall: 'nl:-m-xs',
  small: 'nl:-m-xs',
  large: 'nl:-m-xxs',
} as const;

/** NlIcon size per chip size (as NlChipBase). */
export const iconSize = {
  xsmall: 16,
  small: 16,
  large: 20,
} as const;

/** The hidden word "Remove", read before the label in the button's name. */
export const hidden = 'nl:sr-only';
