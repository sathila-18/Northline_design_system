import type { ComponentPropsWithRef, CSSProperties } from 'react';
import * as styles from './NlProgressBar.styles';

export type NlProgressBarSize = keyof typeof styles.size;

interface NlProgressBarBaseProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'role' | 'aria-label' | 'aria-labelledby'
> {
  /** Track height: large Size-8, small Size-4. */
  size?: NlProgressBarSize;
  /** Percent done, 0 to 100. Clamped; anything that isn't a number counts as 0. */
  value: number;
}

/** An accessible name is required: either a label, or the id of a visible label. */
export type NlProgressBarProps = NlProgressBarBaseProps &
  ({ label: string; 'aria-labelledby'?: never } | { label?: never; 'aria-labelledby': string });

const clamp = (value: number) => (Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0);

/**
 * A horizontal bar that shows how much of a task is done (DESIGN.md §9, NlProgressBar).
 * role progressbar, 0 to 100, with a name from `label` or `aria-labelledby`. Not interactive.
 * Presentational, so no 'use client'.
 */
export function NlProgressBar({ size = 'small', value, label, className, ...rest }: NlProgressBarProps) {
  const percent = clamp(value);
  const classes = [styles.track, styles.size[size], className].filter(Boolean).join(' ');
  // The only inline value is data: the fill's width as a custom property, read by nl:progress-fill.
  const fillStyle = { '--nl-progress-value': `${String(percent)}%` } as CSSProperties;

  return (
    <div
      {...rest}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className={classes}
      data-size={size}
    >
      <div className={styles.fill} style={fillStyle} />
    </div>
  );
}
