import { useEffect, useId, useRef, useState } from 'react';
import { action } from 'storybook/actions';
import { NlBarChart, NlChartFrame } from '@northline/ui/charts';
import {
  NlButton,
  NlCheckboxListItem,
  NlDialog,
  NlEmptyState,
  NlHelperText,
  NlSelect,
  NlSideSheet,
  NlSnackbarProvider,
  NlTable,
  NlTextBlock,
  NlTextField,
  useNlSnackbar,
  type NlTableColumn,
} from '@northline/ui';
import { LAST_DATE, formatDate, formatPoints } from '../_fixtures/members';
import {
  formatMonths,
  formatMultiplier,
  formatPerkCount,
  keepMonthOptions,
  membersInTier,
  multiplierOptions,
  perks,
  shareOfMembers,
  tiers as fixtureTiers,
  totalMembers,
  type Tier,
} from '../_fixtures/tiers';
import { PageLayout } from '../_shared/PageLayout';
import { tierTone } from '../members/MemberDetailsSheet';

/** The edit drawer's fields, as typed. */
export interface TierDraft {
  name: string;
  pointsToReach: string;
  multiplier: string;
  keepMonths: string;
  perkIds: string[];
}

interface DraftErrors {
  name?: string;
  pointsToReach?: string;
  perkIds?: string;
}

export interface TiersProps {
  /** Hold the page in a state (stories): loading, or failed to load. */
  status?: 'ready' | 'loading' | 'error';
  /** Open the edit drawer on this tier (stories). */
  initialEditId?: string;
  /** Changes already typed in the drawer (stories). */
  initialDraft?: Partial<TierDraft>;
  /** Show the drawer's errors straight away, as after Save (stories). */
  initialShowErrors?: boolean;
  /** Show the discard dialog straight away (stories). */
  initialDiscard?: boolean;
  /** Save this change on mount, as if Save was just pressed (stories). */
  initialSave?: { id: string; draft: Partial<TierDraft> };
}

const toDraft = (tier: Tier): TierDraft => ({
  name: tier.name,
  pointsToReach: formatPoints(tier.pointsToReach),
  multiplier: String(tier.multiplier),
  keepMonths: String(tier.keepMonths),
  perkIds: tier.perkIds,
});

/** "15,000" or "15000" → 15000; anything else → NaN. */
const parsePoints = (value: string) => {
  const digits = value.replace(/[\s,]/g, '');
  return /^\d+$/.test(digits) ? Number(digits) : Number.NaN;
};

const sameDraft = (a: TierDraft, b: TierDraft) =>
  a.name === b.name &&
  parsePoints(a.pointsToReach) === parsePoints(b.pointsToReach) &&
  a.multiplier === b.multiplier &&
  a.keepMonths === b.keepMonths &&
  a.perkIds.length === b.perkIds.length &&
  a.perkIds.every((id) => b.perkIds.includes(id));

/** Checks a draft against the tiers either side of it. */
function validate(draft: TierDraft, index: number, list: Tier[]): DraftErrors {
  const errors: DraftErrors = {};
  if (draft.name.trim() === '') errors.name = 'Enter a tier name';
  if (index > 0) {
    const below = list[index - 1];
    const above = list[index + 1];
    const points = parsePoints(draft.pointsToReach);
    const low = (below?.pointsToReach ?? 0) + 1;
    const high = above ? above.pointsToReach - 1 : undefined;
    if (Number.isNaN(points) || points < low || (high !== undefined && points > high)) {
      errors.pointsToReach =
        high === undefined
          ? `Must be ${formatPoints(low)} or more`
          : `Must be between ${formatPoints(low)} and ${formatPoints(high)}`;
    }
  }
  if (draft.perkIds.length === 0) errors.perkIds = 'Select at least one perk';
  return errors;
}

