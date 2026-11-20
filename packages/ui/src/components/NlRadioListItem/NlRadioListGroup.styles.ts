// NlRadioListGroup classes (DESIGN.md §9, NlRadioListItem). Whole literal class strings only (CLAUDE.md, Tailwind
// rule 1).

/** The group: a full-width vertical stack. */
export const root = 'nl:flex nl:w-full nl:flex-col';

/** Gap between rows per appearance: plain rows touch (their dividers separate them); filled cards Space-L apart. */
export const gap = {
  plain: 'nl:gap-none',
  filled: 'nl:gap-l',
} as const;
