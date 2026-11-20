'use client';

import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { NlIcon, type NlIconName } from '../../icons';
import {
  NlListItemBase,
  type NlListItemBaseAppearance,
  type NlListItemBaseDensity,
  type NlListItemBaseSize,
} from '../NlListItemBase';
import { NlSwitch } from '../NlSwitch';

export interface NlSwitchListItemProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'type' | 'role' | 'children' | 'title' | 'className' | 'onChange' | 'aria-checked' | 'aria-label' | 'aria-labelledby'
> {
  /** The title: the switch's name. */
  title: ReactNode;
  /** Under the title; describes the switch. */
  description?: ReactNode;
  /** Custom content in place of the description; describes the switch (OD-164). */
  body?: ReactNode;
  /** Shows the content under the title (description or body). On by default (OD-164). */
  showBody?: boolean;
  /** Controlled on (true) or off (false). */
  checked?: boolean;
  /** Starting state when uncontrolled. Default off. */
  defaultChecked?: boolean;
  /** Called with the new state. */
  onCheckedChange?: (checked: boolean) => void;
  /** Leading icon, 24, fg-primary, decorative. */
  icon?: NlIconName;
  /** plain (default) or filled. */
  appearance?: NlListItemBaseAppearance;
  /** large (default) or small. */
  size?: NlListItemBaseSize;
  /** default or compact. */
  density?: NlListItemBaseDensity;
  /** The divider under a plain row. On by default (OD-164). */
  divider?: boolean;
  /** Placement only, on the row. */
  className?: string;
}

/**
 * A settings row with a switch at the end (DESIGN.md §9, NlSwitchListItem), mapped onto NlListItemBase. The row is
 * a <label> around NlSwitch (small), so the whole row toggles; the switch is named by the title and described by the
 * description or body ("Email updates, switch, on"). An on row isn't highlighted: the switch shows the state. Focus
 * ring round the row (OD-102); the switch sits on the title's first line (OD-163). Native button attributes and `ref`
 * go to the switch. 'use client' for useId and state.
 */
export function NlSwitchListItem({
  title,
  description,
  body,
  showBody = true,
  checked,
  defaultChecked,
  onCheckedChange,
  icon,
  appearance = 'plain',
  size = 'large',
  density = 'default',
  divider = true,
  disabled = false,
  className,
  'aria-describedby': describedByProp,
  ...rest
}: NlSwitchListItemProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  const hasBody = showBody && body !== undefined && body !== null;
  const hasDescription = showBody && !hasBody && description !== undefined && description !== null;
  const describedBy =
    [hasBody || hasDescription ? descriptionId : null, describedByProp].filter(Boolean).join(' ') || undefined;

  return (
    <NlListItemBase
      as="label"
      appearance={appearance}
      size={size}
      density={density}
      title={<span id={titleId}>{title}</span>}
      description={hasDescription ? <span id={descriptionId}>{description}</span> : undefined}
      body={hasBody ? <span id={descriptionId}>{body}</span> : undefined}
      leading={icon ? <NlIcon name={icon} size={24} tone="inherit" /> : undefined}
      trailing={
        <NlSwitch
          {...rest}
          inRow
          size="small"
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          aria-labelledby={titleId}
          aria-describedby={describedBy}
        />
      }
      divider={divider}
      disabled={disabled}
      actionable
      controlRow
      accessoryAlign="title"
      className={className}
    />
  );
}
