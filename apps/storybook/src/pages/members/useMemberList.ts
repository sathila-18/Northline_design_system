import { useMemo, useState } from 'react';
import type { NlTableSort } from '@northline/ui';
import type { Member, MemberStatus, MemberTier } from '../_fixtures/members';

/** The member list's story state: search, filters, sort, pages and selection. */
export interface MemberListState {
  query: string;
  tiers: MemberTier[];
  statuses: MemberStatus[];
  /** ISO YYYY-MM-DD, '' for none. */
  joinedFrom: string;
  /** ISO YYYY-MM-DD, '' for none. */
  joinedTo: string;
  sort: NlTableSort;
  page: number;
  pageSize: number;
  selectedIds: string[];
}

/** Default sort: last activity, newest first. Also used when a column's sort is turned off. */
export const defaultSort: NlTableSort = { key: 'lastActivity', direction: 'descending' };

export const pageSizes = [10, 25, 50];

const initialState: MemberListState = {
  query: '',
  tiers: [],
  statuses: [],
  joinedFrom: '',
  joinedTo: '',
  sort: defaultSort,
  page: 1,
  pageSize: 10,
  selectedIds: [],
};

type FilterKey = 'query' | 'tiers' | 'statuses' | 'joinedFrom' | 'joinedTo';
type SortKey = 'points' | 'joined' | 'lastActivity';

function matches(member: Member, state: MemberListState) {
  const query = state.query.trim().toLowerCase();
  if (
    query !== '' &&
    !member.name.toLowerCase().includes(query) &&
    !member.email.toLowerCase().includes(query) &&
    !member.id.toLowerCase().includes(query)
  )
    return false;
  if (state.tiers.length > 0 && !state.tiers.includes(member.tier)) return false;
  if (state.statuses.length > 0 && !state.statuses.includes(member.status)) return false;
  // ISO dates compare as strings.
  if (state.joinedFrom !== '' && member.joined < state.joinedFrom) return false;
  if (state.joinedTo !== '' && member.joined > state.joinedTo) return false;
  return true;
}

function compare(a: Member, b: Member, sort: NlTableSort) {
  const key = sort.key as SortKey;
  const result = key === 'points' ? a.points - b.points : a[key].localeCompare(b[key]);
  // Ties keep a stable order by member ID.
  const ordered = result === 0 ? a.id.localeCompare(b.id) : result;
  return sort.direction === 'ascending' ? ordered : -ordered;
}

/**
 * Search, filters, sorting, pagination and selection over the fixture members, in story state. Changing the search
 * or a filter goes back to page 1. Selection is kept across pages (NlTable).
 */
export function useMemberList(source: Member[], initial: Partial<MemberListState> = {}) {
  const [state, setState] = useState<MemberListState>({ ...initialState, ...initial });

  const filtered = useMemo(
    () => source.filter((member) => matches(member, state)).sort((a, b) => compare(a, b, state.sort)),
    [source, state],
  );

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / state.pageSize));
  const page = Math.min(state.page, pageCount);
  const rows = filtered.slice((page - 1) * state.pageSize, page * state.pageSize);
  const hasFilters =
    state.query.trim() !== '' ||
    state.tiers.length > 0 ||
    state.statuses.length > 0 ||
    state.joinedFrom !== '' ||
    state.joinedTo !== '';

  const setFilter = <K extends FilterKey>(key: K, value: MemberListState[K]) => {
    setState((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return {
    state,
    rows,
    total,
    page,
    pageCount,
    hasFilters,
    setFilter,
    clearFilters: () => {
      setState((prev) => ({ ...prev, query: '', tiers: [], statuses: [], joinedFrom: '', joinedTo: '', page: 1 }));
    },
    setSort: (sort: NlTableSort | null) => {
      setState((prev) => ({ ...prev, sort: sort ?? defaultSort }));
    },
    setPage: (next: number) => {
      setState((prev) => ({ ...prev, page: next }));
    },
    setPageSize: (pageSize: number) => {
      setState((prev) => ({ ...prev, pageSize, page: 1 }));
    },
    setSelectedIds: (selectedIds: string[]) => {
      setState((prev) => ({ ...prev, selectedIds }));
    },
  };
}
