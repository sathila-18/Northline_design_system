'use client';

import { useId, type ComponentPropsWithRef } from 'react';
import { NlHelperText, type NlHelperTextTone } from '../NlHelperText';
import * as styles from './NlTextAreaBase.styles';

export interface NlTextAreaBaseProps extends Omit<
  ComponentPropsWithRef<'textarea'>,
  'children' | 'className' | 'placeholder'
> {
  /** The field's name, always shown: on the first line at rest, floating when focused or filled (OD-42). */
  label: string;
  /** Error look: border-error, aria-invalid, error-toned helper text. */
  error?: boolean;
  /** The line under the box. Announced politely when it changes. */
  helperText?: string;
  /** Visible lines; sets the height (OD-85). Default 4 (128). */
  rows?: number;
  /** Placement only, on the root. */
  className?: string;
}

/**
 * The multi-line field (DESIGN.md §9, NlTextAreaBase): an outlined box with a floating label and a helper line.
 * Internal (§7.2): NlTextArea maps onto it. A native <textarea> with a real <label>; `aria-describedby` points to the
 * helper text; `error` sets `aria-invalid`. No hint text (designer's choice, 19 Nov 2026). Resizes vertically only
 * (OD-86). Native attributes (`value` / `defaultValue`, `onChange`, `name`, `maxLength`, `required`, `disabled`) and
 * `ref` go to the textarea; `className` (placement only) to the root. 'use client' for useId.
 */
export function NlTextAreaBase({
  label,
  error = false,
  helperText,
  rows = 4,
  className,
  id,
  disabled,
  'aria-describedby': describedBy,
  ...rest
}: NlTextAreaBaseProps) {
  const ownId = useId();
  const textareaId = id ?? `${ownId}-textarea`;
  const helperId = `${ownId}-helper`;
  const helperTone: NlHelperTextTone = disabled ? 'disabled' : error ? 'error' : 'default';

  const rootClasses = [styles.root, className].filter(Boolean).join(' ');
  const boxClasses = [styles.box, error ? styles.border.error : styles.border.normal].join(' ');

  return (
    <div className={rootClasses} data-error={error || undefined}>
      <div className={boxClasses}>
        <textarea
          {...rest}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          // No hint text (designer's choice, 19 Nov 2026): empty while focused, the label is the only text. A single
          // space keeps :placeholder-shown working, so it means empty and the label floats on a value.
          placeholder=" "
          aria-invalid={error || undefined}
          aria-describedby={[describedBy, helperText ? helperId : undefined].filter(Boolean).join(' ') || undefined}
          className={styles.textarea}
        />
        <label htmlFor={textareaId} className={styles.label}>
          {label}
        </label>
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
