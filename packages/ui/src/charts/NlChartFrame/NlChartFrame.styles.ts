// NlChartFrame classes (DESIGN.md §9, NlChartFrame). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: <section> (header: text block · view switch) → body (chart height: chart | table | state).

/** The frame per look: card (default, OD-258) or plain. Header and body Space-L apart. */
export const root = {
  card: 'nl:flex nl:min-w-0 nl:flex-col nl:gap-l nl:rounded-m nl:border nl:border-subtle nl:bg-primary nl:p-3xl',
  plain: 'nl:flex nl:min-w-0 nl:flex-col nl:gap-l',
} as const;

/** The header: title and description at the start, the switch at the end. */
export const header = 'nl:flex nl:items-start nl:justify-between nl:gap-l';

/** The title block takes the free space. */
export const title = 'nl:min-w-0 nl:flex-1';

/**
 * The switch's place. Hidden while loading, empty or in error (designer, 24 Nov 2026) but still taking its space, so
 * the header doesn't change height.
 */
export const switchSlot = {
  shown: 'nl:shrink-0',
  hidden: 'nl:invisible nl:shrink-0',
} as const;

/** The body: the chart's height in every state (Size-240 or Size-320); full width. */
export const body = {
  '240': 'nl:relative nl:h-240 nl:w-full nl:min-w-0',
  '320': 'nl:relative nl:h-320 nl:w-full nl:min-w-0',
} as const;

/**
 * The table view scrolls inside the chart's height. It is a tab stop with the standard focus ring, so the keyboard can
 * scroll it (WCAG 2.1.1; found by the a11y check with the line chart's 15-month table).
 */
export const table =
  'nl:h-full nl:overflow-auto nl:rounded-xs nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused nl:focus:not-focus-visible:outline-none';

/** Empty and error: centred in the body. */
export const state = 'nl:flex nl:h-full nl:items-center nl:justify-center';

/** Loading: five rect skeletons spread down the body, like gridlines (designer, 24 Nov 2026). */
export const skeletons = 'nl:flex nl:h-full nl:flex-col nl:justify-between';
