import { NlButtonBase, type NlButtonBaseProps } from '../NlButtonBase';
import * as styles from './NlWhiteButton.styles';

/** Omit that keeps NlButtonBase's icon union intact. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type NlWhiteButtonProps = DistributiveOmit<NlButtonBaseProps, 'variant'>;

/**
 * The white button for brand-coloured backgrounds (DESIGN.md §9, NlWhiteButton, D12). Internal base with one look,
 * built on NlButtonBase: it passes a fixed white `appearance` and adds no markup or sizes of its own. NlButton can
 * replace `appearance` to add its states. Presentational, so no 'use client'.
 */
export function NlWhiteButton({ appearance, ...rest }: NlWhiteButtonProps) {
  return <NlButtonBase {...rest} variant="primary" appearance={appearance ?? styles.appearance} data-tone="white" />;
}
