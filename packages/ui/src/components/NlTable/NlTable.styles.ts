// NlTable classes (DESIGN.md §9, NlTable). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: root (vertical) → toolbar (search · filters, action) → frame (scrolls sideways) → <table> (caption,
// colgroup, thead, tbody) → footer (summary · rows per page, pagination); a hidden live region.

/** The root: toolbar, table and footer, Space-XL apart; fills its container. */
export const root = 'nl:flex nl:w-full nl:min-w-0 nl:flex-col nl:gap-xl';

/** Toolbar: a row, the search filling the free space, then the filters and the action, Space-L apart. */
export const toolbar = 'nl:flex nl:w-full nl:items-center nl:gap-l';

/** The search takes the free space. */
export const toolbarSearch = 'nl:min-w-0 nl:flex-1';

/** Filters and the action, at the end, Space-L apart. */
export const toolbarEnd = 'nl:ms-auto nl:flex nl:shrink-0 nl:items-center nl:gap-l';

/**
 * The frame: scrolls sideways when the columns are wider than the container. Bordered: 1px border-subtle round the
 * header and rows, Radius-S, clipped.
 */
export const frame = {
  default: 'nl:w-full nl:overflow-x-auto',
  bordered: 'nl:w-full nl:overflow-x-auto nl:rounded-s nl:border nl:border-subtle',
} as const;

/** The table: full width, collapsed borders (row dividers). */
export const table = 'nl:w-full nl:border-collapse';

/** The caption: the table's name, never shown (OD-226). */
export const caption = 'nl:sr-only';

/**
 * Column widths from Size-* tokens (OD-222): the select column Size-56, the row-actions column Size-64, and the
 * widths a column can ask for. A column without a width is flexible.
 */
export const colWidth = {
  '56': 'nl:w-56',
  '64': 'nl:w-64',
  '80': 'nl:w-80',
  '96': 'nl:w-96',
  '120': 'nl:w-120',
  '320': 'nl:w-320',
} as const;

/** Minimum column widths (on the header cell), from Size-* tokens (OD-222). */
export const colMinWidth = {
  '80': 'nl:min-w-80',
  '96': 'nl:min-w-96',
  '120': 'nl:min-w-120',
  '320': 'nl:min-w-320',
} as const;

/**
 * Body rows: a 1px border-default divider under every row but the last (§4.2). Fills: hover bg-secondary; selected
 * bg-active, with hover bg-active-hover. At rest bg-primary rather than none, so the sticky row-actions cell (which
 * takes the row's fill) covers the cells scrolled under it; on the bg-primary panel it looks the same (OD-227).
 * Colours ease with Duration fast; none under reduced motion.
 */
export const row = {
  default:
    'nl:border-b nl:border-default nl:last:border-b-0 nl:bg-primary nl:hover:bg-secondary nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none',
  selected:
    'nl:border-b nl:border-default nl:last:border-b-0 nl:bg-active nl:hover:bg-active-hover nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none',
} as const;

/** A clickable row (onRowClick, OD-243): the pointer shows the row can be opened. */
export const rowClickable = 'nl:cursor-pointer';

/** The empty state's cell: spans every column; Space-4XL above and below NlEmptyState (OD-229). */
export const emptyCell = 'nl:px-none nl:py-4xl';

/** A loading cell's skeleton bar: Size-80 wide (OD-228). */
export const skeleton = 'nl:w-80';

/**
 * Footer: a row, Size-32 high, space between: the summary and rows per page at the start, pagination at the end,
 * Space-L apart (OD-242).
 */
export const footer = 'nl:flex nl:h-32 nl:w-full nl:items-center nl:justify-between nl:gap-l';

/** The footer's start: summary, then rows per page, Space-L apart. */
export const footerStart = 'nl:flex nl:min-w-0 nl:items-center nl:gap-l';

/** The summary: "3 selected · Showing 1–10 of 120", Body S, text-tertiary. */
export const summary = 'nl:m-none nl:min-w-0 nl:truncate nl:text-body-s nl:text-tertiary';

/** Result and selection announcements: read politely, never shown. */
export const announcement = 'nl:sr-only';
