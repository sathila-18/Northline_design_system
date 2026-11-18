// NlOverlay classes (DESIGN.md §9, NlOverlay). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).

/**
 * The scrim: fixed over the whole viewport, layer z-overlay, Alpha-md fill.
 * nl:transition fades opacity (and display) with the defaults Duration base and Ease standard (§3.8, §5).
 * nl:transition-discrete lets display change at the end of the fade out, so it can fade out and still end hidden.
 * Reduced motion: no transition, it appears and disappears at once.
 */
export const root =
  'nl:fixed nl:inset-none nl:z-overlay nl:bg-alpha-md nl:transition nl:transition-discrete nl:motion-reduce:transition-none';

/**
 * Shown: full opacity, fading in from 0 on first show (nl:starting:, @starting-style).
 * Hidden: display none, so it draws nothing and takes no clicks.
 */
export const state = {
  open: 'nl:block nl:opacity-100 nl:starting:opacity-0',
  closed: 'nl:hidden nl:opacity-0',
} as const;
