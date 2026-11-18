// NlSwitch classes (DESIGN.md §9, NlSwitch). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: the track is the native <button role="switch"> (named group "switch"); the handle is a child that
// follows the button's aria-checked and disabled states through the group (rule 3).

/**
 * The track: a pill with the handle inset Space-XS. Off fg-placeholder; on fg-brand. Disabled: off border-disabled,
 * on bg-disabled. No hover or pressed colours (OD-13b, designer's choice, 18 Nov 2026). Focus: the standard ring.
 * Colour changes use Duration fast; none under reduced motion.
 */
export const track =
  'nl:group/switch nl:relative nl:inline-flex nl:shrink-0 nl:cursor-pointer nl:items-center nl:rounded-full nl:p-xs nl:bg-fg-placeholder nl:aria-checked:bg-fg-brand nl:disabled:cursor-default nl:disabled:bg-border-disabled nl:disabled:aria-checked:bg-disabled nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';

/** Track size, from Size-*. */
export const trackSize = {
  large: 'nl:h-32 nl:w-56',
  small: 'nl:h-24 nl:w-40',
} as const;

/**
 * The handle: a circle at the start when off, sliding to the end when on with Duration fast and Ease standard
 * (OD-13c); no slide under reduced motion. fg-white_both; disabled off fg-disabled, disabled on fg-disabled-on_bg.
 */
export const handle =
  'nl:pointer-events-none nl:block nl:rounded-full nl:bg-fg-white-both nl:group-disabled/switch:bg-fg-disabled nl:group-disabled/switch:group-aria-checked/switch:bg-fg-disabled-on-bg nl:transition-transform nl:duration-fast nl:ease-standard nl:motion-reduce:transition-none';

/**
 * Handle size and slide distance: track − handle − 2 × inset. Large 56 − 24 − 8 = 24 (Space-3XL); small
 * 40 − 16 − 8 = 16 (Space-XL). Mirrored in right-to-left layouts.
 */
export const handleSize = {
  large: 'nl:size-24 nl:group-aria-checked/switch:translate-x-3xl nl:rtl:group-aria-checked/switch:-translate-x-3xl',
  small: 'nl:size-16 nl:group-aria-checked/switch:translate-x-xl nl:rtl:group-aria-checked/switch:-translate-x-xl',
} as const;
