import type { ComponentPropsWithRef, CSSProperties } from 'react';
import { NlIcon } from '../../icons';
import * as styles from './NlSpinner.styles';

export type NlSpinnerStatus = 'loading' | 'success' | 'error';

export interface NlSpinnerProps extends Omit<ComponentPropsWithRef<'span'>, 'children' | 'role'> {
  /** Loading (the ring), or the result: success (tick) or error (warning). */
  status?: NlSpinnerStatus;
  /** Percent done, 0 to 100, for a ring that shows progress. Without it, a quarter arc turns (OD-62). */
  value?: number;
  /**
   * The accessible name, required. While loading, what is loading ("Loading rewards"); for the result, the outcome
   * ("Upload complete", "Upload failed"), which is announced.
   */
  label: string;
}

const clamp = (value: number) => (Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0);

/**
 * A round loading indicator that can end in a success tick or an error mark (DESIGN.md §9, NlSpinner).
 * Loading: role progressbar named by `label`, with a value only when `value` is set. A visually hidden role status
 * region is always rendered and gets the label once the status is success or error, so the change is announced.
 * Not interactive. Presentational, so no 'use client'.
 */
export function NlSpinner({ status = 'loading', value, label, className, ...rest }: NlSpinnerProps) {
  const classes = [styles.root, className].filter(Boolean).join(' ');
  const hasValue = value !== undefined;
  const percent = hasValue ? clamp(value) : undefined;
  // The only inline value is data: the arc length as a custom property, read by nl:spinner-value.
  const arcStyle = hasValue ? ({ '--nl-spinner-value': String(percent) } as CSSProperties) : undefined;

  return (
    <span {...rest} className={classes} data-status={status}>
      {status === 'loading' ? (
        <span
          role="progressbar"
          aria-label={label}
          {...(hasValue ? { 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': percent } : {})}
          className={styles.loader}
        >
          {/* Artwork (OD-61): 40 × 40 viewBox, radius 18 so the 4 stroke fits; starts at the top. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 40 40"
            className={hasValue ? styles.ring : `${styles.ring} ${styles.turning}`}
          >
            <circle className={styles.track} cx="20" cy="20" r="18" strokeWidth="4" />
            <circle
              className={styles.arc}
              style={arcStyle}
              cx="20"
              cy="20"
              r="18"
              strokeWidth="4"
              strokeLinecap="round"
              pathLength="100"
              transform="rotate(-90 20 20)"
            />
          </svg>
        </span>
      ) : (
        <span aria-hidden="true" className={styles.result[status]} data-slot="result">
          <NlIcon name={status === 'success' ? 'check' : 'warning'} size={24} tone="inherit" />
        </span>
      )}
      <span role="status" className={styles.announcer}>
        {status === 'loading' ? '' : label}
      </span>
    </span>
  );
}
