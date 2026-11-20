'use client';

import { useId, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { NlButton } from '../NlButton';
import { NlCheckboxListItem } from '../NlCheckboxListItem';
import { NlListItem } from '../NlListItem';
import { NlMenu } from '../NlMenu';
import { NlRadioListGroup, NlRadioListItem } from '../NlRadioListItem';
import { NlSearchField } from '../NlSearchField';
import * as styles from './NlTableColumnFilter.styles';

export interface NlTableColumnFilterOption {
  value: string;
  label: string;
}

interface NlTableColumnFilterCommonProps {
  /** Shown or hidden. */
  open: boolean;
  /** Called when the filter asks to open or close: Escape, a click outside, Apply, or a radio chosen. */
  onOpenChange: (open: boolean) => void;
  /** The header cell's filter button (NlTableHeaderCell `filterRef`). Focus returns to it on close. */
  anchorRef: RefObject<HTMLElement | null>;
  /** The column's name: "Filter {column}", "Search {column}". */
  column: string;
  /** The column's values. */
  options: NlTableColumnFilterOption[];
  /** A search field in the header. Default: shown when there are more than 8 values. */
  searchable?: boolean;
  /** The dialog's id, for the filter button's aria-controls. */
  id?: string;
}

/** Checkboxes (default) apply a list with Apply; radios apply one value (or '' for "All") as soon as one is chosen. */
export type NlTableColumnFilterProps = NlTableColumnFilterCommonProps &
  (
    | { multiple?: true; value: string[]; onApply: (value: string[]) => void }
    | { multiple: false; value: string; onApply: (value: string) => void }
  );

const ARROWS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

/**
 * The menu that opens from a column header's filter button (DESIGN.md §9, NlTableColumnFilter). An NlMenu dialog
 * ("Filter {column}") with an optional NlSearchField header and NlCheckboxListItem rows plus Reset and Apply, or an
 * NlRadioListGroup of NlRadioListItem rows with "All" first. Opening starts from the applied values with an empty
 * search. Checkboxes apply with Apply; a radio applies when chosen and closes, except when moved to with the arrow keys
 * (it applies and stays open). Focus returns to the filter button on close. 'use client' for state and refs.
 */
export function NlTableColumnFilter(props: NlTableColumnFilterProps) {
  const { open, onOpenChange, anchorRef, column, options, searchable, id } = props;
  const multiple = props.multiple !== false;
  const generatedId = useId();
  const menuId = id ?? `${generatedId}-filter`;
  const showSearch = searchable ?? options.length > 8;

  const applied = props.value;
  const [draft, setDraft] = useState<string[]>(multiple && Array.isArray(applied) ? applied : []);
  const [query, setQuery] = useState('');
  const arrowMove = useRef(false);

  // Each opening starts from the applied values with an empty search (adjusting state during render).
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setDraft(multiple && Array.isArray(applied) ? applied : []);
      setQuery('');
    }
  }

  const close = () => {
    onOpenChange(false);
    anchorRef.current?.focus();
  };

  const searching = showSearch && query !== '';
  const shown = searching
    ? options.filter((option) => option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
    : options;
  const label = `Filter ${column}`;

  const header = showSearch ? (
    <>
      <NlSearchField
        label={`Search ${column}`}
        size="small"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
        }}
        onClear={() => {
          setQuery('');
        }}
      />
      <span role="status" className={styles.status}>
        {shown.length === 0 ? <NlListItem title="No results" size="small" divider={false} /> : null}
      </span>
    </>
  ) : undefined;

  let content;
  let footer;
  if (props.multiple === false) {
    const { onApply } = props;
    const rows = [...(searching ? [] : [{ value: '', label: 'All' }]), ...shown];
    content = (
      <NlRadioListGroup
        aria-label={label}
        value={props.value}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          arrowMove.current = ARROWS.includes(event.key);
        }}
        onValueChange={(next) => {
          onApply(next);
          if (arrowMove.current) arrowMove.current = false;
          else close();
        }}
      >
        {rows.map((option, index) => (
          <NlRadioListItem
            key={option.value === '' ? '\u0000all' : option.value}
            value={option.value}
            title={option.label}
            size="small"
            divider={index < rows.length - 1}
          />
        ))}
      </NlRadioListGroup>
    );
  } else {
    const { onApply } = props;
    content = shown.map((option, index) => (
      <NlCheckboxListItem
        key={option.value}
        title={option.label}
        size="small"
        divider={index < shown.length - 1}
        checked={draft.includes(option.value)}
        onCheckedChange={(checked) => {
          setDraft((current) =>
            checked ? [...current, option.value] : current.filter((value) => value !== option.value),
          );
        }}
      />
    ));
    footer = (
      <>
        <NlButton
          type="button"
          variant="tertiary"
          size="small"
          onClick={() => {
            setDraft([]);
          }}
        >
          Reset
        </NlButton>
        <NlButton
          type="button"
          variant="primary"
          size="small"
          onClick={() => {
            // Applied in the options' order.
            onApply(options.map((option) => option.value).filter((value) => draft.includes(value)));
            close();
          }}
        >
          Apply
        </NlButton>
      </>
    );
  }

  return (
    <NlMenu
      id={menuId}
      kind="filter"
      open={open}
      onOpenChange={onOpenChange}
      anchorRef={anchorRef}
      aria-label={label}
      header={header}
      footer={footer}
      initialFocusSelector={!showSearch && !multiple ? 'input[type="radio"]:checked' : undefined}
    >
      {content}
    </NlMenu>
  );
}
