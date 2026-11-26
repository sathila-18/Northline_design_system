import { useMemo, useState } from 'react';
import type { NlTableSort } from '@northline/ui';
import type { EventStatus, EventType, NlEvent } from '../_fixtures/events';

/** The events page's story state: search, filters, sort and pages. */
export interface EventListState {
  query: string;
  /** The Status column filter. [] shows every status. */
  statuses: EventStatus[];
  types: EventType[];
  /** ISO YYYY-MM-DD, '' for none. Matches events running on any day in the range. */
  from: string;
  /** ISO YYYY-MM-DD, '' for none. */
  to: string;
  /** null: not sorted (fixture order, by event ID). */
  sort: NlTableSort | null;
  page: number;
  pageSize: number;
}

export const pageSizes = [10, 25, 50];

/** The page opens on upcoming events. */
const initialState: EventListState = {
  query: '',
  statuses: ['upcoming'],
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
  if (state.statuses.length > 0 && !state.statuses.includes(event.status)) return false;
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
 * Search, filters, sorting and pagination over the fixture events, in story state. Changing the search or a filter
 * goes back to page 1. Not sorted until a sort is chosen in the Date and time header.
 */
export function useEventList(source: NlEvent[], initial: Partial<EventListState> = {}) {
  const [state, setState] = useState<EventListState>({ ...initialState, ...initial });
  const { sort } = state;

  /** Events per status, for the Status filter's options. */
  const counts = useMemo(() => {
    const result: Record<EventStatus, number> = { upcoming: 0, live: 0, past: 0, draft: 0, cancelled: 0 };
    for (const event of source) result[event.status] += 1;
    return result;
  }, [source]);

  const filtered = useMemo(() => {
    const matching = source.filter((event) => matches(event, state));
    return sort ? matching.sort((a, b) => compare(a, b, sort)) : matching;
  }, [source, state, sort]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / state.pageSize));
  const page = Math.min(state.page, pageCount);
  const rows = filtered.slice((page - 1) * state.pageSize, page * state.pageSize);
  /** Filters other than the status. */
  const hasOtherFilters = state.query.trim() !== '' || state.types.length > 0 || state.from !== '' || state.to !== '';
  const hasFilters = hasOtherFilters || state.statuses.length > 0;

  return {
    state,
    sort,
    counts,
    rows,
    total,
    page,
    pageCount,
    hasFilters,
    hasOtherFilters,
    setStatuses: (statuses: EventStatus[]) => {
      setState((prev) => ({ ...prev, statuses, page: 1 }));
    },
    setFilter: <K extends FilterKey>(key: K, value: EventListState[K]) => {
      setState((prev) => ({ ...prev, [key]: value, page: 1 }));
    },
    setRange: (from: string, to: string) => {
      setState((prev) => ({ ...prev, from, to, page: 1 }));
    },
    clearFilters: () => {
      setState((prev) => ({ ...prev, query: '', statuses: [], types: [], from: '', to: '', page: 1 }));
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
