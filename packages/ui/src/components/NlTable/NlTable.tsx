'use client';

import { useId, useRef, useState, type ElementType, type MouseEvent, type ReactNode } from 'react';
import type { NlBadgeTone } from '../NlBadge';
import { NlButton, type NlButtonProps } from '../NlButton';
import { NlEmptyState, type NlEmptyStateProps } from '../NlEmptyState';
import { NlListItem } from '../NlListItem';
import { NlMenu } from '../NlMenu';
import { NlPagination } from '../NlPagination';
import { NlRowsPerPage } from '../NlRowsPerPage';
import { NlSearchField, type NlSearchFieldProps } from '../NlSearchField';
import { NlSkeleton } from '../NlSkeleton';
import { NlTableCell, type NlTableCellProps } from '../NlTableCell';
import { NlTableColumnFilter, type NlTableColumnFilterOption } from '../NlTableColumnFilter';
import { NlTableHeaderCell, type NlTableHeaderCellSort } from '../NlTableHeaderCell';
import * as styles from './NlTable.styles';

/** Column widths, as Size-* token names (OD-222). */
export type NlTableWidth = '80' | '96' | '120' | '320';
/** Minimum column widths, as Size-* token names (OD-222). */
export type NlTableMinWidth = '80' | '96' | '120' | '320';

/** What a body cell shows: text (default), a small badge, or a flush link (NlTableCell's types). */
export type NlTableCellContent =
  | { type?: 'default'; children?: ReactNode }
  | { type: 'badge'; badge: { tone: NlBadgeTone; label: string } }
  | {
      type: 'link';
      link: {
        label: string;
        href?: string;
        as?: ElementType;
        onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
      };
    };

/** A column filter, opened from the header cell's filter button (NlTableColumnFilter, OD-145). */
export type NlTableColumnFilterConfig =
  | { multiple?: true; options: NlTableColumnFilterOption[]; value: string[]; onApply: (value: string[]) => void }
  | { multiple: false; options: NlTableColumnFilterOption[]; value: string; onApply: (value: string) => void };

export interface NlTableColumn<T> {
  /** Unique key; also the row field shown by default. */
  key: string;
  /** The header text. */
  header: string;
  /** Fixed width (Size-* token name). Without one the column is flexible. */
  width?: NlTableWidth;
  /** Minimum width (Size-* token name). */
  minWidth?: NlTableMinWidth;
  /** The header cell's sort button. */
  sortable?: boolean;
  /** The header cell's filter button and its NlTableColumnFilter. */
  filter?: NlTableColumnFilterConfig;
  /** What the cell shows. Default: the row's field `key` as text. */
  cell?: (row: T) => NlTableCellContent;
  /** This column's cells are the rows' headers (<th scope="row">). */
  rowHeader?: boolean;
}

export interface NlTableSort {
  key: string;
  direction: 'ascending' | 'descending';
}

