import { useMemo, useState } from 'react';
import { action } from 'storybook/actions';
import {
  NlButton,
  NlDialog,
  NlFilterChip,
  NlInputChip,
  NlSnackbarProvider,
  NlTable,
  useNlSnackbar,
  type NlEmptyStateProps,
  type NlTableColumn,
} from '@northline/ui';
import {
  EVENTS_FIRST_DATE,
  EVENTS_LAST_DATE,
  eventStatuses,
  eventStatusLabel,
  eventTypeLabel,
  eventTypes,
  formatEventStart,
  type EventStatus,
  type EventType,
  type NlEvent,
} from '../_fixtures/events';
import { formatDate } from '../_fixtures/members';
import { PageLayout } from '../_shared/PageLayout';
import { EventDrawer, Registered, tierAccessCell } from './EventDrawer';
import { pageSizes, useEventList, type EventListState } from './useEventList';

/** Ready shows the data; loading and error stand in for a request that hasn't finished or failed. */
export type EventsStatus = 'ready' | 'loading' | 'error';

export interface EventsProps {
  /** The events to show: the fixtures, or a subset for the empty story. */
  events: NlEvent[];
  status?: EventsStatus;
  /** Starting tab, search, filters, sort or page. */
  initial?: Partial<EventListState>;
  /** An event whose drawer is open at the start (story only). */
  initialDrawer?: string;
  /** An event whose cancel dialog is open at the start (story only). */
  initialCancel?: string;
}

const typeOptions = eventTypes.map((type) => ({ value: type, label: eventTypeLabel[type] }));

/** Tab label words, lower case for the empty states. */
const tabNoun: Record<EventStatus, string> = {
  upcoming: 'upcoming events',
  live: 'live events',
  past: 'past events',
  draft: 'drafts',
  cancelled: 'cancelled events',
};

const tabLabel: Record<EventStatus, string> = {
  upcoming: 'Upcoming',
  live: 'Live',
  past: 'Past',
  draft: 'Drafts',
  cancelled: 'Cancelled',
};

const createEvent = () => {
  action('create event')();
};

/**
 * Events page (DESIGN.md §8.6, P7). The shared layout; status tabs with counts (filter chips: the library has no
 * tabs); NlTable with a search (name or ID), Create event, Type and Date filters in the header cells, active filters
 * as removable chips with Clear filters, date sorting (soonest first, Past and Cancelled most recent first), row
 * actions and pagination. A row click or View opens the event drawer; Cancel event asks in an NlDialog first, then
 * shows a success snackbar. Every date check uses the fixtures' fixed today (26/11/2026).
 */
export function Events(props: EventsProps) {
  return (
    <NlSnackbarProvider placement="top-end">
      <EventsPage {...props} />
    </NlSnackbarProvider>
  );
}

