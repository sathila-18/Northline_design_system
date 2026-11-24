import { useMemo, useState } from 'react';
import { action } from 'storybook/actions';
import {
  NlButton,
  NlDialog,
  NlInputChip,
  NlSnackbarProvider,
  NlTable,
  useNlSnackbar,
  type NlEmptyStateProps,
  type NlTableColumn,
} from '@northline/ui';
import {
  formatDate,
  formatPoints,
  memberStatuses,
  memberTiers,
  statusLabel,
  type Member,
  type MemberStatus,
  type MemberTier,
} from '../_fixtures/members';
import { PageLayout } from '../_shared/PageLayout';
import { MemberDetailsSheet, statusTone, tierTone } from './MemberDetailsSheet';
import { pageSizes, useMemberList, type MemberListState } from './useMemberList';

/** Ready shows the data; loading and error stand in for a request that hasn't finished or failed. */
export type MemberListStatus = 'ready' | 'loading' | 'error';

export interface MemberListProps {
  /** The members to show: the fixtures, or [] for a new programme. */
  members: Member[];
  status?: MemberListStatus;
  /** Starting search, filters, sort, page or selection. */
  initial?: Partial<MemberListState>;
  /** A member whose details side sheet is open at the start (story only). */
  initialDetails?: string;
  /** Members whose suspend dialog is open at the start (story only). */
  initialSuspend?: string[];
}

const tierOptions = memberTiers.map((tier) => ({ value: tier, label: tier }));
const statusOptions = memberStatuses.map((status) => ({ value: status, label: statusLabel[status] }));

const addMember = () => {
  action('add member')();
};

/**
 * Member list page (DESIGN.md §8.6, P2). The shared layout and NlTable: a fixed-width search and Add member in the
 * toolbar (active filters as removable chips with Clear filters between them), Tier, Status and Join date filters in
 * the header cells, sorting, row actions and pagination. A row click or View opens the member's details side sheet.
 * While rows are selected, the table's NlBulkActionBar floats at the bottom with Export, Change status and Suspend.
 * Suspend (row, side sheet or bulk) asks in an NlDialog, then shows a success snackbar at the top end.
 */
export function MemberList(props: MemberListProps) {
  // Snackbars at the top end, clear of the bulk action bar at the bottom (OD-245).
  return (
    <NlSnackbarProvider placement="top-end">
      <MemberListPage {...props} />
    </NlSnackbarProvider>
  );
}

