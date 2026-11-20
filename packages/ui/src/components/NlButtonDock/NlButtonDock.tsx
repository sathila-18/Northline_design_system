import type { ComponentPropsWithRef, ReactNode } from 'react';
import { NlButton } from '../NlButton';
import type { NlButtonBaseProps } from '../NlButtonBase';
import { NlTextBlock } from '../NlTextBlock';
import * as styles from './NlButtonDock.styles';

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

/** A dock button: NlButton props without the ones the dock fixes (variant, size, tone, content tone). */
export type NlButtonDockButtonProps = DistributiveOmit<NlButtonBaseProps, 'variant' | 'size' | 'appearance' | 'flush'>;

export interface NlButtonDockProps extends Omit<ComponentPropsWithRef<'div'>, 'className' | 'children'> {
  /** The primary button, last at the end. Pass `type: 'submit'` inside a form. */
  primary?: NlButtonDockButtonProps;
  /** The secondary button, before the primary. */
  secondary?: NlButtonDockButtonProps;
  /** The tertiary button, at the start. */
  tertiary?: NlButtonDockButtonProps;
  /** A note above the buttons. A string becomes an NlTextBlock description (Body M, text-secondary). */
  accessory?: ReactNode;
  /** Sticky look (--nl-shadow-sticky). The container pins it and pads the content above. */
  sticky?: boolean;
  /** Placement only. */
  className?: string;
}

/**
 * The row of actions at the bottom of a form, dialog or side sheet (DESIGN.md §9, NlButtonDock): an optional note,
 * a tertiary button at the start and secondary and primary buttons at the end, all small and as wide as their labels.
 * DOM order is tertiary, secondary, primary, so Tab follows what you see. Nothing is rendered when there is nothing
 * to show (OD-171). Presentational, so no 'use client'.
 */
export function NlButtonDock({
  primary,
  secondary,
  tertiary,
  accessory,
  sticky = false,
  className,
  ...rest
}: NlButtonDockProps) {
  const hasAccessory = accessory !== undefined && accessory !== null && accessory !== '';
  const hasButtons = primary !== undefined || secondary !== undefined || tertiary !== undefined;
  if (!hasAccessory && !hasButtons) return null;

  const classes = [styles.root, styles.sticky[sticky ? 'on' : 'off'], className].filter(Boolean).join(' ');

  return (
    <div {...rest} className={classes} data-sticky={sticky || undefined}>
      {hasAccessory &&
        (typeof accessory === 'string' ? (
          <NlTextBlock type="headline-small" description={accessory} data-slot="accessory" />
        ) : (
          <div data-slot="accessory">{accessory}</div>
        ))}
      {hasButtons && (
        <div className={styles.row}>
          {tertiary && <NlButton {...tertiary} variant="tertiary" size="small" />}
          {(secondary ?? primary) && (
            <div className={styles.end}>
              {secondary && <NlButton {...secondary} variant="secondary" size="small" />}
              {primary && <NlButton {...primary} variant="primary" size="small" />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
