// NlAssistChip classes (DESIGN.md §9, NlAssistChip). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
// Anatomy, sizes and the `chip` group come from NlChipBase; this file holds the button behaviour classes and the full
// colour set for closed and open, passed to the base as `appearance` (it replaces the resting colours, §7.2).
// "No border" is the 1px inset ring at width 0. Pressed sorts after hover; disabled after both.

/** The button: pointer, standard focus ring (keyboard only, follows Radius-S), colour changes at Duration fast. */
export const interactive =
  'nl:cursor-pointer nl:disabled:cursor-default nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused nl:focus:not-focus-visible:outline-none nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';

/**
 * Closed (and every action chip): bordered look with the resting shadow. Hover drops border and shadow; pressed is
 * white on the pressed brand fill; disabled has no border or shadow.
 * Open: the selected look. Hovering an open chip keeps it (designer's choice, 19 Nov 2026); pressing still shows the
 * pressed look as click feedback.
 */
export const state = {
  closed: {
    chip: 'nl:bg-primary nl:inset-ring nl:inset-ring-default nl:shadow-resting nl:text-primary nl:enabled:hover:bg-active-hover nl:enabled:hover:inset-ring-0 nl:enabled:hover:shadow-none nl:enabled:active:bg-action-primary-pressed nl:enabled:active:inset-ring-0 nl:enabled:active:shadow-none nl:enabled:active:text-white-both nl:disabled:bg-disabled nl:disabled:inset-ring-0 nl:disabled:shadow-none nl:disabled:text-disabled-on-bg',
    leading:
      'nl:text-fg-secondary nl:group-active/chip:text-fg-white-both nl:group-disabled/chip:text-fg-disabled-on-bg nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none',
    trailing:
      'nl:text-fg-secondary nl:group-active/chip:text-fg-white-both nl:group-disabled/chip:text-fg-disabled-on-bg nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none',
  },
  open: {
    chip: 'nl:bg-active nl:inset-ring nl:inset-ring-active nl:text-action nl:enabled:active:bg-action-primary-pressed nl:enabled:active:inset-ring-0 nl:enabled:active:text-white-both nl:disabled:bg-disabled nl:disabled:inset-ring-0 nl:disabled:text-disabled-on-bg',
    leading:
      'nl:text-fg-brand nl:group-active/chip:text-fg-white-both nl:group-disabled/chip:text-fg-disabled-on-bg nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none',
    trailing:
      'nl:text-fg-secondary nl:group-active/chip:text-fg-white-both nl:group-disabled/chip:text-fg-disabled-on-bg nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none',
  },
} as const;

/** NlIcon size per chip size (as NlChipBase). */
export const iconSize = {
  xsmall: 16,
  small: 16,
  large: 20,
} as const;
