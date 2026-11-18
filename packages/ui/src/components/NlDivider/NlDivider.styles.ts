// NlDivider classes (DESIGN.md §9, NlDivider). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).

/** Fills its container. No margin, radius or shadow of its own: the parent sets spacing with its gap. */
export const root = 'nl:block nl:w-full nl:shrink-0';

/**
 * divider: a 1px top border in border-default, Tailwind's built-in 1px width (§4.2, D16).
 * section: a Size-8 band filled with border-default (nl:bg-border-default, see tailwind.css). border-0 clears the
 * 1px top border the reset gives <hr>.
 */
export const type = {
  divider: 'nl:border-t nl:border-default',
  section: 'nl:h-8 nl:border-0 nl:bg-border-default',
} as const;
