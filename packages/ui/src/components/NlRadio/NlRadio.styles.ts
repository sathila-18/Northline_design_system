// NlRadio classes (DESIGN.md §9, NlRadio). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: a Size-24 root (named group "radio") holding a transparent native <input type="radio"> and the drawn
// ring and dot. The ring and dot follow the input's state through the group: group-has-checked, group-hover,
// group-active, group-has-disabled (rule 3).

/**
 * The root: the Size-24 box and pointer target. Focus: the standard ring around the box, round (designer's choice,
 * 18 Nov 2026), keyboard only. Disabled: no pointer events, so hover and press never show.
 */
export const root =
  'nl:group/radio nl:relative nl:inline-flex nl:size-24 nl:shrink-0 nl:items-center nl:justify-center nl:rounded-full nl:has-focus-visible:outline-2 nl:has-focus-visible:-outline-offset-1 nl:has-focus-visible:outline-focused nl:has-disabled:pointer-events-none';

/** The native input, invisible but interactive, covering the box. */
export const input = 'nl:absolute nl:inset-none nl:m-none nl:size-24 nl:cursor-pointer nl:appearance-none nl:opacity-0';

/**
 * The ring: Size-20, round, 2px border inside.
 * Unselected: border-strong; hover border-hovered + bg-active; pressed border-pressed + bg-active-hover;
 * disabled fg-disabled. Selected: fg-action; hover fg-hovered; pressed fg-pressed; no fill; disabled fg-disabled.
 * Colour changes use Duration fast; none under reduced motion.
 */
export const ring =
  'nl:pointer-events-none nl:size-20 nl:rounded-full nl:border-2 nl:border-strong nl:group-hover/radio:border-hovered nl:group-hover/radio:bg-active nl:group-active/radio:border-pressed nl:group-active/radio:bg-active-hover nl:group-has-disabled/radio:border-fg-disabled nl:group-has-checked/radio:border-fg-action nl:group-has-checked/radio:group-hover/radio:border-fg-hovered nl:group-has-checked/radio:group-hover/radio:bg-transparent nl:group-has-checked/radio:group-active/radio:border-fg-pressed nl:group-has-checked/radio:group-active/radio:bg-transparent nl:group-has-checked/radio:group-has-disabled/radio:border-fg-disabled nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';

/**
 * The dot: Size-12, round, centred; shown only when selected.
 * fg-action; hover fg-hovered; pressed fg-pressed; disabled fg-disabled.
 */
export const dot =
  'nl:pointer-events-none nl:absolute nl:size-12 nl:rounded-full nl:bg-fg-action nl:opacity-0 nl:group-has-checked/radio:opacity-100 nl:group-hover/radio:bg-fg-hovered nl:group-active/radio:bg-fg-pressed nl:group-has-disabled/radio:bg-fg-disabled nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';

/**
 * In a list row (`inRow`, OD-100, OD-102): no focus ring of its own (the row draws it), and the ring and dot take
 * their hover and pressed looks from the row's named group "list-item" (NlListItemBase `controlRow`). The row only
 * carries that group while enabled.
 */
export const rootInRow =
  'nl:group/radio nl:relative nl:inline-flex nl:size-24 nl:shrink-0 nl:items-center nl:justify-center nl:rounded-full nl:has-disabled:pointer-events-none';

export const ringInRow =
  'nl:pointer-events-none nl:size-20 nl:rounded-full nl:border-2 nl:border-strong nl:group-hover/list-item:border-hovered nl:group-hover/list-item:bg-active nl:group-active/list-item:border-pressed nl:group-active/list-item:bg-active-hover nl:group-has-disabled/radio:border-fg-disabled nl:group-has-checked/radio:border-fg-action nl:group-has-checked/radio:group-hover/list-item:border-fg-hovered nl:group-has-checked/radio:group-hover/list-item:bg-transparent nl:group-has-checked/radio:group-active/list-item:border-fg-pressed nl:group-has-checked/radio:group-active/list-item:bg-transparent nl:group-has-checked/radio:group-has-disabled/radio:border-fg-disabled nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';

export const dotInRow =
  'nl:pointer-events-none nl:absolute nl:size-12 nl:rounded-full nl:bg-fg-action nl:opacity-0 nl:group-has-checked/radio:opacity-100 nl:group-hover/list-item:bg-fg-hovered nl:group-active/list-item:bg-fg-pressed nl:group-has-disabled/radio:bg-fg-disabled nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';
