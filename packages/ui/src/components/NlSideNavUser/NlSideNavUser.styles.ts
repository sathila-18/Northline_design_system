// NlSideNavUser classes (DESIGN.md §9, NlSideNavUser). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
// Padding, radius and fills come from NlListItemBase appearance="nav" (OD-119); only placement and text cutting here.

/** The root: holds the row, the menu and the hidden menu label. Full width of the nav column. */
export const root = 'nl:flex nl:w-full nl:min-w-0 nl:flex-col';

/** Minimized: as wide as the avatar row. */
export const rootMinimized = 'nl:inline-flex nl:flex-col';

/** Name and email: one line each, cut with an ellipsis; the full text is a title only when cut. */
export const line = 'nl:block nl:truncate';

/** The menu label, read after the email as part of the button's name (WCAG 2.5.3); hidden from view. */
export const hiddenText = 'nl:sr-only';
