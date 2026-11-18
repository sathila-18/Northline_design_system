import { NlButtonBase, type NlButtonBaseProps } from '../NlButtonBase';
import * as styles from './NlDestructiveButton.styles';

/** Omit that keeps NlButtonBase's icon union intact. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type NlDestructiveButtonVariant = keyof typeof styles.variant;

export type NlDestructiveButtonProps = DistributiveOmit<NlButtonBaseProps, 'variant'> & {
  /** Primary (filled), secondary (outlined) or tertiary (text only). No link form. */
  variant?: NlDestructiveButtonVariant;
};

/**
 * The base for buttons that delete or remove something (DESIGN.md §9, NlDestructiveButton, D12). Internal, built on
 * NlButtonBase: it passes a fixed `appearance` per variant and adds no markup or sizes of its own. NlButton can
 * replace `appearance` to add its states. Name what is removed in the label ("Delete reward"); confirming is the
 * caller's job. Presentational, so no 'use client'.
 */
export function NlDestructiveButton({ variant = 'primary', appearance, ...rest }: NlDestructiveButtonProps) {
  return (
    <NlButtonBase
      {...rest}
      variant={variant}
      appearance={appearance ?? styles.variant[variant]}
      data-tone="destructive"
    />
  );
}
