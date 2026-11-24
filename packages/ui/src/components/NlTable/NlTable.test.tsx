import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlTable, type NlTableColumn, type NlTableProps } from './NlTable';

interface Row {
  id: string;
  name: string;
  tier: string;
  points: number;
}

const rows: Row[] = [
  { id: 'a', name: 'Member 0001', tier: 'Tier 1', points: 100 },
  { id: 'b', name: 'Member 0002', tier: 'Tier 2', points: 200 },
  { id: 'c', name: 'Member 0003', tier: 'Tier 3', points: 300 },
];

const columns: NlTableColumn<Row>[] = [
  { key: 'name', header: 'Name', rowHeader: true, sortable: true },
  { key: 'tier', header: 'Tier', width: '120' },
  { key: 'points', header: 'Points', minWidth: '96' },
];

const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

function base(props: Partial<NlTableProps<Row>> = {}) {
  return <NlTable caption="Members" columns={columns} rows={rows} getRowId={(r) => r.id} {...props} />;
}

function Selectable(props: { onChange?: (ids: string[]) => void; initial?: string[] }) {
  const [ids, setIds] = useState(props.initial ?? []);
  return base({
    selectable: true,
    selectedIds: ids,
    onSelectionChange: (next) => {
      setIds(next);
      props.onChange?.(next);
    },
  });
}

