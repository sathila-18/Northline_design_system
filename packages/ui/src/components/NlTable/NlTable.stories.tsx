import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { NlBadgeTone } from '../NlBadge';
import type { NlCalendarRange } from '../NlCalendar';
import { NlTable, type NlTableColumn, type NlTableProps, type NlTableSort } from './NlTable';

interface Member {
  id: string;
  name: string;
  tier: string;
  status: 'Active' | 'Paused';
  points: number;
  joined: string;
}

const tiers = ['Tier 1', 'Tier 2', 'Tier 3'];
const members: Member[] = Array.from({ length: 42 }, (_, index) => {
  const n = index + 1;
  return {
    id: `m${String(n)}`,
    name: `Member ${String(n).padStart(4, '0')}`,
    tier: tiers[n % 3] ?? 'Tier 1',
    status: n % 5 === 0 ? 'Paused' : 'Active',
    points: (n * 137) % 5000,
    joined: `2026-${String((n % 12) + 1).padStart(2, '0')}-${String((n % 28) + 1).padStart(2, '0')}`,
  };
});

const statusTone: Record<Member['status'], NlBadgeTone> = { Active: 'success', Paused: 'warning' };

/** A page wiring every NlTable feature to local state, as an app would. */
function Demo({
  variant = 'default',
  loading = false,
  emptyData = false,
  wide = false,
  minimal = false,
  clickable = false,
}: {
  variant?: NlTableProps<Member>['variant'];
  loading?: boolean;
  emptyData?: boolean;
  wide?: boolean;
  minimal?: boolean;
  /** Rows open on click (onRowClick); the story shows the last row opened. */
  clickable?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [sort, setSort] = useState<NlTableSort | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [joinedRange, setJoinedRange] = useState<NlCalendarRange>({ start: null, end: null });
  const [opened, setOpened] = useState('none');

  let data = emptyData ? [] : members;
  if (query) data = data.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()));
  if (tierFilter.length) data = data.filter((m) => tierFilter.includes(m.tier));
  if (statusFilter) data = data.filter((m) => m.status === statusFilter);
  const { start, end } = joinedRange;
  if (start) data = data.filter((m) => m.joined >= start);
  if (end) data = data.filter((m) => m.joined <= end);
  if (sort) {
    const dir = sort.direction === 'ascending' ? 1 : -1;
    data = [...data].sort((a, b) => {
      const x = a[sort.key as keyof Member];
      const y = b[sort.key as keyof Member];
      return (x < y ? -1 : x > y ? 1 : 0) * dir;
    });
  }
  const pageCount = Math.max(1, Math.ceil(data.length / pageSize));
  const current = Math.min(page, pageCount);
  const rows = data.slice((current - 1) * pageSize, current * pageSize);

  const columns: NlTableColumn<Member>[] = [
    { key: 'name', header: 'Name', rowHeader: true, sortable: true, minWidth: '120' },
    {
      key: 'tier',
      header: 'Tier',
      width: '120',
      filter: {
        options: tiers.map((t) => ({ value: t, label: t })),
        value: tierFilter,
        onApply: (v: string[]) => {
          setTierFilter(v);
          setPage(1);
        },
      },
    },
    {
      key: 'status',
      header: 'Status',
      width: '120',
      cell: (m) => ({ type: 'badge', badge: { tone: statusTone[m.status], label: m.status } }),
      filter: {
        multiple: false,
        options: [
          { value: 'Active', label: 'Active' },
          { value: 'Paused', label: 'Paused' },
        ],
        value: statusFilter,
        onApply: (v: string) => {
          setStatusFilter(v);
          setPage(1);
        },
      },
    },
    { key: 'points', header: 'Points', sortable: true, width: '96' },
    ...(wide
      ? ([
          {
            key: 'joined',
            header: 'Joined',
            width: '120',
            filter: {
              type: 'date-range',
              value: joinedRange,
              onApply: (v) => {
                setJoinedRange(v);
                setPage(1);
              },
            },
          },
          { key: 'id', header: 'Member id', width: '120' },
          { key: 'email', header: 'Email', minWidth: '320', cell: (m) => ({ children: `${m.id}@example.test` }) },
        ] satisfies NlTableColumn<Member>[])
      : []),
    {
      key: 'profile',
      header: 'Profile',
      width: '96',
      cell: (m) => ({ type: 'link', link: { label: 'View', href: `#${m.id}` } }),
    },
  ];

  return (
    // The grey header's titles are 4.46:1 in Dark: known issue K8 (accepted with NlTableHeaderCell #66).
    <div className={wide ? 'nl:max-w-720' : undefined} data-a11y-known-issue="K8">
      {clickable && <p className="nl:mb-xl nl:text-body-m nl:text-secondary">Opened: {opened}</p>}
      <NlTable
        onRowClick={
          clickable
            ? (m) => {
                setOpened(m.name);
              }
            : undefined
        }
        caption="Members"
        variant={variant}
        columns={columns}
        rows={rows}
        getRowId={(m) => m.id}
        loading={loading}
        sort={sort}
        onSortChange={setSort}
        selectable={!minimal}
        selectedIds={selected}
        onSelectionChange={setSelected}
        rowActions={
          minimal
            ? undefined
            : () => [
                { label: 'Edit', onSelect: () => undefined },
                { label: 'Pause', onSelect: () => undefined },
                { label: 'Remove', onSelect: () => undefined, disabled: true },
              ]
        }
        toolbar={
          minimal
            ? false
            : {
                search: {
                  label: 'Search members',
                  value: query,
                  onChange: (event) => {
                    setQuery(event.target.value);
                    setPage(1);
                  },
                  onClear: () => {
                    setQuery('');
                  },
                },
                action: { children: 'Add member' },
              }
        }
        pagination={
          minimal
            ? false
            : {
                page: current,
                pageCount,
                pageSize,
                pageSizes: [5, 10, 20],
                total: data.length,
                onPageChange: setPage,
                onPageSizeChange: (size) => {
                  setPageSize(size);
                  setPage(1);
                },
              }
        }
        empty={
          emptyData
            ? { heading: 'No members yet', description: 'Members appear here once they join.', icon: 'person' }
            : undefined
        }
      />
    </div>
  );
}

