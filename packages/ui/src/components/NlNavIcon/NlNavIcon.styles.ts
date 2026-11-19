// NlNavIcon classes (DESIGN.md §9, NlNavIcon). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).

/** The box: Size-20, no padding, the icon centred. Colour changes use Duration fast; none under reduced motion. */
export const root =
  'nl:inline-flex nl:size-20 nl:shrink-0 nl:items-center nl:justify-center nl:p-none nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';

/** Colour per selected state: fg-secondary unselected, fg-active selected. The NlIcon inside inherits it. */
export const selected = {
  off: 'nl:text-fg-secondary',
  on: 'nl:text-fg-active',
} as const;
