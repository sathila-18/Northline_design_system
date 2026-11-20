'use client';

import { createContext, useContext, useId, useState, type ComponentPropsWithRef } from 'react';
import type { NlListItemBaseAppearance } from '../NlListItemBase';
import * as styles from './NlRadioListGroup.styles';

interface NlRadioListGroupContextValue {
  name: string;
  value: string | null;
  select: (value: string) => void;
  disabled: boolean;
  appearance: NlListItemBaseAppearance;
}

const NlRadioListGroupContext = createContext<NlRadioListGroupContextValue | null>(null);

/** The group's state, for NlRadioListItem. Throws outside a group. */
export function useNlRadioListGroup(): NlRadioListGroupContextValue {
  const context = useContext(NlRadioListGroupContext);
  if (!context) throw new Error('NlRadioListItem must be inside NlRadioListGroup.');
  return context;
}

type NlRadioListGroupNameProps =
  { 'aria-label': string; 'aria-labelledby'?: string } | { 'aria-label'?: string; 'aria-labelledby': string };

export type NlRadioListGroupProps = Omit<
  ComponentPropsWithRef<'div'>,
  'role' | 'aria-label' | 'aria-labelledby' | 'defaultValue' | 'onChange'
> &
  NlRadioListGroupNameProps & {
    /** The selected value (controlled). `null` for none. */
    value?: string | null;
    /** The first selected value (uncontrolled). */
    defaultValue?: string | null;
    /** Called with the newly selected value. */
    onValueChange?: (value: string) => void;
    /** The radios' shared name, for forms. Default: a generated one. */
    name?: string;
    /** Disables every row. */
    disabled?: boolean;
    /** Passed to every row; filled cards sit Space-L apart (OD-160). */
    appearance?: NlListItemBaseAppearance;
    /** Placement only. */
    className?: string;
  };

/**
 * The radio group for NlRadioListItem rows (DESIGN.md §9, NlRadioListItem, OD-101). A `role="radiogroup"` stack that
 * owns the value, the shared name and a group-wide disabled, and sets the rows' appearance and gap. It needs a name
 * (`aria-label` or `aria-labelledby`); a visible label is the page's (OD-162). 'use client' for state and context.
 */
export function NlRadioListGroup({
  value,
  defaultValue = null,
  onValueChange,
  name,
  disabled = false,
  appearance = 'plain',
  className,
  children,
  ...rest
}: NlRadioListGroupProps) {
  const generatedName = useId();
  const [uncontrolled, setUncontrolled] = useState<string | null>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : uncontrolled;

  const select = (next: string) => {
    if (!isControlled) setUncontrolled(next);
    onValueChange?.(next);
  };

  const classes = [styles.root, styles.gap[appearance], className].filter(Boolean).join(' ');

  return (
    <NlRadioListGroupContext value={{ name: name ?? generatedName, value: current, select, disabled, appearance }}>
      <div
        {...rest}
        role="radiogroup"
        aria-disabled={disabled || undefined}
        className={classes}
        data-appearance={appearance}
      >
        {children}
      </div>
    </NlRadioListGroupContext>
  );
}
