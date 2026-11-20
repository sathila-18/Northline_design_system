'use client';

import { useState, type ChangeEvent, type ComponentPropsWithRef, type ReactNode } from 'react';
import { NlCheckboxControl } from '../NlCheckboxControl';
import {
  NlListItemBase,
  type NlListItemBaseAppearance,
  type NlListItemBaseDensity,
  type NlListItemBaseSize,
} from '../NlListItemBase';

export type NlCheckboxListItemControlSide = 'leading' | 'trailing';

export interface NlCheckboxListItemProps extends Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'children' | 'title' | 'className' | 'size'
> {
  /** The title: first in the checkbox's name. */
  title: ReactNode;
  /** Under the title; part of the name. */
  description?: ReactNode;
  /** Shows the content under the title (description or body). On by default. */
  showBody?: boolean;
  /** Custom content in place of the description (OD-158); part of the name. */
  body?: ReactNode;
  /** Called with the new checked state. `onChange` still gets the native event. */
  onCheckedChange?: (checked: boolean) => void;
  /** Checkbox in the leading slot (default) or the trailing slot. */
  controlSide?: NlCheckboxListItemControlSide;
  /** plain (default) or filled. */
  appearance?: NlListItemBaseAppearance;
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
 * A list row with a checkbox, for picking several items (DESIGN.md §9, NlCheckboxListItem), mapped onto
 * NlListItemBase. The row is a <label> around NlCheckboxControl's native checkbox, so the whole row toggles, Space
 * toggles, and the row's text (title, then description or body) names it. Checked rows take the selected colours;
 * the focus ring goes round the row and the box follows the row's hover (OD-100, OD-102). No indeterminate and no
 * menu mode (OD-156, OD-157). Native input attributes (`checked` / `defaultChecked`, `name`, `value`, `disabled`,
 * `onChange`) and `ref` go to the input. 'use client' for the checked state.
 */
export function NlCheckboxListItem({
  title,
  description,
  body,
  showBody = true,
  onCheckedChange,
  controlSide = 'leading',
  appearance = 'plain',
  size = 'large',
  density = 'default',
  divider = true,
  disabled = false,
  checked,
  defaultChecked = false,
  onChange,
  className,
  ...rest
}: NlCheckboxListItemProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : uncontrolled;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setUncontrolled(event.currentTarget.checked);
    onChange?.(event);
    onCheckedChange?.(event.currentTarget.checked);
  };

  const control = (
    <NlCheckboxControl
      {...rest}
      inRow
      checked={isControlled ? checked : undefined}
      defaultChecked={isControlled ? undefined : defaultChecked}
      disabled={disabled}
      onChange={handleChange}
    />
  );

  return (
    <NlListItemBase
      as="label"
      appearance={appearance}
      size={size}
      density={density}
      title={title}
      description={showBody ? description : undefined}
      body={showBody ? body : undefined}
      leading={controlSide === 'leading' ? control : undefined}
      trailing={controlSide === 'trailing' ? control : undefined}
      divider={divider}
      selected={isChecked}
      disabled={disabled}
      actionable
      controlRow
      accessoryAlign="title"
      data-checked={isChecked || undefined}
      data-control-side={controlSide}
      className={className}
    />
  );
}
