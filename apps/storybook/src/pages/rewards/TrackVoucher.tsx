import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { linkTo } from '@storybook/addon-links';
import { action } from 'storybook/actions';
import {
  NlBadge,
  NlButton,
  NlDivider,
  NlEmptyState,
  NlIconContainer,
  NlSkeleton,
  NlTable,
  NlTextBlock,
  NlTextField,
  type NlBadgeTone,
  type NlIconContainerTone,
  type NlIconName,
  type NlTableCellContent,
} from '@northline/ui';
import { formatDate, formatPoints } from '../_fixtures/members';
import {
  CODE_PATTERN,
  memberOf,
  normaliseCode,
  recentVouchers,
  rewardOf,
  voucherStatusLabel,
  vouchers,
  type Voucher,
  type VoucherStatus,
} from '../_fixtures/vouchers';
import { PageLayout } from '../_shared/PageLayout';

/** What the result area shows. */
type Lookup =
  | { kind: 'idle' }
  | { kind: 'loading'; code: string }
  | { kind: 'found'; voucher: Voucher }
  | { kind: 'not-found'; code: string }
  | { kind: 'error'; code: string };

export interface TrackVoucherProps {
  /** A code already typed and searched (stories). */
  initialCode?: string;
  /** Hold the result area in a state (stories): the loading card, or a failed lookup. */
  initialState?: 'loading' | 'error';
}

/** How long a lookup takes in the story, so the loading card is visible. */
const LOOKUP_MS = 600;

export const voucherTone: Record<VoucherStatus, NlBadgeTone> = {
  issued: 'info',
  redeemed: 'primary',
  settled: 'success',
  expired: 'neutral',
  cancelled: 'error',
};

const formatError = 'Enter a code like NLV-7K2P-94QX';

function find(code: string): Lookup {
  const voucher = vouchers.find((item) => item.code === code);
  return voucher ? { kind: 'found', voucher } : { kind: 'not-found', code };
}

/** Member details aren't a page: the member list's details story stands in (it shows a fixed member). */
const openMember = (voucher: Voucher) => {
  action('open member')(voucher.memberId);
  linkTo('Pages/Members/Member list', 'Details open')();
};

/**
 * Track voucher page (DESIGN.md §8.6, P5). A code field with Track (Enter also tracks): the code is tidied (no
 * spaces, upper case) and checked against NLV-XXXX-XXXX first; a wrong format is a field error and doesn't search.
 * The result: the code, status, details, three steps (Issued, Redeemed, Settled) and actions by status; not found,
 * loading and error states. Recent vouchers below load into the result on a row click.
 */
