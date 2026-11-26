import { useMemo, useState } from 'react';
import type { NlTableSort } from '@northline/ui';
import type { EventStatus, EventType, NlEvent } from '../_fixtures/events';

/** The events page's story state: tab, search, filters, sort and pages. */
export interface EventListState {
  tab: EventStatus;
  query: string;
  types: EventType[];
  /** ISO YYYY-MM-DD, '' for none. Matches events running on any day in the range. */
  from: string;
  /** ISO YYYY-MM-DD, '' for none. */
  to: string;
  /** null: the tab's default sort. */
  sort: NlTableSort | null;
  page: number;
  pageSize: number;
}

export const pageSizes = [10, 25, 50];

/** Soonest first, except Past and Cancelled: most recent first. */
export function tabSort(tab: EventStatus): NlTableSort {
  return { key: 'start', direction: tab === 'past' || tab === 'cancelled' ? 'descending' : 'ascending' };
}

const initialState: EventListState = {
  tab: 'upcoming',
  query: '',
  types: [],
  from: '',
  to: '',
  sort: null,
  page: 1,
  pageSize: 10,
};

type FilterKey = 'query' | 'types';

function matches(event: NlEvent, state: EventListState) {
  const query = state.query.trim().toLowerCase();
  if (query !== '' && !event.name.toLowerCase().includes(query) && !event.id.toLowerCase().includes(query))
    return false;
  if (state.types.length > 0 && !state.types.includes(event.type)) return false;
  // ISO dates compare as strings. An event matches if any of its days is in the range.
  if (state.from !== '' && event.end.slice(0, 10) < state.from) return false;
  if (state.to !== '' && event.start.slice(0, 10) > state.to) return false;
  return true;
}

function compare(a: NlEvent, b: NlEvent, sort: NlTableSort) {
  const result = a.start.localeCompare(b.start) || a.id.localeCompare(b.id);
  return sort.direction === 'ascending' ? result : -result;
}

/**
 * Tabs, search, filters, sorting and pagination over the fixture events, in story state. Changing the tab, the search
 * or a filter goes back to page 1; changing the tab also goes back to its default sort.
 */
export function useEventList(source: NlEvent[], initial: Partial<EventListState> = {}) {
  const [state, setState] = useState<EventListState>({ ...initialState, ...initial });
  const sort = state.sort ?? tabSort(state.tab);

  const counts = useMemo(() => {
    const result: Record<EventStatus, number> = { upcoming: 0, live: 0, past: 0, draft: 0, cancelled: 0 };
    for (const event of source) result[event.status] += 1;
    return result;
  }, [source]);

  const filtered = useMemo(
    () =>
      source.filter((event) => event.status === state.tab && matches(event, state)).sort((a, b) => compare(a, b, sort)),
    [source, state, sort],
  );

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / state.pageSize));
  const page = Math.min(state.page, pageCount);
  const rows = filtered.slice((page - 1) * state.pageSize, page * state.pageSize);
  const hasFilters = state.query.trim() !== '' || state.types.length > 0 || state.from !== '' || state.to !== '';

  return {
    state,
    sort,
    counts,
    rows,
    total,
    page,
    pageCount,
    hasFilters,
    setTab: (tab: EventStatus) => {
      setState((prev) => ({ ...prev, tab, sort: null, page: 1 }));
    },
    setFilter: <K extends FilterKey>(key: K, value: EventListState[K]) => {
      setState((prev) => ({ ...prev, [key]: value, page: 1 }));
    },
    setRange: (from: string, to: string) => {
      setState((prev) => ({ ...prev, from, to, page: 1 }));
    },
    clearFilters: () => {
      setState((prev) => ({ ...prev, query: '', types: [], from: '', to: '', page: 1 }));
    },
    setSort: (next: NlTableSort | null) => {
      setState((prev) => ({ ...prev, sort: next }));
    },
    setPage: (next: number) => {
      setState((prev) => ({ ...prev, page: next }));
    },
    setPageSize: (pageSize: number) => {
      setState((prev) => ({ ...prev, pageSize, page: 1 }));
    },
  };
}
