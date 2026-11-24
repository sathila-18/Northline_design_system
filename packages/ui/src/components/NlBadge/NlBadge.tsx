import { NlBadgeBase, type NlBadgeBaseProps } from '../NlBadgeBase';
import * as styles from './NlBadge.styles';

export type NlBadgeTone = keyof typeof styles.tone;
export type NlBadgeSize = NonNullable<NlBadgeBaseProps['size']>;

export interface NlBadgeProps extends Omit<NlBadgeBaseProps, 'appearance'> {
  /** Status colour. The label must still say the status; colour is never the only signal. */
  tone?: NlBadgeTone;
}

/**
 * A status tag, such as "Active", "Pending" or "Tier 2", in one of eight status tones, or one of four member tier tones (DESIGN.md §9, NlBadge, D20).
 * Mapped on NlBadgeBase: passes the tone's fixed colours, size, label and optional icons (none by default).
 * Not interactive. Presentational, so no 'use client'.
 */
export function NlBadge({ tone = 'neutral', size = 'small', ...rest }: NlBadgeProps) {
  return <NlBadgeBase {...rest} size={size} appearance={styles.tone[tone]} data-tone={tone} />;
}
