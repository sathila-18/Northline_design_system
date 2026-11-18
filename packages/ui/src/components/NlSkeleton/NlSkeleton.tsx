import type { ComponentPropsWithRef } from 'react';
import * as styles from './NlSkeleton.styles';

export type NlSkeletonShape = keyof typeof styles.shape;

export interface NlSkeletonProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** text: a Size-12 line. rect: a Size-24 block. circle: a Size-24 circle. */
  shape?: NlSkeletonShape;
}

/**
 * A grey placeholder shown while content loads (DESIGN.md §9, NlSkeleton). Always hidden from screen readers;
 * the loading region sets aria-busy, not the skeleton. text and rect fill their container; callers narrow them with a
 * width class in className (placement only). Not interactive. Presentational, so no 'use client'.
 */
export function NlSkeleton({ shape = 'text', className, ...rest }: NlSkeletonProps) {
  const classes = [styles.root, styles.shape[shape], className].filter(Boolean).join(' ');

  return <span {...rest} aria-hidden="true" className={classes} data-shape={shape} />;
}
