import { useState } from 'react';
import { linkTo } from '@storybook/addon-links';
import { action } from 'storybook/actions';
import {
  NlBadge,
  NlButton,
  NlProgressBar,
  NlSideSheet,
  NlTable,
  NlTextBlock,
  type NlBadgeTone,
  type NlButtonDockProps,
  type NlTableCellContent,
} from '@northline/ui';
import {
  eventStatusLabel,
  eventTypeLabel,
  formatEventWhen,
  isFull,
  lowestTierOf,
  memberOf,
  registeredLabel,
  registeredPercent,
  tierAccessLabel,
  type EventStatus,
  type NlEvent,
  type Registration,
} from '../_fixtures/events';
import { formatDate } from '../_fixtures/members';
import { tierTone } from '../members/MemberDetailsSheet';

export const eventStatusTone: Record<EventStatus, NlBadgeTone> = {
  upcoming: 'info',
  live: 'success',
  past: 'neutral',
  draft: 'warning',
  cancelled: 'error',
};

/** The tier access badge content: the lowest tier's tone, "Gold and above". */
export const tierAccessCell = (event: NlEvent): NlTableCellContent => ({
  type: 'badge',
  badge: { tone: tierTone[lowestTierOf(event).memberTier], label: tierAccessLabel(event) },
});

/** The registration bar with "84 / 120" next to it, and a Full badge when full. */
export function Registered({ event }: { event: NlEvent }) {
  return (
    // A span: it sits inside the table cell's text span.
    <span className="nl:flex nl:min-w-0 nl:items-center nl:gap-m">
      {/* The bar fills its container, so a fixed-width span places it. */}
      <span className="nl:w-48 nl:shrink-0">
        <NlProgressBar
          value={registeredPercent(event)}
          label={`${event.name} registrations, ${registeredLabel(event)}`}
        />
      </span>
      <span className="nl:shrink-0">{registeredLabel(event)}</span>
      {isFull(event) && (
        <NlBadge tone="error" size="small">
          Full
        </NlBadge>
      )}
    </span>
  );
}

/** Member details aren't a page: the member list's details story stands in (it shows a fixed member). */
const openMember = (memberId: string) => {
  action('open member')(memberId);
  linkTo('Pages/Members/Member list', 'Details open')();
};

interface DetailRow {
  key: string;
  label: string;
  value: NlTableCellContent;
}

function detailRows(event: NlEvent): DetailRow[] {
  return [
    { key: 'id', label: 'Event ID', value: { children: event.id } },
    { key: 'type', label: 'Type', value: { children: eventTypeLabel[event.type] } },
    {
      key: 'status',
      label: 'Status',
      value: { type: 'badge', badge: { tone: eventStatusTone[event.status], label: eventStatusLabel[event.status] } },
    },
    { key: 'when', label: 'Date and time', value: { children: formatEventWhen(event) } },
    { key: 'location', label: 'Location', value: { children: event.location } },
    { key: 'tier', label: 'Tier access', value: tierAccessCell(event) },
    { key: 'capacity', label: 'Capacity', value: { children: <Registered event={event} /> } },
    ...(event.waitlist > 0
      ? [{ key: 'waitlist', label: 'Waitlist', value: { children: `${String(event.waitlist)} members` } }]
      : []),
  ];
}

const PREVIEW = 10;

export interface EventDrawerProps {
  /** The event shown, or null when closed. */
  event: NlEvent | null;
  onClose: () => void;
  onEdit: (event: NlEvent) => void;
  onPublish: (event: NlEvent) => void;
  onCancel: (event: NlEvent) => void;
}

/** Actions by status: upcoming Edit, Export attendees, Cancel event; draft Edit, Publish; the rest Export attendees. */
function footerFor(event: NlEvent, props: EventDrawerProps): NlButtonDockProps {
  const exportAttendees = {
    children: 'Export attendees',
    icon: 'leading' as const,
    iconName: 'download' as const,
    onClick: () => {
      action('export attendees')(event.id);
    },
  };
  const edit = {
    children: 'Edit',
    onClick: () => {
      props.onEdit(event);
    },
  };
  if (event.status === 'upcoming')
    return {
      tertiary: {
        children: 'Cancel event',
        tone: 'destructive',
        onClick: () => {
          props.onCancel(event);
        },
      },
      secondary: exportAttendees,
      primary: edit,
    };
  if (event.status === 'draft')
    return {
      secondary: edit,
      primary: {
        children: 'Publish',
        onClick: () => {
          props.onPublish(event);
        },
      },
    };
  return { primary: exportAttendees };
}

