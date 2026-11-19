'use client';

import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { NlHelperText, type NlHelperTextTone } from '../NlHelperText';
import * as styles from './NlInputBase.styles';

export type NlInputBaseSize = keyof typeof styles.size;

export interface NlInputBaseProps extends Omit<
  ComponentPropsWithRef<'input'>,
  'size' | 'prefix' | 'children' | 'className'
> {
  /** The field's name, always shown: in the value position at rest, floating when focused or filled (OD-42). */
  label: string;
  /** Box height, padding and icon size. Default large. */
  size?: NlInputBaseSize;
  /** Error look: border-error, aria-invalid, error-toned helper text. */
  error?: boolean;
  /** Short text before the value, for example a currency sign. */
  prefix?: string;
  /** Short text after the value, for example a unit. */
  suffix?: string;
  /** Slot before the value, usually an NlIcon (24 large, 20 small; it inherits fg-secondary). */
  leading?: ReactNode;
  /** Slot after the value: an icon, or an NlButton for an action. */
  trailing?: ReactNode;
  /**
   * Hides the label from view; it stays the accessible name. For fields without a visible label (NlSearchField).
   * Only then is `placeholder` drawn.
   */
  hideLabel?: boolean;
  /** Placeholder text, used only with `hideLabel`. Floating-label fields have no hint text (designer's choice). */
  placeholder?: string;
  /** The line under the box. Announced politely when it changes. */
  helperText?: string;
  /** Placement only, on the root. */
  className?: string;
}

/**
 * The shared field (DESIGN.md §9, NlInputBase): an outlined box with a floating label, optional leading and trailing
 * items, and a helper line. Internal (§7.2): NlTextField, NlPasswordField, NlSearchField and the other fields map
 * onto it. A native <input> with a real <label>; `aria-describedby` points to the helper text; `error` sets
 * `aria-invalid`. The label floats through CSS (focus, or a value), so controlled and uncontrolled both work.
 * Native input attributes (`value` / `defaultValue`, `onChange`, `type`, `name`, `required`, `disabled`) and `ref` go to
 * the input; `className` (placement only) to the root. 'use client' for useId.
 */
export function NlInputBase({
  label,
  size = 'large',
  error = false,
  prefix,
  suffix,
  leading,
  trailing,
  helperText,
  hideLabel = false,
  placeholder,
  className,
  id,
  disabled,
  'aria-describedby': describedBy,
  ...rest
}: NlInputBaseProps) {
  const ownId = useId();
  const inputId = id ?? `${ownId}-input`;
  const helperId = `${ownId}-helper`;
  const helperTone: NlHelperTextTone = disabled ? 'disabled' : error ? 'error' : 'default';

  const rootClasses = [styles.root, className].filter(Boolean).join(' ');
  const boxClasses = [styles.box, styles.size[size], error ? styles.border.error : styles.border.normal].join(' ');

  return (
    <div className={rootClasses} data-size={size} data-error={error || undefined}>
      <div className={boxClasses}>
        {leading !== undefined && (
          <span className={styles.slot} data-slot="leading">
            {leading}
          </span>
        )}
        {prefix !== undefined && <span className={styles.affix}>{prefix}</span>}
        <div className={styles.value}>
          <input
            {...rest}
            id={inputId}
            disabled={disabled}
            // No hint text (designer's choice, 19 Nov 2026): the box stays empty while focused, the label is the only
            // text. A single space keeps :placeholder-shown working, so it means empty and the label floats on a value.
            // With a hidden label, the placeholder text shows instead (NlSearchField).
            placeholder={hideLabel && placeholder ? placeholder : ' '}
            aria-invalid={error || undefined}
            aria-describedby={[describedBy, helperText ? helperId : undefined].filter(Boolean).join(' ') || undefined}
            className={hideLabel ? `${styles.input} ${styles.placeholder}` : styles.input}
          />
          <label
            htmlFor={inputId}
            className={hideLabel ? styles.labelHidden : `${styles.label} ${styles.labelFloat[size]}`}
          >
            {label}
          </label>
        </div>
        {suffix !== undefined && <span className={styles.affix}>{suffix}</span>}
        {trailing !== undefined && (
          <span className={styles.slot} data-slot="trailing">
            {trailing}
          </span>
        )}
      </div>
      {/* Always rendered, so text that appears later (an error) is announced. */}
      <div aria-live="polite" className={styles.helper}>
        {helperText && (
          <NlHelperText id={helperId} tone={helperTone} showIcon={helperTone === 'error'} className={styles.helperText}>
            {helperText}
          </NlHelperText>
        )}
      </div>
    </div>
  );
}
