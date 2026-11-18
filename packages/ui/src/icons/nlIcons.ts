import type { MaterialSymbol } from 'material-symbols';

/**
 * The nlIcons registry (DESIGN.md §6). Every icon NlIcon can show, as Material Symbols Rounded name → code point.
 *
 * NlIcon renders the glyph at its code point, never a drawing. The icon font is subset to exactly these code
 * points at build time (`pnpm icons`, scripts/subset-icons.mjs). Each code point is the glyph the font's own
 * ligature gives for the name. `satisfies` checks every name is a real Material Symbols icon.
 *
 * To add an icon: add its name and code point here (alphabetical), then run `pnpm icons`.
 */
export const nlIcons = {
  add: 0xe145,
  arrow_back: 0xe5c4,
  arrow_downward: 0xe5db,
  arrow_upward: 0xe5d8,
  calendar_today: 0xe935,
  cancel: 0xe5c9,
  check: 0xe5ca,
  check_circle: 0xe86c,
  chevron_left: 0xe408,
  chevron_right: 0xe409,
  close: 0xe14c,
  delete: 0xe872,
  dock_to_right: 0xf7e4,
  error: 0xe000,
  info: 0xe88e,
  keyboard_arrow_down: 0xe313,
  keyboard_arrow_up: 0xe316,
  menu: 0xe5d2,
  more_vert: 0xe5d4,
  remove: 0xe15b,
  search: 0xe8b6,
  unfold_more: 0xe5d7,
  visibility: 0xe417,
  visibility_off: 0xe8f5,
  warning: 0xe002,
} as const satisfies Partial<Record<MaterialSymbol, number>>;

/** A name in the nlIcons registry. */
export type NlIconName = keyof typeof nlIcons;

/** Every registered name, in registry order. */
export const nlIconNames = Object.keys(nlIcons) as NlIconName[];
