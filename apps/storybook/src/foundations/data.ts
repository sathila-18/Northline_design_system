// Hand-written foundation tokens (packages/tokens/src/styles.css). Names and uses from DESIGN.md §4.1, §4.3, §5 and §6.

export const shadows = [
  { name: 'resting', use: 'Cards and surfaces at rest' },
  { name: 'panel', use: 'Panels on the page' },
  { name: 'menu', use: 'Menus and popovers' },
  { name: 'sticky', use: 'Sticky bottom bars' },
  { name: 'sticky-end', use: 'Fixed table columns (shadow falls to the left)' },
] as const;

export const layers = [
  { name: 'base', use: 'Page content' },
  { name: 'sticky', use: 'Sticky headers, fixed table columns, sticky bottom bars' },
  { name: 'overlay', use: 'Overlay (scrim)' },
  { name: 'modal', use: 'Dialogs and side sheets' },
  { name: 'menu', use: 'Menus, popovers, the calendar' },
  { name: 'tooltip', use: 'Tooltips' },
  { name: 'snackbar', use: 'Snackbars' },
] as const;

export const motion = [
  { name: '--nl-duration-fast', use: 'Hover and press' },
  { name: '--nl-duration-base', use: 'Menus, tooltips' },
  { name: '--nl-duration-slow', use: 'Side sheets, dialogs' },
  { name: '--nl-duration-pulse', use: 'Skeleton loading pulse (one full cycle)' },
  { name: '--nl-ease-standard', use: 'Default easing' },
] as const;

export const iconSizes = [16, 20, 24, 36, 48, 64] as const;
