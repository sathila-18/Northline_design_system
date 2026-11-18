// NlBadgeBase classes (DESIGN.md §9, NlBadgeBase). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).

/**
 * The tag: a centred row on one line that hugs its content. Padding Space-XS / Space-M, gap Space-XS, Radius-S.
 * No colours: NlBadge passes them through `appearance`. A tone's 1px inside border is an inset ring, so bordered and
 * borderless tones are the same size (designer's choice, 18 Nov 2026).
 */
export const root =
  'nl:inline-flex nl:shrink-0 nl:items-center nl:justify-center nl:gap-xs nl:whitespace-nowrap nl:rounded-s nl:px-m nl:py-xs';

/** Text style per size. Small hugs to 26. Large has a Size-32 minimum height, the reference's 32 (OD-49). */
export const size = {
  small: 'nl:text-label-s',
  large: 'nl:min-h-32 nl:text-label-m',
} as const;

/** NlIcon size per badge size. */
export const iconSize = {
  small: 16,
  large: 20,
} as const;

/** The icon slot: carries the icon colour from `appearance.icon`; the NlIcon inside inherits it. */
export const iconSlot = 'nl:inline-flex nl:shrink-0';
