// NlPaginationItem classes (DESIGN.md §9, NlPaginationItem). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).

/**
 * The box: Size-32 high, at least Size-32 wide and wider for long numbers (OD-32), padding Space-XS, content centred,
 * Radius-S. Shared by the page button and the ellipsis.
 */
export const box =
  'nl:inline-flex nl:h-32 nl:min-w-32 nl:shrink-0 nl:items-center nl:justify-center nl:rounded-s nl:p-xs';

/**
 * The page button: Label M, 1px inside border, standard focus ring (OD-34). Colours ease with Duration fast; none
 * under reduced motion.
 */
export const page =
  'nl:cursor-pointer nl:text-label-m nl:inset-ring nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused nl:focus:not-focus-visible:outline-none nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';

/**
 * Colours. Default bg-secondary, border-subtle, text-secondary; hover and pressed (same, OD-33) bg-tertiary,
 * border-default, text-primary. Current page: bg-active, border-active, text-action, no state change.
 */
export const state = {
  default:
    'nl:bg-secondary nl:inset-ring-subtle nl:text-secondary nl:hover:bg-tertiary nl:hover:inset-ring-default nl:hover:text-primary nl:active:bg-tertiary nl:active:inset-ring-default nl:active:text-primary',
  current: 'nl:cursor-default nl:bg-active nl:inset-ring-active nl:text-action',
} as const;

/** The ellipsis: one "…" in Label L, text-secondary, no border or fill (OD-35). */
export const ellipsis = 'nl:text-label-l nl:text-secondary';
