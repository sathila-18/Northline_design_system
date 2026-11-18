// NlProgressBar classes (DESIGN.md §9, NlProgressBar). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).

/** The track: fills its container, bg-active-hover, Radius-XS, and clips the fill to its shape. */
export const track = 'nl:block nl:w-full nl:overflow-hidden nl:rounded-xs nl:bg-active-hover';

/**
 * The fill: from the start edge, fg-brand, Radius-XS, full track height. Width is value% (nl:progress-fill reads
 * --nl-progress-value, see tailwind.css) and animates with Duration base and Ease standard (OD-7); no animation
 * under reduced motion. At 0 its width is 0, so nothing is drawn.
 */
export const fill =
  'nl:block nl:h-full nl:rounded-xs nl:bg-fg-brand nl:progress-fill nl:duration-base nl:ease-standard nl:motion-reduce:transition-none';

/** Track height, from Size-*. The fill matches it. */
export const size = {
  large: 'nl:h-8',
  small: 'nl:h-4',
} as const;
