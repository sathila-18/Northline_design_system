// NlBulkActionBar classes (DESIGN.md §9, NlBulkActionBar). Whole literal class strings only (CLAUDE.md, Tailwind
// rule 1).
//
// Structure: root (the pill: clear button, count, actions, more button) + a hidden measuring row.

/**
 * The pill: bg-direct, Radius-M (12), Size-48 high, Space-XS padding, parts Space-M apart, --nl-shadow-menu. Hugs its content, never wider than its container. Slides up and fades in over Duration base; fade only under reduced motion.
 */
export const root =
  'nl:relative nl:flex nl:h-48 nl:w-fit nl:max-w-full nl:items-center nl:gap-m nl:rounded-m nl:bg-direct nl:p-xs nl:shadow-menu nl:animate-bulk-bar-in nl:motion-reduce:animate-bulk-bar-fade';

/** "{n} selected": Label M, text-inverse, one line. */
export const count = 'nl:m-none nl:shrink-0 nl:whitespace-nowrap nl:pe-xs nl:text-label-m nl:text-inverse';

/** The actions: a row, Space-XS apart. */
export const actions = 'nl:flex nl:items-center nl:gap-xs';

/**
 * The measuring row: every action button (and the more button) laid out invisibly at no size, so the bar can work out
 * how many fit. Hidden from everyone (aria-hidden, inert) and from the pointer.
 */
export const measure =
  'nl:pointer-events-none nl:invisible nl:absolute nl:start-none nl:top-none nl:flex nl:h-none nl:w-none nl:gap-xs nl:overflow-hidden';
