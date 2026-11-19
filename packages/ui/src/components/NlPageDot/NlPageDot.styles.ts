// NlPageDot classes (DESIGN.md §9, NlPageDot). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).

/**
 * The dot: Size-6 high, Radius-Full (OD-37). Width and fill change with Duration base and Ease standard (OD-38);
 * no animation under reduced motion.
 */
export const root =
  'nl:block nl:h-6 nl:shrink-0 nl:rounded-full nl:transition-all nl:duration-base nl:ease-standard nl:motion-reduce:transition-none';

/** Width and fill: default Size-6, fg-placeholder; current Size-24 (OD-36), fg-brand. */
export const type = {
  default: 'nl:w-6 nl:bg-fg-placeholder',
  current: 'nl:w-24 nl:bg-fg-brand',
} as const;
