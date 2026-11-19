// NlButton classes (DESIGN.md §9, NlButton). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
// Anatomy, sizes, icons and the focus ring come from the bases (NlButtonBase, NlWhiteButton, NlDestructiveButton).
// This file holds the full colour set per tone and variant, with every state, passed to the base as `appearance`
// (it replaces the base's resting colours, §7.2).
//
// State selectors:
// - Hover, pressed and expanded on the button use `not-disabled:not-aria-disabled:` instead of `enabled:`, because
//   `:enabled` never matches a link (`as="a"`). A disabled button and a disabled link (aria-disabled) both opt out.
// - Expanded (`aria-expanded="true"`, OD-57) uses the pressed look. It sorts after hover and pressed, so an open
//   button keeps the pressed look under the pointer.
// - Disabled is set for both `disabled:` (native button) and `aria-disabled:` (link).
// - The icon slot follows the button through the named group `button` (rule 3). Disabled sorts after hover and
//   pressed, so a disabled button's icon keeps the disabled colour.

/** Colour changes use Duration fast; none under reduced motion. Added to every look's button and icon. */
export const motion = 'nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';

/** tone="normal" (NlButtonBase): background, 2px inside border (inset ring) and label, then icon, per variant. */
export const normal = {
  primary: {
    button:
      'nl:bg-action-primary nl:text-white-both nl:not-disabled:not-aria-disabled:hover:bg-action-primary-hovered nl:not-disabled:not-aria-disabled:active:bg-action-primary-pressed nl:not-disabled:not-aria-disabled:aria-expanded:bg-action-primary-pressed nl:disabled:bg-disabled nl:disabled:text-disabled-on-bg nl:aria-disabled:bg-disabled nl:aria-disabled:text-disabled-on-bg',
    icon: 'nl:text-fg-white-both nl:group-disabled/button:text-fg-disabled-on-bg nl:group-aria-disabled/button:text-fg-disabled-on-bg',
  },
  secondary: {
    button:
      'nl:inset-ring-2 nl:inset-ring-active nl:text-action nl:not-disabled:not-aria-disabled:hover:bg-action-secondary-hovered nl:not-disabled:not-aria-disabled:hover:inset-ring-hovered nl:not-disabled:not-aria-disabled:hover:text-hovered nl:not-disabled:not-aria-disabled:active:bg-action-secondary-pressed nl:not-disabled:not-aria-disabled:active:inset-ring-pressed nl:not-disabled:not-aria-disabled:active:text-pressed nl:not-disabled:not-aria-disabled:aria-expanded:bg-action-secondary-pressed nl:not-disabled:not-aria-disabled:aria-expanded:inset-ring-pressed nl:not-disabled:not-aria-disabled:aria-expanded:text-pressed nl:disabled:inset-ring-disabled nl:disabled:text-disabled nl:aria-disabled:inset-ring-disabled nl:aria-disabled:text-disabled',
    icon: 'nl:text-fg-action nl:group-hover/button:text-fg-hovered nl:group-active/button:text-fg-pressed nl:group-aria-expanded/button:text-fg-pressed nl:group-disabled/button:text-fg-disabled nl:group-aria-disabled/button:text-fg-disabled',
  },
  tertiary: {
    button:
      'nl:text-action nl:not-disabled:not-aria-disabled:hover:bg-action-secondary-hovered nl:not-disabled:not-aria-disabled:hover:text-hovered nl:not-disabled:not-aria-disabled:active:bg-action-secondary-pressed nl:not-disabled:not-aria-disabled:active:text-pressed nl:not-disabled:not-aria-disabled:aria-expanded:bg-action-secondary-pressed nl:not-disabled:not-aria-disabled:aria-expanded:text-pressed nl:disabled:text-disabled nl:aria-disabled:text-disabled',
    icon: 'nl:text-fg-action nl:group-hover/button:text-fg-hovered nl:group-active/button:text-fg-pressed nl:group-aria-expanded/button:text-fg-pressed nl:group-disabled/button:text-fg-disabled nl:group-aria-disabled/button:text-fg-disabled',
  },
  /**
   * No background in any state. The label span is underlined on hover, press and expanded, never the icon: an
   * underline on the button would run under the icon too. Disabled sorts last, so a disabled link has none.
   */
  link: {
    button:
      'nl:text-action nl:not-disabled:not-aria-disabled:active:text-pressed nl:not-disabled:not-aria-disabled:aria-expanded:text-pressed nl:disabled:text-disabled nl:aria-disabled:text-disabled',
    label:
      'nl:group-hover/button:underline nl:group-active/button:underline nl:group-aria-expanded/button:underline nl:group-disabled/button:no-underline nl:group-aria-disabled/button:no-underline',
    icon: 'nl:text-fg-action nl:group-active/button:text-fg-pressed nl:group-aria-expanded/button:text-fg-pressed nl:group-disabled/button:text-fg-disabled nl:group-aria-disabled/button:text-fg-disabled',
  },
} as const;

