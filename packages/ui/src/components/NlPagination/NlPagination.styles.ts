// NlPagination classes (DESIGN.md §9, NlPagination). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: nav → list (previous, pages, next), horizontal.

/** The nav: hugs its content. */
export const root = 'nl:inline-flex';

/** The list: horizontal, gap Space-M, items centred; no list markers, margin or padding. */
export const list = 'nl:m-none nl:flex nl:list-none nl:items-center nl:gap-m nl:p-none';

/** Each list item keeps its part's size. */
export const item = 'nl:flex';
