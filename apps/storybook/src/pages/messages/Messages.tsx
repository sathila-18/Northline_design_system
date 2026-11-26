import { useMemo, useState } from 'react';
import { linkTo } from '@storybook/addon-links';
import { action } from 'storybook/actions';
import {
  NlButton,
  NlDialog,
  NlSnackbarProvider,
  NlTable,
  useNlSnackbar,
  type NlEmptyStateProps,
  type NlTableColumn,
} from '@northline/ui';
import {
  audienceWithSize,
  channelLabel,
  formatSendDate,
  messageChannels,
  messageStatusLabel,
  messageStatuses,
  type Message,
  type MessageChannel,
  type MessageStatus,
} from '../_fixtures/messages';
import { PageLayout } from '../_shared/PageLayout';
import { CampaignDrawer, clickRate, Figure, messageStatusTone, NO_VALUE, openRate } from './CampaignDrawer';
import { pageSizes, useMessageList, type MessageListState } from './useMessageList';

/** Ready shows the data; loading and error stand in for a request that hasn't finished or failed. */
export type MessagesStatus = 'ready' | 'loading' | 'error';

export interface MessagesProps {
  /** The campaigns to show: the fixtures, or [] for a programme with none yet. */
  messages: Message[];
  status?: MessagesStatus;
  /** Starting search, filters, sort or page. */
  initial?: Partial<MessageListState>;
  /** A campaign whose drawer is open at the start (story only). */
  initialDrawer?: string;
  /** A campaign whose cancel dialog is open at the start (story only). */
  initialCancel?: string;
}

/** Status filter labels: plural where the status is a noun. */
const statusFilterLabel: Record<MessageStatus, string> = {
  draft: 'Drafts',
  scheduled: 'Scheduled',
  sending: 'Sending',
  sent: 'Sent',
  failed: 'Failed',
};

const channelOptions = messageChannels.map((channel) => ({ value: channel, label: channelLabel[channel] }));

/** Create campaign opens the Coming soon story: there is no campaign editor yet. */
const createCampaign = () => {
  action('create campaign')();
  linkTo('Pages/Coming soon', 'Create campaign')();
};

/**
 * Messages page (DESIGN.md §8.6, P8): the campaigns a brand's loyalty team sends to its members. The shared layout and
 * NlTable: a search (name or ID) and Create campaign in the toolbar; Channel and Status filters in their header cells
 * (nothing selected by default, counts on the status options), with Clear filters in the toolbar while any is on (no
 * filter chips); send date sorting (newest first); open and click rates in tabular figures (a dash where they don't
 * apply); row actions and pagination. A row click or View opens the campaign drawer; Cancel asks in an NlDialog
 * first. Every date check uses the fixtures' fixed today (26/11/2026).
 */
export function Messages(props: MessagesProps) {
  return (
    <NlSnackbarProvider placement="top-end">
      <MessagesPage {...props} />
    </NlSnackbarProvider>
  );
}

