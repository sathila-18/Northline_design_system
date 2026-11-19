// NlListCaption classes (DESIGN.md §9, NlListCaption). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).

/** One line, no padding, hugs the text and keeps its width in the row. */
export const root = 'nl:shrink-0 nl:whitespace-nowrap nl:p-none';

/** Text style per weight and size: heavy Label S / M / L, light Body S / M / L. */
export const textStyle = {
  heavy: { small: 'nl:text-label-s', medium: 'nl:text-label-m', large: 'nl:text-label-l' },
  light: { small: 'nl:text-body-s', medium: 'nl:text-body-m', large: 'nl:text-body-l' },
} as const;

/** Colour: text-tertiary; text-disabled when the row is disabled (OD-29). */
export const tone = {
  default: 'nl:text-tertiary',
  disabled: 'nl:text-disabled',
} as const;
