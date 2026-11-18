// NlTextBlock classes (DESIGN.md §9, NlTextBlock). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).

/** The root: a vertical stack, label slot → content, gap Space-none. No padding; fills its container. */
export const root = 'nl:flex nl:flex-col nl:gap-none';

/** Alignment: the text, and the label slot on the cross axis. */
export const align = {
  start: 'nl:items-start nl:text-start',
  center: 'nl:items-center nl:text-center',
  end: 'nl:items-end nl:text-end',
} as const;

/** The content: heading → description, full width so the text alignment applies. */
export const content = 'nl:flex nl:w-full nl:flex-col';

/** Gap heading → description, per type. */
export const contentGap = {
  'display-large': 'nl:gap-m',
  'display-medium': 'nl:gap-m',
  'display-small': 'nl:gap-m',
  'headline-large': 'nl:gap-m',
  'headline-medium': 'nl:gap-xs',
  'headline-small': 'nl:gap-xs',
  label: 'nl:gap-none',
  body: 'nl:gap-none',
} as const;

/** Heading text style, per type. The body type has no heading (OD-41). */
export const heading = {
  'display-large': 'nl:m-none nl:text-display-large-h1',
  'display-medium': 'nl:m-none nl:text-display-medium-h2',
  'display-small': 'nl:m-none nl:text-display-small-h3',
  'headline-large': 'nl:m-none nl:text-headline-large-h4',
  'headline-medium': 'nl:m-none nl:text-headline-medium-h5',
  'headline-small': 'nl:m-none nl:text-headline-small-h6',
  label: 'nl:m-none nl:text-label-m',
} as const;

/** Description text style, per type. */
export const description = {
  'display-large': 'nl:m-none nl:text-body-l',
  'display-medium': 'nl:m-none nl:text-body-l',
  'display-small': 'nl:m-none nl:text-body-m',
  'headline-large': 'nl:m-none nl:text-body-m',
  'headline-medium': 'nl:m-none nl:text-body-m',
  'headline-small': 'nl:m-none nl:text-body-m',
  label: 'nl:m-none nl:text-body-s',
  body: 'nl:m-none nl:text-body-l',
} as const;

/** Heading colour: text-primary; inverse text-inverse; disabled text-disabled (OD-15). */
export const headingColour = {
  default: 'nl:text-primary',
  inverse: 'nl:text-inverse',
  disabled: 'nl:text-disabled',
} as const;

/** Description colour: text-secondary; inverse text-inverse; disabled text-disabled (OD-15). */
export const descriptionColour = {
  default: 'nl:text-secondary',
  inverse: 'nl:text-inverse',
  disabled: 'nl:text-disabled',
} as const;