function MessagesPage({
  messages,
  status: initialStatus = 'ready',
  initial,
  initialDrawer,
  initialCancel,
}: MessagesProps) {
  const [status, setStatus] = useState(initialStatus);
  const snackbar = useNlSnackbar();
  // Status changes made in this story session: cancelled, scheduled or retried.
  const [changed, setChanged] = useState<Record<string, MessageStatus>>({});
  const data = useMemo(
    () => messages.map((message): Message => ({ ...message, status: changed[message.id] ?? message.status })),
    [messages, changed],
  );
  const list = useMessageList(data, initial);
  const { state } = list;
  const [drawerId, setDrawerId] = useState<string | null>(initialDrawer ?? null);
  const [cancelId, setCancelId] = useState<string | null>(initialCancel ?? null);
  const drawerMessage = data.find((message) => message.id === drawerId) ?? null;
  const toCancel = data.find((message) => message.id === cancelId) ?? null;

  const setStatusOf = (message: Message, next: MessageStatus) => {
    setChanged((prev) => ({ ...prev, [message.id]: next }));
  };
  const edit = (message: Message) => {
    action('edit')(message.id);
  };
  const duplicate = (message: Message) => {
    action('duplicate')(message.id);
  };
  const schedule = (message: Message) => {
    setStatusOf(message, 'scheduled');
    action('schedule')(message.id);
    snackbar.show({ tone: 'success', message: `${message.name} scheduled` });
  };
  const retry = (message: Message) => {
    setStatusOf(message, 'sending');
    action('retry')(message.id);
    snackbar.show({ tone: 'success', message: `${message.name} is sending again` });
  };
  const confirmCancel = () => {
    if (!toCancel) return;
    // A cancelled campaign goes back to Drafts.
    setStatusOf(toCancel, 'draft');
    action('cancel')(toCancel.id);
    snackbar.show({ tone: 'success', message: `${toCancel.name} cancelled and moved to drafts` });
    setCancelId(null);
  };

  const columns: NlTableColumn<Message>[] = [
    { key: 'name', header: 'Campaign', rowHeader: true },
    {
      key: 'channel',
      header: 'Channel',
      cell: (message) => ({ children: channelLabel[message.channel] }),
      filter: {
        options: channelOptions,
        value: state.channels,
        onApply: (value: string[]) => {
          list.setChannels(value as MessageChannel[]);
        },
      },
    },
    {
      key: 'audience',
      header: 'Audience',
      cell: (message) => ({ children: audienceWithSize(message) }),
    },
    {
      key: 'sendAt',
      header: 'Send date',
      sortable: true,
      cell: (message) => ({ children: <Figure>{formatSendDate(message)}</Figure> }),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (message) => ({
        type: 'badge',
        badge: { tone: messageStatusTone[message.status], label: messageStatusLabel[message.status] },
      }),
      filter: {
        options: messageStatuses.map((value) => ({
          value,
          label: `${statusFilterLabel[value]} (${String(list.counts[value])})`,
        })),
        value: state.statuses,
        onApply: (value: string[]) => {
          list.setStatuses(value as MessageStatus[]);
        },
      },
    },
    {
      key: 'openRate',
      header: 'Open rate',
      cell: (message) => ({ children: <Figure>{openRate(message) ?? NO_VALUE}</Figure> }),
    },
    {
      key: 'clickRate',
      header: 'Click rate',
      cell: (message) => ({ children: <Figure>{clickRate(message) ?? NO_VALUE}</Figure> }),
    },
  ];

  let empty: NlEmptyStateProps;
  if (status === 'error') {
    empty = {
      icon: 'error',
      heading: "Campaigns couldn't load",
      description: 'Something went wrong while loading the campaigns.',
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
  } else if (messages.length === 0) {
    empty = {
      icon: 'mail',
      heading: 'No campaigns yet',
      description: 'Campaigns you send to members appear here.',
      action: (
        <NlButton variant="primary" size="small" onClick={createCampaign}>
          Create campaign
        </NlButton>
      ),
    };
  } else {
    empty = {
      icon: 'search',
      heading: 'No campaigns match these filters',
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
    <PageLayout active="#messages" title="Messages">
      <div className="nl:flex nl:flex-col nl:gap-xl">
        {/* The grey header's titles are 4.46:1 in Dark: known issue K8 (accepted with NlTableHeaderCell #66). */}
        <div data-a11y-known-issue="K8">
          <NlTable
            caption="Campaigns"
            columns={columns}
            rows={showRows ? list.rows : []}
            getRowId={(message) => message.id}
            getRowLabel={(message) => message.name}
            loading={status === 'loading'}
            sort={state.sort}
            onSortChange={list.setSort}
            onRowClick={(message) => {
              setDrawerId(message.id);
            }}
            rowActions={(message) => [
              {
                label: 'View',
                onSelect: () => {
                  setDrawerId(message.id);
                },
              },
              {
                label: 'Duplicate',
                onSelect: () => {
                  duplicate(message);
                },
              },
              ...(message.status === 'scheduled'
                ? [
                    {
                      label: 'Cancel',
                      onSelect: () => {
                        setCancelId(message.id);
                      },
                    },
                  ]
                : []),
            ]}
            toolbar={{
              search: {
                label: 'Search campaigns',
                placeholder: 'Search by name or ID',
                className: 'nl:max-w-320',
                value: state.query,
                onChange: (event) => {
                  list.setQuery(event.target.value);
                },
                onClear: () => {
                  list.setQuery('');
                },
              },
              // Active filters show only in the header cells (designer, 27 Nov 2026: no filter chips, as on Events).
              filters: list.hasFilters ? (
                <NlButton variant="link" size="small" onClick={list.clearFilters}>
                  Clear filters
                </NlButton>
              ) : undefined,
              // The page header has no action slot, so Create campaign sits in the table toolbar (Held for later).
              action: { children: 'Create campaign', icon: 'leading', iconName: 'add', onClick: createCampaign },
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
      <CampaignDrawer
        message={drawerMessage}
        onClose={() => {
          setDrawerId(null);
        }}
        onEdit={edit}
        onSchedule={schedule}
        onCancel={(message) => {
          setCancelId(message.id);
        }}
        onDuplicate={duplicate}
        onRetry={retry}
      />
      <NlDialog
        open={toCancel !== null}
        onOpenChange={(open) => {
          if (!open) setCancelId(null);
        }}
        title="Cancel campaign"
        size="small"
        primaryAction={{ children: 'Cancel campaign', tone: 'destructive', onClick: confirmCancel }}
        secondaryAction={{
          children: 'Keep scheduled',
          onClick: () => {
            setCancelId(null);
          },
        }}
      >
        {toCancel
          ? `Are you sure you want to cancel “${toCancel.name}”? It won't be sent, and it moves back to Drafts.`
          : ''}
      </NlDialog>
    </PageLayout>
  );
}