export interface NlTableRowAction {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface NlTableToolbar {
  /** A search field filling the free space. */
  search?: NlSearchFieldProps;
  /** Filter content (chips, menus), before the action. */
  filters?: ReactNode;
  /** The main action, as NlButton props (drawn small, primary unless set). */
  action?: NlButtonProps;
}

export interface NlTablePagination {
  /** The current page, from 1. */
  page: number;
  pageCount: number;
  /** Rows per page now. */
  pageSize: number;
  /** The rows-per-page choices. */
  pageSizes: number[];
  /** All rows across pages. */
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export interface NlTableProps<T> {
  /** The table's accessible name, in a visually hidden <caption> (OD-226). */
  caption: string;
  /** default (no outer border) or bordered. */
  variant?: 'default' | 'bordered';
  columns: NlTableColumn<T>[];
  /** This page's rows. */
  rows: T[];
  getRowId: (row: T) => string;
  /** A row's name for its checkbox and actions ("Select {row}"). Default: the row-header column's text, else the first column's (OD-224). */
  getRowLabel?: (row: T) => string;
  /** A select column with select-all for the page. */
  selectable?: boolean;
  /** Selected row ids, kept across pages. */
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** A row-actions column: the menu items for a row. */
  rowActions?: (row: T) => NlTableRowAction[];
  /** The toolbar above the table, or false. */
  toolbar?: NlTableToolbar | false;
  /** The footer with the summary, rows per page and pagination, or false. */
  pagination?: NlTablePagination | false;
  /** The current sort, or null. */
  sort?: NlTableSort | null;
  onSortChange?: (sort: NlTableSort | null) => void;
  /** Skeleton rows instead of data; aria-busy; no footer. */
  loading?: boolean;
  /** Shown instead of the rows and footer when there are none. Default heading "No results". */
  empty?: NlEmptyStateProps;
  /** Placement only. */
  className?: string;
}

/** A row field as text: strings, numbers and booleans; anything else is empty. */
const toText = (raw: unknown): string =>
  typeof raw === 'string' ? raw : typeof raw === 'number' || typeof raw === 'boolean' ? String(raw) : '';

const plural = (count: number, one: string, many: string) => `${String(count)} ${count === 1 ? one : many}`;

/**
 * A data table (DESIGN.md §9, NlTable): an optional toolbar (NlSearchField, a filter slot, a primary NlButton), a real
 * <table> with NlTableHeaderCell headers (sort, NlTableColumnFilter, select-all) and NlTableCell rows (select,
 * content, a row-actions NlMenu), and an optional footer (summary, NlRowsPerPage with its NlMenu of NlListItem options,
 * NlPagination). Toolbar, rows and footer are internal parts (D15). Loading shows NlSkeleton rows; no rows shows
 * NlEmptyState. Result and selection changes are announced politely. 'use client' for state and refs.
 */
export function NlTable<T>({
  caption,
  variant = 'default',
  columns,
  rows,
  getRowId,
  getRowLabel,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  rowActions,
  toolbar,
  pagination,
  sort = null,
  onSortChange,
  loading = false,
  empty,
  className,
}: NlTableProps<T>) {
  const id = useId();
  const actionsMenuId = `${id}-actions`;
  const sizesMenuId = `${id}-sizes`;

  // Row actions: one menu, anchored to the open row's button.
  const [actionsFor, setActionsFor] = useState<string | null>(null);
  const actionButtons = useRef(new Map<string, HTMLButtonElement>());
  const actionsAnchor = useRef<HTMLButtonElement | null>(null);

  // Column filters: one open at a time, anchored to its header cell's filter button.
  const [filterFor, setFilterFor] = useState<string | null>(null);
  const filterButtons = useRef(new Map<string, HTMLButtonElement>());
  const filterAnchor = useRef<HTMLButtonElement | null>(null);

  // Rows per page.
  const [sizesOpen, setSizesOpen] = useState(false);
  const sizesAnchor = useRef<HTMLButtonElement>(null);

  const value = (row: T, key: string): unknown => (row as Record<string, unknown>)[key];
  const labelColumn = columns.find((column) => column.rowHeader) ?? columns[0];
  const rowLabel = (row: T) =>
    getRowLabel?.(row) ?? (labelColumn ? toText(value(row, labelColumn.key)) : getRowId(row));

  // Announcements: results when the total changes, selection when the count changes (not on first render).
  const total = pagination ? pagination.total : rows.length;
  const selectedCount = selectedIds.length;
  const [seen, setSeen] = useState({ total, selectedCount });
  const [message, setMessage] = useState('');
  if (total !== seen.total || selectedCount !== seen.selectedCount) {
    setMessage(
      selectedCount !== seen.selectedCount
        ? `${String(selectedCount)} selected`
        : `Showing ${plural(total, 'result', 'results')}`,
    );
    setSeen({ total, selectedCount });
  }

  const pageIds = rows.map(getRowId);
  const allOnPage = pageIds.length > 0 && pageIds.every((rowId) => selectedIds.includes(rowId));
  const someOnPage = pageIds.some((rowId) => selectedIds.includes(rowId));
  const toggleRow = (rowId: string) => {
    onSelectionChange?.(selectedIds.includes(rowId) ? selectedIds.filter((s) => s !== rowId) : [...selectedIds, rowId]);
  };
  const togglePage = () => {
    onSelectionChange?.(
      allOnPage
        ? selectedIds.filter((s) => !pageIds.includes(s))
        : [...selectedIds, ...pageIds.filter((p) => !selectedIds.includes(p))],
    );
  };

  const showEmpty = !loading && rows.length === 0;
  const showFooter = pagination !== undefined && pagination !== false && !loading && !showEmpty;
  const columnCount = columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0);
  const skeletonRows = Array.from(
    { length: pagination ? pagination.pageSize : 5 },
    (_, index) => `skeleton-${String(index)}`,
  );

