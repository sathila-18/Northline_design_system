// NlSpinner classes (DESIGN.md §9, NlSpinner). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).

/** The root: the Size-48 box, content centred. */
export const root = 'nl:relative nl:inline-flex nl:size-48 nl:shrink-0 nl:items-center nl:justify-center';

/** The loading part (role progressbar): fills the box, ring centred. */
export const loader = 'nl:inline-flex nl:size-48 nl:items-center nl:justify-center';

/** The SVG ring, Size-40. The ring's 4 stroke width and geometry are artwork (OD-61), set in the SVG. */
export const ring = 'nl:size-40 nl:fill-none';

/** Turning (no value): one turn per Duration pulse, linear (OD-63). Reduced motion: still (rule 6). */
export const turning = 'nl:animate-spinner-turn nl:motion-reduce:animate-none';

/** The track: the full ring, bg-active-hover. */
export const track = 'nl:spinner-track';

/** The arc: fg-brand, its length from --nl-spinner-value (a quarter when turning). */
export const arc = 'nl:spinner-arc nl:spinner-value';

/** The result circle: Size-48, Radius-Full, NlIcon 24 centred. Colours per status. */
export const result = {
  success:
    'nl:inline-flex nl:size-48 nl:items-center nl:justify-center nl:rounded-full nl:bg-success-secondary nl:text-fg-success',
  error:
    'nl:inline-flex nl:size-48 nl:items-center nl:justify-center nl:rounded-full nl:bg-error-secondary nl:text-fg-error',
} as const;

/** The live region: always rendered, visually hidden; holds the label once the spinner ends. */
export const announcer = 'nl:sr-only';
