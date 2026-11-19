import type { ComponentPropsWithRef, ReactNode } from 'react';
import { NlIcon, type NlIconName } from '../../icons';
import * as styles from './NlSegment.styles';

export type NlSegmentSize = keyof typeof styles.labelled;

interface NlSegmentCommonProps extends Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'children' | 'checked' | 'defaultChecked' | 'size'
> {
  /** Whether this option is chosen. Set by the group. */
  selected: boolean;
  /** Height, padding, radius, text style and icon size. Set by the group. Default medium. */
  size?: NlSegmentSize;
  /** The label. Always required: for icon-only it is the accessible name, visually hidden. */
  children: ReactNode;
}

/** Icon-only needs an icon. */
type NlSegmentIconProps = { iconOnly?: false; icon?: NlIconName } | { iconOnly: true; icon: NlIconName };

export type NlSegmentProps = NlSegmentCommonProps & NlSegmentIconProps;

/**
 * One option in a segmented button (DESIGN.md §9, NlSegment). Internal: used only by NlSegmentedButton, which sets
 * `selected`, `size` and `iconOnly`, and gives every segment the same `name` inside a role radiogroup.
 * A <label> holding a native <input type="radio"> (checked = `selected`) under the drawn content, so the browser
 * handles arrow keys and skips disabled segments. Native radio attributes (`name`, `value`, `onChange`, `disabled`)
 * and `ref` go to the input; `className` (placement and width, set by the group) to the root. No state or effects
 * of its own, so no 'use client'.
 */
export function NlSegment({
  selected,
  size = 'medium',
  iconOnly = false,
  icon,
  children,
  className,
  onChange,
  ...rest
}: NlSegmentProps) {
  const colours = selected ? styles.selected.on : styles.selected.off;
  const classes = [
    styles.root,
    styles.group,
    iconOnly ? styles.iconOnly[size] : styles.labelled[size],
    colours.segment,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={classes} data-size={size} data-selected={selected} data-icon-only={iconOnly || undefined}>
      {/* onChange is required by React for a controlled radio; the group passes one. */}
      <input
        {...rest}
        type="radio"
        checked={selected}
        onChange={onChange ?? (() => undefined)}
        className={styles.input}
      />
      {icon && (
        <span className={`${styles.iconSlot} ${colours.icon}`} data-slot="icon">
          <NlIcon name={icon} size={styles.iconSize[size]} tone="inherit" filled={selected} />
        </span>
      )}
      <span className={iconOnly ? styles.label.hidden : styles.label.visible}>{children}</span>
    </label>
  );
}