  const actionsRow = actionsFor === null ? undefined : rows.find((row) => getRowId(row) === actionsFor);
  const openFilterColumn = columns.find((column) => column.key === filterFor);

  const headerSort = (column: NlTableColumn<T>): NlTableHeaderCellSort =>
    sort?.key === column.key ? sort.direction : 'none';
  const filterState = (column: NlTableColumn<T>) => {
    if (!column.filter) return undefined;
    if (filterFor === column.key) return 'open' as const;
    const applied = Array.isArray(column.filter.value) ? column.filter.value.length > 0 : column.filter.value !== '';
    return applied ? ('applied' as const) : ('available' as const);
  };

  const cellContent = (column: NlTableColumn<T>, row: T): NlTableCellContent => {
    if (column.cell) return column.cell(row);
    return { children: toText(value(row, column.key)) };
  };

  const toolbarContent = toolbar ? (
    <div className={styles.toolbar}>
      {toolbar.search && (
        <div className={styles.toolbarSearch}>
          <NlSearchField size="small" {...toolbar.search} />
        </div>
      )}
      {(toolbar.filters !== undefined || toolbar.action) && (
        <div className={styles.toolbarEnd}>
          {toolbar.filters}
          {toolbar.action && <NlButton {...toolbar.action} size="small" />}
        </div>
      )}
    </div>
  ) : null;

