import { NlSideSheet, NlTable, type NlBadgeTone, type NlTableCellContent } from '@northline/ui';
import {
  formatDate,
  formatPoints,
  statusLabel,
  type Member,
  type MemberStatus,
  type MemberTier,
} from '../_fixtures/members';

export const statusTone: Record<MemberStatus, NlBadgeTone> = {
  active: 'success',
  inactive: 'neutral',
  suspended: 'error',
};

export const tierTone: Record<MemberTier, NlBadgeTone> = {
  Bronze: 'bronze',
  Silver: 'silver',
  Gold: 'gold',
  Platinum: 'platinum',
};

interface DetailRow {
  key: string;
  label: string;
  value: NlTableCellContent;
}

function detailRows(member: Member): DetailRow[] {
  return [
    { key: 'id', label: 'Member ID', value: { children: member.id } },
    { key: 'name', label: 'Name', value: { children: member.name } },
    { key: 'email', label: 'Email', value: { children: member.email } },
    {
      key: 'tier',
      label: 'Tier',
      value: { type: 'badge', badge: { tone: tierTone[member.tier], label: member.tier } },
    },
    { key: 'points', label: 'Points balance', value: { children: formatPoints(member.points) } },
    { key: 'joined', label: 'Join date', value: { children: formatDate(member.joined) } },
    { key: 'lastActivity', label: 'Last activity', value: { children: formatDate(member.lastActivity) } },
    {
      key: 'status',
      label: 'Status',
      value: { type: 'badge', badge: { tone: statusTone[member.status], label: statusLabel[member.status] } },
    },
  ];
}

export interface MemberDetailsSheetProps {
  /** The member shown, or null when closed. */
  member: Member | null;
  onClose: () => void;
  onEdit: (member: Member) => void;
  onSuspend: (member: Member) => void;
}

/**
 * The member details side sheet (P2): "{name} details", a two-column NlTable of the member's details (Detail,
 * Value), and Suspend (destructive, OD-244) and Edit in the footer. Opened by a row click or View.
 */
export function MemberDetailsSheet({ member, onClose, onEdit, onSuspend }: MemberDetailsSheetProps) {
  return (
    <NlSideSheet
      open={member !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={member ? `${member.name} details` : 'Member details'}
      size="small"
      footer={
        member
          ? {
              secondary: {
                children: 'Suspend',
                tone: 'destructive',
                icon: 'leading',
                iconName: 'block',
                disabled: member.status === 'suspended',
                onClick: () => {
                  onSuspend(member);
                },
              },
              primary: {
                children: 'Edit',
                onClick: () => {
                  onEdit(member);
                },
              },
            }
          : undefined
      }
    >
      {member && (
        // The grey header's titles are 4.46:1 in Dark: known issue K8 (accepted with NlTableHeaderCell #66).
        <div data-a11y-known-issue="K8">
          <NlTable
            caption={`${member.name} details`}
            columns={[
              { key: 'label', header: 'Detail', rowHeader: true },
              { key: 'value', header: 'Value', cell: (row: DetailRow) => row.value },
            ]}
            rows={detailRows(member)}
            getRowId={(row) => row.key}
            toolbar={false}
            pagination={false}
          />
        </div>
      )}
    </NlSideSheet>
  );
}
