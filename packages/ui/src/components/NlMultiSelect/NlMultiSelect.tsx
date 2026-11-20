'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type Ref } from 'react';
import { NlIcon } from '../../icons';
import { NlCheckboxListItem } from '../NlCheckboxListItem';
import { NlInputBase, type NlInputBaseProps } from '../NlInputBase';
import { NlInputChip } from '../NlInputChip';
import { NlListItem } from '../NlListItem';
import { NlMenu, nlMenuTriggerProps } from '../NlMenu';
import { NlSearchField } from '../NlSearchField';
import * as styles from './NlMultiSelect.styles';

export interface NlMultiSelectOption {
  value: string;
  label: string;
  /** A second line under the label (Body S). */
  description?: string;
  /** Shown, but can't be chosen; skipped by the keyboard. */
  disabled?: boolean;
}

export interface NlMultiSelectProps extends Pick<
  NlInputBaseProps,
  'label' | 'size' | 'error' | 'helperText' | 'disabled' | 'name' | 'id' | 'className' | 'onBlur' | 'onFocus'
> {
  /** The options, in order. Chips follow this order. */
  options: NlMultiSelectOption[];
  /** The chosen values (controlled). */
  value?: string[];
  /** The chosen values at first (uncontrolled). */
  defaultValue?: string[];
  /** Called with the new list of chosen values. */
  onValueChange?: (value: string[]) => void;
  /** A search field in the menu header that filters the rows, for long lists. */
  searchable?: boolean;
  /** Marks the field required for assistive tech (aria-required). No visible marker (OD-78); the page validates. */
  required?: boolean;
  /** The field (the combobox input). */
  ref?: Ref<HTMLInputElement>;
}

/** NlIcon size per field size, as NlInputBase's spec. */
const iconSize = { large: 24, small: 20 } as const;

/**
 * A field for choosing several options, shown as chips in the field (DESIGN.md §9, NlMultiSelect). NlInputBase
 * (type select) is the combobox field; its value is the chosen labels (read by assistive tech, unseen) and the chips
 * (NlInputChip xsmall) draw over it, with a "+N" chip for those that don't fit (OD-136, OD-203). NlMenu (kind select,
 * multiple) under the box holds NlCheckboxListItem option rows (OD-202) and an optional NlSearchField header
 * (OD-205). Focus moves into the menu while open; after removing a chip it moves to the next chip, the previous one,
 * or the field (OD-206). The values are submitted through hidden inputs with `name`. 'use client' for state, refs and
 * effects.
 */
