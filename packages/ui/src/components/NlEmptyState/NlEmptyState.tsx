import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { NlIconName } from '../../icons';
import { NlIconContainer } from '../NlIconContainer';
import { NlTextBlock, type NlTextBlockHeadingAs } from '../NlTextBlock';
import * as styles from './NlEmptyState.styles';

export type NlEmptyStateSize = 'small' | 'medium';

export interface NlEmptyStateProps extends Omit<ComponentPropsWithRef<'div'>, 'className' | 'children' | 'role'> {
  /** small (48 icon, Headline Small) or medium (64 icon, Headline Medium, default). */
  size?: NlEmptyStateSize;
  /** An icon in NlIconContainer (tone primary), decorative (OD-112). */
  icon?: NlIconName;
  /** Anything else in the icon's place; wins over `icon` (OD-112). No icon when neither is given (OD-173). */
  iconSlot?: ReactNode;
  /** The heading. */
  heading: ReactNode;
  /** The heading element, matching the page outline. Default h2 (OD-172). */
  headingAs?: NlTextBlockHeadingAs;
  /** The description under the heading. */
  description?: ReactNode;
  /** Usually one NlButton variant="primary" size="small". */
  action?: ReactNode;
  /** Announces it (role="status"), for an empty state that replaces results after a filter or search (OD-174). */
  live?: boolean;
  /** Placement only. */
  className?: string;
}

const iconSize = { small: 48, medium: 64 } as const;
const textType = { small: 'headline-small', medium: 'headline-medium' } as const;

/**
 * What a list, table or page shows when there is nothing in it yet (DESIGN.md §9, NlEmptyState): an icon, a centred
 * heading and description (NlTextBlock), and an optional action. Presentational, so no 'use client'.
 */
export function NlEmptyState({
  size = 'medium',
  icon,
  iconSlot,
  heading,
  headingAs = 'h2',
  description,
  action,
  live = false,
  className,
  ...rest
}: NlEmptyStateProps) {
  const hasSlot = iconSlot !== undefined && iconSlot !== null;
  const classes = [styles.root, className].filter(Boolean).join(' ');

  return (
    <div {...rest} role={live ? 'status' : undefined} className={classes} data-size={size}>
      <div className={styles.top}>
        {hasSlot ? (
          <div data-slot="icon">{iconSlot}</div>
        ) : (
          icon && <NlIconContainer icon={icon} size={iconSize[size]} tone="primary" data-slot="icon" />
        )}
        <NlTextBlock
          type={textType[size]}
          align="center"
          heading={heading}
          headingAs={headingAs}
          description={description}
        />
      </div>
      {action !== undefined && action !== null && <div className={styles.action}>{action}</div>}
    </div>
  );
}
