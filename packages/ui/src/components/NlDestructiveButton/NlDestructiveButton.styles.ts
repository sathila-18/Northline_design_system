// NlDestructiveButton classes (DESIGN.md §9, NlDestructiveButton). Whole literal class strings only (CLAUDE.md,
// Tailwind rule 1). Anatomy, sizes, icons and the focus ring come from NlButtonBase; this file only holds the colours.

/** Resting colours per variant: `button` (background, 2px inside border as an inset ring, label) and `icon`. */
export const variant = {
  primary: { button: 'nl:bg-action-destructive nl:text-white-both', icon: 'nl:text-fg-white-both' },
  secondary: { button: 'nl:inset-ring-2 nl:inset-ring-error nl:text-error', icon: 'nl:text-fg-error' },
  tertiary: { button: 'nl:text-error', icon: 'nl:text-fg-error' },
} as const;