export function NlMultiSelect({
  options,
  value,
  defaultValue,
  onValueChange,
  searchable = false,
  size = 'large',
  disabled,
  required,
  name,
  ref,
  label,
  ...rest
}: NlMultiSelectProps) {
  const menuId = `${useId()}-menu`;
  const [innerValue, setInnerValue] = useState<string[]>(defaultValue ?? []);
  const current = value ?? innerValue;
  const chosen = options.filter((option) => current.includes(option.value));
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(chosen.length);
  const boxRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLInputElement | null>(null);
  const rowRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const focusAfterRemove = useRef<number | null>(null);
  const canOpen = !disabled && options.length > 0;

  const setFieldRef = (node: HTMLInputElement | null) => {
    fieldRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  const commit = (next: string[]) => {
    if (value === undefined) setInnerValue(next);
    onValueChange?.(next);
  };

  const toggle = (optionValue: string) => {
    commit(current.includes(optionValue) ? current.filter((v) => v !== optionValue) : [...current, optionValue]);
  };

  const remove = (optionValue: string, index: number) => {
    focusAfterRemove.current = index;
    commit(current.filter((v) => v !== optionValue));
  };

  const setMenuOpen = (next: boolean) => {
    setOpen(next);
    if (!next) setQuery('');
  };

  // How many chips fit (OD-136): the measuring row holds every chip and a "+N" chip at natural width.
  const chosenKey = chosen.map((option) => option.value).join('\u0000');
  useLayoutEffect(() => {
    const row = rowRef.current;
    const measure = measureRef.current;
    if (!row || !measure) return;
    const fit = () => {
      const chips = [...measure.children] as HTMLElement[];
      const plus = chips.pop();
      const gap = parseFloat(getComputedStyle(measure).columnGap) || 0;
      const room = row.clientWidth;
      const plusWidth = plus?.offsetWidth ?? 0;
      let used = 0;
      let count = 0;
      for (const [index, chip] of chips.entries()) {
        const width = used + (index > 0 ? gap : 0) + chip.offsetWidth;
        const rest = index < chips.length - 1 ? gap + plusWidth : 0;
        if (width + rest > room) break;
        used = width;
        count = index + 1;
      }
      setVisibleCount(count);
    };
    fit();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(fit);
    observer.observe(row);
    return () => {
      observer.disconnect();
    };
  }, [chosenKey]);

  // After a chip's removal: the chip now at its place (the next one), else the last one, else the field (OD-206).
  useEffect(() => {
    const index = focusAfterRemove.current;
    if (index === null) return;
    focusAfterRemove.current = null;
    const buttons = [...(rowRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])].filter(
      (button) => !measureRef.current?.contains(button),
    );
    (buttons[Math.min(index, buttons.length - 1)] ?? fieldRef.current)?.focus();
  }, [chosenKey]);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!canOpen || event.altKey || event.ctrlKey || event.metaKey) return;
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      setMenuOpen(true);
    }
  };

  const shown = chosen.slice(0, visibleCount);
  const hiddenCount = chosen.length - shown.length;
  const filtered =
    searchable && query !== ''
      ? options.filter((option) => option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
      : options;

  const chips =
    chosen.length > 0 ? (
      <span ref={rowRef} className={styles.chipRow}>
        {shown.map((option, index) => (
          <NlInputChip
            key={option.value}
            size="xsmall"
            disabled={disabled}
            onRemove={() => {
              remove(option.value, index);
            }}
          >
            {option.label}
          </NlInputChip>
        ))}
        {hiddenCount > 0 && (
          <NlInputChip size="xsmall" disabled={disabled} removable={false} aria-hidden="true">
            {`+${String(hiddenCount)}`}
          </NlInputChip>
        )}
        <span ref={measureRef} aria-hidden="true" className={styles.measureRow}>
          {chosen.map((option) => (
            <NlInputChip key={option.value} size="xsmall" disabled={disabled} onRemove={() => undefined}>
              {option.label}
            </NlInputChip>
          ))}
          <NlInputChip size="xsmall" removable={false}>
            {`+${String(chosen.length)}`}
          </NlInputChip>
        </span>
      </span>
    ) : undefined;

  return (
    <>
      <NlInputBase
        {...rest}
        ref={setFieldRef}
        boxRef={boxRef}
        type="select"
        label={label}
        size={size}
        disabled={disabled}
        value={chosen.map((option) => option.label).join(', ')}
        valueOverlay={chips}
        aria-required={required ? true : undefined}
        {...nlMenuTriggerProps({ kind: 'select', open, menuId })}
        onClick={() => {
          if (canOpen) setMenuOpen(!open);
        }}
        onKeyDown={onKeyDown}
        trailing={
          <NlIcon name={open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} size={iconSize[size]} tone="inherit" />
        }
      />
      {name !== undefined &&
        current.map((v) => <input key={v} type="hidden" name={name} value={v} disabled={disabled} />)}
      <NlMenu
        id={menuId}
        kind="select"
        multiple
        open={open && canOpen}
        onOpenChange={setMenuOpen}
        anchorRef={boxRef}
        returnFocusRef={fieldRef}
        maxHeight="320"
        aria-label={label}
        initialFocus={searchable ? 'header' : 'rows'}
        header={
          searchable ? (
            <>
              <NlSearchField
                label={`Search ${label}`}
                size="small"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                }}
                onClear={() => {
                  setQuery('');
                }}
                onKeyDown={(event) => {
                  // Backspace in an empty search removes the last chip.
                  if (event.key === 'Backspace' && query === '' && current.length > 0) {
                    commit(current.slice(0, -1));
                  }
                }}
              />
              <span role="status" className={styles.status}>
                {filtered.length === 0 ? (
                  <NlListItem title="No results" size="small" density="compact" divider={false} />
                ) : null}
              </span>
            </>
          ) : undefined
        }
      >
        {filtered.map((option) => (
          <NlCheckboxListItem
            key={option.value}
            role="option"
            size="small"
            density="compact"
            divider={false}
            title={option.label}
            description={option.description}
            disabled={option.disabled}
            checked={current.includes(option.value)}
            onCheckedChange={() => {
              toggle(option.value);
            }}
          />
        ))}
      </NlMenu>
    </>
  );
}
