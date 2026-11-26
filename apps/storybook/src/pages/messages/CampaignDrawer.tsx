import {
  NlBanner,
  NlSideSheet,
  NlTable,
  NlTextBlock,
  type NlBadgeTone,
  type NlButtonDockProps,
  type NlTableCellContent,
} from '@northline/ui';
import {
  audienceLabel,
  channelLabel,
  formatCount,
  formatRate,
  formatSendAt,
  messageStatusLabel,
  type Message,
  type MessageStatus,
} from '../_fixtures/messages';

export const messageStatusTone: Record<MessageStatus, NlBadgeTone> = {
  draft: 'warning',
  scheduled: 'info',
  sending: 'primary',
  sent: 'success',
  failed: 'error',
};

/** The dash shown where a rate doesn't apply. */
export const NO_VALUE = '–';

/** Opens over delivered, for sent email campaigns; null where it doesn't apply. */
export function openRate(message: Message): string | null {
  const results = message.results;
  if (results?.opened == null) return null;
  return formatRate(results.opened, results.delivered);
}

/** Clicks over delivered, for sent email, push and in-app campaigns; null where it doesn't apply. */
export function clickRate(message: Message): string | null {
  const results = message.results;
  if (results?.clicked == null) return null;
  return formatRate(results.clicked, results.delivered);
}

/** A number in tabular figures, so the column lines up. */
export const Figure = ({ children }: { children: string }) => <span className="nl:tabular-nums">{children}</span>;

interface DetailRow {
  key: string;
  label: string;
  value: NlTableCellContent;
}

function detailRows(message: Message): DetailRow[] {
  return [
    { key: 'id', label: 'Campaign ID', value: { children: message.id } },
    { key: 'channel', label: 'Channel', value: { children: channelLabel[message.channel] } },
    {
      key: 'status',
      label: 'Status',
      value: {
        type: 'badge',
        badge: { tone: messageStatusTone[message.status], label: messageStatusLabel[message.status] },
      },
    },
    { key: 'audience', label: 'Audience', value: { children: audienceLabel(message.audience) } },
    {
      key: 'size',
      label: 'Audience size',
      value: { children: <Figure>{`${formatCount(message.audienceSize)} members`}</Figure> },
    },
    {
      key: 'send',
      label: message.status === 'draft' ? 'Planned send' : 'Send date and time',
      value: { children: formatSendAt(message) },
    },
  ];
}

/** Delivered over the audience; opened and clicked over delivered. "Not tracked" where the channel can't. */
function resultRows(message: Message): DetailRow[] {
  const results = message.results;
  if (!results) return [];
  const withRate = (value: number | null, whole: number): NlTableCellContent => ({
    children:
      value === null ? (
        `Not tracked for ${channelLabel[message.channel]}`
      ) : (
        <Figure>{`${formatCount(value)} (${formatRate(value, whole)})`}</Figure>
      ),
  });
  return [
    { key: 'delivered', label: 'Delivered', value: withRate(results.delivered, message.audienceSize) },
    { key: 'opened', label: 'Opened', value: withRate(results.opened, results.delivered) },
    { key: 'clicked', label: 'Clicked', value: withRate(results.clicked, results.delivered) },
  ];
}

export interface CampaignDrawerProps {
  /** The campaign shown, or null when closed. */
  message: Message | null;
  onClose: () => void;
  onEdit: (message: Message) => void;
  onSchedule: (message: Message) => void;
  onCancel: (message: Message) => void;
  onDuplicate: (message: Message) => void;
  onRetry: (message: Message) => void;
}

/** Actions by status: scheduled Edit, Cancel; draft Edit, Schedule; sent Duplicate; failed Retry; sending none. */
function footerFor(message: Message, props: CampaignDrawerProps): NlButtonDockProps | undefined {
  switch (message.status) {
    case 'scheduled':
      return {
        secondary: {
          children: 'Cancel',
          tone: 'destructive',
          onClick: () => {
            props.onCancel(message);
          },
        },
        primary: {
          children: 'Edit',
          onClick: () => {
            props.onEdit(message);
          },
        },
      };
    case 'draft':
      return {
        secondary: {
          children: 'Edit',
          onClick: () => {
            props.onEdit(message);
          },
        },
        primary: {
          children: 'Schedule',
          onClick: () => {
            props.onSchedule(message);
          },
        },
      };
    case 'sent':
      return {
        primary: {
          children: 'Duplicate',
          onClick: () => {
            props.onDuplicate(message);
          },
        },
      };
    case 'failed':
      return {
        primary: {
          children: 'Retry',
          icon: 'leading',
          iconName: 'refresh',
          onClick: () => {
            props.onRetry(message);
          },
        },
      };
    case 'sending':
      return undefined;
  }
}

/**
 * The campaign drawer (P8): an NlSideSheet titled with the campaign's name; a failed campaign's reason in an error
 * NlBanner; a Detail / Value NlTable (ID, channel, status, audience, size, send date and time); the subject and body in
 * a neutral NlBanner without its icon as a plain preview panel; for sent campaigns, delivered, opened and clicked with their rates;
 * and actions by status in the footer.
 */
export function CampaignDrawer(props: CampaignDrawerProps) {
  const { message, onClose } = props;
  const results = message ? resultRows(message) : [];
  return (
    <NlSideSheet
      open={message !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={message?.name ?? 'Campaign'}
      size="large"
      footer={message ? footerFor(message, props) : undefined}
    >
      {message && (
        <div className="nl:flex nl:flex-col nl:gap-3xl">
          {message.status === 'failed' && (
            <NlBanner tone="error" title="This campaign didn't send">
              {message.failureReason}
            </NlBanner>
          )}
          {/* The grey header's titles are 4.46:1 in Dark: known issue K8 (accepted with NlTableHeaderCell #66). */}
          <div data-a11y-known-issue="K8">
            <NlTable
              caption={`${message.name} details`}
              columns={[
                { key: 'label', header: 'Detail', rowHeader: true, width: '120' },
                { key: 'value', header: 'Value', cell: (row: DetailRow) => row.value },
              ]}
              rows={detailRows(message)}
              getRowId={(row) => row.key}
              toolbar={false}
              pagination={false}
            />
          </div>
          <div className="nl:flex nl:flex-col nl:gap-m">
            <NlTextBlock type="headline-small" headingAs="h3" heading="Preview" />
            {/* No panel or card component yet: a static neutral banner without its icon stands in (Held for later). */}
            <NlBanner tone="neutral" showIcon={false} title={message.subject}>
              {message.body}
            </NlBanner>
          </div>
          {results.length > 0 && (
            <div className="nl:flex nl:flex-col nl:gap-m">
              <NlTextBlock type="headline-small" headingAs="h3" heading="Results" />
              <div data-a11y-known-issue="K8">
                <NlTable
                  caption={`${message.name} results`}
                  columns={[
                    { key: 'label', header: 'Result', rowHeader: true, width: '120' },
                    { key: 'value', header: 'Members', cell: (row: DetailRow) => row.value },
                  ]}
                  rows={results}
                  getRowId={(row) => row.key}
                  toolbar={false}
                  pagination={false}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </NlSideSheet>
  );
}
