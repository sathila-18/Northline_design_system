import { NlIcon, type NlIconName } from '../../icons';
import { NlInputBase, type NlInputBaseProps } from '../NlInputBase';

export type NlTextFieldInputType = 'text' | 'email' | 'number' | 'tel' | 'url';

export interface NlTextFieldProps extends Omit<NlInputBaseProps, 'type' | 'leading' | 'trailing'> {
  /** The native input type. Default text. Named inputType so it can't clash with the base's select type. */
  inputType?: NlTextFieldInputType;
  /** Optional decorative icon at the end, any registry icon (OD-79). An action is an NlButton, not an icon. */
  trailingIcon?: NlIconName;
}

/** NlIcon size per field size, as NlInputBase's spec. */
const iconSize = { large: 24, small: 20 } as const;

/**
 * A single-line text input (DESIGN.md §9, NlTextField). Mapped onto NlInputBase: it passes the native type and an
 * optional decorative trailing icon, and adds no markup or styles of its own. Label, helper text,
 * prefix, suffix, error, disabled, required, value and `ref` are the base's. Presentational, so no 'use client'
 * (the base has it).
 */
export function NlTextField({ inputType = 'text', trailingIcon, size = 'large', ...rest }: NlTextFieldProps) {
  return (
    <NlInputBase
      {...rest}
      size={size}
      type={inputType}
      trailing={trailingIcon && <NlIcon name={trailingIcon} size={iconSize[size]} tone="inherit" />}
    />
  );
}
