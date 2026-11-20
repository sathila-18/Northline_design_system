import type { ComponentPropsWithRef, ElementType } from 'react';
import { NlLabel } from '../NlLabel';
import * as styles from './NlStatCard.styles';

export interface NlStatCardProps extends Omit<ComponentPropsWithRef<'div'>, 'className' | 'children'> {
  /** What the number is, for example "Total points". */
  label: string;
  /** The number, formatted by the page so server and client output match. */
  value: string;
  /** Inside a page's <dl>: the label becomes a <dt> and the value a <dd> (OD-175). */
  inList?: boolean;
  /** The root element. Default div. */
  as?: ElementType;
  /** Placement only. */
  className?: string;
}

/**
 * A summary number with its label, for dashboards and report headers (DESIGN.md §9, NlStatCard). NlLabel (medium,
 * text-secondary, OD-50) above the value in Data M with tabular figures (OD-113). Not interactive.
 * Presentational, so no 'use client'.
 */
export function NlStatCard({ label, value, inList = false, as, className, ...rest }: NlStatCardProps) {
  const Element: ElementType = as ?? 'div';
  const Term: ElementType = inList ? 'dt' : 'div';
  const Value: ElementType = inList ? 'dd' : 'p';
  const classes = [styles.root, className].filter(Boolean).join(' ');

  return (
    <Element {...rest} className={classes}>
      <Term className={styles.term}>
        <NlLabel size="medium" tone="secondary">
          {label}
        </NlLabel>
      </Term>
      <Value className={styles.value}>{value}</Value>
    </Element>
  );
}
