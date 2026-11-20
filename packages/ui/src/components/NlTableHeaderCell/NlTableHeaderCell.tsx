'use client';

import type { ChangeEvent, ComponentPropsWithRef, MouseEvent, Ref } from 'react';
import { NlIcon } from '../../icons';
import { NlCheckboxControl } from '../NlCheckboxControl';
import { NlLabel } from '../NlLabel';
import * as styles from './NlTableHeaderCell.styles';

export type NlTableHeaderCellSort = 'none' | 'ascending' | 'descending';
export type NlTableHeaderCellFilter = 'available' | 'open' | 'applied';

export interface NlTableHeaderCellSelectAll {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface NlTableHeaderCellProps extends Omit<
  ComponentPropsWithRef<'th'>,
  'children' | 'className' | 'scope' | 'aria-sort'
> {
  /** The column name. */
  children: string;
  /** Hides the title visually; it stays the column's name. */
  hideTitle?: boolean;
  /** plain (default, no fill) or grey (bg-tertiary). */
  appearance?: keyof typeof styles.appearance;
  /** Checkbox and row-action columns: Space-XL inline padding. */
  narrow?: boolean;
  /** The column can be sorted: the title becomes the sort button. */
  sortable?: boolean;
  /** Current order. Default none (unsorted when sortable). */
  sort?: NlTableHeaderCellSort;
  /** Called with the next order: none → ascending → descending → none. Announcing it is the table's job (OD-184). */
  onSortChange?: (sort: NlTableHeaderCellSort) => void;
  /** Shows the filter button in this state. */
  filter?: NlTableHeaderCellFilter;
  /** Called when the filter button is pressed; open the column filter (NlMenu kind="filter") against `filterRef`. */
  onFilterClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** The filter button, as the column filter's anchor. */
  filterRef?: Ref<HTMLButtonElement>;
  /** A "Select all rows" checkbox. */
  selectAll?: NlTableHeaderCellSelectAll;
  /** Placement only. */
  className?: string;
}

const nextSort: Record<NlTableHeaderCellSort, NlTableHeaderCellSort> = {
  none: 'ascending',
  ascending: 'descending',
  descending: 'none',
};

const sortIcon = {
  none: 'unfold_more',
  ascending: 'arrow_upward',
  descending: 'arrow_downward',
} as const;

/**
 * A column header (DESIGN.md §9, NlTableHeaderCell): a <th scope="col"> with the column name, an optional sort
 * button (title + icon, aria-sort on the cell), an optional filter button ("Filter {column}", aria-haspopup dialog)
 * and an optional "Select all rows" checkbox. Sort and filter are plain native buttons, not NlButton (OD-116).
 * 'use client' for the handlers.
 */
export function NlTableHeaderCell({
  children,
  hideTitle = false,
  appearance = 'plain',
  narrow = false,
  sortable = false,
  sort = 'none',
  onSortChange,
  filter,
  onFilterClick,
  filterRef,
  selectAll,
  className,
  ...rest
}: NlTableHeaderCellProps) {
  const classes = [styles.root, styles.padding[narrow ? 'narrow' : 'default'], styles.appearance[appearance], className]
    .filter(Boolean)
    .join(' ');

  const label = <NlLabel size="medium">{children}</NlLabel>;
  const title = hideTitle ? <span className={styles.hidden}>{label}</span> : label;

  return (
    <th
      {...rest}
      scope="col"
      aria-sort={sortable ? sort : undefined}
      className={classes}
      data-appearance={appearance}
      data-sort={sortable ? sort : undefined}
      data-filter={filter}
    >
      <div className={styles.row}>
        {selectAll && (
          <NlCheckboxControl
            aria-label="Select all rows"
            checked={selectAll.checked}
            indeterminate={selectAll.indeterminate}
            onChange={selectAll.onChange}
          />
        )}
        {sortable ? (
          <button
            type="button"
            className={styles.sortButton}
            onClick={() => {
              onSortChange?.(nextSort[sort]);
            }}
          >
            {title}
            <span className={styles.sortIcon[sort === 'none' ? 'unsorted' : 'sorted']} data-slot="sort-icon">
              <NlIcon name={sortIcon[sort]} size={20} tone="inherit" />
            </span>
          </button>
        ) : (
          title
        )}
        {filter && (
          <button
            ref={filterRef}
            type="button"
            className={[styles.filterButton, styles.filterColour[filter === 'available' ? 'available' : 'active']].join(
              ' ',
            )}
            aria-label={filter === 'applied' ? `Filter ${children}, applied` : `Filter ${children}`}
            aria-haspopup="dialog"
            aria-expanded={filter === 'open'}
            onClick={onFilterClick}
          >
            <NlIcon name={filter === 'open' ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} size={24} tone="inherit" />
          </button>
        )}
      </div>
    </th>
  );
}
