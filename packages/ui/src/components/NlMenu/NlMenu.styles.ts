// NlMenu classes (DESIGN.md §9, NlMenu). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).

/**
 * The panel: fixed, layer z-menu, a vertical stack clipped to Radius-M. bg-primary, 1px border-subtle inside,
 * shadow-menu (OD-17). Position and size from nl:menu-position (see tailwind.css). Fades with the nl:transition
 * defaults, Duration base and Ease standard (OD-21); no fade under reduced motion.
 */
export const panel =
  'nl:fixed nl:z-menu nl:flex-col nl:gap-none nl:overflow-hidden nl:rounded-m nl:border nl:border-subtle nl:bg-primary nl:p-none nl:shadow-menu nl:menu-position nl:transition nl:transition-discrete nl:motion-reduce:transition-none';

/** Shown fades in from 0 on first show; hidden is display none, so it draws nothing and takes no clicks. */
export const state = {
  open: 'nl:flex nl:opacity-100 nl:starting:opacity-0',
  closed: 'nl:hidden nl:opacity-0',
} as const;

/** Hidden until the first position is measured, so it never shows at the window's corner. */
export const unpositioned = 'nl:invisible';

/** Header: padding Space-L, 1px bottom border-subtle. Stays at the top while the content scrolls. */
export const header = 'nl:shrink-0 nl:border-b nl:border-subtle nl:p-l';

/** Content: gap and padding Space-none. Scrolls when the panel reaches its maximum height. */
export const content = 'nl:flex nl:min-h-0 nl:flex-col nl:gap-none nl:overflow-y-auto nl:p-none';

/** Footer: padding Space-XL, 1px top border-subtle. Stays at the bottom. */
export const footer = 'nl:shrink-0 nl:border-t nl:border-subtle nl:p-xl';

/** Footer slot: a horizontal row, gap Space-M, aligned to the end. */
export const footerRow = 'nl:flex nl:items-center nl:justify-end nl:gap-m';
