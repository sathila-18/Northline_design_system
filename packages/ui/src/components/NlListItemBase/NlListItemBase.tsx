import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';
import { NlDivider } from '../NlDivider';
import { NlLabel } from '../NlLabel';
import { NlTextBlock } from '../NlTextBlock';
import * as styles from './NlListItemBase.styles';

export type NlListItemBaseAppearance = 'plain' | 'filled';
export type NlListItemBaseSize = 'large' | 'small';
export type NlListItemBaseDensity = 'default' | 'compact';

export interface NlListItemBaseProps extends Omit<ComponentPropsWithRef<'div'>, 'title' | 'className' | 'children'> {
  /** plain: rows with dividers (default). filled: separate cards. */
  appearance?: NlListItemBaseAppearance;
  /** large: Headline Small-H6 title, Body M description (default). small: Label M, Body S (OD-14). */
  size?: NlListItemBaseSize;
  /** default: Space-XL padding. compact: Space-M. */
  density?: NlListItemBaseDensity;
  /** The title. */
  title: ReactNode;
  /** The description under the title. Replaced by `body` when that is given. */
  description?: ReactNode;
  /** A small label above the title (NlLabel small). Not shown unless given (OD-149). */
  topLabel?: string;
  /** Leading accessory: any component (icon, avatar, checkbox, radio…). */
  leading?: ReactNode;
  /** Trailing accessory: any component (caption, chevron, switch, checkbox, radio…). */
  trailing?: ReactNode;
  /** A decorative icon after the title, Space-M (8) from it (OD-150). Hidden from assistive tech. */
  extraIcon?: ReactNode;
  /** Custom content under the title, in place of the description. */
  body?: ReactNode;
  /** The divider under a plain row. On by default; filled rows never have one. */
  divider?: boolean;
  /** Selected look. The mapped item sets the matching ARIA. */
  selected?: boolean;
  /** Disabled look. On a `<button>` root also native disabled; otherwise the mapped item sets aria-disabled. */
  disabled?: boolean;
  /** Hover and pressed colours, for rows the mapped item makes actionable (OD-151). */
  actionable?: boolean;
  /** The root element: 'div' (default), 'li', 'label', 'button', 'a' or a router link component. */
  as?: ElementType;
  /** Passed through when `as` is a button. */
  type?: 'button' | 'submit' | 'reset';
  /** Passed through when `as` is a link. */
  href?: string;
  /** Passed through when `as` is a label. */
  htmlFor?: string;
  /** Placement only. */
  className?: string;
}

/**
 * The shared list row (DESIGN.md §9, NlListItemBase). Internal (§7.2): the list items map onto it. Renders the layout
 * only: leading accessory → text column (top label, title + extra icon, description or body) → trailing accessory,
 * then a divider (plain) or a card (filled). Role, keyboard and ARIA come from the mapped item through `as` and native
 * props. The divider stays border-default when disabled (OD-148). Presentational, so no 'use client'.
 */
export function NlListItemBase({
  appearance = 'plain',
  size = 'large',
  density = 'default',
  title,
  description,
  topLabel,
  leading,
  trailing,
  extraIcon,
  body,
  divider = true,
  selected = false,
  disabled = false,
  actionable = false,
  as,
  className,
  ...rest
}: NlListItemBaseProps) {
  const Element: ElementType = as ?? 'div';
  const showDivider = appearance === 'plain' && divider;
  const layoutKey = appearance === 'filled' ? 'filled' : showDivider ? 'plainDivider' : 'plain';
  const stateKey = disabled
    ? 'disabled'
    : selected
      ? actionable
        ? 'selectedActionable'
        : 'selected'
      : actionable
        ? 'defaultActionable'
        : 'default';
  const colour = disabled ? 'disabled' : 'enabled';
  const hasBody = body !== undefined && body !== null;

  const classes = [styles.root, styles.layout[layoutKey][density], styles.state[appearance][stateKey], className]
    .filter(Boolean)
    .join(' ');

  const heading =
    extraIcon !== undefined && extraIcon !== null ? (
      <span className={styles.titleRow}>
        <span>{title}</span>
        <span aria-hidden="true" className={styles.extraIcon} data-slot="extra-icon">
          {extraIcon}
        </span>
      </span>
    ) : (
      title
    );

  return (
    <Element
      {...rest}
      disabled={Element === 'button' ? disabled : undefined}
      className={classes}
      data-appearance={appearance}
      data-size={size}
      data-density={density}
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
      data-actionable={actionable || undefined}
    >
      <span className={styles.content} data-slot="content">
        {leading !== undefined && leading !== null && (
          <span className={[styles.leading, styles.leadingColour[colour]].join(' ')} data-slot="leading">
            {leading}
          </span>
        )}
        <span className={styles.textColumn} data-slot="text">
          {topLabel !== undefined && topLabel !== '' && <NlLabel size="small">{topLabel}</NlLabel>}
          <NlTextBlock
            type={size === 'small' ? 'label' : 'headline-small'}
            heading={heading}
            headingAs="span"
            description={hasBody ? undefined : description}
            disabled={disabled}
          />
          {hasBody && (
            <span className={styles.body} data-slot="body">
              {body}
            </span>
          )}
        </span>
        {trailing !== undefined && trailing !== null && (
          <span className={[styles.trailing, styles.trailingColour[colour]].join(' ')} data-slot="trailing">
            {trailing}
          </span>
        )}
      </span>
      {showDivider && <NlDivider decorative />}
    </Element>
  );
}
