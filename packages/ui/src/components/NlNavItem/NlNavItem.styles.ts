// NlNavItem classes (DESIGN.md §9, NlNavItem). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: item (vertical) → row (link or button: icon, label, chevron) → pages list (NlNavSubItem × n).

/** The item: fills the nav, vertical. */
export const root = 'nl:flex nl:w-full nl:flex-col';

/**
 * The row: padding Space-M block, Space-L inline, Radius-S (D19), gap Space-L, items centred, fills the nav. Native link or
 * button with its chrome cleared. Standard focus ring, keyboard only. Colours ease with Duration fast.
 */
export const row =
  'nl:flex nl:w-full nl:min-w-0 nl:cursor-pointer nl:items-center nl:gap-l nl:rounded-s nl:border-0 nl:px-l nl:py-m nl:text-start nl:no-underline nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused nl:focus:not-focus-visible:outline-none nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';

/** Minimized: only the icon, centred. */
export const rowMinimized = 'nl:justify-center';

/**
 * Row colours (OD-130). Default bg-secondary, text-secondary; hover bg-tertiary; pressed bg-neutral (K1: same as hover
 * in Light). Current page: bg-primary, text-action, no hover change. Current section: bg-secondary, text-action, with
 * the hover and pressed fills (it still toggles).
 */
export const state = {
  default: 'nl:bg-secondary nl:text-secondary nl:hover:bg-tertiary nl:active:bg-neutral',
  page: 'nl:bg-primary nl:text-action',
  section: 'nl:bg-secondary nl:text-action nl:hover:bg-tertiary nl:active:bg-neutral',
} as const;

/** The label: Label M, one line, cut with an ellipsis (`title` when cut, OD-191). */
export const label = 'nl:min-w-0 nl:flex-1 nl:truncate nl:text-label-m';

/** Minimized: the label stays as hidden text (the row's name). */
export const hidden = 'nl:sr-only';

/** The chevron: 20, fg-secondary; fg-active when current. */
export const chevron = {
  default: 'nl:inline-flex nl:shrink-0 nl:text-fg-secondary',
  current: 'nl:inline-flex nl:shrink-0 nl:text-fg-active',
} as const;

/** The pages: Space-XS below the row and apart (OD-131); no list markers, margin or padding. */
export const pages = 'nl:m-none nl:mt-xs nl:flex nl:list-none nl:flex-col nl:gap-xs nl:p-none';
