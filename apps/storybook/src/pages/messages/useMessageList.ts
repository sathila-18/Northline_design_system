import { useMemo, useState } from 'react';
import type { NlTableSort } from '@northline/ui';
import type { Message, MessageChannel, MessageStatus } from '../_fixtures/messages';

/** The tabs: All, or one status. */
export type MessageTab = 'all' | 'scheduled' | 'sent' | 'draft';
export const messageTabs: MessageTab[] = ['all', 'scheduled', 'sent', 'draft'];

/** The messages page's story state: tab, search, filters, sort and pages. */
export interface MessageListState {
  tab: MessageTab;
  query: string;
  channels: MessageChannel[];
  sort: NlTableSort;
  page: number;
  pageSize: number;
}

/** Newest first. Also used when the send date's sort is turned off. */
export const defaultSort: NlTableSort = { key: 'sendAt', direction: 'descending' };

export const pageSizes = [10, 25, 50];

const initialState: MessageListState = {
  tab: 'all',
  query: '',
  channels: [],
  sort: defaultSort,
  page: 1,
  pageSize: 10,
};

const inTab = (status: MessageStatus, tab: MessageTab) => tab === 'all' || status === tab;

function matches(message: Message, state: MessageListState) {
  const query = state.query.trim().toLowerCase();
  if (query !== '' && !message.name.toLowerCase().includes(query) && !message.id.toLowerCase().includes(query))
    return false;
  if (state.channels.length > 0 && !state.channels.includes(message.channel)) return false;
  return true;
}

function compare(a: Message, b: Message, sort: NlTableSort) {
  const result = a.sendAt.localeCompare(b.sendAt) || a.id.localeCompare(b.id);
  return sort.direction === 'ascending' ? result : -result;
}

/**
 * Tabs, search, the channel filter, sorting and pagination over the fixture campaigns, in story state. Changing the
 * tab, the search or a filter goes back to page 1.
 */
export function useMessageList(source: Message[], initial: Partial<MessageListState> = {}) {
  const [state, setState] = useState<MessageListState>({ ...initialState, ...initial });

  /** Campaigns per tab (before search and filters). */
  const counts = useMemo(() => {
    const result: Record<MessageTab, number> = { all: 0, scheduled: 0, sent: 0, draft: 0 };
    for (const message of source) for (const tab of messageTabs) if (inTab(message.status, tab)) result[tab] += 1;
    return result;
  }, [source]);

  const filtered = useMemo(
    () =>
      source
        .filter((message) => inTab(message.status, state.tab) && matches(message, state))
        .sort((a, b) => compare(a, b, state.sort)),
    [source, state],
  );

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / state.pageSize));
  const page = Math.min(state.page, pageCount);
  const rows = filtered.slice((page - 1) * state.pageSize, page * state.pageSize);
  const hasFilters = state.query.trim() !== '' || state.channels.length > 0;

  return {
    state,
    counts,
    rows,
    total,
    page,
    pageCount,
    hasFilters,
    setTab: (tab: MessageTab) => {
      setState((prev) => ({ ...prev, tab, page: 1 }));
    },
    setQuery: (query: string) => {
      setState((prev) => ({ ...prev, query, page: 1 }));
    },
    setChannels: (channels: MessageChannel[]) => {
      setState((prev) => ({ ...prev, channels, page: 1 }));
    },
    clearFilters: () => {
      setState((prev) => ({ ...prev, query: '', channels: [], page: 1 }));
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
  };
}
