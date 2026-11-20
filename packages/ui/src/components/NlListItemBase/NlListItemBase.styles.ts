// NlListItemBase classes (DESIGN.md §9, NlListItemBase). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: root (vertical) → content (horizontal: leading slot → text column → trailing slot) → NlDivider (plain only).

/**
 * The root: a full-width vertical stack. Standard focus ring, keyboard only, around the whole row (it follows the card's
 * corners in filled). Colours ease with Duration fast; none under reduced motion.
 */
export const root =
  'nl:flex nl:w-full nl:min-w-0 nl:flex-col nl:text-start nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused nl:focus:not-focus-visible:outline-none nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';

/**
 * Padding and the gap content → divider, per appearance and density.
 * Plain with a divider: Space-XL top and sides, bottom Space-none, gap Space-XL (compact Space-M).
 * Plain without a divider: Space-XL all round (compact Space-M).
 * Filled: Space-XL all round (compact Space-M), Radius-L and a 1px inside border (§4.2).
 */
export const layout = {
  plainDivider: {
    default: 'nl:px-xl nl:pt-xl nl:pb-none nl:gap-xl',
    compact: 'nl:px-m nl:pt-m nl:pb-none nl:gap-m',
  },
  plain: {
    default: 'nl:p-xl',
    compact: 'nl:p-m',
  },
  filled: {
    default: 'nl:p-xl nl:rounded-l nl:inset-ring',
    compact: 'nl:p-m nl:rounded-l nl:inset-ring',
  },
  /** Nav (OD-119): Space-L block, Space-XL inline, Radius-M. Density doesn't change it. */
  nav: {
    default: 'nl:px-xl nl:py-l nl:rounded-m',
    compact: 'nl:px-xl nl:py-l nl:rounded-m',
  },
  /** Nav, not actionable: no side padding (NlSideNavUser with no menu). */
  navStatic: {
    default: 'nl:px-none nl:py-l nl:rounded-m',
    compact: 'nl:px-none nl:py-l nl:rounded-m',
  },
  /** Nav with the text hidden (minimized side nav): Space-L all round (designer's choice 20 Nov 2026). */
  navTextHidden: {
    default: 'nl:p-l nl:rounded-m',
    compact: 'nl:p-l nl:rounded-m',
  },
} as const;

/**
 * Fill and card border per appearance and state. Hover and pressed (OD-97: pressed = hover) only on actionable rows
 * (OD-151), so they have their own entries.
 * Plain: none; hover bg-secondary; selected bg-active; selected + hover bg-active-hover; disabled none.
 * Filled: bg-primary + border-subtle; hover bg-secondary; selected border-active; disabled border-disabled.
 */
export const state = {
  plain: {
    default: 'nl:bg-transparent',
    defaultActionable: 'nl:bg-transparent nl:hover:bg-secondary nl:active:bg-secondary',
    selected: 'nl:bg-active',
    selectedActionable: 'nl:bg-active nl:hover:bg-active-hover nl:active:bg-active-hover',
    disabled: 'nl:bg-transparent',
  },
  filled: {
    default: 'nl:bg-primary nl:inset-ring-subtle',
    defaultActionable: 'nl:bg-primary nl:inset-ring-subtle nl:hover:bg-secondary nl:active:bg-secondary',
    selected: 'nl:bg-primary nl:inset-ring-active',
    selectedActionable: 'nl:bg-primary nl:inset-ring-active nl:hover:bg-secondary nl:active:bg-secondary',
    disabled: 'nl:bg-primary nl:inset-ring-disabled',
  },
  /** Nav (OD-119): none; hover bg-tertiary; pressed bg-neutral; selected (an open menu) bg-tertiary. */
  nav: {
    default: 'nl:bg-transparent',
    defaultActionable: 'nl:bg-transparent nl:hover:bg-tertiary nl:active:bg-neutral',
    selected: 'nl:bg-tertiary',
    selectedActionable: 'nl:bg-tertiary nl:active:bg-neutral',
    disabled: 'nl:bg-transparent',
  },
} as const;

/**
 * A row around a control (`controlRow`, OD-100, OD-102): the focus ring goes round the row while the control inside
 * has keyboard focus. While enabled the row is also the named group "list-item" the control's hover and pressed
 * looks follow (NlCheckboxControl `inRow`).
 */
export const controlRow = {
  enabled:
    'nl:group/list-item nl:cursor-pointer nl:has-focus-visible:outline-2 nl:has-focus-visible:-outline-offset-1 nl:has-focus-visible:outline-focused',
  disabled:
    'nl:has-focus-visible:outline-2 nl:has-focus-visible:-outline-offset-1 nl:has-focus-visible:outline-focused',
} as const;

/** The content row: horizontal, gap Space-L. */
export const content = 'nl:flex nl:w-full nl:min-w-0 nl:gap-l';

/**
 * Accessory alignment: centre (default, items centred vertically) or title (items at the top; the accessory slots
 * are one title line high, so a control sits centred on the title's first line, designer's choice 20 Nov 2026).
 */
export const contentAlign = {
  center: 'nl:items-center',
  title: 'nl:items-start',
} as const;

/** Slot height for title alignment: 1lh of the title's text style per size (Headline Small-H6, Label M). */
export const slotTitleLine = {
  large: 'nl:h-lh nl:text-headline-small-h6',
  small: 'nl:h-lh nl:text-label-m',
} as const;

/** The leading slot: holds any component. Icons that inherit take fg-primary (fg-disabled when disabled). */
export const leading = 'nl:flex nl:shrink-0 nl:items-center';

export const leadingColour = {
  enabled: 'nl:text-fg-primary',
  disabled: 'nl:text-fg-disabled',
} as const;

/** The text column: vertical, gap Space-XS, takes the remaining width. */
export const textColumn = 'nl:flex nl:min-w-0 nl:flex-1 nl:flex-col nl:gap-xs';

/** The text column kept for assistive tech only (`hideText`): out of the layout, so the row is the leading slot. */
export const textColumnHidden = 'nl:sr-only';

/** The title row inside the heading: title text → extra icon, gap Space-M (8, OD-150). */
export const titleRow = 'nl:inline-flex nl:min-w-0 nl:items-center nl:gap-m';

/** The extra icon slot: keeps its size; takes the title's colour. */
export const extraIcon = 'nl:inline-flex nl:shrink-0 nl:items-center';

/** The body slot (replaces the description): full width of the text column. */
export const body = 'nl:min-w-0';

/** The trailing slot: holds any component, gap Space-S. Icons that inherit take fg-secondary (fg-disabled). */
export const trailing = 'nl:flex nl:shrink-0 nl:items-center nl:gap-s';

export const trailingColour = {
  enabled: 'nl:text-fg-secondary',
  disabled: 'nl:text-fg-disabled',
} as const;