function applyDraft(tier: Tier, draft: TierDraft, isFirst: boolean): Tier {
  return {
    ...tier,
    name: draft.name.trim(),
    pointsToReach: isFirst ? 0 : parsePoints(draft.pointsToReach),
    multiplier: Number(draft.multiplier),
    keepMonths: Number(draft.keepMonths),
    // Keep the perks in the list's order.
    perkIds: perks.map((perk) => perk.id).filter((id) => draft.perkIds.includes(id)),
    // The fixtures' "today".
    lastUpdated: LAST_DATE,
  };
}

/**
 * Tiers page (DESIGN.md §8.6, P6). Members by tier (one stacked NlBarChart in a card frame) and the tier rules table in
 * tier order, with a visible Edit button per row. Edit opens the edit drawer (NlSideSheet): name, points to reach,
 * multiplier, keep tier for and perks, checked on Save; leaving with changes asks first. Save updates the chart and
 * table and shows a success snackbar.
 */
export function Tiers(props: TiersProps) {
  return (
    <NlSnackbarProvider placement="top-end">
      <TiersPage {...props} />
    </NlSnackbarProvider>
  );
}

function TiersPage({
  status: initialStatus = 'ready',
  initialEditId,
  initialDraft,
  initialShowErrors = false,
  initialDiscard = false,
  initialSave,
}: TiersProps) {
  const snackbar = useNlSnackbar();
  const [status, setStatus] = useState(initialStatus);
  const [tiers, setTiers] = useState(() =>
    initialSave
      ? fixtureTiers.map((tier, index) =>
          tier.id === initialSave.id ? applyDraft(tier, { ...toDraft(tier), ...initialSave.draft }, index === 0) : tier,
        )
      : fixtureTiers,
  );
  const [editId, setEditId] = useState<string | null>(initialEditId ?? null);
  const [draft, setDraft] = useState<TierDraft | null>(() => {
    const tier = fixtureTiers.find((item) => item.id === initialEditId);
    return tier ? { ...toDraft(tier), ...initialDraft } : null;
  });
  const [showErrors, setShowErrors] = useState(initialShowErrors);
  const [discardOpen, setDiscardOpen] = useState(initialDiscard);

  const editIndex = tiers.findIndex((tier) => tier.id === editId);
  const editing = tiers[editIndex];
  const dirty = editing !== undefined && draft !== null && !sameDraft(draft, toDraft(editing));
  const errors = editing && draft && showErrors ? validate(draft, editIndex, tiers) : {};

  const save = (id: string, next: TierDraft, list: Tier[]) => {
    const index = list.findIndex((tier) => tier.id === id);
    const tier = list[index];
    if (!tier) return false;
    if (Object.keys(validate(next, index, list)).length > 0) return false;
    const saved = applyDraft(tier, next, index === 0);
    setTiers(list.map((item) => (item.id === id ? saved : item)));
    action('save tier')(saved);
    snackbar.show({ tone: 'success', message: `${saved.name} tier updated` });
    return true;
  };

  // The Saved story: the change is in the first state (above); the snackbar shows once, on mount.
  const savedOnce = useRef(false);
  useEffect(() => {
    if (!initialSave || savedOnce.current) return;
    savedOnce.current = true;
    const saved = fixtureTiers.find((item) => item.id === initialSave.id);
    if (saved) snackbar.show({ tone: 'success', message: `${initialSave.draft.name ?? saved.name} tier updated` });
  }, [initialSave, snackbar]);

  const openEdit = (tier: Tier) => {
    setEditId(tier.id);
    setDraft(toDraft(tier));
    setShowErrors(false);
  };
  const close = () => {
    setEditId(null);
    setDraft(null);
    setShowErrors(false);
    setDiscardOpen(false);
  };
  /** Cancel, Escape or the close button: asks first when there are changes. */
  const requestClose = () => {
    if (dirty) setDiscardOpen(true);
    else close();
  };
  const onSave = () => {
    if (!editing || !draft) return;
    setShowErrors(true);
    if (save(editing.id, draft, tiers)) close();
  };
  const update = (patch: Partial<TierDraft>) => {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const columns: NlTableColumn<Tier>[] = [
    {
      key: 'name',
      header: 'Tier',
      rowHeader: true,
      width: '120',
      cell: (tier) => ({ type: 'badge', badge: { tone: tierTone[tier.memberTier], label: tier.name } }),
    },
    {
      key: 'pointsToReach',
      header: 'Points to reach',
      cell: (tier) => ({ children: formatPoints(tier.pointsToReach) }),
    },
    { key: 'multiplier', header: 'Multiplier', cell: (tier) => ({ children: formatMultiplier(tier.multiplier) }) },
    { key: 'keepMonths', header: 'Keep tier for', cell: (tier) => ({ children: formatMonths(tier.keepMonths) }) },
    { key: 'perks', header: 'Perks', cell: (tier) => ({ children: formatPerkCount(tier.perkIds.length) }) },
    {
      key: 'members',
      header: 'Members',
      cell: (tier) => ({
        children: `${formatPoints(membersInTier[tier.memberTier])} (${shareOfMembers(tier.memberTier)})`,
      }),
    },
    {
      key: 'lastUpdated',
      header: 'Last updated',
      width: '120',
      cell: (tier) => ({ children: formatDate(tier.lastUpdated) }),
    },
    {
      // The only action, so a visible button instead of the row-actions menu. NlTable has no button cell type.
      key: 'edit',
      header: 'Action',
      width: '96',
      cell: (tier) => ({
        children: (
          <NlButton
            variant="tertiary"
            size="small"
            aria-label={`Edit ${tier.name} tier`}
            onClick={() => {
              openEdit(tier);
            }}
          >
            Edit
          </NlButton>
        ),
      }),
    },
  ];

  // One stacked bar: a series per tier, in tier order. The legend label carries the count and share, since the bar
  // chart's legend has no value slot.
  const chartRow = Object.fromEntries([
    ['group', 'All members'],
    ...tiers.map((tier) => [tier.id, membersInTier[tier.memberTier]]),
  ]) as Record<string, string | number>;
  const chartSeries = tiers.map((tier) => ({
    key: tier.id,
    label: `${tier.name} ${formatPoints(membersInTier[tier.memberTier])} (${shareOfMembers(tier.memberTier)})`,
  }));

  return (
    <PageLayout active="#tiers" title="Tiers" subtitle="Set how members move up and what each tier gets.">
      {status === 'error' ? (
        <NlEmptyState
          icon="error"
          heading="Tiers couldn't load"
          description="Something went wrong while loading the tiers."
          action={
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
          }
        />
      ) : (
        <div className="nl:flex nl:flex-col nl:gap-4xl">
          <NlChartFrame
            title="Members by tier"
            description={status === 'loading' ? undefined : `${formatPoints(totalMembers)} members`}
            height="240"
            status={status === 'loading' ? 'loading' : 'ready'}
          >
            <NlBarChart
              title="Members by tier"
              data={[chartRow]}
              xKey="group"
              orientation="horizontal"
              layout="stacked"
              height="240"
              series={chartSeries}
            />
          </NlChartFrame>

          <section className="nl:flex nl:flex-col nl:gap-l">
            <NlTextBlock type="headline-small" headingAs="h2" heading="Tier rules" />
            {/* The grey header's titles are 4.46:1 in Dark: known issue K8 (accepted with NlTableHeaderCell #66). */}
            <div data-a11y-known-issue="K8">
              <NlTable
                caption="Tier rules"
                columns={columns}
                rows={tiers}
                getRowId={(tier) => tier.id}
                getRowLabel={(tier) => tier.name}
                loading={status === 'loading'}
                toolbar={false}
                pagination={false}
              />
            </div>
          </section>
        </div>
      )}

      <NlSideSheet
        open={editing !== undefined && draft !== null}
        onOpenChange={(open) => {
          if (!open) requestClose();
        }}
        // With changes, an overlay click doesn't close the sheet; Escape and close ask first.
        dismissible={!dirty}
        title={editing ? `Edit ${editing.name} tier` : 'Edit tier'}
        size="small"
        footer={{
          secondary: { children: 'Cancel', onClick: requestClose },
          primary: { children: 'Save', onClick: onSave },
        }}
      >
        {editing && draft && <TierForm draft={draft} errors={errors} isFirst={editIndex === 0} onChange={update} />}
      </NlSideSheet>

      <NlDialog
        open={discardOpen}
        onOpenChange={(open) => {
          if (!open) setDiscardOpen(false);
        }}
        title="Discard changes?"
        size="small"
        primaryAction={{ children: 'Discard', tone: 'destructive', onClick: close }}
        secondaryAction={{
          children: 'Keep editing',
          onClick: () => {
            setDiscardOpen(false);
          },
        }}
      >
        {`Your changes to the ${editing?.name ?? ''} tier haven't been saved.`}
      </NlDialog>
    </PageLayout>
  );
}

function TierForm({
  draft,
  errors,
  isFirst,
  onChange,
}: {
  draft: TierDraft;
  errors: DraftErrors;
  isFirst: boolean;
  onChange: (patch: Partial<TierDraft>) => void;
}) {
  const perksLabelId = useId();
  const perksErrorId = useId();
  return (
    <form
      noValidate
      className="nl:flex nl:flex-col nl:gap-xl"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <NlTextField
        label="Tier name"
        required
        value={draft.name}
        error={errors.name !== undefined}
        helperText={errors.name}
        onChange={(event) => {
          onChange({ name: event.target.value });
        }}
      />
      <NlTextField
        label="Points to reach"
        inputMode="numeric"
        autoComplete="off"
        // The first tier always starts at 0.
        readOnly={isFirst}
        value={isFirst ? '0' : draft.pointsToReach}
        error={errors.pointsToReach !== undefined}
        helperText={
          errors.pointsToReach ?? (isFirst ? 'Every member starts in this tier, so it starts at 0.' : undefined)
        }
        onChange={(event) => {
          onChange({ pointsToReach: event.target.value });
        }}
      />
      <NlSelect
        label="Points multiplier"
        options={multiplierOptions.map((value) => ({ value: String(value), label: formatMultiplier(value) }))}
        value={draft.multiplier}
        onValueChange={(value) => {
          onChange({ multiplier: value });
        }}
      />
      <NlSelect
        label="Keep tier for"
        options={keepMonthOptions.map((value) => ({ value: String(value), label: formatMonths(value) }))}
        value={draft.keepMonths}
        onValueChange={(value) => {
          onChange({ keepMonths: value });
        }}
      />
      <div
        role="group"
        aria-labelledby={perksLabelId}
        aria-describedby={errors.perkIds ? perksErrorId : undefined}
        className="nl:flex nl:flex-col nl:gap-s"
      >
        <span id={perksLabelId}>
          <NlTextBlock type="label" heading="Perks" />
        </span>
        <div>
          {perks.map((perk, index) => (
            <NlCheckboxListItem
              key={perk.id}
              // No divider under the last row (page rule 10).
              divider={index < perks.length - 1}
              title={perk.label}
              size="small"
              density="compact"
              checked={draft.perkIds.includes(perk.id)}
              onCheckedChange={(checked) => {
                onChange({
                  perkIds: checked ? [...draft.perkIds, perk.id] : draft.perkIds.filter((id) => id !== perk.id),
                });
              }}
            />
          ))}
        </div>
        {errors.perkIds && (
          <NlHelperText id={perksErrorId} tone="error">
            {errors.perkIds}
          </NlHelperText>
        )}
      </div>
    </form>
  );
}
