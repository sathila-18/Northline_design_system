// NlIcon classes (DESIGN.md §9, NlIcon). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).

/** The box: square, glyph centred, no padding, radius, border or shadow. */
export const root = 'nl:inline-flex nl:shrink-0 nl:items-center nl:justify-center nl:font-icon nl:select-none';

/** Box size and glyph font size, both from Size-* (§6). The font's optical size follows the font size. */
export const size = {
  16: 'nl:size-16 nl:icon-16',
  20: 'nl:size-20 nl:icon-20',
  24: 'nl:size-24 nl:icon-24',
  36: 'nl:size-36 nl:icon-36',
  48: 'nl:size-48 nl:icon-48',
  64: 'nl:size-64 nl:icon-64',
} as const;

/** Glyph colour. `inherit` adds nothing, so the glyph uses currentColor from its parent. */
export const tone = {
  inherit: '',
  primary: 'nl:text-fg-primary',
  secondary: 'nl:text-fg-secondary',
  disabled: 'nl:text-fg-disabled',
  success: 'nl:text-fg-success',
  warning: 'nl:text-fg-warning',
  error: 'nl:text-fg-error',
  info: 'nl:text-fg-info',
} as const;

/** Outlined (FILL 0) by default, filled (FILL 1) for active and selected states (§6). */
export const fill = {
  outlined: '',
  filled: 'nl:icon-filled',
} as const;
