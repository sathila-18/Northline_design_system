'use client';

import { useState, type ChangeEvent, type ComponentPropsWithRef, type CSSProperties } from 'react';
import * as styles from './NlSlider.styles';

interface NlSliderBaseProps extends Omit<
  ComponentPropsWithRef<'input'>,
  | 'type'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'min'
  | 'max'
  | 'step'
  | 'children'
  | 'aria-label'
  | 'aria-labelledby'
> {
  /** Controlled value. */
  value?: number;
  /** Starting value when uncontrolled. Defaults to `min`. */
  defaultValue?: number;
  /** Lowest value. Default 0 (OD-11). */
  min?: number;
  /** Highest value. Default 100 (OD-11). */
  max?: number;
  /** Step between values. Default 1 (OD-11). */
  step?: number;
  /** Called with the new value as a number. */
  onChange?: (value: number) => void;
}

/** An accessible name is required: either aria-label, or the id of a visible label. */
export type NlSliderProps = NlSliderBaseProps &
  (
    | {
        /** The slider's accessible name. Use it, or `aria-labelledby`. */
        'aria-label': string;
        /** The id of a visible label that names the slider. */
        'aria-labelledby'?: never;
      }
    | { 'aria-label'?: never; 'aria-labelledby': string }
  );

const percentOf = (value: number, min: number, max: number) => {
  if (!Number.isFinite(value) || max <= min) return 0;
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
};

/**
 * Picks one value along a range by dragging a thumb or with the keyboard (DESIGN.md §9, NlSlider).
 * A native <input type="range"> (keyboard, screen reader, form value) drawn as a track, fill and thumb.
 * Controlled (`value`) or uncontrolled (`defaultValue`). `ref` and native input attributes go to the input;
 * `className` goes to the root, for placement only.
 */
export function NlSlider({
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  className,
  disabled,
  ...rest
}: NlSliderProps) {
  const [inner, setInner] = useState(defaultValue ?? min);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    if (!controlled) setInner(next);
    onChange?.(next);
  };

  // The only inline value is data: the position as a percent of the range, read by nl:slider-fill and nl:slider-thumb.
  const rootStyle = { '--nl-slider-value': `${String(percentOf(current, min, max))}%` } as CSSProperties;
  const rootClasses = [styles.root, className].filter(Boolean).join(' ');

  return (
    <div className={rootClasses} style={rootStyle} data-value={current} data-disabled={disabled ? '' : undefined}>
      <input
        {...rest}
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        disabled={disabled}
        onChange={handleChange}
        className={styles.input}
      />
      <span aria-hidden="true" className={styles.track} />
      <span aria-hidden="true" className={styles.fill} />
      <span aria-hidden="true" className={styles.thumb} />
    </div>
  );
}
