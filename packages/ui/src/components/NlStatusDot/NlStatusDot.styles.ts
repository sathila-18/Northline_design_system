// NlStatusDot classes (DESIGN.md §9, NlStatusDot). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).

/**
 * The dot: round, fg-success, with a 1px ring drawn outside the diameter (border + content-box, §4.2), so the outer
 * size is the diameter plus 2. The ring uses border-inverse, which has the spec's fg-inverse values in every brand
 * and theme (designer's choice, 18 Nov 2026).
 */
export const root =
  'nl:inline-block nl:shrink-0 nl:box-content nl:rounded-full nl:border nl:border-inverse nl:bg-fg-success';

/** Diameter, from Size-*. */
export const size = {
  xsmall: 'nl:size-6',
  small: 'nl:size-8',
  medium: 'nl:size-12',
  large: 'nl:size-16',
  xlarge: 'nl:size-24',
} as const;
