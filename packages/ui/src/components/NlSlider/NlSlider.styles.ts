// NlSlider classes (DESIGN.md §9, NlSlider). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: a transparent native <input type="range"> (the peer) on top, then the drawn track, fill and thumb as
// its siblings. Every pointer and key event goes to the input; the drawn parts follow its state with peer-*.

/** The root: fills its container, Size-24 tall so the thumb fits. Holds --nl-slider-value for the parts. */
export const root = 'nl:relative nl:block nl:h-24 nl:w-full';

/**
 * The native input, invisible but interactive. It reaches half a thumb (Space-L) past each end, and its own thumb
 * is Size-24, so its thumb travels exactly the drawn track and a click lands on the value under the pointer.
 * Disabled: no pointer events.
 */
export const input =
  'nl:peer nl:absolute nl:inset-y-none nl:-inset-x-l nl:m-none nl:cursor-pointer nl:appearance-none nl:bg-transparent nl:opacity-0 nl:disabled:pointer-events-none nl:range-thumb:size-24 nl:range-thumb:appearance-none nl:range-thumb:border-0';

/** Track: Size-8 tall, centred, full width, Radius-XS. bg-active-hover; disabled bg-disabled. */
export const track =
  'nl:pointer-events-none nl:absolute nl:inset-x-none nl:inset-y-none nl:my-auto nl:h-8 nl:rounded-xs nl:bg-active-hover nl:peer-disabled:bg-disabled';

/**
 * Fill: from the start edge to the thumb (nl:slider-fill), Size-8, Radius-XS.
 * fg-brand; hover fg-hovered; pressed fg-pressed; disabled fg-disabled-on_bg (OD-10).
 * Colour changes use Duration fast; none under reduced motion.
 */
export const fill =
  'nl:pointer-events-none nl:absolute nl:start-none nl:inset-y-none nl:my-auto nl:h-8 nl:rounded-xs nl:slider-fill nl:bg-fg-brand nl:peer-hover:bg-fg-hovered nl:peer-active:bg-fg-pressed nl:peer-disabled:bg-fg-disabled-on-bg nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';

/**
 * Thumb: Size-24 circle centred on the end of the fill (nl:slider-thumb, then back half a thumb, Space-L).
 * 2px inset ring in border-inverse, shadow-resting. Same colours as the fill. Focus: the standard ring (rule 5).
 * Disabled: no shadow.
 */
export const thumb =
  'nl:pointer-events-none nl:absolute nl:inset-y-none nl:my-auto nl:-ms-l nl:size-24 nl:rounded-full nl:slider-thumb nl:bg-fg-brand nl:inset-ring-2 nl:inset-ring-inverse nl:shadow-resting nl:peer-hover:bg-fg-hovered nl:peer-active:bg-fg-pressed nl:peer-focus-visible:outline-2 nl:peer-focus-visible:-outline-offset-1 nl:peer-focus-visible:outline-focused nl:peer-disabled:bg-fg-disabled-on-bg nl:peer-disabled:shadow-none nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';
