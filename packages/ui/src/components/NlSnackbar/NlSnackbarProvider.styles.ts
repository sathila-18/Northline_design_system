// NlSnackbarProvider classes (DESIGN.md §9, NlSnackbar). Whole literal class strings only (CLAUDE.md, Tailwind
// rule 1).

/**
 * The region: fixed at the bottom centre, Space-3XL up, on --nl-z-snackbar (OD-104). It lets clicks through; the
 * snackbar takes them. `className` can place it (for example in the content panel).
 */
export const region =
  'nl:pointer-events-none nl:fixed nl:inset-x-none nl:bottom-3xl nl:z-snackbar nl:flex nl:justify-center nl:px-3xl';

/** The two live regions (polite status, assertive alert) exist from page load, empty until a snackbar shows. */
export const live = 'nl:flex nl:justify-center';

/**
 * The snackbar's frame: takes pointer events; fades and slides up Space-M with Duration base and the standard ease.
 * Reduced motion: no slide (the durations are zero there, so the fade is instant too).
 */
export const frame =
  'nl:pointer-events-auto nl:transition nl:duration-base nl:ease-standard nl:motion-reduce:translate-y-none';

export const motion = {
  hidden: 'nl:translate-y-m nl:opacity-0',
  shown: 'nl:translate-y-none nl:opacity-100',
} as const;