function EventsPage({ events, status: initialStatus = 'ready', initial, initialDrawer, initialCancel }: EventsProps) {
  const [status, setStatus] = useState(initialStatus);
  const snackbar = useNlSnackbar();
  // Status changes made in this story session: cancelled or published.
  const [changed, setChanged] = useState<Record<string, EventStatus>>({});
  const data = useMemo(
    () => events.map((event): NlEvent => ({ ...event, status: changed[event.id] ?? event.status })),
    [events, changed],
  );
  const list = useEventList(data, initial);
  const { state } = list;
  const [drawerId, setDrawerId] = useState<string | null>(initialDrawer ?? null);
  const [cancelId, setCancelId] = useState<string | null>(initialCancel ?? null);
  const drawerEvent = data.find((event) => event.id === drawerId) ?? null;
  const toCancel = data.find((event) => event.id === cancelId) ?? null;

  const edit = (event: NlEvent) => {
    action('edit')(event.id);
  };
  const publish = (event: NlEvent) => {
    setChanged((prev) => ({ ...prev, [event.id]: 'upcoming' }));
    action('publish')(event.id);
    snackbar.show({ tone: 'success', message: `${event.name} published` });
  };
  const confirmCancel = () => {
    if (!toCancel) return;
    setChanged((prev) => ({ ...prev, [toCancel.id]: 'cancelled' }));
    action('cancel event')(toCancel.id);
    snackbar.show({ tone: 'success', message: `${toCancel.name} cancelled` });
    setCancelId(null);
  };

  const columns: NlTableColumn<NlEvent>[] = [
    // The table has one line per cell, so the type has its own column.
    { key: 'name', header: 'Event', rowHeader: true },
    {
      key: 'type',
      header: 'Type',
      cell: (event) => ({ children: eventTypeLabel[event.type] }),
      filter: {
        options: typeOptions,
        value: state.types,
        onApply: (value: string[]) => {
          list.setFilter('types', value as EventType[]);
        },
      },
    },
    {
      key: 'start',
      header: 'Date and time',
      sortable: true,
      cell: (event) => ({ children: formatEventStart(event) }),
      filter: {
        type: 'date-range',
        value: { start: state.from || null, end: state.to || null },
        onApply: (value) => {
          list.setRange(value.start ?? '', value.end ?? '');
        },
        minDate: EVENTS_FIRST_DATE,
        maxDate: EVENTS_LAST_DATE,
      },
    },
    { key: 'location', header: 'Location' },
    { key: 'tier', header: 'Tier access', cell: tierAccessCell },
    { key: 'registered', header: 'Registered', cell: (event) => ({ children: <Registered event={event} /> }) },
  ];

  const dateLabel = (() => {
    if (state.from && state.to) return `Date: ${formatDate(state.from)} to ${formatDate(state.to)}`;
    if (state.from) return `Date from: ${formatDate(state.from)}`;
    if (state.to) return `Date to: ${formatDate(state.to)}`;
    return '';
  })();

  const chips = [
    ...state.types.map((type) => ({
      key: `type-${type}`,
      label: `Type: ${eventTypeLabel[type]}`,
      onRemove: () => {
        list.setFilter(
          'types',
          state.types.filter((item) => item !== type),
        );
      },
    })),
    ...(dateLabel
      ? [
          {
            key: 'date',
            label: dateLabel,
            onRemove: () => {
              list.setRange('', '');
            },
          },
        ]
      : []),
  ];

  let empty: NlEmptyStateProps;
  if (status === 'error') {
    empty = {
      icon: 'error',
      heading: "Events couldn't load",
      description: 'Something went wrong while loading the events.',
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
  } else if (!list.hasFilters) {
    empty = {
      icon: 'event',
      heading: `No ${tabNoun[state.tab]}`,
      description:
        state.tab === 'upcoming'
          ? 'Events appear here once they are published.'
          : 'Events with this status appear here.',
      action:
        state.tab === 'upcoming' || state.tab === 'draft' ? (
          <NlButton variant="primary" size="small" onClick={createEvent}>
            Create event
          </NlButton>
        ) : undefined,
    };
  } else {
    empty = {
      icon: 'search',
      heading: 'No events match these filters',
      description: 'Try a different search or fewer filters.',
      action: (
        <NlButton variant="primary" size="small" onClick={list.clearFilters}>
          Clear filters
        </NlButton>
      ),
    };
  }

  const showRows = status === 'ready';

  return (
    <PageLayout active="#events" title="Events">
      <div className="nl:flex nl:flex-col nl:gap-xl">
        {/* Status tabs: the library has no tabs, so single-choice filter chips stand in (Held for later). */}
        <div role="group" aria-label="Event status" className="nl:flex nl:flex-wrap nl:gap-s">
          {eventStatuses.map((tab) => (
            <NlFilterChip
              key={tab}
              size="small"
              selected={state.tab === tab}
              onSelectedChange={() => {
                list.setTab(tab);
              }}
            >
              {`${tabLabel[tab]} (${showRows ? String(list.counts[tab]) : '–'})`}
            </NlFilterChip>
          ))}
        </div>
        {/* The grey header's titles are 4.46:1 in Dark: known issue K8 (accepted with NlTableHeaderCell #66). */}
        <div data-a11y-known-issue="K8">
          <NlTable
            caption={`${eventStatusLabel[state.tab]} events`}
            columns={columns}
            rows={showRows ? list.rows : []}
            getRowId={(event) => event.id}
            getRowLabel={(event) => event.name}
            loading={status === 'loading'}
            sort={list.sort}
            onSortChange={list.setSort}
            onRowClick={(event) => {
              setDrawerId(event.id);
            }}
            rowActions={(event) => [
              {
                label: 'View',
                onSelect: () => {
                  setDrawerId(event.id);
                },
              },
              {
                label: 'Edit',
                onSelect: () => {
                  edit(event);
                },
                disabled: event.status !== 'upcoming' && event.status !== 'draft',
              },
              {
                label: 'Duplicate',
                onSelect: () => {
                  action('duplicate')(event.id);
                },
              },
              {
                label: 'Cancel event',
                onSelect: () => {
                  setCancelId(event.id);
                },
                disabled: event.status !== 'upcoming',
              },
            ]}
            toolbar={{
              search: {
                label: 'Search events',
                placeholder: 'Search by name or ID',
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
              // The page header has no action slot, so Create event sits in the table toolbar (Held for later).
              action: { children: 'Create event', icon: 'leading', iconName: 'add', onClick: createEvent },
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
      <EventDrawer
        event={drawerEvent}
        onClose={() => {
          setDrawerId(null);
        }}
        onEdit={edit}
        onPublish={publish}
        onCancel={(event) => {
          setCancelId(event.id);
        }}
      />
      <NlDialog
        open={toCancel !== null}
        onOpenChange={(open) => {
          if (!open) setCancelId(null);
        }}
        title="Cancel event"
        size="small"
        primaryAction={{ children: 'Cancel event', tone: 'destructive', onClick: confirmCancel }}
        secondaryAction={{
          children: 'Keep event',
          onClick: () => {
            setCancelId(null);
          },
        }}
      >
        {toCancel
          ? `Are you sure you want to cancel “${toCancel.name}”? ${String(toCancel.registrations.length)} registered members will be told it isn't going ahead.`
          : ''}
      </NlDialog>
    </PageLayout>
  );
}
