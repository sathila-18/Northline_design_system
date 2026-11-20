// NlEmptyState classes (DESIGN.md §9, NlEmptyState). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: root (vertical, centred) → top group (icon, text) → action (optional).

/** The root: fills its container, vertical, items centred, gap Space-3XL (top group → action), text centred. */
export const root = 'nl:flex nl:w-full nl:flex-col nl:items-center nl:gap-3xl nl:text-center';

/** The top group: vertical, items centred, gap Space-XL (icon → text). */
export const top = 'nl:flex nl:w-full nl:flex-col nl:items-center nl:gap-xl';

/** The action: hugs its content, centred. */
export const action = 'nl:flex nl:flex-wrap nl:items-center nl:justify-center nl:gap-xl';
