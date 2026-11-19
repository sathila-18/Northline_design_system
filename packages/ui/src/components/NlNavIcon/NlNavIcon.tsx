import type { ComponentPropsWithRef } from 'react';
import { NlIcon, type NlIconName } from '../../icons';
import * as styles from './NlNavIcon.styles';

export interface NlNavIconProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** Whether the section is current. Set by NlNavItem. */
  selected: boolean;
  /** The section's icon. */
  name: NlIconName;
}

/**
 * The icon of a side nav section (DESIGN.md §9, NlNavIcon). Internal: used only by NlNavItem. fg-secondary,
 * or fg-active and filled when selected (OD-71). Always decorative: the nav item's text names the link.
 * Hover and pressed keep fg-secondary (NlNavItem), so it has no states of its own. Presentational, so no 'use client'.
 */
export function NlNavIcon({ selected, name, className, ...rest }: NlNavIconProps) {
  const classes = [styles.root, selected ? styles.selected.on : styles.selected.off, className]
    .filter(Boolean)
    .join(' ');

  return (
    <span {...rest} aria-hidden="true" className={classes} data-selected={selected}>
      <NlIcon name={name} size={20} tone="inherit" filled={selected} />
    </span>
  );
}
