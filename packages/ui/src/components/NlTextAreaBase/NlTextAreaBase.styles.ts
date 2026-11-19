// NlTextAreaBase classes (DESIGN.md §9, NlTextAreaBase). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: root (vertical) → box (named group `field`) → the native <textarea> (`peer/input`), then the floating
// <label> → helper. The same tokens as NlInputBase. States come from the textarea: the box uses has-focus,
// has-disabled, has-enabled and has-placeholder-shown (the placeholder is always a single space, so "placeholder
// shown" means empty). The box holds nothing else focusable, so plain has-focus is enough. The label follows the
// textarea with peer-* variants.

/** The root: box, then the helper area. Fills its container. */
export const root = 'nl:flex nl:w-full nl:flex-col';

/**
 * The box: Radius-M, 1px inside border. Hover fills bg-secondary (enabled and not focused). The standard focus ring
 * shows while the textarea has focus (OD-44), any focus, as for text inputs. Colour changes use Duration fast.
 */
export const box =
  'nl:group/field nl:relative nl:flex nl:w-full nl:rounded-m nl:inset-ring nl:hover:has-enabled:not-has-focus:bg-secondary nl:has-focus:outline-2 nl:has-focus:-outline-offset-1 nl:has-focus:outline-focused nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';

/**
 * Border per error state. Normal: border-default; filled and not focused border-strong (enabled only); disabled
 * border-disabled. Error: border-error in every state but disabled.
 */
export const border = {
  normal:
    'nl:inset-ring-default nl:has-enabled:not-has-placeholder-shown:not-has-focus:inset-ring-strong nl:has-disabled:inset-ring-disabled',
  error: 'nl:inset-ring-error nl:has-disabled:inset-ring-disabled',
} as const;

/**
 * The textarea: Space-XL padding all round (on the textarea, so the resize handle sits in the box corner and text
 * scrolls inside the border), Body L, text-primary. Height is `rows` lines of Body L plus the padding (OD-85; 4 rows
 * = 128). Vertical resize only, none when disabled (OD-86). The box draws the focus ring, so the textarea's own
 * outline is hidden. No hint text (designer's choice, 19 Nov 2026). Disabled text-disabled.
 */
export const textarea =
  'nl:peer/input nl:block nl:w-full nl:min-w-0 nl:resize-y nl:rounded-m nl:bg-transparent nl:p-xl nl:text-body-l nl:text-primary nl:focus:outline-hidden nl:disabled:cursor-default nl:disabled:resize-none nl:disabled:text-disabled';

/**
 * The label (OD-42): at rest on the first line (Space-XL in from the top and start), Body L, text-placeholder.
 * Floating (focused or filled): Label S, text-tertiary (OD-77), on a bg-primary patch with Space-XS inline padding,
 * centred on the top border. The text keeps its start edge (-ms-xs undoes the patch padding). Its position eases with
 * Duration fast; the size switches; it jumps under reduced motion. Disabled text-disabled.
 */
export const label =
  'nl:pointer-events-none nl:absolute nl:start-xl nl:top-xl nl:-ms-xs nl:max-w-full nl:truncate nl:px-xs nl:text-body-l nl:text-placeholder nl:peer-focus/input:top-none nl:peer-focus/input:-translate-y-1/2 nl:peer-focus/input:bg-primary nl:peer-focus/input:text-label-s nl:peer-focus/input:text-tertiary nl:peer-not-placeholder-shown/input:top-none nl:peer-not-placeholder-shown/input:-translate-y-1/2 nl:peer-not-placeholder-shown/input:bg-primary nl:peer-not-placeholder-shown/input:text-label-s nl:peer-not-placeholder-shown/input:text-tertiary nl:peer-disabled/input:text-disabled nl:transition-all nl:duration-fast nl:motion-reduce:transition-none';

/** The helper area: indented Space-XL to line up with the text. A polite live region, empty without text. */
export const helper = 'nl:ps-xl';

/** The helper text: Space-M below the box (on the text, so an empty helper area adds no space). */
export const helperText = 'nl:mt-m';