export function TrackVoucher({ initialCode, initialState }: TrackVoucherProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [query, setQuery] = useState(initialCode ?? '');
  const initialNormal = normaliseCode(initialCode ?? '');
  const initialValid = CODE_PATTERN.test(initialNormal);
  const [fieldError, setFieldError] = useState(initialCode !== undefined && !initialValid);
  const [lookup, setLookup] = useState<Lookup>(() => {
    if (initialState === 'loading') return { kind: 'loading', code: initialNormal };
    if (initialState === 'error') return { kind: 'error', code: initialNormal };
    if (initialCode !== undefined && initialValid) return find(initialNormal);
    return { kind: 'idle' };
  });

  useEffect(
    () => () => {
      clearTimeout(timer.current);
    },
    [],
  );

  /** Looks a valid code up, with a short loading state. */
  const lookUp = (code: string) => {
    clearTimeout(timer.current);
    setLookup({ kind: 'loading', code });
    timer.current = setTimeout(() => {
      setLookup(find(code));
    }, LOOKUP_MS);
  };

  const track = (event?: SyntheticEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const code = normaliseCode(query);
    if (!CODE_PATTERN.test(code)) {
      setFieldError(true);
      inputRef.current?.focus();
      return;
    }
    setFieldError(false);
    setQuery(code);
    action('track')(code);
    lookUp(code);
  };

  const tryAnother = () => {
    clearTimeout(timer.current);
    setQuery('');
    setFieldError(false);
    setLookup({ kind: 'idle' });
    inputRef.current?.focus();
  };

  const loadVoucher = (voucher: Voucher) => {
    setQuery(voucher.code);
    setFieldError(false);
    lookUp(voucher.code);
  };

  return (
    <PageLayout active="#track-voucher" title="Track voucher" subtitle="Enter a voucher code to see where it is.">
      <div className="nl:flex nl:flex-col nl:gap-4xl">
        {/* The search: a code field and Track. Enter submits the form. */}
        <search>
          <form noValidate onSubmit={track} className="nl:flex nl:items-start nl:gap-l">
            <div className="nl:w-320">
              <NlTextField
                ref={inputRef}
                label="Voucher code"
                size="large"
                autoComplete="off"
                spellCheck={false}
                value={query}
                error={fieldError}
                helperText={fieldError ? formatError : undefined}
                onChange={(event) => {
                  setQuery(event.target.value);
                  if (fieldError) setFieldError(false);
                }}
              />
            </div>
            <NlButton type="submit">Track</NlButton>
          </form>
        </search>

        <section aria-label="Voucher" aria-live="polite" aria-busy={lookup.kind === 'loading' || undefined}>
          <Result lookup={lookup} onTryAnother={tryAnother} onRetry={lookUp} />
        </section>

        <section className="nl:flex nl:flex-col nl:gap-l">
          <NlTextBlock type="headline-small" headingAs="h2" heading="Recent vouchers" />
          {/* The grey header's titles are 4.46:1 in Dark: known issue K8 (accepted with NlTableHeaderCell #66). */}
          <div data-a11y-known-issue="K8">
            <NlTable
              caption="Recent vouchers"
              columns={[
                { key: 'code', header: 'Code', rowHeader: true, width: '120' },
                { key: 'reward', header: 'Reward', cell: (v) => ({ children: rewardOf(v)?.name ?? '' }) },
                { key: 'member', header: 'Member', cell: (v) => ({ children: memberOf(v)?.name ?? '' }) },
                { key: 'issued', header: 'Issued', width: '120', cell: (v) => ({ children: formatDate(v.issued) }) },
                {
                  key: 'status',
                  header: 'Status',
                  width: '120',
                  cell: (v) => ({
                    type: 'badge',
                    badge: { tone: voucherTone[v.status], label: voucherStatusLabel[v.status] },
                  }),
                },
              ]}
              rows={recentVouchers}
              getRowId={(v) => v.code}
              getRowLabel={(v) => v.code}
              onRowClick={loadVoucher}
              toolbar={false}
              pagination={false}
            />
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function Result({
  lookup,
  onTryAnother,
  onRetry,
}: {
  lookup: Lookup;
  onTryAnother: () => void;
  onRetry: (code: string) => void;
}) {
  switch (lookup.kind) {
    case 'idle':
      return null;
    case 'loading':
      // A short loading card; each skeleton is hidden, the section is busy.
      return (
        <div className="nl:flex nl:max-w-720 nl:flex-col nl:gap-l">
          <NlSkeleton shape="rect" className="nl:w-1/2" />
          <NlSkeleton shape="text" />
          <NlSkeleton shape="text" />
          <NlSkeleton shape="text" className="nl:w-1/2" />
        </div>
      );
    case 'not-found':
      return (
        <NlEmptyState
          icon="search"
          heading="No voucher with this code"
          description={`Nothing matches ${lookup.code}. Check the code and try again.`}
          live
          action={
            <NlButton variant="primary" size="small" onClick={onTryAnother}>
              Try another code
            </NlButton>
          }
        />
      );
    case 'error':
      return (
        <NlEmptyState
          icon="error"
          heading="The voucher couldn't load"
          description="Something went wrong while looking up the code."
          action={
            <NlButton
              variant="primary"
              size="small"
              icon="leading"
              iconName="refresh"
              onClick={() => {
                action('try again')(lookup.code);
                onRetry(lookup.code);
              }}
            >
              Try again
            </NlButton>
          }
        />
      );
    case 'found':
      return <VoucherCard voucher={lookup.voucher} />;
  }
}

const notYet = 'Not yet';

function VoucherCard({ voucher }: { voucher: Voucher }) {
  const reward = rewardOf(voucher);
  const member = memberOf(voucher);
  const rows: { key: string; label: string; value: NlTableCellContent }[] = [
    { key: 'reward', label: 'Reward', value: { children: reward?.name ?? '' } },
    { key: 'points', label: 'Points spent', value: { children: formatPoints(voucher.pointsSpent) } },
    {
      key: 'member',
      label: 'Member',
      value: {
        type: 'link',
        link: {
          label: member?.name ?? voucher.memberId,
          onClick: () => {
            openMember(voucher);
          },
        },
      },
    },
    { key: 'issued', label: 'Issued', value: { children: formatDate(voucher.issued) } },
    { key: 'expires', label: 'Expiry', value: { children: formatDate(voucher.expires) } },
    {
      key: 'redeemed',
      label: 'Redeemed',
      value: {
        children: voucher.redeemed ? `${formatDate(voucher.redeemed)}, ${voucher.place ?? ''}` : notYet,
      },
    },
    { key: 'settled', label: 'Settled', value: { children: voucher.settled ? formatDate(voucher.settled) : notYet } },
  ];

  const copy = () => {
    action('copy code')(voucher.code);
    // Storybook only: the clipboard can be blocked (an insecure page or no permission); the action still logs it.
    navigator.clipboard.writeText(voucher.code).catch(() => undefined);
  };

  return (
    <div className="nl:flex nl:max-w-720 nl:flex-col nl:gap-3xl">
      <div className="nl:flex nl:flex-wrap nl:items-center nl:gap-l">
        <NlTextBlock type="headline-medium" headingAs="h2" heading={voucher.code} />
        <NlBadge tone={voucherTone[voucher.status]} size="large">
          {voucherStatusLabel[voucher.status]}
        </NlBadge>
        <NlButton variant="tertiary" size="small" onClick={copy}>
          Copy code
        </NlButton>
      </div>

      <Steps voucher={voucher} />

      <div data-a11y-known-issue="K8">
        <NlTable
          caption={`${voucher.code} details`}
          columns={[
            { key: 'label', header: 'Detail', rowHeader: true, width: '120' },
            { key: 'value', header: 'Value', cell: (row) => row.value },
          ]}
          rows={rows}
          getRowId={(row) => row.key}
          toolbar={false}
          pagination={false}
        />
      </div>

      <Actions voucher={voucher} />
    </div>
  );
}

type StepState = 'done' | 'current' | 'todo' | 'expired' | 'cancelled';

const stepLook: Record<StepState, { icon: NlIconName; tone: NlIconContainerTone; text: string }> = {
  done: { icon: 'check_circle', tone: 'success', text: 'Done' },
  current: { icon: 'check_circle', tone: 'primary', text: 'Current step' },
  todo: { icon: 'remove', tone: 'disabled', text: 'Not yet' },
  expired: { icon: 'error', tone: 'error', text: 'Stopped, expired' },
  cancelled: { icon: 'cancel', tone: 'secondary', text: 'Stopped, cancelled' },
};

/**
 * Issued, Redeemed, Settled. The library's stepper is on hold, so the steps are icon containers with text, joined by
 * dividers. The last step reached is current. Expired and cancelled stop at the step they reached: the next step
 * shows the error state (expired) or the neutral state (cancelled), with a line saying why.
 */
function Steps({ voucher }: { voucher: Voucher }) {
  const reached = voucher.settled ? 3 : voucher.redeemed ? 2 : 1;
  const stopped = voucher.status === 'expired' || voucher.status === 'cancelled';
  const steps = [
    { label: 'Issued', date: voucher.issued },
    { label: 'Redeemed', date: voucher.redeemed },
    { label: 'Settled', date: voucher.settled },
  ];
  const stateOf = (index: number): StepState => {
    const step = index + 1;
    if (step < reached) return 'done';
    // Settled is the last step: every step is done.
    if (step === reached) return stopped || voucher.status === 'settled' ? 'done' : 'current';
    if (stopped && step === reached + 1) return voucher.status === 'expired' ? 'expired' : 'cancelled';
    return 'todo';
  };
  const why =
    voucher.status === 'expired'
      ? `Expired on ${formatDate(voucher.expires)} before it was redeemed.`
      : voucher.status === 'cancelled' && voucher.cancelled
        ? `Cancelled on ${formatDate(voucher.cancelled)}. The points went back to the member.`
        : undefined;

  return (
    <div className="nl:flex nl:flex-col nl:gap-l">
      <ol aria-label="Voucher progress" className="nl:m-none nl:flex nl:list-none nl:items-center nl:gap-l nl:p-none">
        {steps.map((step, index) => {
          const state = stateOf(index);
          const look = stepLook[state];
          return (
            <li
              key={step.label}
              className="nl:flex nl:flex-1 nl:items-center nl:gap-l"
              aria-current={state === 'current' ? 'step' : undefined}
            >
              <NlIconContainer icon={look.icon} tone={look.tone} size={40} label={look.text} />
              <NlTextBlock
                type="label"
                heading={step.label}
                description={
                  step.date
                    ? formatDate(step.date)
                    : state === 'expired' || state === 'cancelled'
                      ? voucherStatusLabel[voucher.status]
                      : notYet
                }
              />
              {index < steps.length - 1 ? (
                <div className="nl:min-w-0 nl:flex-1">
                  <NlDivider decorative />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
      {why ? <NlTextBlock type="body-m" description={why} /> : null}
    </div>
  );
}

function Actions({ voucher }: { voucher: Voucher }) {
  if (voucher.status === 'issued') {
    return (
      <div className="nl:flex nl:gap-l">
        <NlButton
          onClick={() => {
            action('mark as redeemed')(voucher.code);
          }}
        >
          Mark as redeemed
        </NlButton>
        <NlButton
          tone="destructive"
          variant="secondary"
          onClick={() => {
            action('cancel voucher')(voucher.code);
          }}
        >
          Cancel voucher
        </NlButton>
      </div>
    );
  }
  if (voucher.status === 'redeemed') {
    return (
      <div className="nl:flex nl:gap-l">
        <NlButton
          onClick={() => {
            action('mark as settled')(voucher.code);
          }}
        >
          Mark as settled
        </NlButton>
      </div>
    );
  }
  return null;
}
