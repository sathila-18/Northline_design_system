'use client';

import { useId, useState, type ComponentPropsWithRef, type KeyboardEvent } from 'react';
import type { NlIconName } from '../../icons';
import { NlSegment, type NlSegmentSize } from '../NlSegment';
import { NlTooltip } from '../NlTooltip';
import * as styles from './NlSegmentedButton.styles';

/** One option: its value, its label (visible, or the hidden name and tooltip when icon-only) and an optional icon. */
export interface NlSegmentedButtonOption {
  value: string;
  label: string;
  icon?: NlIconName;
}

type WithIcon = NlSegmentedButtonOption & { icon: NlIconName };

/** 2 or 3 options (OD-75). Icon-only needs an icon on every option. */
type NlSegmentedButtonOptionsProps =
  | {
      iconOnly?: false;
      options:
        | [NlSegmentedButtonOption, NlSegmentedButtonOption]
        | [NlSegmentedButtonOption, NlSegmentedButtonOption, NlSegmentedButtonOption];
    }
  | { iconOnly: true; options: [WithIcon, WithIcon] | [WithIcon, WithIcon, WithIcon] };

/** An accessible name is required: aria-label, or the id of a visible label. */
type NlSegmentedButtonNameProps =
  { 'aria-label': string; 'aria-labelledby'?: never } | { 'aria-label'?: never; 'aria-labelledby': string };

interface NlSegmentedButtonCommonProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'role' | 'defaultValue' | 'aria-label' | 'aria-labelledby'
> {
  /** The selected option's value (controlled). */
  value?: string;
  /** The starting option when uncontrolled. Default the first option. */
  defaultValue?: string;
  /** Called with the new value when another option is chosen. */
  onValueChange?: (value: string) => void;
  /** Track and segment size. Default medium. */
  size?: NlSegmentSize;
  /** Disables every segment. */
  disabled?: boolean;
}

export type NlSegmentedButtonProps = NlSegmentedButtonCommonProps &
  NlSegmentedButtonOptionsProps &
  NlSegmentedButtonNameProps;

/**
 * A row of 2 or 3 options where exactly one is selected (DESIGN.md §9, NlSegmentedButton). A role radiogroup of
 * NlSegments (native radios sharing a name): one tab stop, arrow keys move and select (wrapping), Home and End go to the
 * first and last. Icon only: each segment keeps its label as its name and shows it in an NlTooltip. Controlled
 * (`value`) or uncontrolled (`defaultValue`). `ref`, `className` and native attributes go to the track.
 */
export function NlSegmentedButton({
  options,
  value,
  defaultValue,
  onValueChange,
  size = 'medium',
  iconOnly = false,
  disabled = false,
  className,
  onKeyDown,
  ...rest
}: NlSegmentedButtonProps) {
  const name = useId();
  const [inner, setInner] = useState(defaultValue ?? options[0].value);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;

  const choose = (next: string) => {
    if (next === current) return;
    if (!controlled) setInner(next);
    onValueChange?.(next);
  };

  // Native radios give arrow keys; Home and End are added here.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled || (event.key !== 'Home' && event.key !== 'End')) return;
    event.preventDefault();
    const target = event.key === 'Home' ? options[0] : options[options.length - 1];
    if (!target) return;
    choose(target.value);
    event.currentTarget.querySelector<HTMLInputElement>(`input[value="${CSS.escape(target.value)}"]`)?.focus();
  };

  const classes = [styles.track, styles.size[size], iconOnly ? styles.width.iconOnly : styles.width.labelled, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      {...rest}
      role="radiogroup"
      className={classes}
      onKeyDown={handleKeyDown}
      data-size={size}
      aria-disabled={disabled || undefined}
    >
      {options.map((option) => {
        const common = {
          name,
          value: option.value,
          size,
          selected: option.value === current,
          disabled,
          onChange: () => {
            choose(option.value);
          },
        };
        if (iconOnly && option.icon) {
          return (
            <NlTooltip key={option.value} content={option.label}>
              <NlSegment {...common} iconOnly icon={option.icon}>
                {option.label}
              </NlSegment>
            </NlTooltip>
          );
        }
        return (
          <NlSegment key={option.value} {...common} icon={option.icon} className={styles.segmentShare}>
            {option.label}
          </NlSegment>
        );
      })}
    </div>
  );
}
