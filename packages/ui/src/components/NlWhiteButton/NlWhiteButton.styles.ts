// NlWhiteButton classes (DESIGN.md §9, NlWhiteButton). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
// Anatomy, sizes, icons and the focus ring come from NlButtonBase; this file only holds the white look.

/** Resting colours: white fill, 1px border-subtle inside (inset ring) in every size, dark label and icon. */
export const appearance = {
  button: 'nl:bg-action-inverse nl:inset-ring nl:inset-ring-subtle nl:text-dark-both',
  icon: 'nl:text-fg-dark-both',
} as const;
