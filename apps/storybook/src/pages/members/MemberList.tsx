import { useState } from 'react';
import { action } from 'storybook/actions';
import {
  NlButton,
  NlButtonDock,
  NlDateField,
  NlInputChip,
  NlMultiSelect,
  NlTable,
  type NlBadgeTone,
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
import { goTo, StoryLink } from '../_shared/navItems';
import { pageSizes, useMemberList, type MemberListState } from './useMemberList';

/** Ready shows the data; loading and error stand in for a request that hasn't finished or failed. */
export type MemberListStatus = 'ready' | 'loading' | 'error';

export interface MemberListProps {
  /** The members to show: the fixtures, or [] for a new programme. */
  members: Member[];
  status?: MemberListStatus;
  /** Starting search, filters, sort, page or selection. */
  initial?: Partial<MemberListState>;
}

const statusTone: Record<MemberStatus, NlBadgeTone> = {
  active: 'success',
  inactive: 'neutral',
  suspended: 'error',
};

const tierOptions = memberTiers.map((tier) => ({ value: tier, label: tier }));
const statusOptions = memberStatuses.map((status) => ({ value: status, label: statusLabel[status] }));

const columns: NlTableColumn<Member>[] = [
  {
    key: 'name',
    header: 'Member',
    rowHeader: true,
    cell: (member) => ({
      type: 'link',
      // A real link to the member's page (Coming soon for now).
      link: { label: member.name, href: '#member-detail', as: StoryLink },
    }),
  },
  { key: 'email', header: 'Email' },
  { key: 'id', header: 'Member ID', width: '120' },
  // One neutral tone for every tier, so a tier never reads as a status (held for later).
  {
    key: 'tier',
    header: 'Tier',
    width: '96',
    cell: (member) => ({ type: 'badge', badge: { tone: 'neutral', label: member.tier } }),
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
  },
];

const addMember = () => {
  action('add member')();
};

/**
 * Member list page (DESIGN.md §8.6, P2). The shared layout, a filter row (Tier, Status, Joined from, Joined to),
 * the active filters as removable chips with Clear filters, and NlTable with search, Add member, sorting, row
 * actions and pagination. A bulk action bar (NlButtonDock) shows while rows are selected.
 */
export function MemberList({ members, status: initialStatus = 'ready', initial }: MemberListProps) {
  const [status, setStatus] = useState(initialStatus);
  const list = useMemberList(members, initial);
  const { state } = list;
  const selectedCount = state.selectedIds.length;

  const removeValue = <T,>(values: T[], value: T) => values.filter((item) => item !== value);

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
    ...(state.joinedFrom
      ? [
          {
            key: 'from',
            label: `Joined from: ${formatDate(state.joinedFrom)}`,
            onRemove: () => {
              list.setFilter('joinedFrom', '');
            },
          },
        ]
      : []),
    ...(state.joinedTo
      ? [
          {
            key: 'to',
            label: `Joined to: ${formatDate(state.joinedTo)}`,
            onRemove: () => {
              list.setFilter('joinedTo', '');
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
        {/* Four fields don't fit in NlTable's toolbar beside the search, so the filters get their own row
            (held for later). */}
        <div className="nl:grid nl:grid-cols-4 nl:gap-3xl">
          <NlMultiSelect
            label="Tier"
            options={tierOptions}
            value={state.tiers}
            onValueChange={(value) => {
              list.setFilter('tiers', value as MemberTier[]);
            }}
          />
          <NlMultiSelect
            label="Status"
            options={statusOptions}
            value={state.statuses}
            onValueChange={(value) => {
              list.setFilter('statuses', value as MemberStatus[]);
            }}
          />
          <NlDateField
            label="Joined from"
            value={state.joinedFrom}
            maxDate={state.joinedTo || undefined}
            onValueChange={(value) => {
              list.setFilter('joinedFrom', value);
            }}
          />
          <NlDateField
            label="Joined to"
            value={state.joinedTo}
            minDate={state.joinedFrom || undefined}
            onValueChange={(value) => {
              list.setFilter('joinedTo', value);
            }}
          />
        </div>

        {(chips.length > 0 || list.hasFilters) && (
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
        )}

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
            rowActions={(member) => [
              {
                label: 'View',
                onSelect: () => {
                  action('view')(member.id);
                  goTo('#member-detail');
                },
              },
              {
                label: 'Edit',
                onSelect: () => {
                  action('edit')(member.id);
                },
              },
              {
                label: 'Suspend',
                onSelect: () => {
                  action('suspend')(member.id);
                },
                disabled: member.status === 'suspended',
              },
            ]}
            toolbar={{
              search: {
                label: 'Search members',
                placeholder: 'Search by name, email or member ID',
                value: state.query,
                onChange: (event) => {
                  list.setFilter('query', event.target.value);
                },
                onClear: () => {
                  list.setFilter('query', '');
                },
              },
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

        {showRows && selectedCount > 0 && (
          // NlButtonDock is look only; the page pins it to the bottom of the scrolling content.
          <div className="nl:sticky nl:bottom-none nl:z-sticky">
            <NlButtonDock
              sticky
              accessory={`${String(selectedCount)} selected`}
              secondary={{
                children: 'Export',
                onClick: () => {
                  action('export')(state.selectedIds);
                },
              }}
              tertiary={{
                children: 'Change status',
                onClick: () => {
                  action('change status')(state.selectedIds);
                },
              }}
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
}
