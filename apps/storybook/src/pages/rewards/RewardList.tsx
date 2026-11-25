import { useState } from 'react';
import { linkTo } from '@storybook/addon-links';
import { action } from 'storybook/actions';
import {
  NlBadge,
  NlButton,
  NlEmptyState,
  NlInputChip,
  NlListItem,
  NlMultiSelect,
  NlPagination,
  NlSearchField,
  NlSegmentedButton,
  NlSelect,
  NlSkeleton,
  NlTable,
  NlTextBlock,
  type NlBadgeTone,
  type NlEmptyStateProps,
  type NlTableColumn,
} from '@northline/ui';
import { formatDate, formatPoints } from '../_fixtures/members';
import {
  categoryIcon,
  categoryLabel,
  rewardCategories,
  rewardStatuses,
  rewardStatusLabel,
  type Reward,
  type RewardCategory,
  type RewardStatus,
} from '../_fixtures/rewards';
import { PageLayout } from '../_shared/PageLayout';
import {
  fromSortValue,
  gridPageSize,
  pageSizes,
  sortOptions,
  toSortValue,
  useRewardList,
  type RewardListState,
  type RewardView,
} from './useRewardList';

/** Ready shows the data; loading and error stand in for a request that hasn't finished or failed. */
export type RewardListStatus = 'ready' | 'loading' | 'error';

export interface RewardListProps {
  /** The rewards to show: the fixtures, or [] for a new programme. */
  rewards: Reward[];
  status?: RewardListStatus;
  /** Starting search, filters, sort, view or page. */
  initial?: Partial<RewardListState>;
}

/** Status tones: live success, scheduled info, expired neutral, draft warning. */
export const statusTone: Record<RewardStatus, NlBadgeTone> = {
  live: 'success',
  scheduled: 'info',
  expired: 'neutral',
  draft: 'warning',
};

const categoryOptions = rewardCategories.map((category) => ({ value: category, label: categoryLabel[category] }));
const statusOptions = rewardStatuses.map((status) => ({ value: status, label: rewardStatusLabel[status] }));
const viewOptions: [
  { value: RewardView; label: string; icon: 'dashboard' },
  { value: RewardView; label: string; icon: 'table' },
] = [
  { value: 'grid', label: 'Grid', icon: 'dashboard' },
  { value: 'table', label: 'Table', icon: 'table' },
];

const addReward = () => {
  action('add reward')();
};

/** Reward details aren't built yet: a card, row click or View opens their Coming soon story. */
const openReward = (reward: Reward) => {
  action('open reward')(reward.id);
  linkTo('Pages/Coming soon', 'Reward details')();
};

const stockText = (stock: Reward['stock']) => (stock === 'unlimited' ? 'Unlimited' : formatPoints(stock));

/**
 * All rewards page (DESIGN.md §8.6, P4). The shared layout with a toolbar above both views: search, Category and
 * Status multi selects, a sort select, the Grid / Table switch and Add reward, with active filters as removable
 * chips and Clear filters underneath. Grid (default): reward cards, 4 per row, 12 per page with pagination. Table:
 * NlTable with sorting in sync with the toolbar sort, row actions and pagination as on the Member list.
 */
