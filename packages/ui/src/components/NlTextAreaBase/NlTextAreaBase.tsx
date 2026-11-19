'use client';

import { useId, useRef, useState, type ChangeEvent, type ComponentPropsWithRef } from 'react';
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
  /** Native limit: typing stops there. Also shows the character count and announces it near the limit (OD-89). */
  maxLength?: number;
  /** Placement only, on the root. */
  className?: string;
}

/** Characters left at which the count is announced (OD-89). Above the first, the announcement is cleared. */
const firstAnnounce = 20;
const announceAt = [firstAnnounce, 10, 5, 0];

/** What a screen reader hears when `left` characters remain. */
function leftMessage(left: number) {
  if (left === 0) return 'Character limit reached';
  return left === 1 ? '1 character left' : `${String(left)} characters left`;
}

/**
 * The multi-line field (DESIGN.md §9, NlTextAreaBase): an outlined box with a floating label and a helper line.
 * Internal (§7.2): NlTextArea maps onto it. A native <textarea> with a real <label>; `aria-describedby` points to the
 * helper text; `error` sets `aria-invalid`. No hint text (designer's choice, 19 Nov 2026). Resizes vertically only
 * (OD-86). With `maxLength`, a count ("120 / 500") at the end of the helper line, the limit in the description, and a
 * polite announcement when 20, 10, 5 and 0 characters are left (OD-89). Native attributes (`value` / `defaultValue`, `onChange`, `name`, `maxLength`, `required`, `disabled`) and
 * `ref` go to the textarea; `className` (placement only) to the root. 'use client' for useId.
 */
export function NlTextAreaBase({
  label,
  error = false,
  helperText,
  rows = 4,
  maxLength,
  className,
  id,
  disabled,
  value,
  defaultValue,
  onChange,
  'aria-describedby': describedBy,
  ...rest
}: NlTextAreaBaseProps) {
  const ownId = useId();
  const textareaId = id ?? `${ownId}-textarea`;
  const helperId = `${ownId}-helper`;
  const limitId = `${ownId}-limit`;
  const helperTone: NlHelperTextTone = disabled ? 'disabled' : error ? 'error' : 'default';

  // The length for the count: from `value` when controlled, tracked here when not.
  const [ownLength, setOwnLength] = useState(() => String(defaultValue ?? '').length);
  const length = value === undefined ? ownLength : String(value).length;
  const hasCount = maxLength !== undefined;

  // Announced only when typing crosses a point in announceAt, so it doesn't speak on every key.
  const [announcement, setAnnouncement] = useState('');
  const lastLeft = useRef(hasCount ? maxLength - length : 0);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const nextLength = event.target.value.length;
    if (value === undefined) setOwnLength(nextLength);
    if (hasCount) {
      const left = maxLength - nextLength;
      const crossed = announceAt.some((point) => left <= point && lastLeft.current > point);
      if (crossed) setAnnouncement(leftMessage(left));
      else if (left > firstAnnounce) setAnnouncement('');
      lastLeft.current = left;
    }
    onChange?.(event);
  };

  const describedByIds = [describedBy, helperText ? helperId : undefined, hasCount ? limitId : undefined];

  const rootClasses = [styles.root, className].filter(Boolean).join(' ');
  const boxClasses = [styles.box, error ? styles.border.error : styles.border.normal].join(' ');

  return (
    <div className={rootClasses} data-error={error || undefined}>
      <div className={boxClasses}>
        <textarea
          {...rest}
          id={textareaId}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          // No hint text (designer's choice, 19 Nov 2026): empty while focused, the label is the only text. A single
          // space keeps :placeholder-shown working, so it means empty and the label floats on a value.
          placeholder=" "
          aria-invalid={error || undefined}
          aria-describedby={describedByIds.filter(Boolean).join(' ') || undefined}
          className={styles.textarea}
        />
        <label htmlFor={textareaId} className={styles.label}>
          {label}
        </label>
      </div>
      <div className={styles.footer}>
        {/* Always rendered, so text that appears later (an error) is announced. */}
        <div aria-live="polite" className={styles.helper}>
          {helperText && (
            <NlHelperText
              id={helperId}
              tone={helperTone}
              showIcon={helperTone === 'error'}
              className={styles.helperText}
            >
              {helperText}
            </NlHelperText>
          )}
        </div>
        {hasCount && (
          <span
            aria-hidden="true"
            data-slot="count"
            className={`${styles.count} ${disabled ? styles.countTone.disabled : styles.countTone.default}`}
          >
            {`${String(length)} / ${String(maxLength)}`}
          </span>
        )}
      </div>
      {hasCount && (
        <>
          <span id={limitId} className={styles.srOnly}>
            {`Up to ${String(maxLength)} characters.`}
          </span>
          <span aria-live="polite" data-slot="count-announcement" className={styles.srOnly}>
            {announcement}
          </span>
        </>
      )}
    </div>
  );
}