/**
 * Content tones (tertiary, normal tone only). The label and icon keep the tone's colour in every state except
 * disabled; hover and press share one alpha background (OD-56). Disabled: text-disabled / fg-disabled, no background.
 * `default` is the plain tertiary above.
 */
export const contentTone = {
  default: normal.tertiary,
  inverse: {
    button:
      'nl:text-inverse nl:not-disabled:not-aria-disabled:hover:bg-alpha-light nl:not-disabled:not-aria-disabled:active:bg-alpha-light nl:not-disabled:not-aria-disabled:aria-expanded:bg-alpha-light nl:disabled:text-disabled nl:aria-disabled:text-disabled',
    icon: 'nl:text-fg-inverse nl:group-disabled/button:text-fg-disabled nl:group-aria-disabled/button:text-fg-disabled',
  },
  primary: {
    button:
      'nl:text-primary nl:not-disabled:not-aria-disabled:hover:bg-alpha-sm nl:not-disabled:not-aria-disabled:active:bg-alpha-sm nl:not-disabled:not-aria-disabled:aria-expanded:bg-alpha-sm nl:disabled:text-disabled nl:aria-disabled:text-disabled',
    icon: 'nl:text-fg-primary nl:group-disabled/button:text-fg-disabled nl:group-aria-disabled/button:text-fg-disabled',
  },
  secondary: {
    button:
      'nl:text-secondary nl:not-disabled:not-aria-disabled:hover:bg-alpha-sm nl:not-disabled:not-aria-disabled:active:bg-alpha-sm nl:not-disabled:not-aria-disabled:aria-expanded:bg-alpha-sm nl:disabled:text-disabled nl:aria-disabled:text-disabled',
    icon: 'nl:text-fg-secondary nl:group-disabled/button:text-fg-disabled nl:group-aria-disabled/button:text-fg-disabled',
  },
  info: {
    button:
      'nl:text-info nl:not-disabled:not-aria-disabled:hover:bg-alpha-sm nl:not-disabled:not-aria-disabled:active:bg-alpha-sm nl:not-disabled:not-aria-disabled:aria-expanded:bg-alpha-sm nl:disabled:text-disabled nl:aria-disabled:text-disabled',
    icon: 'nl:text-fg-info nl:group-disabled/button:text-fg-disabled nl:group-aria-disabled/button:text-fg-disabled',
  },
  success: {
    button:
      'nl:text-success nl:not-disabled:not-aria-disabled:hover:bg-alpha-sm nl:not-disabled:not-aria-disabled:active:bg-alpha-sm nl:not-disabled:not-aria-disabled:aria-expanded:bg-alpha-sm nl:disabled:text-disabled nl:aria-disabled:text-disabled',
    icon: 'nl:text-fg-success nl:group-disabled/button:text-fg-disabled nl:group-aria-disabled/button:text-fg-disabled',
  },
  error: {
    button:
      'nl:text-error nl:not-disabled:not-aria-disabled:hover:bg-alpha-sm nl:not-disabled:not-aria-disabled:active:bg-alpha-sm nl:not-disabled:not-aria-disabled:aria-expanded:bg-alpha-sm nl:disabled:text-disabled nl:aria-disabled:text-disabled',
    icon: 'nl:text-fg-error nl:group-disabled/button:text-fg-disabled nl:group-aria-disabled/button:text-fg-disabled',
  },
  warning: {
    button:
      'nl:text-warning nl:not-disabled:not-aria-disabled:hover:bg-alpha-sm nl:not-disabled:not-aria-disabled:active:bg-alpha-sm nl:not-disabled:not-aria-disabled:aria-expanded:bg-alpha-sm nl:disabled:text-disabled nl:aria-disabled:text-disabled',
    icon: 'nl:text-fg-warning nl:group-disabled/button:text-fg-disabled nl:group-aria-disabled/button:text-fg-disabled',
  },
} as const;

