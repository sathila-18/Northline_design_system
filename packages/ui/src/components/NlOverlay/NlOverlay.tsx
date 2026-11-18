'use client';

import type { ComponentPropsWithRef } from 'react';
import * as styles from './NlOverlay.styles';

export interface NlOverlayProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** Shown or hidden. Hidden, it stays in the page with display none, so it can fade out. */
  open: boolean;
}

/**
 * The dim layer (scrim) behind dialogs and side sheets (DESIGN.md §9, NlOverlay). Always hidden from screen readers
 * and never focusable. It only draws the scrim and passes clicks (onClick) to its parent. The parent owns focus
 * trapping, Escape, making the page inert, scroll locking and where it renders (no portal).
 * 'use client' because it takes an event handler.
 */
export function NlOverlay({ open, className, ...rest }: NlOverlayProps) {
  const classes = [styles.root, open ? styles.state.open : styles.state.closed, className].filter(Boolean).join(' ');

  return <div {...rest} aria-hidden="true" className={classes} data-open={open} />;
}
