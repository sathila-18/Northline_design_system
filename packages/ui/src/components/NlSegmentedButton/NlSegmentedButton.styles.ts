// NlSegmentedButton classes (DESIGN.md §9, NlSegmentedButton). Whole literal class strings only (CLAUDE.md, Tailwind
// rule 1). Segment sizes, radius and colours come from NlSegment.

/** The track: bg-tertiary, a row of segments, items centred. */
export const track = 'nl:flex nl:items-center nl:bg-tertiary';

/**
 * Track padding, gap between segments, radius and height per size. Height = segment height + padding. Radius-S at
 * every size (D19); segments inside use Radius-XS where the track has Space-XS padding, so the corners stay parallel.
 */
export const size = {
  medium: 'nl:h-48 nl:p-xs nl:gap-l nl:rounded-s',
  small: 'nl:h-40 nl:p-xs nl:gap-xs nl:rounded-s',
  xsmall: 'nl:h-24 nl:p-none nl:gap-none nl:rounded-s',
} as const;

/** Labelled: the track fills its container. Icon only: it hugs its segments. */
export const width = {
  labelled: 'nl:w-full',
  iconOnly: 'nl:w-fit',
} as const;

/** Labelled segments share the width equally (set on each segment, for placement). */
export const segmentShare = 'nl:min-w-0 nl:flex-1';
