// NlNavSubItem classes (DESIGN.md §9, NlNavSubItem). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: link (full width, rounded, relative) → tree line parts (optional, decorative) → text.

/**
 * The link: a row, items centred, fills the nav. Padding Space-M block, Space-XL end, Space-6XL start (the text lines
 * up under the section's text). Radius-M. Standard focus ring, keyboard only (OD-30b). Colours ease with Duration
 * fast; none under reduced motion.
 */
export const root =
  'nl:relative nl:flex nl:w-full nl:min-w-0 nl:items-center nl:rounded-m nl:py-m nl:ps-6xl nl:pe-xl nl:no-underline nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused nl:focus:not-focus-visible:outline-none nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';

/**
 * Colours. Default bg-secondary, text-secondary; hover bg-tertiary; pressed bg-neutral (K1: same as hover in Light).
 * Selected (current page) bg-primary, text-action, no hover change.
 */
export const state = {
  default: 'nl:bg-secondary nl:text-secondary nl:hover:bg-tertiary nl:active:bg-neutral',
  current: 'nl:bg-primary nl:text-action',
} as const;

/** The text: Label M, one line, ellipsis when too long. */
export const text = 'nl:min-w-0 nl:truncate nl:text-label-m';

/**
 * The tree line's curve leg (OD-30a): 1px border-default down the start and along the bottom, curving with Radius-S.
 * Position and size from nl:nav-tree-line (tailwind.css, rule 9, approved).
 */
export const treeLine =
  'nl:nav-tree-line nl:pointer-events-none nl:rounded-es-s nl:border-s nl:border-b nl:border-default';

/** A "middle" item's line carries on from the middle to the bottom, to meet the next item's line. */
export const treeContinue = 'nl:nav-tree-continue nl:pointer-events-none nl:border-s nl:border-default';
