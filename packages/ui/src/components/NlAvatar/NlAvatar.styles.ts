// NlAvatar classes (DESIGN.md §9, NlAvatar). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).

/** The bounding box. Holds the circle and the status dot as siblings, so the circle clips the photo, not the dot. */
export const root = 'nl:relative nl:inline-flex nl:shrink-0';

/** Bounding box size, from Size-*. */
export const size = {
  xsmall: 'nl:size-24',
  small: 'nl:size-32',
  medium: 'nl:size-40',
  large: 'nl:size-48',
  xlarge: 'nl:size-56',
  xxlarge: 'nl:size-64',
  xxxlarge: 'nl:size-96',
} as const;

/** The circle: Radius-Full, 1px border-subtle inside (border-box, §4.2), content centred and clipped. */
export const circle =
  'nl:flex nl:size-full nl:items-center nl:justify-center nl:overflow-hidden nl:rounded-full nl:border nl:border-subtle';

/** Fill and content colour per type. The photo covers the circle, so the image type has no fill. */
export const type = {
  image: '',
  text: 'nl:bg-icons nl:text-secondary',
  icon: 'nl:bg-icons nl:text-fg-secondary',
} as const;

/** The photo covers the circle. */
export const image = 'nl:size-full nl:object-cover';

/** Initials text style per size. */
export const initials = {
  xsmall: 'nl:select-none nl:text-label-s',
  small: 'nl:select-none nl:text-label-m',
  medium: 'nl:select-none nl:text-label-l',
  large: 'nl:select-none nl:text-title-l',
  xlarge: 'nl:select-none nl:text-headline-medium-h5',
  xxlarge: 'nl:select-none nl:text-headline-large-h4',
  xxxlarge: 'nl:select-none nl:text-display-medium-h2',
} as const;

/** NlIcon size per avatar size. */
export const iconSize = {
  xsmall: 16,
  small: 20,
  medium: 24,
  large: 24,
  xlarge: 36,
  xxlarge: 48,
  xxxlarge: 64,
} as const;

/**
 * Status dot placement, bottom-right. The dot's 1px ring touches the bounding box up to xlarge, and sits Space-XXS
 * further in for xxlarge and xxxlarge.
 */
export const dot = {
  xsmall: 'nl:absolute nl:end-none nl:bottom-none',
  small: 'nl:absolute nl:end-none nl:bottom-none',
  medium: 'nl:absolute nl:end-none nl:bottom-none',
  large: 'nl:absolute nl:end-none nl:bottom-none',
  xlarge: 'nl:absolute nl:end-none nl:bottom-none',
  xxlarge: 'nl:absolute nl:end-xxs nl:bottom-xxs',
  xxxlarge: 'nl:absolute nl:end-xxs nl:bottom-xxs',
} as const;