/** tone="white" (NlWhiteButton): one look, 1px border-subtle (inset ring) in every state. */
export const white = {
  button:
    'nl:bg-action-inverse nl:inset-ring nl:inset-ring-subtle nl:text-dark-both nl:not-disabled:not-aria-disabled:hover:bg-active nl:not-disabled:not-aria-disabled:hover:text-hovered nl:not-disabled:not-aria-disabled:active:bg-action-secondary-pressed nl:not-disabled:not-aria-disabled:active:text-pressed nl:not-disabled:not-aria-disabled:aria-expanded:bg-action-secondary-pressed nl:not-disabled:not-aria-disabled:aria-expanded:text-pressed nl:disabled:bg-disabled nl:disabled:text-disabled-on-bg nl:aria-disabled:bg-disabled nl:aria-disabled:text-disabled-on-bg',
  icon: 'nl:text-fg-dark-both nl:group-hover/button:text-fg-hovered nl:group-active/button:text-fg-pressed nl:group-aria-expanded/button:text-fg-pressed nl:group-disabled/button:text-fg-disabled-on-bg nl:group-aria-disabled/button:text-fg-disabled-on-bg',
} as const;

/** tone="destructive" (NlDestructiveButton): per variant. Label and icon stay error-coloured until disabled. */
export const destructive = {
  primary: {
    button:
      'nl:bg-action-destructive nl:text-white-both nl:not-disabled:not-aria-disabled:hover:bg-action-destructive-hovered nl:not-disabled:not-aria-disabled:active:bg-action-destructive-pressed nl:not-disabled:not-aria-disabled:aria-expanded:bg-action-destructive-pressed nl:disabled:bg-disabled nl:disabled:text-disabled-on-bg nl:aria-disabled:bg-disabled nl:aria-disabled:text-disabled-on-bg',
    icon: 'nl:text-fg-white-both nl:group-disabled/button:text-fg-disabled-on-bg nl:group-aria-disabled/button:text-fg-disabled-on-bg',
  },
  secondary: {
    button:
      'nl:inset-ring-2 nl:inset-ring-error nl:text-error nl:not-disabled:not-aria-disabled:hover:bg-action-destructive-secondary-hovered nl:not-disabled:not-aria-disabled:active:bg-action-destructive-secondary-pressed nl:not-disabled:not-aria-disabled:aria-expanded:bg-action-destructive-secondary-pressed nl:disabled:inset-ring-disabled nl:disabled:text-disabled nl:aria-disabled:inset-ring-disabled nl:aria-disabled:text-disabled',
    icon: 'nl:text-fg-error nl:group-disabled/button:text-fg-disabled nl:group-aria-disabled/button:text-fg-disabled',
  },
  tertiary: {
    button:
      'nl:text-error nl:not-disabled:not-aria-disabled:hover:bg-action-destructive-secondary-hovered nl:not-disabled:not-aria-disabled:active:bg-action-destructive-secondary-pressed nl:not-disabled:not-aria-disabled:aria-expanded:bg-action-destructive-secondary-pressed nl:disabled:text-disabled nl:aria-disabled:text-disabled',
    icon: 'nl:text-fg-error nl:group-disabled/button:text-fg-disabled nl:group-aria-disabled/button:text-fg-disabled',
  },
} as const;
