'use client';

import { useCallback, useLayoutEffect, useRef, useState, type Ref } from 'react';
import { NlButton } from '../NlButton';
import { NlInputBase, type NlInputBaseProps } from '../NlInputBase';

export interface NlPasswordFieldProps extends Omit<
  NlInputBaseProps,
  'type' | 'leading' | 'trailing' | 'prefix' | 'suffix'
> {
  /** Shows the password as plain text (controlled). */
  showPassword?: boolean;
  /** Starting value when uncontrolled. Default false (hidden). */
  defaultShowPassword?: boolean;
  /** Called with the next value when the show/hide button is pressed. */
  onShowPasswordChange?: (showPassword: boolean) => void;
}

/** Puts a ref of any kind on the element. */
function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

/**
 * A password input with a show/hide button (DESIGN.md §9, NlPasswordField). Mapped onto NlInputBase: it switches the
 * native type between password and text and puts an NlButton (tertiary, icon-only, xsmall, contentTone secondary,
 * OD-80 / OD-31) in the trailing slot. The button keeps one name, "Show password", and carries the state in
 * `aria-pressed`. The value always stays; the caret or selection is put back after the switch. Label, helper text,
 * error, disabled, required, value and `ref` are the base's. 'use client' for state and refs.
 */
export function NlPasswordField({
  showPassword,
  defaultShowPassword = false,
  onShowPasswordChange,
  autoComplete = 'current-password',
  size = 'large',
  disabled,
  ref,
  ...rest
}: NlPasswordFieldProps) {
  const [ownShow, setOwnShow] = useState(defaultShowPassword);
  const shown = showPassword ?? ownShow;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const selection = useRef<[number, number] | null>(null);
  const setInput = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      setRef(ref, node);
    },
    [ref],
  );

  // Some browsers reset the caret when an input's type changes; put back what was there before the switch.
  useLayoutEffect(() => {
    const input = inputRef.current;
    const saved = selection.current;
    if (!input || !saved) return;
    selection.current = null;
    input.setSelectionRange(saved[0], saved[1]);
  }, [shown]);

  const toggle = () => {
    const input = inputRef.current;
    if (input?.selectionStart != null && input.selectionEnd != null) {
      selection.current = [input.selectionStart, input.selectionEnd];
    }
    const next = !shown;
    if (showPassword === undefined) setOwnShow(next);
    onShowPasswordChange?.(next);
  };

  return (
    <NlInputBase
      {...rest}
      ref={setInput}
      size={size}
      disabled={disabled}
      autoComplete={autoComplete}
      type={shown ? 'text' : 'password'}
      data-show-password={shown || undefined}
      trailing={
        <NlButton
          type="button"
          variant="tertiary"
          contentTone="secondary"
          size="xsmall"
          icon="only-icon"
          iconName={shown ? 'visibility' : 'visibility_off'}
          aria-pressed={shown}
          disabled={disabled}
          onClick={toggle}
        >
          Show password
        </NlButton>
      }
    />
  );
}
