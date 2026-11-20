'use client';

import type { ChangeEvent, ComponentPropsWithRef, ReactNode } from 'react';
import { NlListItemBase, type NlListItemBaseDensity, type NlListItemBaseSize } from '../NlListItemBase';
import { NlRadio } from '../NlRadio';
import { useNlRadioListGroup } from './NlRadioListGroup';

export type NlRadioListItemControlSide = 'leading' | 'trailing';

export interface NlRadioListItemProps extends Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'children' | 'title' | 'className' | 'size' | 'value' | 'name' | 'checked' | 'defaultChecked'
> {
  /** This row's value. Selected when it matches the group's value. */
  value: string;
  /** The title: first in the radio's name. */
  title: ReactNode;
  /** Under the title; part of the name. */
  description?: ReactNode;
  /** Shows the content under the title (description or body). On by default. */
  showBody?: boolean;
  /** Custom content in place of the description; part of the name. */
  body?: ReactNode;
  /** Radio in the leading slot (default) or the trailing slot. */
  controlSide?: NlRadioListItemControlSide;
  /** large (default) or small. */
  size?: NlListItemBaseSize;
  /** default or compact. */
  density?: NlListItemBaseDensity;
  /** The divider under a plain row. On by default. */
  divider?: boolean;
  /** Placement only, on the row. */
  className?: string;
}

/**
 * A list row with a radio, for picking exactly one item (DESIGN.md §9, NlRadioListItem), mapped onto
 * NlListItemBase. Lives inside NlRadioListGroup, which owns the value, name and appearance. The row is a <label>
 * around NlRadio's native radio: the whole row selects, the arrow keys move and select (native), and the row's text
 * names it. The selected row takes the selected colours; the ring goes round the row and the radio follows the row's
 * hover (OD-100, OD-102); the radio sits on the title's first line. No menu mode (OD-161). 'use client' for context.
 */
export function NlRadioListItem({
  value,
  title,
  description,
  body,
  showBody = true,
  controlSide = 'leading',
  size = 'large',
  density = 'default',
  divider = true,
  disabled = false,
  onChange,
  className,
  ...rest
}: NlRadioListItemProps) {
  const group = useNlRadioListGroup();
  const checked = group.value === value;
  const isDisabled = disabled || group.disabled;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    if (event.currentTarget.checked) group.select(value);
  };

  const control = (
    <NlRadio
      {...rest}
      inRow
      name={group.name}
      value={value}
      checked={checked}
      disabled={isDisabled}
      onChange={handleChange}
    />
  );

  return (
    <NlListItemBase
      as="label"
      appearance={group.appearance}
      size={size}
      density={density}
      title={title}
      description={showBody ? description : undefined}
      body={showBody ? body : undefined}
      leading={controlSide === 'leading' ? control : undefined}
      trailing={controlSide === 'trailing' ? control : undefined}
      divider={divider}
      selected={checked}
      disabled={isDisabled}
      actionable
      controlRow
      accessoryAlign="title"
      data-checked={checked || undefined}
      data-control-side={controlSide}
      className={className}
    />
  );
}