function MemberListPage({
  members,
  status: initialStatus = 'ready',
  initial,
  initialDetails,
  initialSuspend,
}: MemberListProps) {
  const [status, setStatus] = useState(initialStatus);
  const snackbar = useNlSnackbar();
  // Members suspended in this story session.
  const [suspendedIds, setSuspendedIds] = useState<string[]>([]);
  const data = useMemo(
    () =>
      members.map((member) =>
        suspendedIds.includes(member.id) ? { ...member, status: 'suspended' as const } : member,
      ),
    [members, suspendedIds],
  );
  const list = useMemberList(data, initial);
  const { state } = list;
  const [detailsId, setDetailsId] = useState<string | null>(initialDetails ?? null);
  const [suspendIds, setSuspendIds] = useState<string[] | null>(initialSuspend ?? null);
  const details = data.find((member) => member.id === detailsId) ?? null;
  const toSuspend = data.filter((member) => suspendIds?.includes(member.id));

  const openMember = (member: Member) => {
    setDetailsId(member.id);
  };
  const editMember = (member: Member) => {
    action('edit')(member.id);
  };
  const confirmSuspend = () => {
    const ids = toSuspend.map((member) => member.id);
    setSuspendedIds((prev) => [...new Set([...prev, ...ids])]);
    list.setSelectedIds(state.selectedIds.filter((id) => !ids.includes(id)));
    setSuspendIds(null);
    setDetailsId(null);
    action('suspend')(ids);
    const one = toSuspend.length === 1 ? toSuspend[0] : undefined;
    snackbar.show({
      tone: 'success',
      message: one ? `${one.name} suspended` : `${String(ids.length)} members suspended`,
    });
  };

  const columns: NlTableColumn<Member>[] = [
    { key: 'name', header: 'Member', rowHeader: true },
    { key: 'email', header: 'Email' },
    { key: 'id', header: 'Member ID', width: '120' },
    {
      key: 'tier',
      header: 'Tier',
      width: '120',
      // Tier tones (D20): a light gradient per tier, identity rather than status.
      cell: (member) => ({ type: 'badge', badge: { tone: tierTone[member.tier], label: member.tier } }),
      filter: {
        options: tierOptions,
        value: state.tiers,
        onApply: (value: string[]) => {
          list.setFilter('tiers', value as MemberTier[]);
        },
      },
    },
    {
      key: 'points',
      header: 'Points balance',
      width: '120',
      sortable: true,
      cell: (member) => ({ children: formatPoints(member.points) }),
    },
    {
      key: 'joined',
      header: 'Join date',
      width: '120',
      sortable: true,
      cell: (member) => ({ children: formatDate(member.joined) }),
      filter: {
        type: 'date-range',
        value: { start: state.joinedFrom || null, end: state.joinedTo || null },
        onApply: (value) => {
          list.setJoinedRange(value.start ?? '', value.end ?? '');
        },
        minDate: '2026-01-01',
        maxDate: '2026-12-31',
      },
    },
    {
      key: 'lastActivity',
      header: 'Last activity',
      width: '120',
      sortable: true,
      cell: (member) => ({ children: formatDate(member.lastActivity) }),
    },
    {
      key: 'status',
      header: 'Status',
      width: '120',
      cell: (member) => ({
        type: 'badge',
        badge: { tone: statusTone[member.status], label: statusLabel[member.status] },
      }),
      filter: {
        options: statusOptions,
        value: state.statuses,
        onApply: (value: string[]) => {
          list.setFilter('statuses', value as MemberStatus[]);
        },
      },
    },
  ];

  const removeValue = <T,>(values: T[], value: T) => values.filter((item) => item !== value);
  const joinedLabel = (() => {
    if (state.joinedFrom && state.joinedTo)
      return `Joined: ${formatDate(state.joinedFrom)} to ${formatDate(state.joinedTo)}`;
    if (state.joinedFrom) return `Joined from: ${formatDate(state.joinedFrom)}`;
    if (state.joinedTo) return `Joined to: ${formatDate(state.joinedTo)}`;
    return '';
  })();

  const chips = [
    ...state.tiers.map((tier) => ({
      key: `tier-${tier}`,
      label: `Tier: ${tier}`,
      onRemove: () => {
        list.setFilter('tiers', removeValue(state.tiers, tier));
      },
    })),
    ...state.statuses.map((value) => ({
      key: `status-${value}`,
      label: `Status: ${statusLabel[value]}`,
      onRemove: () => {
        list.setFilter('statuses', removeValue(state.statuses, value));
      },
    })),
    ...(joinedLabel
      ? [
          {
            key: 'joined',
            label: joinedLabel,
            onRemove: () => {
              list.setJoinedRange('', '');
            },
          },
        ]
      : []),
  ];

  let empty: NlEmptyStateProps;
  if (status === 'error') {
    empty = {
      icon: 'error',
      heading: "Members couldn't load",
      description: 'Something went wrong while loading the member list.',
      action: (
        <NlButton
          variant="primary"
          size="small"
          icon="leading"
          iconName="refresh"
          onClick={() => {
            action('try again')();
            setStatus('ready');
          }}
        >
          Try again
        </NlButton>
      ),
    };
  } else if (members.length === 0) {
    empty = {
      icon: 'person',
      heading: 'No members yet',
      description: 'Members appear here once they join the programme.',
      action: (
        <NlButton variant="primary" size="small" onClick={addMember}>
          Add member
        </NlButton>
      ),
    };
  } else {
    empty = {
      icon: 'search',
      heading: 'No members match these filters',
      description: 'Try a different search or fewer filters.',
      action: (
        <NlButton variant="primary" size="small" onClick={list.clearFilters}>
          Clear filters
        </NlButton>
      ),
    };
  }

  const showRows = status === 'ready';
  const count = list.total === 1 ? '1 member' : `${String(list.total)} members`;

  return (
    <PageLayout active="#members" title="Members" subtitle={showRows ? count : undefined}>
      <div className="nl:flex nl:flex-col nl:gap-xl">
        {/* The grey header's titles are 4.46:1 in Dark: known issue K8 (accepted with NlTableHeaderCell #66). */}
        <div data-a11y-known-issue="K8">
          <NlTable
            caption="Members"
            columns={columns}
            rows={showRows ? list.rows : []}
            getRowId={(member) => member.id}
            getRowLabel={(member) => member.name}
            loading={status === 'loading'}
            selectable
            selectedIds={state.selectedIds}
            onSelectionChange={list.setSelectedIds}
            sort={state.sort}
            onSortChange={list.setSort}
            onRowClick={openMember}
            bulkActions={(ids) => [
              {
                label: 'Export',
                icon: 'download',
                onSelect: () => {
                  action('export')(ids);
                },
              },
              {
                label: 'Change status',
                icon: 'swap_horiz',
                onSelect: () => {
                  action('change status')(ids);
                },
              },
              {
                label: 'Suspend',
                icon: 'block',
                tone: 'destructive',
                onSelect: () => {
                  // Only members who aren't suspended yet.
                  const active = ids.filter((id) => !suspendedIds.includes(id));
                  if (active.length > 0) setSuspendIds(active);
                },
              },
            ]}
            rowActions={(member) => [
              {
                label: 'View',
                onSelect: () => {
                  openMember(member);
                },
              },
              {
                label: 'Edit',
                onSelect: () => {
                  editMember(member);
                },
              },
              {
                label: 'Suspend',
                onSelect: () => {
                  setSuspendIds([member.id]);
                },
                disabled: member.status === 'suspended',
              },
            ]}
            toolbar={{
              search: {
                label: 'Search members',
                placeholder: 'Search members',
                // Fixed width: the search doesn't stretch across the toolbar.
                className: 'nl:max-w-320',
                value: state.query,
                onChange: (event) => {
                  list.setFilter('query', event.target.value);
                },
                onClear: () => {
                  list.setFilter('query', '');
                },
              },
              filters:
                chips.length > 0 || list.hasFilters ? (
                  <div className="nl:flex nl:flex-wrap nl:items-center nl:gap-s">
                    {chips.map((chip) => (
                      <NlInputChip
                        key={chip.key}
                        size="small"
                        removable
                        removeLabel={`Remove ${chip.label}`}
                        onRemove={chip.onRemove}
                      >
                        {chip.label}
                      </NlInputChip>
                    ))}
                    <NlButton variant="link" size="small" onClick={list.clearFilters}>
                      Clear filters
                    </NlButton>
                  </div>
                ) : undefined,
              action: { children: 'Add member', icon: 'leading', iconName: 'add', onClick: addMember },
            }}
            pagination={{
              page: list.page,
              pageCount: list.pageCount,
              pageSize: state.pageSize,
              pageSizes,
              total: list.total,
              onPageChange: list.setPage,
              onPageSizeChange: list.setPageSize,
            }}
            empty={empty}
          />
        </div>
      </div>
      <MemberDetailsSheet
        member={details}
        onClose={() => {
          setDetailsId(null);
        }}
        onEdit={editMember}
        onSuspend={(member) => {
          setSuspendIds([member.id]);
        }}
      />
      <NlDialog
        open={toSuspend.length > 0}
        onOpenChange={(open) => {
          if (!open) setSuspendIds(null);
        }}
        title={toSuspend.length === 1 ? 'Suspend member' : `Suspend ${String(toSuspend.length)} members`}
        size="small"
        primaryAction={{ children: 'Suspend', tone: 'destructive', onClick: confirmSuspend }}
        secondaryAction={{
          children: 'Cancel',
          onClick: () => {
            setSuspendIds(null);
          },
        }}
      >
        {toSuspend.length === 1
          ? `Are you sure you want to suspend “${toSuspend[0]?.name ?? ''}”? They can't earn or use points until they're active again.`
          : `Are you sure you want to suspend these ${String(toSuspend.length)} members? They can't earn or use points until they're active again.`}
      </NlDialog>
    </PageLayout>
  );
}
