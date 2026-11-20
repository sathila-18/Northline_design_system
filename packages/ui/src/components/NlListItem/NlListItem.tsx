'use client';

import { type ComponentPropsWithRef, type ElementType, type MouseEventHandler, type ReactNode } from 'react';
import { NlIcon, type NlIconName } from '../../icons';
import { NlAvatar, type NlAvatarProps } from '../NlAvatar';
import { NlListCaption } from '../NlListCaption';
import {
  NlListItemBase,
  type NlListItemBaseAppearance,
  type NlListItemBaseDensity,
  type NlListItemBaseSize,
} from '../NlListItemBase';

export type NlListItemRole = 'menuitem' | 'option';

export interface NlListItemProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'title' | 'className' | 'children' | 'role' | 'onClick'
> {
  /** plain: rows with dividers (default). filled: separate cards, always with a chevron. */
  appearance?: NlListItemBaseAppearance;
  /** large (default) or small. */
  size?: NlListItemBaseSize;
  /** default or compact. */
  density?: NlListItemBaseDensity;
  /** The title: first in the row's accessible name. */
  title: ReactNode;
  /** Read after the title, as part of the name. */
  description?: ReactNode;
  /** Custom content in place of the description (OD-155). Part of the name, after the title. */
  body?: ReactNode;
  /** Leading icon, 24, fg-primary, decorative. Ignored when `avatar` is given. */
  icon?: NlIconName;
  /** Leading avatar, always medium (40). */
  avatar?: Omit<NlAvatarProps, 'size'>;
  /** Trailing caption (NlListCaption small, heavy). Part of the name, after the title. */
  caption?: string;
  /** Trailing chevron (chevron_right, 24, decorative). Makes the whole row actionable. Always on for filled. */
  chevron?: boolean;
  /** The divider under a plain row. On by default (OD-154). */
  divider?: boolean;
  /** Selected look. In a select menu (role option) also aria-selected; elsewhere the page sets aria-current (OD-152). */
  selected?: boolean;
  /** Button: native disabled. Link: no href and aria-disabled. Menu row: aria-disabled (OD-153). */
  disabled?: boolean;
  /** Makes the row a link (`<a>`, or `as`). */
  href?: string;
  /** Makes the row a button when there is no `href`. */
  onClick?: MouseEventHandler<HTMLElement>;
  /** Inside NlMenu: menuitem (action, navigation) or option (select). The row then takes tabIndex -1. With `href`
   * it is a link (navigation menus). */
  role?: NlListItemRole;
  /** A router link component, for link rows. */
  as?: ElementType;
  /** Placement only. */
  className?: string;
}

type Kind = 'menu' | 'link' | 'button' | 'static';

/**
 * The standard list row (DESIGN.md §9, NlListItem), mapped onto NlListItemBase. The whole row is the control:
 * a link (`href` or `as`), a button (`onClick`, or a chevron with no `href`), a menu row (`role`) or static (none of
 * these: no hover, no focus, OD-98). The name comes from the row's text (title, then description or body, then
 * caption), so the visible text is part of it (WCAG 2.5.3). 'use client' for event handlers.
 */
export function NlListItem({
  appearance = 'plain',
  size = 'large',
  density = 'default',
  title,
  description,
  body,
  icon,
  avatar,
  caption,
  chevron = false,
  divider = true,
  selected = false,
  disabled = false,
  href,
  onClick,
  role,
  as,
  className,
  tabIndex,
  ...rest
}: NlListItemProps) {
  const showChevron = chevron || appearance === 'filled';
  const kind: Kind = role
    ? 'menu'
    : href !== undefined || as !== undefined
      ? 'link'
      : onClick !== undefined || showChevron
        ? 'button'
        : 'static';

  const hasBody = body !== undefined && body !== null;
  const hasDescription = !hasBody && description !== undefined && description !== null;
  const hasCaption = caption !== undefined && caption !== '';
  const leading = avatar ? (
    <NlAvatar {...avatar} size="medium" />
  ) : icon ? (
    <NlIcon name={icon} size={24} tone="inherit" />
  ) : undefined;

  const trailing =
    hasCaption || showChevron ? (
      <>
        {hasCaption && (
          <NlListCaption size="small" weight="heavy" disabled={disabled}>
            {caption}
          </NlListCaption>
        )}
        {showChevron && <NlIcon name="chevron_right" size={24} tone="inherit" />}
      </>
    ) : undefined;

  const element: Record<Kind, ElementType> = {
    menu: href !== undefined ? (as ?? 'a') : 'div',
    link: as ?? 'a',
    button: 'button',
    static: 'div',
  };

  const kindProps: Record<string, unknown> =
    kind === 'menu'
      ? {
          role,
          href: disabled ? undefined : href,
          tabIndex: tabIndex ?? -1,
          'aria-selected': role === 'option' ? selected : undefined,
          'aria-disabled': disabled || undefined,
          onClick: disabled ? undefined : onClick,
        }
      : kind === 'link'
        ? {
            href: disabled ? undefined : href,
            'aria-disabled': disabled || undefined,
            tabIndex: disabled ? undefined : tabIndex,
            onClick: disabled ? undefined : onClick,
          }
        : kind === 'button'
          ? { type: 'button', tabIndex, onClick }
          : {};

  return (
    <NlListItemBase
      {...rest}
      {...kindProps}
      as={element[kind]}
      appearance={appearance}
      size={size}
      density={density}
      title={title}
      description={hasDescription ? description : undefined}
      body={hasBody ? body : undefined}
      leading={leading}
      trailing={trailing}
      divider={divider}
      selected={selected}
      disabled={disabled}
      actionable={kind !== 'static'}
      data-kind={kind}
      className={className}
    />
  );
}
