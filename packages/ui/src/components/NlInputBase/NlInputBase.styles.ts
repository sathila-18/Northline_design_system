// NlInputBase classes (DESIGN.md §9, NlInputBase). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: root (vertical) → box (named group `field`) → leading slot, prefix, value area (the native <input> with
// `peer/input`, then the floating <label>), suffix, trailing slot → helper. States come from the input: the box uses
// input-focus (tailwind.css), has-disabled, has-enabled and has-placeholder-shown (the input's placeholder is always a single
// space, so "placeholder shown" means empty). The label follows the input with peer-* variants.

/** The root: box, then the helper area. Fills its container. */
export const root = 'nl:flex nl:w-full nl:flex-col';

/**
 * The box: a row, gap Space-M, Radius-M, 1px inside border. Hover fills bg-secondary (enabled and not focused).
 * The focus ring shows while the box's own input has focus (OD-44: the standard border-focused ring; the spec draws
 * it on :focus, not only keyboard focus, as text inputs usually do). nl:input-focus (tailwind.css) rather than
 * has-focus, so a focused trailing button shows only its own ring (approved 19 Nov 2026, rule 9). Colour changes use
 * Duration fast.
 */
export const box =
  'nl:group/field nl:relative nl:flex nl:w-full nl:items-center nl:rounded-m nl:inset-ring nl:hover:has-enabled:not-input-focus:bg-secondary nl:input-focus:outline-2 nl:input-focus:-outline-offset-1 nl:input-focus:outline-focused nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';

/** Height, padding and gap per size. Large Size-48, Space-L / Space-XL; small Size-40, Space-M / Space-XL. */
export const size = {
  large: 'nl:h-48 nl:py-l nl:px-xl nl:gap-m',
  small: 'nl:h-40 nl:py-m nl:px-xl nl:gap-m',
} as const;

/**
 * Border per error state. Normal: border-default; filled and not focused border-strong (enabled only); disabled
 * border-disabled. Error: border-error in every state but disabled.
 */
export const border = {
  normal:
    'nl:inset-ring-default nl:has-enabled:not-has-placeholder-shown:not-input-focus:inset-ring-strong nl:has-disabled:inset-ring-disabled',
  error: 'nl:inset-ring-error nl:has-disabled:inset-ring-disabled',
} as const;

/** The value area: takes the rest of the row; holds the input and the label. */
export const value = 'nl:relative nl:flex nl:min-w-0 nl:flex-1 nl:items-center';

/**
 * The input: Body L, text-primary, no box of its own. The box draws the focus ring, so the input's own outline is
 * hidden (nl:focus:outline-hidden; designer-approved spec, 19 Nov 2026). There is no hint text (designer's choice, 19 Nov
 * 2026): the native placeholder is a single space, only so :placeholder-shown means empty. Disabled text-disabled.
 */
export const input =
  'nl:peer/input nl:w-full nl:min-w-0 nl:bg-transparent nl:p-none nl:text-body-l nl:text-primary nl:focus:outline-hidden nl:disabled:cursor-default nl:disabled:text-disabled';

/**
 * The label (OD-42): at rest in the value position, Body L, text-placeholder. Floating (focused or filled): Label S,
 * text-tertiary (OD-77), on a bg-primary patch with Space-XS inline padding, centred on the box's top border.
 * The text keeps its start edge (-ms-xs undoes the patch padding). Its position eases with Duration fast; the size
 * switches; it jumps under reduced motion. Disabled text-disabled.
 */
export const label =
  'nl:pointer-events-none nl:absolute nl:start-none nl:top-1/2 nl:-ms-xs nl:max-w-full nl:-translate-y-1/2 nl:truncate nl:px-xs nl:text-body-l nl:text-placeholder nl:peer-focus/input:bg-primary nl:peer-focus/input:text-label-s nl:peer-focus/input:text-tertiary nl:peer-not-placeholder-shown/input:bg-primary nl:peer-not-placeholder-shown/input:text-label-s nl:peer-not-placeholder-shown/input:text-tertiary nl:peer-disabled/input:text-disabled nl:transition-all nl:duration-fast nl:motion-reduce:transition-none';

/** Floating label offset per size: up by the box's block padding, onto the top border. */
export const labelFloat = {
  large: 'nl:peer-focus/input:-top-l nl:peer-not-placeholder-shown/input:-top-l',
  small: 'nl:peer-focus/input:-top-m nl:peer-not-placeholder-shown/input:-top-m',
} as const;

/** Leading and trailing slots: fg-secondary; disabled fg-disabled. An NlIcon inside inherits it. */
export const slot =
  'nl:inline-flex nl:shrink-0 nl:items-center nl:text-fg-secondary nl:group-has-disabled/field:text-fg-disabled';

/** Prefix and suffix: short text in Body L, text-placeholder; disabled text-disabled. */
export const affix = 'nl:shrink-0 nl:text-body-l nl:text-placeholder nl:group-has-disabled/field:text-disabled';

/** The helper area: indented Space-XL to line up with the value. A polite live region, empty without text. */
export const helper = 'nl:ps-xl';

/** The helper text: Space-M below the box (on the text, so an empty helper area adds no space). */
export const helperText = 'nl:mt-m';
