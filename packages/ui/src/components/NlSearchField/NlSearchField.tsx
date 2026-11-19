'use client';

import { useCallback, useRef, useState, type ChangeEvent, type KeyboardEvent, type Ref } from 'react';
import { NlIcon } from '../../icons';
import { NlButton } from '../NlButton';
import { NlInputBase, type NlInputBaseProps } from '../NlInputBase';

export interface NlSearchFieldProps extends Omit<
  NlInputBaseProps,
  | 'type'
  | 'label'
  | 'hideLabel'
  | 'leading'
  | 'trailing'
  | 'prefix'
  | 'suffix'
  | 'helperText'
  | 'error'
  | 'required'
  | 'value'
  | 'defaultValue'
> {
  /** The accessible name. Never shown (the label is always hidden). Default "Search". */
  label?: string;
  /** The text shown while the field is empty, focused too. Default "Search". */
  placeholder?: string;
  /** The search text (controlled). Reset it to '' in `onClear`. */
  value?: string;
  /** Starting text when uncontrolled. */
  defaultValue?: string;
  /** Called with the text on Enter. */
  onSearch?: (value: string) => void;
  /** Called when the clear button or Escape clears the text. */
  onClear?: () => void;
}

/** NlIcon size per field size, as NlInputBase's spec. */
const iconSize = { large: 24, small: 20 } as const;

/** Puts a ref of any kind on the element. */
function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

/**
 * A search input (DESIGN.md §9, NlSearchField). Mapped onto NlInputBase: `type="search"`, a hidden label (the
 * accessible name) with placeholder text instead, a leading `search` icon, and a clear NlButton (tertiary, icon-only,
 * xsmall, contentTone secondary, OD-83 / OD-31) in the trailing slot while there is text. Enter calls `onSearch`;
 * Escape clears when there is text and stops there (so a menu around it stays open), and passes on when empty.
 * No landmark of its own: the page or toolbar wraps it in `<search>` when it searches the page or a table.
 * 'use client' for state and refs.
 */
export function NlSearchField({
  label = 'Search',
  placeholder = 'Search',
  size = 'large',
  value,
  defaultValue = '',
  onChange,
  onKeyDown,
  onSearch,
  onClear,
  disabled,
  ref,
  ...rest
}: NlSearchFieldProps) {
  const [ownValue, setOwnValue] = useState(defaultValue);
  const current = value ?? ownValue;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const setInput = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      setRef(ref, node);
    },
    [ref],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) setOwnValue(event.target.value);
    onChange?.(event);
  };

  const clear = () => {
    if (value === undefined) setOwnValue('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'Enter') {
      onSearch?.(current);
    } else if (event.key === 'Escape' && current !== '') {
      // Not the browser's own clear: the same path as the button, and the key stops here.
      event.preventDefault();
      event.stopPropagation();
      clear();
    }
  };

  return (
    <NlInputBase
      {...rest}
      ref={setInput}
      type="search"
      label={label}
      hideLabel
      placeholder={placeholder}
      size={size}
      disabled={disabled}
      value={current}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      leading={<NlIcon name="search" size={iconSize[size]} tone="inherit" />}
      trailing={
        current !== '' ? (
          <NlButton
            type="button"
            variant="tertiary"
            contentTone="secondary"
            size="xsmall"
            icon="only-icon"
            iconName="cancel"
            disabled={disabled}
            onClick={clear}
          >
            Clear search
          </NlButton>
        ) : undefined
      }
    />
  );
}
