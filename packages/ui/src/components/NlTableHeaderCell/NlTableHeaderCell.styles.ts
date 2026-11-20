// NlTableHeaderCell classes (DESIGN.md §9, NlTableHeaderCell). Whole literal class strings only (CLAUDE.md,
// Tailwind rule 1).
//
// Structure: th → row (select all, title or sort button, filter button).

/** The <th>: Size-40 high, no block padding, start-aligned, vertically centred. */
export const root = 'nl:h-40 nl:py-none nl:text-start nl:align-middle';

/** Inline padding: Space-3XL; narrow (checkbox and row-action columns) Space-XL. */
export const padding = {
  default: 'nl:px-3xl',
  narrow: 'nl:px-xl',
} as const;

/** Fill: plain none, grey bg-tertiary. */
export const appearance = {
  plain: 'nl:bg-transparent',
  grey: 'nl:bg-tertiary',
} as const;

/** The row inside the cell: horizontal, gap Space-L, items centred. */
export const row = 'nl:flex nl:items-center nl:gap-l';

/**
 * Plain native buttons (OD-116): no chrome, just text and icon. At least Size-24 high (pointer target). Standard focus
 * ring around them with Radius-XS, keyboard only.
 */
export const sortButton =
  'nl:group/sort nl:m-none nl:inline-flex nl:min-h-24 nl:cursor-pointer nl:items-center nl:gap-xs nl:rounded-xs nl:border-0 nl:bg-transparent nl:p-none nl:text-start nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused nl:focus:not-focus-visible:outline-none';

/** Sort icon colour: unsorted fg-secondary, sorted fg-action; hover fg-hovered, pressed fg-pressed (following the button). */
export const sortIcon = {
  unsorted:
    'nl:inline-flex nl:text-fg-secondary nl:group-hover/sort:text-fg-hovered nl:group-active/sort:text-fg-pressed',
  sorted: 'nl:inline-flex nl:text-fg-action nl:group-hover/sort:text-fg-hovered nl:group-active/sort:text-fg-pressed',
} as const;

/** The filter button: the 24 icon only. */
export const filterButton =
  'nl:m-none nl:inline-flex nl:size-24 nl:shrink-0 nl:cursor-pointer nl:items-center nl:justify-center nl:rounded-xs nl:border-0 nl:bg-transparent nl:p-none nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused nl:focus:not-focus-visible:outline-none';

/** Filter icon colour: available fg-secondary; open and applied fg-action; hover fg-hovered, pressed fg-pressed. */
export const filterColour = {
  available: 'nl:text-fg-secondary nl:enabled:hover:text-fg-hovered nl:enabled:active:text-fg-pressed',
  active: 'nl:text-fg-action nl:enabled:hover:text-fg-hovered nl:enabled:active:text-fg-pressed',
} as const;

/** A hidden title: still the column's name. */
export const hidden = 'nl:sr-only';
