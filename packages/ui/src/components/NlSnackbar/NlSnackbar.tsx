'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';
import { NlIcon, type NlIconName } from '../../icons';
import { NlButton, type NlButtonContentTone } from '../NlButton';
import * as styles from './NlSnackbar.styles';

export type NlSnackbarTone = keyof typeof styles.background;
export type NlSnackbarLayout = keyof typeof styles.layout;

export interface NlSnackbarAction {
  /** The button's label, for example "Undo". */
  label: string;
  onClick: () => void;
}

export interface NlSnackbarProps extends Omit<ComponentPropsWithRef<'div'>, 'role' | 'className'> {
  /** neutral (default), success, warning or error. */
  tone?: NlSnackbarTone;
  /** The message. */
  children: ReactNode;
  /** single (default): one row, message cut to one line. stacked: message on top, buttons below (OD-167). */
  layout?: NlSnackbarLayout;
  /** The leading icon. On by default. */
  showIcon?: boolean;
  /** An action button (NlButton tertiary small). */
  action?: NlSnackbarAction;
  /** The close button ("Dismiss"). On by default (OD-168). */
  showClose?: boolean;
  /** Called by the close button. */
  onClose?: () => void;
  /** Placement only. */
  className?: string;
}

const icon: Record<NlSnackbarTone, NlIconName> = {
  neutral: 'info',
  success: 'check_circle',
  warning: 'warning',
  error: 'error',
};

const buttonTone: Record<NlSnackbarTone, NlButtonContentTone> = {
  neutral: 'inverse',
  success: 'primary',
  warning: 'primary',
  error: 'primary',
};

/**
 * A short message after an action, such as "Reward saved" (DESIGN.md §9, NlSnackbar). The look only: show it through
 * NlSnackbarProvider and useNlSnackbar, which own the live region, timing and motion. Plain tone-coloured message
 * (OD-93), `error` icon for errors (OD-111), tertiary buttons in the inverse (neutral) or primary content tone.
 * 'use client' for the button handlers.
 */
export function NlSnackbar({
  tone = 'neutral',
  children,
  layout = 'single',
  showIcon = true,
  action,
  showClose = true,
  onClose,
  className,
  ...rest
}: NlSnackbarProps) {
  const hasButtons = action !== undefined || showClose;
  const classes = [
    styles.layout[layout],
    layout === 'single' ? styles.singleEnd[hasButtons ? 'buttons' : 'none'] : undefined,
    styles.background[tone],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div {...rest} className={classes} data-tone={tone} data-layout={layout}>
      <div className={styles.leading[layout]}>
        {showIcon && (
          <span className={[styles.iconSlot, styles.iconColour[tone]].join(' ')} data-slot="icon">
            <NlIcon name={icon[tone]} size={24} tone="inherit" />
          </span>
        )}
        <p className={[styles.message[layout], styles.messageColour[tone]].join(' ')}>{children}</p>
      </div>
      {hasButtons && (
        <div className={styles.buttons[layout]}>
          {action && (
            <NlButton variant="tertiary" size="small" contentTone={buttonTone[tone]} onClick={action.onClick}>
              {action.label}
            </NlButton>
          )}
          {showClose && (
            <NlButton
              variant="tertiary"
              size="medium"
              contentTone={buttonTone[tone]}
              icon="only-icon"
              iconName="close"
              onClick={onClose}
            >
              Dismiss
            </NlButton>
          )}
        </div>
      )}
    </div>
  );
}
