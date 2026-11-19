// NlNotificationButton classes (DESIGN.md §9, NlNotificationButton). Whole literal class strings only (CLAUDE.md,
// Tailwind rule 1). Its own native button, not NlButton (OD-40, designer's choice, 19 Nov 2026: NlButton has no
// 40 size, no circle and no soft look; an exception to D12 for this one component).

/**
 * The button: a Size-40 circle (Radius-Full), padding Space-M, the 20 icon centred. bg-action-secondary; hover
 * _hovered; pressed and expanded _pressed; disabled bg-disabled. Relative, so the badge sits on it, unclipped.
 * Focus: the standard ring, following the circle. Colour changes use Duration fast; none under reduced motion.
 * Named group `bell`, so the icon follows the states.
 */
export const root =
  'nl:group/bell nl:relative nl:inline-flex nl:size-40 nl:shrink-0 nl:cursor-pointer nl:items-center nl:justify-center nl:rounded-full nl:p-m nl:bg-action-secondary nl:enabled:hover:bg-action-secondary-hovered nl:enabled:active:bg-action-secondary-pressed nl:enabled:aria-expanded:bg-action-secondary-pressed nl:disabled:cursor-default nl:disabled:bg-disabled nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused nl:focus:not-focus-visible:outline-none nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';

/** The icon slot: fg-action; hover fg-hovered; pressed and expanded fg-pressed; disabled fg-disabled-on_bg. */
export const icon =
  'nl:inline-flex nl:text-fg-action nl:group-enabled/bell:group-hover/bell:text-fg-hovered nl:group-enabled/bell:group-active/bell:text-fg-pressed nl:group-enabled/bell:group-aria-expanded/bell:text-fg-pressed nl:group-disabled/bell:text-fg-disabled-on-bg nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';

/**
 * Badge placement, on an aria-hidden wrapper around NlCountBadge (a flex box, so it hugs the badge). Dot: Space-M below the top and Space-M in from the
 * end. Number: starts at the vertical centre line and grows towards the end, Space-XS above the top.
 */
export const badge = {
  dot: 'nl:absolute nl:top-m nl:end-m nl:flex',
  number: 'nl:absolute nl:-top-xs nl:start-1/2 nl:flex',
} as const;