export function RewardList({ rewards, status: initialStatus = 'ready', initial }: RewardListProps) {
  const [status, setStatus] = useState(initialStatus);
  const list = useRewardList(rewards, initial);
  const { state } = list;
  const ready = status === 'ready';

  const removeValue = <T,>(values: T[], value: T) => values.filter((item) => item !== value);
  const chips = [
    ...state.categories.map((category) => ({
      key: `category-${category}`,
      label: `Category: ${categoryLabel[category]}`,
      onRemove: () => {
        list.setFilter('categories', removeValue(state.categories, category));
      },
    })),
    ...state.statuses.map((value) => ({
      key: `status-${value}`,
      label: `Status: ${rewardStatusLabel[value]}`,
      onRemove: () => {
        list.setFilter('statuses', removeValue(state.statuses, value));
      },
    })),
  ];

  let empty: NlEmptyStateProps;
  if (status === 'error') {
    empty = {
      icon: 'error',
      heading: "Rewards couldn't load",
      description: 'Something went wrong while loading the rewards.',
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
  } else if (rewards.length === 0) {
    empty = {
      icon: 'redeem',
      heading: 'No rewards yet',
      description: 'Rewards appear here once you add them.',
      action: (
        <NlButton variant="primary" size="small" icon="leading" iconName="add" onClick={addReward}>
          Add reward
        </NlButton>
      ),
    };
  } else {
    empty = {
      icon: 'search',
      heading: 'No rewards match these filters',
      description: 'Try a different search or fewer filters.',
      action: (
        <NlButton variant="primary" size="small" onClick={list.clearFilters}>
          Clear filters
        </NlButton>
      ),
    };
  }

  const columns: NlTableColumn<Reward>[] = [
    { key: 'name', header: 'Reward', rowHeader: true },
    {
      key: 'category',
      header: 'Category',
      width: '120',
      cell: (reward) => ({ children: categoryLabel[reward.category] }),
    },
    {
      key: 'points',
      header: 'Points cost',
      width: '120',
      sortable: true,
      cell: (reward) => ({ children: formatPoints(reward.points) }),
    },
    {
      key: 'redemptions',
      header: 'Redemptions',
      width: '120',
      sortable: true,
      cell: (reward) => ({ children: formatPoints(reward.redemptions) }),
    },
    { key: 'stock', header: 'Stock', width: '120', cell: (reward) => ({ children: stockText(reward.stock) }) },
    {
      key: 'status',
      header: 'Status',
      width: '120',
      cell: (reward) => ({
        type: 'badge',
        badge: { tone: statusTone[reward.status], label: rewardStatusLabel[reward.status] },
      }),
    },
    {
      key: 'validUntil',
      header: 'Valid until',
      width: '120',
      sortable: true,
      cell: (reward) => ({ children: formatDate(reward.validUntil) }),
    },
  ];

  const count = list.total === 1 ? '1 reward' : `${formatPoints(list.total)} rewards`;
  const sortValue = toSortValue(state.sort);
  const showEmpty = status === 'error' || (ready && list.total === 0);

  return (
    <PageLayout active="#rewards" title="All rewards" subtitle={ready ? count : undefined}>
      <div className="nl:flex nl:flex-col nl:gap-xl">
        {/* Toolbar, above both views. */}
        <div className="nl:flex nl:flex-col nl:gap-l">
          {/* Row 1: search, then the view switch and Add reward at the end. */}
          <div className="nl:flex nl:items-center nl:gap-l">
            <search className="nl:w-320">
              <NlSearchField
                size="small"
                label="Search rewards by name or ID"
                placeholder="Search by name or ID"
                value={state.query}
                onChange={(event) => {
                  list.setFilter('query', event.target.value);
                }}
                onClear={() => {
                  list.setFilter('query', '');
                }}
              />
            </search>
            <div className="nl:ms-auto nl:flex nl:items-center nl:gap-l">
              <NlSegmentedButton
                aria-label="View"
                size="small"
                iconOnly
                options={viewOptions}
                value={state.view}
                onValueChange={(value) => {
                  list.setView(value as RewardView);
                }}
              />
              <NlButton size="small" icon="leading" iconName="add" onClick={addReward}>
                Add reward
              </NlButton>
            </div>
          </div>
          {/* Row 2: filters and sort. */}
          <div className="nl:flex nl:flex-wrap nl:items-center nl:gap-l">
            <div className="nl:w-240">
              <NlMultiSelect
                size="small"
                label="Category"
                options={categoryOptions}
                value={state.categories}
                onValueChange={(value) => {
                  list.setFilter('categories', value as RewardCategory[]);
                }}
              />
            </div>
            <div className="nl:w-240">
              <NlMultiSelect
                size="small"
                label="Status"
                options={statusOptions}
                value={state.statuses}
                onValueChange={(value) => {
                  list.setFilter('statuses', value as RewardStatus[]);
                }}
              />
            </div>
            <div className="nl:w-320">
              <NlSelect
                size="small"
                label="Sort by"
                options={sortOptions}
                value={sortOptions.some((option) => option.value === sortValue) ? sortValue : undefined}
                onValueChange={(value) => {
                  list.setSort(fromSortValue(value));
                }}
              />
            </div>
          </div>
          {chips.length > 0 || list.hasFilters ? (
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
          ) : null}
        </div>

        {state.view === 'table' ? (
          // The grey header's titles are 4.46:1 in Dark: known issue K8 (accepted with NlTableHeaderCell #66).
          <div data-a11y-known-issue="K8">
            <NlTable
              caption="All rewards"
              columns={columns}
              rows={ready ? list.items : []}
              getRowId={(reward) => reward.id}
              getRowLabel={(reward) => reward.name}
              loading={status === 'loading'}
              sort={state.sort}
              onSortChange={list.setSort}
              onRowClick={openReward}
              rowActions={(reward) => [
                {
                  label: 'View',
                  onSelect: () => {
                    openReward(reward);
                  },
                },
                {
                  label: 'Edit',
                  onSelect: () => {
                    action('edit')(reward.id);
                  },
                },
                {
                  label: 'Duplicate',
                  onSelect: () => {
                    action('duplicate')(reward.id);
                  },
                },
                {
                  label: 'Archive',
                  onSelect: () => {
                    action('archive')(reward.id);
                  },
                },
              ]}
              toolbar={false}
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
        ) : status === 'loading' ? (
          // Skeleton cards while the rewards load; the region is busy, each skeleton is hidden.
          <ul aria-busy="true" aria-label="Loading rewards" className="nl:grid nl:grid-cols-4 nl:gap-l">
            {Array.from({ length: gridPageSize }, (_, index) => (
              <li key={index} className="nl:flex nl:flex-col nl:gap-m nl:p-l">
                <NlSkeleton shape="circle" />
                <NlSkeleton shape="text" />
                <NlSkeleton shape="text" className="nl:w-1/2" />
                <NlSkeleton shape="rect" className="nl:w-1/3" />
              </li>
            ))}
          </ul>
        ) : showEmpty ? (
          <NlEmptyState {...empty} live={status !== 'error' && rewards.length > 0} />
        ) : (
          <div className="nl:flex nl:flex-col nl:gap-xl">
            <ul aria-label="Rewards" className="nl:grid nl:grid-cols-4 nl:gap-l">
              {list.items.map((reward) => (
                <li key={reward.id} className="nl:min-w-0">
                  <NlListItem
                    appearance="filled"
                    // Placement only: every card in a row is as tall as the tallest.
                    className="nl:h-full"
                    icon={categoryIcon[reward.category]}
                    title={reward.name}
                    body={
                      <span className="nl:flex nl:flex-col nl:items-start nl:gap-xs">
                        <span>{categoryLabel[reward.category]}</span>
                        <span className="nl:tabular-nums">{formatPoints(reward.points)} points</span>
                        <NlBadge tone={statusTone[reward.status]}>{rewardStatusLabel[reward.status]}</NlBadge>
                      </span>
                    }
                    onClick={() => {
                      openReward(reward);
                    }}
                  />
                </li>
              ))}
            </ul>
            <div className="nl:flex nl:items-center nl:justify-between nl:gap-l">
              <NlTextBlock
                type="body-m"
                description={`${String(list.range[0])}–${String(list.range[1])} of ${formatPoints(list.total)}`}
              />
              <NlPagination page={list.page} pageCount={list.pageCount} onPageChange={list.setPage} />
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
