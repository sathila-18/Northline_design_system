// NlSideNav classes (DESIGN.md §9, NlSideNav). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: <nav> (width, side padding) → column (block padding, space between) → top group (header row, sections)
// and NlSideNavUser.

/**
 * The <nav>: full height, bg-secondary, Space-XL either side. content-box, so the width is the content column:
 * expanded Size-240 (272 with the padding, OD-134), minimized Size-48 (Size-80 with the padding). The width eases with
 * Duration slow and the standard ease; none under reduced motion (OD-147).
 */
export const root =
  'nl:box-content nl:flex nl:h-full nl:shrink-0 nl:flex-col nl:bg-secondary nl:px-xl nl:transition-all nl:duration-slow nl:ease-standard nl:motion-reduce:transition-none';

/** Content width per type (with the Space-XL padding: 272 and 80). */
export const width = {
  expanded: 'nl:w-240',
  minimized: 'nl:w-48',
} as const;

/** The column: Space-3XL top and bottom; top group first, the user at the bottom (space between). */
export const column = 'nl:flex nl:min-h-0 nl:flex-1 nl:flex-col nl:justify-between nl:gap-l nl:py-3xl';

/** The top group: header row, then the sections, Space-L apart. */
export const top = 'nl:flex nl:min-h-0 nl:flex-col nl:gap-l';

/** Header row: logo (fills) and the collapse button at the end; minimized, the button alone, centred. */
export const header = {
  expanded: 'nl:flex nl:items-center nl:justify-between nl:gap-l',
  minimized: 'nl:flex nl:items-center nl:justify-center',
} as const;

/** The logo slot fills the header row. */
export const logo = 'nl:flex nl:min-w-0 nl:flex-1 nl:items-center';

/** The collapse button keeps its size. */
export const collapse = 'nl:shrink-0';

/** The sections list: Space-XS apart, no list styling. */
export const sections = 'nl:m-none nl:flex nl:list-none nl:flex-col nl:gap-xs nl:p-none';
