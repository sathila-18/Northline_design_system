'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';
import { NlIcon, type NlIconName } from '../../icons';
import { NlButton, type NlButtonContentTone } from '../NlButton';
import * as styles from './NlBanner.styles';

export type NlBannerTone = keyof typeof styles.background;

export interface NlBannerAction {
  /** The button's label. */
  label: string;
  onClick: () => void;
}

export interface NlBannerProps extends Omit<ComponentPropsWithRef<'div'>, 'title' | 'role' | 'className'> {
  /** info (default), success, error, warning or neutral. */
  tone?: NlBannerTone;
  /** A short title above the description. */
  title?: ReactNode;
  /** The description. */
  children?: ReactNode;
  /** The leading icon. On by default. */
  showIcon?: boolean;
  /** An action under the text: NlButton link, xsmall, flush, in the tone's colour (designer's choice, 20 Nov 2026). */
  action?: NlBannerAction;
  /** Shows the close button (named "Dismiss {title}", OD-107). Move focus somewhere sensible after closing. */
  onClose?: () => void;
  /** For banners added after the page loads: role status (info, success, neutral) or alert (error, warning) (OD-109). */
  live?: boolean;
  /** Placement only. */
  className?: string;
}

const icon: Record<NlBannerTone, NlIconName> = {
  info: 'info',
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  neutral: 'info',
};

const actionTone: Record<NlBannerTone, NlButtonContentTone> = {
  info: 'info',
  success: 'success',
  error: 'error',
  warning: 'warning',
  neutral: 'primary',
};

const closeTone: Record<NlBannerTone, NlButtonContentTone> = { ...actionTone, neutral: 'secondary' };

const liveRole: Record<NlBannerTone, 'status' | 'alert'> = {
  info: 'status',
  success: 'status',
  error: 'alert',
  warning: 'alert',
  neutral: 'status',
};

/**
 * An inline message in the page (DESIGN.md §9, NlBanner): a tinted, rounded row with a tone icon, a title and
 * description in plain tone-coloured text (OD-93), an optional action and an optional close. Static by default; `live`
 * announces banners added after load (OD-109). The icon sits on the first text line (OD-165). Colour is never the only
 * signal: the icon and the text carry the meaning. 'use client' for the button handlers.
 */
export function NlBanner({
  tone = 'info',
  title,
  children,
  showIcon = true,
  action,
  onClose,
  live = false,
  className,
  ...rest
}: NlBannerProps) {
  const hasTitle = title !== undefined && title !== null && title !== '';
  const hasDescription = children !== undefined && children !== null && children !== '';
  const closeName = typeof title === 'string' && title !== '' ? `Dismiss ${title}` : 'Dismiss';

  const classes = [styles.root, styles.background[tone], className].filter(Boolean).join(' ');

  return (
    <div {...rest} role={live ? liveRole[tone] : undefined} className={classes} data-tone={tone}>
      {showIcon && (
        <span
          className={[
            styles.iconSlot,
            styles.iconLine[hasTitle ? 'title' : 'description'],
            styles.iconColour[tone],
          ].join(' ')}
          data-slot="icon"
        >
          <NlIcon name={icon[tone]} size={20} tone="inherit" />
        </span>
      )}
      <div className={styles.textColumn}>
        {hasTitle && <p className={[styles.title, styles.titleColour[tone]].join(' ')}>{title}</p>}
        {hasDescription && (
          <div className={[styles.description, styles.descriptionColour[tone]].join(' ')}>{children}</div>
        )}
        {action && (
          <NlButton variant="link" flush size="xsmall" contentTone={actionTone[tone]} onClick={action.onClick}>
            {action.label}
          </NlButton>
        )}
      </div>
      {onClose && (
        <span className={styles.close}>
          <NlButton
            variant="tertiary"
            size="xsmall"
            contentTone={closeTone[tone]}
            icon="only-icon"
            iconName="close"
            onClick={onClose}
          >
            {closeName}
          </NlButton>
        </span>
      )}
    </div>
  );
}