const meta = {
  title: 'Components/Data display/Table',
  tags: ['organism'],
  component: NlTable,
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof NlTable>;
export default meta;

type Story = StoryObj<typeof meta>;
const noArgs = { caption: '', columns: [], rows: [], getRowId: () => '' };

/** Toolbar, selectable rows, sort (Name, Points), filters (Tier, Status), row actions and pagination. */
export const Default: Story = { args: noArgs, render: () => <Demo /> };

/** Bordered: a 1px border-subtle frame round the header and rows, Radius-S. */
export const Bordered: Story = { args: noArgs, render: () => <Demo variant="bordered" /> };

/** Loading: skeleton rows in the column layout, aria-busy, no footer. */
export const Loading: Story = { args: noArgs, render: () => <Demo loading /> };

/** No rows: NlEmptyState replaces the rows and footer. */
export const Empty: Story = { args: noArgs, render: () => <Demo emptyData /> };

/**
 * More columns than fit (Size-720 container): the table scrolls sideways; the row-actions column stays at the end.
 * Joined has a date range filter (OD-241). Header titles stay on one line (OD-240).
 */
export const WideScroll: Story = { args: noArgs, render: () => <Demo wide /> };

/** Clickable rows (onRowClick, OD-243): a click on a row opens it; the checkbox and actions button keep their click. */
export const ClickableRows: Story = { args: noArgs, render: () => <Demo clickable /> };

/** No toolbar, selection, actions or footer: just the header and rows. */
export const Minimal: Story = { args: noArgs, render: () => <Demo minimal /> };
