import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';
import { NlCountBadge, type NlCountBadgeTone } from '../NlCountBadge';
import * as styles from './NlLabel.styles';

export type NlLabelSize = keyof typeof styles.size;
export type NlLabelTone = keyof typeof styles.tone;

interface NlLabelCommonProps {
  /** Label M (medium) or Label S (small). */
  size?: NlLabelSize;
  /** Text colour (OD-50). Default tertiary. */
  tone?: NlLabelTone;
  /** The label text. */
  children: ReactNode;
}

/** The dot badge. When shown, its meaning is required: colour is never the only signal. */
type NlLabelBadgeProps =
  | { badge?: false; badgeTone?: undefined; badgeLabel?: undefined }
  | {
      badge: true;
      /** Dot colour (OD-65). Default error. */
      badgeTone?: NlCountBadgeTone;
      /** Hidden text for the dot, read after the label, for example "New". */
      badgeLabel: string;
    };

/** A span by default; a form label with `as="label"` (OD-66), which can take `htmlFor`. */
type NlLabelElementProps =
  | ({ as?: 'span' } & Omit<ComponentPropsWithRef<'span'>, 'children'>)
  | ({ as: 'label' } & Omit<ComponentPropsWithRef<'label'>, 'children'>);

export type NlLabelProps = NlLabelCommonProps & NlLabelBadgeProps & NlLabelElementProps;

/**
 * A small, low-emphasis label, optionally followed by a dot badge (DESIGN.md §9, NlLabel). Used above headings, in
 * list rows, the calendar header, steps and table headers. Not interactive. Presentational, so no 'use client'.
 */
export function NlLabel({
  size = 'medium',
  tone = 'tertiary',
  badge = false,
  badgeTone = 'error',
  badgeLabel,
  as = 'span',
  children,
  className,
  ...rest
}: NlLabelProps) {
  // Widened: span and label take the same props here, and TypeScript can't pair `as` with `rest` after destructuring.
  const Element = as as ElementType;
  const classes = [styles.root, styles.size[size], styles.tone[tone], className].filter(Boolean).join(' ');

  return (
    <Element {...rest} className={classes} data-size={size} data-tone={tone}>
      {children}
      {badge && <NlCountBadge size="small" tone={badgeTone} label={badgeLabel} />}
    </Element>
  );
}
