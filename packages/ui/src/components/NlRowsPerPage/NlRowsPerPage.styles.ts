// NlRowsPerPage classes (DESIGN.md §9, NlRowsPerPage). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).

/**
 * The trigger: a pill (Radius-Full), gap Space-M, padding Space-XS / Space-L, 1px inside border (inset ring), height
 * hugging the 24 icon (32). Named group `rows`, so label, value and icon follow the disabled state.
 * Enabled bg-secondary, border-subtle; hover and pressed bg-tertiary; disabled bg-disabled, no border.
 * Focus: the standard ring, following the pill. Colour changes use Duration fast; none under reduced motion.
 */
export const root =
  'nl:group/rows nl:inline-flex nl:shrink-0 nl:cursor-pointer nl:items-center nl:gap-m nl:whitespace-nowrap nl:rounded-full nl:py-xs nl:px-l nl:inset-ring nl:inset-ring-subtle nl:enabled:hover:bg-tertiary nl:enabled:active:bg-tertiary nl:disabled:cursor-default nl:disabled:bg-disabled nl:disabled:inset-ring-0 nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused nl:focus:not-focus-visible:outline-none nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';

/** Background when closed or open. Open uses the pressed look (bg-tertiary). */
export const open = {
  closed: 'nl:bg-secondary',
  open: 'nl:bg-tertiary',
} as const;

/** The label: Body S, text-tertiary; disabled text-disabled-on_bg. */
export const label = 'nl:text-body-s nl:text-tertiary nl:group-disabled/rows:text-disabled-on-bg';

/** The value: Label S, text-primary; disabled text-disabled-on_bg. */
export const value = 'nl:text-label-s nl:text-primary nl:group-disabled/rows:text-disabled-on-bg';

/** The arrow slot: fg-secondary; disabled fg-disabled-on_bg. The NlIcon inside inherits it. */
export const icon = 'nl:inline-flex nl:shrink-0 nl:text-fg-secondary nl:group-disabled/rows:text-fg-disabled-on-bg';
