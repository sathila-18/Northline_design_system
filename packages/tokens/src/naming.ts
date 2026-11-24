// Token names in code (DESIGN.md §3.8). Shared by build.ts and the tests.
// Names are lowercased; spaces, "_" and "." become "-". Every CSS variable starts with --nl-.

export const BRANDS = ['Northline', 'Garnet', 'Voltic'] as const;
export const THEMES = ['Light', 'Dark'] as const;
export type Brand = (typeof BRANDS)[number];
export type Theme = (typeof THEMES)[number];

export const slug = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .replace(/[\s_.]+/g, '-');

/** CSS variable name (without the leading --) for a token path in tokens/design.tokens.json. */
export function cssName(path: readonly string[]): string {
  const [collection, ...rest] = path;
  const last = rest.at(-1) ?? '';
  switch (collection) {
    case 'Primitives': {
      const [group, sub] = rest;
      if (group === 'Colors') return `nl-palette-${slug(last)}`; // royal-blue-500, and base.white → palette-white
      if (group === 'Typography') {
        if (sub === 'Font style') return `nl-font-family-${slug(last)}`;
        return `nl-${slug(last)}`; // Font Weight-400 → font-weight-400, Line Height-62_4 → line-height-62-4
      }
      return `nl-${slug(last)}`; // Size-16 → size-16, Breakpoint-1024 → breakpoint-1024
    }
    case 'Alias Colors':
      return `nl-color-${slug(last)}`; // Primary-500 → color-primary-500, Base.White → color-white
    case 'Alias Typography': {
      const [style = '', property = ''] = rest;
      const short: Partial<Record<string, string>> = {
        'Font family': 'family',
        'Font weight': 'weight',
        'Font size': 'size',
        'Line height': 'line-height',
      };
      return `nl-font-${slug(style)}-${short[property] ?? slug(property)}`;
    }
    case 'Color collection':
      return `nl-${slug(last)}`; // bg-action-primary_hovered → bg-action-primary-hovered, Alpha-md → alpha-md
    case 'Alias Spacing & Radius':
      return `nl-${slug(last)}`; // Space-XL → space-xl, Radius-S → radius-s
    default:
      throw new Error(`Unknown collection in token path: ${path.join('.')}`);
  }
}

/** Name of a text style in code: "Display Large-H1" → "display-large-h1". */
export const textStyleName = (style: string): string => slug(style);

/**
 * Tailwind theme keys for a semantic token (DESIGN.md §3.8, §3.11). The group prefix is dropped and the token
 * goes into the namespace of the utility it is for, so `bg-primary` becomes `nl:bg-primary`.
 * Foreground (icon) tokens also work as text, background, fill and stroke colours, with an `fg-` prefix
 * where the utility's own group would otherwise clash (`nl:text-fg-secondary`, `nl:bg-fg-brand`, `nl:fill-brand`).
 */
export function tailwindKeys(semantic: string): { key: string; utility: string }[] {
  const name = slug(semantic);
  const [group] = name.split('-');
  const rest = name.slice(name.indexOf('-') + 1);
  switch (group) {
    case 'bg':
      return [{ key: `--background-color-${rest}`, utility: `bg-${rest}` }];
    case 'text':
      return [{ key: `--text-color-${rest}`, utility: `text-${rest}` }];
    case 'border':
      return [
        { key: `--border-color-${rest}`, utility: `border-${rest}` },
        { key: `--outline-color-${rest}`, utility: `outline-${rest}` },
        { key: `--ring-color-${rest}`, utility: `inset-ring-${rest}` },
        // Background too, for fills drawn in a border colour (divider section band, switch disabled track).
        { key: `--background-color-border-${rest}`, utility: `bg-border-${rest}` },
      ];
    case 'fg':
      return [
        { key: `--text-color-fg-${rest}`, utility: `text-fg-${rest}` },
        { key: `--background-color-fg-${rest}`, utility: `bg-fg-${rest}` },
        // Border too, for controls drawn in a foreground colour (radio ring, DESIGN.md §9 NlRadio).
        { key: `--border-color-fg-${rest}`, utility: `border-fg-${rest}` },
        { key: `--fill-${rest}`, utility: `fill-${rest}` },
        { key: `--stroke-${rest}`, utility: `stroke-${rest}` },
      ];
    case 'alpha':
      return [{ key: `--background-color-alpha-${rest}`, utility: `bg-alpha-${rest}` }];
    case 'chart':
      // Chart colours (D9): Recharts reads the CSS variables; the utilities are for legend and tooltip markers.
      return [
        { key: `--background-color-chart-${rest}`, utility: `bg-chart-${rest}` },
        { key: `--text-color-chart-${rest}`, utility: `text-chart-${rest}` },
        { key: `--border-color-chart-${rest}`, utility: `border-chart-${rest}` },
        { key: `--fill-chart-${rest}`, utility: `fill-chart-${rest}` },
        { key: `--stroke-chart-${rest}`, utility: `stroke-chart-${rest}` },
      ];
    default:
      throw new Error(`Unknown semantic group: ${semantic}`);
  }
}
