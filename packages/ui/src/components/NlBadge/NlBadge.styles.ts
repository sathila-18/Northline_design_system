// NlBadge classes (DESIGN.md §9, NlBadge). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
// The shape comes from NlBadgeBase; this file only holds the fixed colours per tone, passed as `appearance`.

/**
 * Background, 1px inside border (inset ring) and text colour per tone (`badge`), and the icon colour (`icon`, the
 * fg-* token matching each text token, OD-52).
 */
export const tone = {
  primary: { badge: 'nl:bg-brand nl:text-white-both', icon: 'nl:text-fg-white-both' },
  secondary: { badge: 'nl:inset-ring nl:inset-ring-strong nl:text-secondary', icon: 'nl:text-fg-secondary' },
  success: {
    badge: 'nl:bg-success-secondary nl:inset-ring nl:inset-ring-success nl:text-success',
    icon: 'nl:text-fg-success',
  },
  error: { badge: 'nl:bg-error-secondary nl:inset-ring nl:inset-ring-error nl:text-error', icon: 'nl:text-fg-error' },
  info: { badge: 'nl:bg-info-secondary nl:inset-ring nl:inset-ring-info nl:text-info', icon: 'nl:text-fg-info' },
  warning: {
    badge: 'nl:bg-warning-secondary nl:inset-ring nl:inset-ring-warning nl:text-warning',
    icon: 'nl:text-fg-warning',
  },
  neutral: { badge: 'nl:bg-neutral nl:text-secondary', icon: 'nl:text-fg-secondary' },
  disabled: { badge: 'nl:bg-disabled nl:text-disabled-on-bg', icon: 'nl:text-fg-disabled-on-bg' },
} as const;
