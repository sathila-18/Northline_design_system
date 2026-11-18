// NlSkeleton classes (DESIGN.md §9, NlSkeleton). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).

/**
 * A block-level filled shape in bg-neutral that pulses while shown (nl:animate-skeleton-pulse, see tailwind.css).
 * Reduced motion: no animation, full opacity. No padding, border or shadow.
 */
export const root = 'nl:block nl:shrink-0 nl:bg-neutral nl:animate-skeleton-pulse nl:motion-reduce:animate-none';

/**
 * Height and radius per shape. text and rect set no width: as blocks they fill their container, so a caller's width
 * class (className, placement only) never competes with one of ours. circle is a Size-24 square.
 */
export const shape = {
  text: 'nl:h-12 nl:rounded-xs',
  rect: 'nl:h-24 nl:rounded-s',
  circle: 'nl:size-24 nl:rounded-full',
} as const;