  const summaryText = (() => {
    if (!pagination) return '';
    const from = total === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1;
    const to = Math.min(pagination.page * pagination.pageSize, total);
    const showing = `Showing ${String(from)}–${String(to)} of ${String(total)}`;
    return selectedCount > 0 ? `${String(selectedCount)} selected · ${showing}` : showing;
  })();

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')} data-variant={variant}>
      {toolbarContent}
      <div className={styles.frame[variant]}>
        <table className={styles.table} aria-busy={loading || undefined}>
          <caption className={styles.caption}>{caption}</caption>
          <colgroup>
            {selectable && <col className={styles.colWidth['56']} />}
            {columns.map((column) => (
              <col key={column.key} className={column.width ? styles.colWidth[column.width] : undefined} />
            ))}
            {rowActions && <col className={styles.colWidth['64']} />}
          </colgroup>
          <thead>
            <tr>
              {selectable && (
                <NlTableHeaderCell
                  appearance="grey"
                  narrow
                  hideTitle
                  selectAll={{ checked: allOnPage, indeterminate: someOnPage && !allOnPage, onChange: togglePage }}
                >
                  Select
                </NlTableHeaderCell>
              )}
              {columns.map((column) => (
                <NlTableHeaderCell
                  key={column.key}
                  appearance="grey"
                  className={column.minWidth ? styles.colMinWidth[column.minWidth] : undefined}
                  sortable={column.sortable}
                  sort={headerSort(column)}
                  onSortChange={(next) => {
                    onSortChange?.(next === 'none' ? null : { key: column.key, direction: next });
                  }}
                  filter={filterState(column)}
                  filterRef={(node) => {
                    if (node) filterButtons.current.set(column.key, node);
                    else filterButtons.current.delete(column.key);
                  }}
                  onFilterClick={() => {
                    filterAnchor.current = filterButtons.current.get(column.key) ?? null;
                    setFilterFor(filterFor === column.key ? null : column.key);
                  }}
                >
                  {column.header}
                </NlTableHeaderCell>
              ))}
              {rowActions && (
                <NlTableHeaderCell appearance="grey" narrow hideTitle stickyEnd>
                  Actions
                </NlTableHeaderCell>
              )}
            </tr>
          </thead>
          <tbody>
            {loading &&
              skeletonRows.map((key) => (
                <tr key={key} className={styles.row.default}>
                  {selectable && <NlTableCell narrow />}
                  {columns.map((column) => (
                    <NlTableCell key={column.key}>
                      <NlSkeleton shape="text" className={styles.skeleton} />
                    </NlTableCell>
                  ))}
                  {rowActions && <NlTableCell narrow stickyEnd />}
                </tr>
              ))}
            {showEmpty && (
              <tr>
                <td colSpan={columnCount} className={styles.emptyCell}>
                  <NlEmptyState heading="No results" {...empty} />
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((row) => {
                const rowId = getRowId(row);
                const selected = selectedIds.includes(rowId);
                const name = rowLabel(row);
                return (
                  <tr
                    key={rowId}
                    className={styles.row[selected ? 'selected' : 'default']}
                    aria-selected={selectable ? selected : undefined}
                    data-selected={selected || undefined}
                  >
                    {selectable && (
                      <NlTableCell
                        narrow
                        select={{
                          checked: selected,
                          onChange: () => {
                            toggleRow(rowId);
                          },
                          label: `Select ${name}`,
                        }}
                      />
                    )}
                    {columns.map((column) => (
                      <NlTableCell
                        key={column.key}
                        rowHeader={column.rowHeader}
                        {...(cellContent(column, row) as NlTableCellProps)}
                      />
                    ))}
                    {rowActions && (
                      <NlTableCell
                        type="row-actions"
                        stickyEnd
                        actions={{
                          label: `Actions for ${name}`,
                          expanded: actionsFor === rowId,
                          ref: (node) => {
                            if (node) actionButtons.current.set(rowId, node);
                            else actionButtons.current.delete(rowId);
                          },
                          onClick: () => {
                            actionsAnchor.current = actionButtons.current.get(rowId) ?? null;
                            setActionsFor(actionsFor === rowId ? null : rowId);
                          },
                        }}
                      />
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {showFooter && (
        <div className={styles.footer}>
          <p className={styles.summary}>{summaryText}</p>
          <div className={styles.footerEnd}>
            <NlRowsPerPage
              ref={sizesAnchor}
              value={pagination.pageSize}
              open={sizesOpen}
              onOpenChange={setSizesOpen}
              aria-controls={sizesMenuId}
            />
            <NlPagination
              page={pagination.page}
              pageCount={pagination.pageCount}
              onPageChange={pagination.onPageChange}
            />
          </div>
        </div>
      )}
      {showFooter && (
        <NlMenu
          id={sizesMenuId}
          kind="select"
          open={sizesOpen}
          onOpenChange={setSizesOpen}
          anchorRef={sizesAnchor}
          aria-label="Rows per page"
        >
          {pagination.pageSizes.map((size) => (
            <NlListItem
              key={size}
              role="option"
              title={String(size)}
              size="small"
              density="compact"
              divider={false}
              selected={size === pagination.pageSize}
              onClick={() => {
                pagination.onPageSizeChange(size);
              }}
            />
          ))}
        </NlMenu>
      )}
      {rowActions && (
        <NlMenu
          id={actionsMenuId}
          kind="action"
          open={actionsRow !== undefined}
          onOpenChange={(next) => {
            if (!next) setActionsFor(null);
          }}
          anchorRef={actionsAnchor}
          aria-label={actionsRow ? `Actions for ${rowLabel(actionsRow)}` : 'Row actions'}
        >
          {actionsRow &&
            rowActions(actionsRow).map((action) => (
              <NlListItem
                key={action.label}
                role="menuitem"
                title={action.label}
                size="small"
                density="compact"
                divider={false}
                disabled={action.disabled}
                onClick={action.onSelect}
              />
            ))}
        </NlMenu>
      )}
      {openFilterColumn?.filter &&
        (openFilterColumn.filter.multiple === false ? (
          <NlTableColumnFilter
            multiple={false}
            open
            onOpenChange={(next) => {
              if (!next) setFilterFor(null);
            }}
            anchorRef={filterAnchor}
            column={openFilterColumn.header}
            options={openFilterColumn.filter.options}
            value={openFilterColumn.filter.value}
            onApply={openFilterColumn.filter.onApply}
          />
        ) : (
          <NlTableColumnFilter
            open
            onOpenChange={(next) => {
              if (!next) setFilterFor(null);
            }}
            anchorRef={filterAnchor}
            column={openFilterColumn.header}
            options={openFilterColumn.filter.options}
            value={openFilterColumn.filter.value}
            onApply={openFilterColumn.filter.onApply}
          />
        ))}
      <span role="status" className={styles.announcement}>
        {message}
      </span>
    </div>
  );
}