describe('NlTable', () => {
  it('a real table: hidden caption, grey column headers, row headers, cells as text', () => {
    const { container } = render(base());
    const table = screen.getByRole('table', { name: 'Members' });
    expect(container.querySelector('caption')).toHaveClass('nl:sr-only');
    const headers = within(table).getAllByRole('columnheader');
    expect(headers).toHaveLength(3);
    expect(headers[0]).toHaveAccessibleName(/Name/);
    expect(headers[1]).toHaveAccessibleName('Tier');
    expect(headers[2]).toHaveAccessibleName('Points');
    expect(headers[0]).toHaveClass('nl:bg-tertiary');
    expect(within(table).getByRole('rowheader', { name: 'Member 0001' })).toBeInTheDocument();
    expect(within(table).getByRole('cell', { name: '200' })).toBeInTheDocument();
  });

  it('column widths and minimum widths from Size-* tokens; rows with dividers and fills', () => {
    const { container } = render(base());
    const cols = container.querySelectorAll('col');
    expect(cols[1]).toHaveClass('nl:w-120');
    expect(screen.getByRole('columnheader', { name: 'Points' })).toHaveClass('nl:min-w-96');
    const row = screen.getByRole('rowheader', { name: 'Member 0001' }).closest('tr');
    expect(row).toHaveClass('nl:border-b', 'nl:border-default', 'nl:last:border-b-0', 'nl:hover:bg-secondary');
  });

  it('bordered: a border-subtle frame with Radius-S', () => {
    const { container } = render(base({ variant: 'bordered' }));
    expect(container.querySelector('table')?.parentElement).toHaveClass(
      'nl:border',
      'nl:border-subtle',
      'nl:rounded-s',
    );
  });

  it('sort: header button cycles and reports; aria-sort on the current column', async () => {
    const onSortChange = vi.fn();
    const { rerender } = render(base({ onSortChange }));
    await userEvent.click(within(screen.getByRole('columnheader', { name: /Name/ })).getByRole('button'));
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'name', direction: 'ascending' });
    rerender(base({ onSortChange, sort: { key: 'name', direction: 'descending' } }));
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'descending');
    await userEvent.click(within(screen.getByRole('columnheader', { name: /Name/ })).getByRole('button'));
    expect(onSortChange).toHaveBeenLastCalledWith(null);
  });

  it('selection: row checkboxes named from the row header; select-all for the page, indeterminate; announced', async () => {
    const onChange = vi.fn();
    render(<Selectable onChange={onChange} initial={['zz']} />);
    const selectAll = screen.getByRole('checkbox', { name: 'Select all rows' });
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select Member 0002' }));
    expect(onChange).toHaveBeenLastCalledWith(['zz', 'b']);
    expect(selectAll).toHaveProperty('indeterminate', true);
    expect(screen.getByRole('rowheader', { name: 'Member 0002' }).closest('tr')).toHaveClass('nl:bg-active');
    expect(screen.getByRole('status')).toHaveTextContent('2 selected');
    await userEvent.click(selectAll);
    expect(onChange).toHaveBeenLastCalledWith(['zz', 'b', 'a', 'c']);
    await userEvent.click(selectAll);
    // Ids from other pages are kept.
    expect(onChange).toHaveBeenLastCalledWith(['zz']);
  });

  it('getRowLabel names rows', () => {
    render(base({ selectable: true, getRowLabel: (r) => `row ${r.id}` }));
    expect(screen.getByRole('checkbox', { name: 'Select row a' })).toBeInTheDocument();
  });

  it('row actions: a sticky Size-64 column; the menu lists the row actions; choosing runs it and returns focus', async () => {
    const edit = vi.fn();
    const { container } = render(
      base({
        rowActions: () => [
          { label: 'Edit', onSelect: edit },
          { label: 'Remove', onSelect: vi.fn(), disabled: true },
        ],
      }),
    );
    expect(container.querySelectorAll('col')[3]).toHaveClass('nl:w-64');
    expect(screen.getByRole('columnheader', { name: 'Actions' })).toHaveAttribute('data-sticky', 'true');
    const button = screen.getByRole('button', { name: 'Actions for Member 0002' });
    expect(button.closest('td')).toHaveAttribute('data-sticky', 'true');
    await userEvent.click(button);
    await settle();
    const menu = screen.getByRole('menu', { name: 'Actions for Member 0002' });
    expect(within(menu).getByRole('menuitem', { name: 'Remove' })).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(within(menu).getByRole('menuitem', { name: 'Edit' }));
    expect(edit).toHaveBeenCalledOnce();
    expect(button).toHaveFocus();
  });

  it('column filter: the header button opens NlTableColumnFilter; Apply reports', async () => {
    const onApply = vi.fn();
    render(
      base({
        columns: [
          ...columns,
          {
            key: 'tier2',
            header: 'Level',
            cell: (r) => ({ children: r.tier }),
            filter: {
              options: [
                { value: 'Tier 1', label: 'Tier 1' },
                { value: 'Tier 2', label: 'Tier 2' },
              ],
              value: [],
              onApply,
            },
          },
        ],
      }),
    );
    const filter = screen.getByRole('button', { name: 'Filter Level' });
    await userEvent.click(filter);
    await settle();
    expect(filter).toHaveAttribute('aria-expanded', 'true');
    const dialog = screen.getByRole('dialog', { name: 'Filter Level' });
    await userEvent.click(within(dialog).getByRole('checkbox', { name: 'Tier 2' }));
    await userEvent.click(within(dialog).getByRole('button', { name: 'Apply' }));
    expect(onApply).toHaveBeenCalledWith(['Tier 2']);
  });

  it('cell types: badge and link', () => {
    render(
      base({
        columns: [
          { key: 'name', header: 'Name' },
          { key: 's', header: 'Status', cell: () => ({ type: 'badge', badge: { tone: 'success', label: 'Active' } }) },
          { key: 'l', header: 'Profile', cell: (r) => ({ type: 'link', link: { label: 'View', href: `#${r.id}` } }) },
        ],
      }),
    );
    expect(screen.getAllByText('Active')).toHaveLength(3);
    expect(screen.getAllByRole('link', { name: 'View' })[0]).toHaveAttribute('href', '#a');
  });

  it('toolbar: search fills, filters slot and a small action', () => {
    render(
      base({
        toolbar: {
          search: { label: 'Search members' },
          filters: <span>Filters here</span>,
          action: { children: 'Add member' },
        },
      }),
    );
    expect(screen.getByRole('searchbox', { name: 'Search members' })).toBeInTheDocument();
    expect(screen.getByText('Filters here')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add member' })).toBeInTheDocument();
  });

  it('footer: summary, rows per page menu, pagination; the selected count leads the summary', async () => {
    const onPageSizeChange = vi.fn();
    const onPageChange = vi.fn();
    render(
      base({
        selectable: true,
        selectedIds: ['a'],
        pagination: {
          page: 2,
          pageCount: 12,
          pageSize: 10,
          pageSizes: [10, 20],
          total: 120,
          onPageChange,
          onPageSizeChange,
        },
      }),
    );
    expect(screen.getByText('1 selected · Showing 11–20 of 120')).toHaveClass('nl:text-body-s', 'nl:text-tertiary');
    const sizes = screen.getByRole('button', { name: /Rows per page/ });
    await userEvent.click(sizes);
    await settle();
    const listbox = screen.getByRole('listbox', { name: 'Rows per page' });
    expect(sizes).toHaveAttribute('aria-controls', listbox.id);
    await userEvent.click(within(listbox).getByRole('option', { name: '20' }));
    expect(onPageSizeChange).toHaveBeenCalledWith(20);
    await userEvent.click(screen.getByRole('button', { name: /3/ }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('results announced when the total changes, not on first render', () => {
    const pagination = {
      page: 1,
      pageCount: 1,
      pageSize: 10,
      pageSizes: [10],
      total: 3,
      onPageChange: vi.fn(),
      onPageSizeChange: vi.fn(),
    };
    const { rerender } = render(base({ pagination }));
    expect(screen.getByRole('status')).toHaveTextContent('');
    rerender(base({ pagination: { ...pagination, total: 12 } }));
    expect(screen.getByRole('status')).toHaveTextContent('Showing 12 results');
  });

  it('loading: aria-busy, skeleton rows per page size, no footer', () => {
    const { container } = render(
      base({
        loading: true,
        pagination: {
          page: 1,
          pageCount: 1,
          pageSize: 4,
          pageSizes: [4],
          total: 3,
          onPageChange: vi.fn(),
          onPageSizeChange: vi.fn(),
        },
      }),
    );
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    expect(container.querySelectorAll('tbody tr')).toHaveLength(4);
    expect(container.querySelector('tbody [data-shape], tbody .nl\\:w-80')).not.toBeNull();
    expect(screen.queryByText(/Showing/)).toBeNull();
    expect(screen.queryByRole('rowheader')).toBeNull();
  });

  it('empty: NlEmptyState across every column replaces the rows and footer', () => {
    const { container } = render(
      base({
        rows: [],
        selectable: true,
        empty: { heading: 'No members yet' },
        pagination: {
          page: 1,
          pageCount: 1,
          pageSize: 10,
          pageSizes: [10],
          total: 0,
          onPageChange: vi.fn(),
          onPageSizeChange: vi.fn(),
        },
      }),
    );
    expect(screen.getByText('No members yet')).toBeInTheDocument();
    expect(container.querySelector('tbody td')).toHaveAttribute('colspan', '4');
    expect(container.querySelector('tbody td')).toHaveClass('nl:py-4xl');
    expect(screen.queryByText(/Showing/)).toBeNull();
  });

  it('onRowClick: a click on a row calls it; the checkbox and actions button keep their own click (OD-243)', async () => {
    const onRowClick = vi.fn();
    const onSelectionChange = vi.fn();
    render(
      base({
        onRowClick,
        selectable: true,
        selectedIds: [],
        onSelectionChange,
        rowActions: () => [{ label: 'Edit', onSelect: () => undefined }],
      }),
    );
    const row = screen.getByRole('rowheader', { name: 'Member 0002' }).closest('tr');
    expect(row).toHaveClass('nl:cursor-pointer');
    await userEvent.click(screen.getByRole('cell', { name: '200' }));
    expect(onRowClick).toHaveBeenCalledWith(rows[1]);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select Member 0002' }));
    await userEvent.click(screen.getByRole('button', { name: 'Actions for Member 0002' }));
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).toHaveBeenCalledWith(['b']);
  });

  it('rows without onRowClick have no pointer', () => {
    render(base());
    expect(screen.getByRole('rowheader', { name: 'Member 0001' }).closest('tr')).not.toHaveClass('nl:cursor-pointer');
  });

  it('footer: summary and rows per page together at the start, pagination at the end (OD-242)', () => {
    render(
      base({
        pagination: {
          page: 1,
          pageCount: 2,
          pageSize: 10,
          pageSizes: [10, 25],
          total: 12,
          onPageChange: () => undefined,
          onPageSizeChange: () => undefined,
        },
      }),
    );
    const summary = screen.getByText('Showing 1–10 of 12');
    const start = summary.parentElement;
    if (!start) throw new Error('No footer start');
    expect(start).toHaveClass('nl:flex', 'nl:gap-l');
    expect(within(start).getByRole('button', { name: /Rows per page/ })).toBeInTheDocument();
    expect(start.parentElement).toHaveClass('nl:justify-between');
  });

  it('bulkActions: a bulk action bar while rows are selected; Clear selection empties it and focuses select all', async () => {
    const onExport = vi.fn();
    function Bulk() {
      const [ids, setIds] = useState<string[]>(['a', 'b']);
      return base({
        selectable: true,
        selectedIds: ids,
        onSelectionChange: setIds,
        bulkActions: (selected) => [
          {
            label: 'Export',
            icon: 'download',
            onSelect: () => {
              onExport(selected);
            },
          },
        ],
      });
    }
    render(<Bulk />);
    const bar = screen.getByRole('region', { name: 'Bulk actions' });
    expect(within(bar).getByText('2 selected')).toBeInTheDocument();
    await userEvent.click(within(bar).getByRole('button', { name: 'Export' }));
    expect(onExport).toHaveBeenCalledWith(['a', 'b']);
    await userEvent.click(within(bar).getByRole('button', { name: 'Clear selection' }));
    expect(screen.queryByRole('region', { name: 'Bulk actions' })).toBeNull();
    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toHaveFocus();
  });

  it('no bulk action bar without a selection', () => {
    render(base({ selectable: true, selectedIds: [], bulkActions: () => [] }));
    expect(screen.queryByRole('region', { name: 'Bulk actions' })).toBeNull();
  });

  it('summary numbers have commas: "Showing 1,011–1,020 of 2,480"', () => {
    render(
      base({
        pagination: {
          page: 102,
          pageCount: 248,
          pageSize: 10,
          pageSizes: [10],
          total: 2480,
          onPageChange: () => undefined,
          onPageSizeChange: () => undefined,
        },
      }),
    );
    expect(screen.getByText('Showing 1,011–1,020 of 2,480')).toBeInTheDocument();
  });
});
