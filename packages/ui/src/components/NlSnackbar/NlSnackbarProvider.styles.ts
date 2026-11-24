// NlSnackbarProvider classes (DESIGN.md §9, NlSnackbar). Whole literal class strings only (CLAUDE.md, Tailwind
// rule 1).

/**
 * The region per placement, on --nl-z-snackbar (OD-104). Bottom centre (default): fixed Space-3XL up, centred.
 * Top end (OD-245): fixed Space-3XL from the top and the end. It lets clicks through; the snackbar takes them.
 * `className` can place it (for example in the content panel).
 */
export const region = {
  'bottom-center':
    'nl:pointer-events-none nl:fixed nl:inset-x-none nl:bottom-3xl nl:z-snackbar nl:flex nl:justify-center nl:px-3xl',
  'top-end': 'nl:pointer-events-none nl:fixed nl:end-3xl nl:top-3xl nl:z-snackbar nl:flex nl:justify-end',
} as const;

/** The two live regions (polite status, assertive alert) exist from page load, empty until a snackbar shows. */
export const live = 'nl:flex nl:justify-center';

/**
 * The snackbar's frame: takes pointer events; fades and slides up Space-M with Duration base and the standard ease.
 * Reduced motion: no slide (the durations are zero there, so the fade is instant too).
 */
export const frame =
  'nl:pointer-events-auto nl:transition nl:duration-base nl:ease-standard nl:motion-reduce:translate-y-none';

export const motion = {
  /** Bottom centre: comes up from Space-M below. Top end: comes down from Space-M above. */
  hidden: {
    'bottom-center': 'nl:translate-y-m nl:opacity-0',
    'top-end': 'nl:-translate-y-m nl:opacity-0',
  },
  shown: 'nl:translate-y-none nl:opacity-100',
} as const;
