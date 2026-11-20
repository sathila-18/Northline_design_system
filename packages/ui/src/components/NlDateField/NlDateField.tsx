'use client';

import { useId, useMemo, useRef, useState, type ChangeEvent, type FocusEvent, type Ref } from 'react';
import { NlButton } from '../NlButton';
import { NlCalendar } from '../NlCalendar';
import { NlInputBase, type NlInputBaseProps } from '../NlInputBase';
import { NlMenu, nlMenuTriggerProps } from '../NlMenu';
import { caretAfterDigits, isoToText, mask, parsePattern, textToISO } from './dateFormat';
import * as styles from './NlDateField.styles';

export interface NlDateFieldProps extends Pick<
  NlInputBaseProps,
  'label' | 'error' | 'helperText' | 'disabled' | 'required' | 'name' | 'id' | 'className' | 'onFocus'
> {
  /** The date (controlled), ISO YYYY-MM-DD; '' for none. */
  value?: string;
  /** The date at first (uncontrolled), ISO YYYY-MM-DD. */
  defaultValue?: string;
  /** Called with the ISO date once it is complete and real, and with '' when it is cleared or stops being one. */
  onValueChange?: (value: string) => void;
  /** The display pattern: DD, MM and YYYY in any order with one separator. Default DD/MM/YYYY (OD-137). */
  format?: string;
  /** The earliest date allowed, ISO. Earlier days are disabled in the calendar. */
  minDate?: string;
  /** The latest date allowed, ISO. Later days are disabled in the calendar. */
  maxDate?: string;
  /** The text input. */
  ref?: Ref<HTMLInputElement>;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}

type Problem = 'format' | 'min' | 'max' | null;

/**
 * A date input that accepts typing and opens a calendar (DESIGN.md §9, NlDateField). NlInputBase holds a text input
 * with a digit mask (separators added as you type) and the format hint while focused (OD-209); the calendar NlButton
 * opens an NlMenu dialog under the box with NlCalendar (single), on the typed date or today. Choosing a date fills
 * the field, closes the menu and returns focus to the input; so does Escape (OD-210). Invalid or out-of-range dates
 * show an error on blur, or once complete. The ISO date is submitted through a hidden input with `name` (OD-211).
 * 'use client' for state and refs.
 */
export function NlDateField({
  value,
  defaultValue,
  onValueChange,
  format = 'DD/MM/YYYY',
  minDate,
  maxDate,
  label,
  error = false,
  helperText,
  disabled,
  name,
  ref,
  onBlur,
  ...rest
}: NlDateFieldProps) {
  const pattern = useMemo(() => parsePattern(format), [format]);
  const ownId = useId();
  const menuId = `${ownId}-menu`;
  const formatId = `${ownId}-format`;

  const [text, setText] = useState(() => isoToText(value ?? defaultValue, pattern));
  const [reported, setReported] = useState(value ?? defaultValue ?? '');
  const [touched, setTouched] = useState(false);
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // A new controlled value from the page replaces the text (adjusting state during render, not in an effect).
  const [seenValue, setSeenValue] = useState(value);
  if (value !== seenValue) {
    setSeenValue(value);
    if (value !== undefined && value !== reported) {
      setText(isoToText(value, pattern));
      setReported(value);
      setTouched(false);
    }
  }

  const iso = textToISO(text, pattern);
  const complete = text.replace(/\D/g, '').length === 8;
  const problem: Problem =
    text === ''
      ? null
      : iso === null
        ? 'format'
        : minDate !== undefined && iso < minDate
          ? 'min'
          : maxDate !== undefined && iso > maxDate
            ? 'max'
            : null;
  const showProblem = problem !== null && (touched || complete);
  const message =
    problem === 'format'
      ? `Enter a date as ${pattern.text}`
      : problem === 'min'
        ? `Choose a date from ${isoToText(minDate, pattern)}`
        : problem === 'max'
          ? `Choose a date until ${isoToText(maxDate, pattern)}`
          : undefined;

  const setInputRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  const report = (next: string) => {
    if (next === reported) return;
    setReported(next);
    onValueChange?.(next);
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const caret = input.selectionStart ?? input.value.length;
    const digitsBefore = input.value.slice(0, caret).replace(/\D/g, '').length;
    const next = mask(input.value, pattern);
    setText(next);
    report(textToISO(next, pattern) ?? '');
    // Keep the caret after the same digits once the separators move.
    requestAnimationFrame(() => {
      if (document.activeElement !== input) return;
      const at = caretAfterDigits(next, digitsBefore);
      input.setSelectionRange(at, at);
    });
  };

  const choose = (date: string) => {
    setText(isoToText(date, pattern));
    setTouched(false);
    report(date);
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <>
      <NlInputBase
        {...rest}
        ref={setInputRef}
        boxRef={boxRef}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        label={label}
        disabled={disabled}
        value={text}
        onChange={onChange}
        onBlur={(event) => {
          setTouched(true);
          onBlur?.(event);
        }}
        formatHint={pattern.text}
        error={error || showProblem}
        helperText={showProblem ? message : helperText}
        aria-describedby={formatId}
        trailing={
          <NlButton
            type="button"
            variant="tertiary"
            contentTone="secondary"
            size="xsmall"
            icon="only-icon"
            iconName="calendar_today"
            disabled={disabled}
            {...nlMenuTriggerProps({ kind: 'filter', open, menuId })}
            onClick={() => {
              if (!open) setOpened((count) => count + 1);
              setOpen(!open);
            }}
          >
            {iso !== null ? `Change date, ${text}` : 'Choose date'}
          </NlButton>
        }
      />
      <span id={formatId} className={styles.formatDescription}>
        {`Format: ${pattern.text}`}
      </span>
      {name !== undefined && <input type="hidden" name={name} value={iso ?? ''} disabled={disabled} />}
      <NlMenu
        id={menuId}
        kind="filter"
        open={open && !disabled}
        onOpenChange={setOpen}
        anchorRef={boxRef}
        returnFocusRef={inputRef}
        matchAnchorWidth={false}
        initialFocusSelector='[role="grid"] button[tabindex="0"]'
        aria-label="Choose date"
      >
        <NlCalendar key={opened} mode="single" value={iso} onValueChange={choose} minDate={minDate} maxDate={maxDate} />
      </NlMenu>
    </>
  );
}
