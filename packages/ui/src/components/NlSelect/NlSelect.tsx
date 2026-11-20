'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { NlIcon } from '../../icons';
import { NlInputBase, type NlInputBaseProps } from '../NlInputBase';
import { NlListItem } from '../NlListItem';
import { NlMenu, nlMenuTriggerProps } from '../NlMenu';

export interface NlSelectOption {
  value: string;
  label: string;
  /** A second line under the label (Body S). */
  description?: string;
  /** Shown, but can't be chosen; skipped by the keyboard. */
  disabled?: boolean;
}

export interface NlSelectProps extends Pick<
  NlInputBaseProps,
  'label' | 'size' | 'error' | 'helperText' | 'disabled' | 'name' | 'id' | 'className' | 'ref' | 'onBlur' | 'onFocus'
> {
  /** The options, in order. */
  options: NlSelectOption[];
  /** The chosen option's value (controlled). An empty string or a value not in `options` shows an empty field. */
  value?: string;
  /** The chosen option's value at first (uncontrolled). */
  defaultValue?: string;
  /** Called with the newly chosen value. */
  onValueChange?: (value: string) => void;
  /** Marks the field required for assistive tech (aria-required). No visible marker (OD-78); the page validates. */
  required?: boolean;
}

/** NlIcon size per field size, as NlInputBase's spec. */
const iconSize = { large: 24, small: 20 } as const;

/**
 * A field that opens a list of options and shows the chosen one (DESIGN.md §9, NlSelect). NlInputBase (type select)
 * is the combobox field with the floating label and a chevron; NlMenu (kind select) under the box holds an
 * NlListItem option per choice. Focus moves into the list while it is open (OD-197); a letter on the closed field
 * picks the next option starting with it (OD-139). The value is submitted through a hidden input with `name`.
 * 'use client' for state and refs.
 */
export function NlSelect({
  options,
  value,
  defaultValue,
  onValueChange,
  size = 'large',
  disabled,
  required,
  name,
  ref,
  ...rest
}: NlSelectProps) {
  const menuId = `${useId()}-menu`;
  const [innerValue, setInnerValue] = useState(defaultValue ?? '');
  const current = value ?? innerValue;
  const chosen = options.find((option) => option.value === current);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLInputElement>(null);
  const canOpen = !disabled && options.length > 0;
  const setFieldRef = (node: HTMLInputElement | null) => {
    fieldRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  const choose = (next: string) => {
    if (value === undefined) setInnerValue(next);
    if (next !== current) onValueChange?.(next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!canOpen || event.altKey || event.ctrlKey || event.metaKey) return;
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
      return;
    }
    // Type-ahead on the closed field (OD-139): the next enabled option after the chosen one starting with the letter.
    if (event.key.length === 1 && event.key !== ' ') {
      const letter = event.key.toLocaleLowerCase();
      const start = chosen ? options.indexOf(chosen) : -1;
      const ordered = [...options.slice(start + 1), ...options.slice(0, start + 1)];
      const match = ordered.find((option) => !option.disabled && option.label.toLocaleLowerCase().startsWith(letter));
      if (match) choose(match.value);
    }
  };

  return (
    <>
      <NlInputBase
        {...rest}
        ref={setFieldRef}
        boxRef={boxRef}
        type="select"
        size={size}
        disabled={disabled}
        value={chosen?.label ?? ''}
        aria-required={required ? true : undefined}
        {...nlMenuTriggerProps({ kind: 'select', open, menuId })}
        onClick={() => {
          if (canOpen) setOpen(!open);
        }}
        onKeyDown={onKeyDown}
        trailing={
          <NlIcon name={open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} size={iconSize[size]} tone="inherit" />
        }
      />
      {name !== undefined && <input type="hidden" name={name} value={current} disabled={disabled} />}
      <NlMenu
        id={menuId}
        kind="select"
        open={open && canOpen}
        onOpenChange={setOpen}
        anchorRef={boxRef}
        returnFocusRef={fieldRef}
        maxHeight="320"
        aria-label={rest.label}
      >
        {options.map((option) => (
          <NlListItem
            key={option.value}
            role="option"
            size="small"
            density="compact"
            divider={false}
            title={option.label}
            description={option.description}
            disabled={option.disabled}
            selected={option.value === current}
            onClick={() => {
              choose(option.value);
            }}
          />
        ))}
      </NlMenu>
    </>
  );
}
