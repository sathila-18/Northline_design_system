// NlCheckbox classes (DESIGN.md §9, NlCheckbox). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
// The control's look, states and focus ring are NlCheckboxControl's; the text's look is NlTextBlock's.

/**
 * The row: a <label>, horizontal, gap Space-L, no padding, full width. Pointer over the whole row; default when
 * disabled. Cross-axis alignment comes from `size`.
 */
export const root = 'nl:flex nl:w-full nl:cursor-pointer nl:gap-l nl:p-none nl:has-disabled:cursor-default';

/**
 * Row alignment per size. Medium: items at the top (the control's 24 hit area matches Body L's 24 line height, so
 * the box sits on the first line). Small: items centred (Body M's 21 line is shorter than the 24 hit area, OD-237).
 */
export const size = {
  medium: 'nl:items-start',
  small: 'nl:items-center',
} as const;

/** The text: takes the rest of the row and wraps. */
export const text = 'nl:min-w-0 nl:flex-1';

/** Hidden text: visually hidden, still the checkbox's name. */
export const hiddenText = 'nl:sr-only';
