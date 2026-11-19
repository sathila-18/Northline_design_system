// NlCheckboxControl classes (DESIGN.md §9, NlCheckboxControl). Whole literal class strings only (CLAUDE.md,
// Tailwind rule 1).
//
// Structure: a Size-24 root (named group "checkbox") holding a transparent native <input type="checkbox"> and the
// drawn box with its two icons. The box and icons follow the input through the group: group-has-checked,
// group-has-indeterminate, group-hover, group-active, group-has-disabled (rule 3). Selected and indeterminate share
// one look, so each selected class is written for both.

/**
 * The root: the Size-24 hit area and pointer target. Focus: the standard ring around the hit area with Radius-XS
 * (designer's choice, 19 Nov 2026), keyboard only. Disabled: no pointer events, so hover and press never show.
 */
export const root =
  'nl:group/checkbox nl:relative nl:inline-flex nl:size-24 nl:shrink-0 nl:items-center nl:justify-center nl:rounded-xs nl:has-focus-visible:outline-2 nl:has-focus-visible:-outline-offset-1 nl:has-focus-visible:outline-focused nl:has-disabled:pointer-events-none';

/** The native input, invisible but interactive, covering the hit area. */
export const input = 'nl:absolute nl:inset-none nl:m-none nl:size-24 nl:cursor-pointer nl:appearance-none nl:opacity-0';

/**
 * The box: Size-20, Radius-XS, 2px border inside, centred.
 * Unselected: border-strong; hover border-hovered + bg-active-hover; pressed border-pressed + bg-active-hover;
 * disabled border fg-disabled.
 * Selected or indeterminate: no border (transparent, so the fill covers the whole box) and bg-action-primary;
 * hover fg-hovered; pressed fg-pressed; disabled fg-disabled.
 * Colour changes use Duration fast; none under reduced motion.
 */
export const box =
  'nl:pointer-events-none nl:inline-flex nl:size-20 nl:items-center nl:justify-center nl:rounded-xs nl:border-2 nl:border-strong nl:group-hover/checkbox:border-hovered nl:group-hover/checkbox:bg-active-hover nl:group-active/checkbox:border-pressed nl:group-active/checkbox:bg-active-hover nl:group-has-disabled/checkbox:border-fg-disabled nl:group-has-checked/checkbox:border-transparent nl:group-has-checked/checkbox:bg-action-primary nl:group-has-checked/checkbox:group-hover/checkbox:border-transparent nl:group-has-checked/checkbox:group-hover/checkbox:bg-fg-hovered nl:group-has-checked/checkbox:group-active/checkbox:border-transparent nl:group-has-checked/checkbox:group-active/checkbox:bg-fg-pressed nl:group-has-checked/checkbox:group-has-disabled/checkbox:border-transparent nl:group-has-checked/checkbox:group-has-disabled/checkbox:bg-fg-disabled nl:group-has-indeterminate/checkbox:border-transparent nl:group-has-indeterminate/checkbox:bg-action-primary nl:group-has-indeterminate/checkbox:group-hover/checkbox:border-transparent nl:group-has-indeterminate/checkbox:group-hover/checkbox:bg-fg-hovered nl:group-has-indeterminate/checkbox:group-active/checkbox:border-transparent nl:group-has-indeterminate/checkbox:group-active/checkbox:bg-fg-pressed nl:group-has-indeterminate/checkbox:group-has-disabled/checkbox:border-transparent nl:group-has-indeterminate/checkbox:group-has-disabled/checkbox:bg-fg-disabled nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';

/**
 * The tick (`check`): shown when checked and not indeterminate. has-indeterminate sorts after has-checked, so an
 * input that is both shows the dash. fg-white_both; disabled fg-disabled-on_bg.
 */
export const check =
  'nl:hidden nl:text-fg-white-both nl:group-has-checked/checkbox:inline-flex nl:group-has-indeterminate/checkbox:hidden nl:group-has-disabled/checkbox:text-fg-disabled-on-bg';

/** The dash (`remove`): shown when indeterminate. fg-white_both; disabled fg-disabled-on_bg. */
export const dash =
  'nl:hidden nl:text-fg-white-both nl:group-has-indeterminate/checkbox:inline-flex nl:group-has-disabled/checkbox:text-fg-disabled-on-bg';
