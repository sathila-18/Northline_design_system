// NlButtonDock classes (DESIGN.md §9, NlButtonDock). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: root (vertical) → accessory (optional) → button row (tertiary at the start, end group at the end).

/**
 * The root: full width, bg-primary, vertical, gap Space-3XL (accessory → buttons). Padding Space-XL top, Space-3XL
 * sides, Space-6XL bottom.
 */
export const root = 'nl:flex nl:w-full nl:flex-col nl:gap-3xl nl:bg-primary nl:px-3xl nl:pt-xl nl:pb-6xl';

/** Sticky look: --nl-shadow-sticky (the container pins it). */
export const sticky = {
  on: 'nl:shadow-sticky',
  off: 'nl:shadow-none',
} as const;

/** The button row: tertiary at the start, the end group at the end; wraps on narrow containers (OD-170). */
export const row = 'nl:flex nl:flex-wrap nl:items-center nl:justify-between nl:gap-xl';

/** The end group: secondary then primary, Space-XL apart, at the end; wraps and stays at the end. */
export const end = 'nl:ms-auto nl:flex nl:flex-wrap nl:items-center nl:justify-end nl:gap-xl';
