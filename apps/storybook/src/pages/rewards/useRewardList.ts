import { useMemo, useState } from 'react';
import type { NlTableSort } from '@northline/ui';
import type { Reward, RewardCategory, RewardStatus } from '../_fixtures/rewards';

export type RewardView = 'grid' | 'table';

/** The All rewards page's story state: search, filters, sort, view and pages. */
export interface RewardListState {
  query: string;
  categories: RewardCategory[];
  statuses: RewardStatus[];
  sort: NlTableSort;
  view: RewardView;
  page: number;
  /** Rows per page in the table. The grid always shows 12. */
  pageSize: number;
}

/** Default sort: redemptions, most first. Also used when a column's sort is turned off. */
export const defaultSort: NlTableSort = { key: 'redemptions', direction: 'descending' };

/** The toolbar's sort choices, as "key:direction". The table's sortable columns use the same keys. */
export const sortOptions = [
  { value: 'points:ascending', label: 'Points cost, low to high' },
  { value: 'points:descending', label: 'Points cost, high to low' },
  { value: 'redemptions:descending', label: 'Redemptions, most first' },
  { value: 'validUntil:ascending', label: 'Valid until, soonest first' },
];

export const toSortValue = (sort: NlTableSort) => `${sort.key}:${sort.direction}`;

export const fromSortValue = (value: string): NlTableSort => {
  const [key = defaultSort.key, direction] = value.split(':');
  return { key, direction: direction === 'ascending' ? 'ascending' : 'descending' };
};

export const gridPageSize = 12;
export const pageSizes = [10, 25, 50];

const initialState: RewardListState = {
  query: '',
  categories: [],
  statuses: [],
  sort: defaultSort,
  view: 'grid',
  page: 1,
  pageSize: 10,
};

type FilterKey = 'query' | 'categories' | 'statuses';

function matches(reward: Reward, state: RewardListState) {
  const query = state.query.trim().toLowerCase();
  if (query !== '' && !reward.name.toLowerCase().includes(query) && !reward.id.toLowerCase().includes(query))
    return false;
  if (state.categories.length > 0 && !state.categories.includes(reward.category)) return false;
  if (state.statuses.length > 0 && !state.statuses.includes(reward.status)) return false;
  return true;
}

function compare(a: Reward, b: Reward, sort: NlTableSort) {
  let result = 0;
  if (sort.key === 'points') result = a.points - b.points;
  else if (sort.key === 'redemptions') result = a.redemptions - b.redemptions;
  else if (sort.key === 'validUntil') result = a.validUntil.localeCompare(b.validUntil);
  // Ties keep a stable order by reward ID.
  const ordered = result === 0 ? a.id.localeCompare(b.id) : result;
  return sort.direction === 'ascending' ? ordered : -ordered;
}

/**
 * Search, filters, sort, view and pagination over the fixture rewards, in story state. Changing the search or a
 * filter goes back to page 1. Switching the view keeps the search, filters and sort, and starts at page 1.
 */
export function useRewardList(source: Reward[], initial: Partial<RewardListState> = {}) {
  const [state, setState] = useState<RewardListState>({ ...initialState, ...initial });

  const filtered = useMemo(
    () => source.filter((reward) => matches(reward, state)).sort((a, b) => compare(a, b, state.sort)),
    [source, state],
  );

  const size = state.view === 'grid' ? gridPageSize : state.pageSize;
  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / size));
  const page = Math.min(state.page, pageCount);
  const items = filtered.slice((page - 1) * size, page * size);
  const hasFilters = state.query.trim() !== '' || state.categories.length > 0 || state.statuses.length > 0;

  const setFilter = <K extends FilterKey>(key: K, value: RewardListState[K]) => {
    setState((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return {
    state,
    items,
    total,
    page,
    pageCount,
    /** The first and last item numbers on this page, from 1. */
    range: [total === 0 ? 0 : (page - 1) * size + 1, Math.min(page * size, total)] as const,
    hasFilters,
    setFilter,
    clearFilters: () => {
      setState((prev) => ({ ...prev, query: '', categories: [], statuses: [], page: 1 }));
    },
    setSort: (sort: NlTableSort | null) => {
      setState((prev) => ({ ...prev, sort: sort ?? defaultSort }));
    },
    setView: (view: RewardView) => {
      setState((prev) => ({ ...prev, view, page: 1 }));
    },
    setPage: (next: number) => {
      setState((prev) => ({ ...prev, page: next }));
    },
    setPageSize: (pageSize: number) => {
      setState((prev) => ({ ...prev, pageSize, page: 1 }));
    },
  };
}