/**
 * The event drawer (P7): an NlSideSheet titled with the event's name; a Detail / Value NlTable (ID, type, status,
 * date and time, location, tier access, capacity with the registration bar, waitlist when there is one); the first
 * 10 registered members (name as a link to the member details story, tier, registered date) with View all for the
 * rest; and actions by status in the footer.
 */
export function EventDrawer(props: EventDrawerProps) {
  const { event, onClose } = props;
  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  // Each event opens on the short list (adjusting state during render).
  const [shownId, setShownId] = useState(event?.id);
  if (event?.id !== shownId) {
    setShownId(event?.id);
    setShowAll(false);
    setPage(1);
  }

  const registrations = event?.registrations ?? [];
  const pageCount = Math.max(1, Math.ceil(registrations.length / pageSize));
  const rows = showAll ? registrations.slice((page - 1) * pageSize, page * pageSize) : registrations.slice(0, PREVIEW);

  return (
    <NlSideSheet
      open={event !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={event?.name ?? 'Event'}
      size="large"
      footer={event ? footerFor(event, props) : undefined}
    >
      {event && (
        <div className="nl:flex nl:flex-col nl:gap-3xl">
          {/* The grey header's titles are 4.46:1 in Dark: known issue K8 (accepted with NlTableHeaderCell #66). */}
          <div data-a11y-known-issue="K8">
            <NlTable
              caption={`${event.name} details`}
              columns={[
                { key: 'label', header: 'Detail', rowHeader: true, width: '120' },
                { key: 'value', header: 'Value', cell: (row: DetailRow) => row.value },
              ]}
              rows={detailRows(event)}
              getRowId={(row) => row.key}
              toolbar={false}
              pagination={false}
            />
          </div>
          <div className="nl:flex nl:flex-col nl:gap-m">
            <NlTextBlock
              type="headline-small"
              headingAs="h3"
              heading="Registered members"
              description={
                registrations.length === 0 ? 'Nobody has registered yet.' : `${String(registrations.length)} registered`
              }
            />
            {registrations.length > 0 && (
              <div data-a11y-known-issue="K8">
                <NlTable
                  caption="Registered members"
                  columns={[
                    {
                      key: 'name',
                      header: 'Name',
                      cell: (row: Registration) => ({
                        type: 'link',
                        link: {
                          label: memberOf(row.memberId)?.name ?? row.memberId,
                          onClick: () => {
                            openMember(row.memberId);
                          },
                        },
                      }),
                    },
                    {
                      key: 'tier',
                      header: 'Tier',
                      width: '120',
                      cell: (row: Registration) => {
                        const tier = memberOf(row.memberId)?.tier;
                        return tier ? { type: 'badge', badge: { tone: tierTone[tier], label: tier } } : {};
                      },
                    },
                    {
                      key: 'registered',
                      header: 'Registered',
                      width: '120',
                      cell: (row: Registration) => ({ children: formatDate(row.registered) }),
                    },
                  ]}
                  rows={rows}
                  getRowId={(row) => row.memberId}
                  toolbar={false}
                  pagination={
                    showAll
                      ? {
                          page: Math.min(page, pageCount),
                          pageCount,
                          pageSize,
                          pageSizes: [10, 25, 50],
                          total: registrations.length,
                          onPageChange: setPage,
                          onPageSizeChange: (size) => {
                            setPageSize(size);
                            setPage(1);
                          },
                        }
                      : false
                  }
                />
              </div>
            )}
            {registrations.length > PREVIEW && (
              <div>
                <NlButton
                  variant="link"
                  size="small"
                  onClick={() => {
                    setShowAll(!showAll);
                    setPage(1);
                  }}
                >
                  {showAll ? 'Show first 10' : `View all ${String(registrations.length)}`}
                </NlButton>
              </div>
            )}
          </div>
        </div>
      )}
    </NlSideSheet>
  );
}
