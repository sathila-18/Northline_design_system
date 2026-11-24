import { useState } from 'react';
import { NlButton, NlSegmentedButton, NlStatCard, NlTable, NlTextBlock, type NlTableColumn } from '@northline/ui';
import { NlBarChart, NlChartFrame, NlDonutChart, NlLineChart, type NlChartFrameStatus } from '@northline/ui/charts';
import {
  activeMembers,
  membersByTier,
  monthly,
  recentActivity,
  rewardRedemptions,
  type ActivityRow,
  type MonthData,
} from '../_fixtures/dashboard';
import { formatDate, formatPoints } from '../_fixtures/members';
import { PageLayout } from '../_shared/PageLayout';
import { goTo } from '../_shared/navItems';

/** Ready shows the data; the other states stand in for a new programme, a slow load or one failed request. */
export type DashboardStatus = 'ready' | 'loading' | 'empty' | 'partial-error';

type Period = '12m' | '6m' | '30d';

/** How many months each period shows. Last 30 days shows the latest month: the fixtures are monthly (held). */
const periodMonths: Record<Period, number> = { '12m': 12, '6m': 6, '30d': 1 };

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthLabel = (month: string) => `${monthNames[Number(month.slice(5, 7)) - 1] ?? ''} ${month.slice(0, 4)}`;
const signed = (points: number) => (points < 0 ? `−${formatPoints(-points)}` : `+${formatPoints(points)}`);

/** A chart's data as an NlTable, for "View as table". */
function ChartTable<T extends Record<string, unknown>>({
  caption,
  rows,
  columns,
  rowId,
}: {
  caption: string;
  rows: T[];
  columns: NlTableColumn<T>[];
  rowId: (row: T) => string;
}) {
  return (
    // The grey header's titles are 4.46:1 in Dark: known issue K8 (accepted with NlTableHeaderCell #66).
    <div data-a11y-known-issue="K8">
      <NlTable caption={caption} columns={columns} rows={rows} getRowId={rowId} toolbar={false} pagination={false} />
    </div>
  );
}

const activityColumns: NlTableColumn<ActivityRow>[] = [
  { key: 'member', header: 'Member', rowHeader: true },
  { key: 'event', header: 'Event' },
  { key: 'points', header: 'Points', width: '120', cell: (row) => ({ children: signed(row.points) }) },
  { key: 'date', header: 'Date', width: '120', cell: (row) => ({ children: formatDate(row.date) }) },
];

/**
 * Dashboard page (DESIGN.md §8.6, P3). Storybook only, built from library components and the fixtures. A period
 * switch, four stat cards, member growth and points earned vs redeemed, top rewards and members by tier (each chart
 * in an NlChartFrame with its table view), and the latest member activity with a link to the Member list.
 */
export function Dashboard({ status = 'ready' }: { status?: DashboardStatus }) {
  const [period, setPeriod] = useState<Period>('12m');
  const empty = status === 'empty';
  const months: MonthData[] = empty ? [] : monthly.slice(-periodMonths[period]);
  const first = months[0];
  const last = months.at(-1);

  const issued = months.reduce((sum, m) => sum + m.earned, 0);
  const redeemed = months.reduce((sum, m) => sum + m.redeemed, 0);
  const rate = issued > 0 ? Math.round((redeemed / issued) * 100) : 0;

  const start = 12 - periodMonths[period];
  const topRewards = empty
    ? []
    : rewardRedemptions
        .map((r) => ({ reward: r.reward, redemptions: r.byMonth.slice(start).reduce((sum, n) => sum + n, 0) }))
        .sort((a, b) => b.redemptions - a.redemptions)
        .slice(0, 5);
  const tiers = empty ? [] : membersByTier;

  const frameStatus = (hasData: boolean): NlChartFrameStatus =>
    status === 'loading' ? 'loading' : hasData ? 'ready' : 'empty';
  const statValue = (value: string) => (status === 'loading' ? '–' : value);
  const range =
    first && last
      ? first === last
        ? monthLabel(first.month)
        : `${monthLabel(first.month)} to ${monthLabel(last.month)}`
      : '';

  return (
    <PageLayout active="#dashboard" title="Dashboard" subtitle={empty ? 'No data yet' : range}>
      <div className="nl:flex nl:flex-col nl:gap-3xl">
        {/* NlPageHeader has no action slot (held), so the period switch sits at the top of the content, at the end. */}
        <div className="nl:flex nl:justify-end">
          {/* The switch fills its container; the wrapper keeps it to its content at the end. */}
          <div className="nl:w-fit">
            <NlSegmentedButton
              aria-label="Period"
              size="small"
              value={period}
              onValueChange={(value) => {
                setPeriod(value as Period);
              }}
              options={[
                { value: '12m', label: 'Last 12 months' },
                { value: '6m', label: 'Last 6 months' },
                { value: '30d', label: 'Last 30 days' },
              ]}
            />
          </div>
        </div>

        <dl className="nl:m-none nl:grid nl:grid-cols-4 nl:gap-3xl">
          <NlStatCard inList label="Active members" value={statValue(empty ? '0' : formatPoints(activeMembers))} />
          <NlStatCard inList label="Points issued" value={statValue(formatPoints(issued))} />
          <NlStatCard inList label="Points redeemed" value={statValue(formatPoints(redeemed))} />
          <NlStatCard inList label="Redemption rate" value={statValue(`${String(rate)}%`)} />
        </dl>

        <div className="nl:grid nl:grid-cols-2 nl:gap-3xl">
          <NlChartFrame
            title="Member growth"
            description="Members at the end of each month"
            status={frameStatus(months.length > 0)}
            table={
              <ChartTable
                caption="Member growth"
                rows={months}
                rowId={(row) => row.month}
                columns={[
                  {
                    key: 'month',
                    header: 'Month',
                    rowHeader: true,
                    cell: (row) => ({ children: monthLabel(row.month) }),
                  },
                  {
                    key: 'totalMembers',
                    header: 'Members',
                    cell: (row) => ({ children: formatPoints(row.totalMembers) }),
                  },
                  { key: 'newMembers', header: 'New', cell: (row) => ({ children: formatPoints(row.newMembers) }) },
                ]}
              />
            }
          >
            <NlLineChart
              title="Member growth"
              data={months}
              xKey="month"
              series={[{ key: 'totalMembers', label: 'Members' }]}
            />
          </NlChartFrame>
          <NlChartFrame
            title="Points earned vs redeemed"
            description="By month"
            status={frameStatus(months.length > 0)}
            table={
              <ChartTable
                caption="Points earned vs redeemed"
                rows={months}
                rowId={(row) => row.month}
                columns={[
                  {
                    key: 'month',
                    header: 'Month',
                    rowHeader: true,
                    cell: (row) => ({ children: monthLabel(row.month) }),
                  },
                  { key: 'earned', header: 'Earned', cell: (row) => ({ children: formatPoints(row.earned) }) },
                  { key: 'redeemed', header: 'Redeemed', cell: (row) => ({ children: formatPoints(row.redeemed) }) },
                ]}
              />
            }
          >
            <NlBarChart
              title="Points earned vs redeemed"
              data={months}
              xKey="month"
              series={[
                { key: 'earned', label: 'Earned' },
                { key: 'redeemed', label: 'Redeemed' },
              ]}
            />
          </NlChartFrame>
        </div>

        <div className="nl:grid nl:grid-cols-2 nl:gap-3xl">
          <NlChartFrame
            title="Top rewards"
            description="Top 5 by redemptions"
            status={status === 'partial-error' ? 'error' : frameStatus(topRewards.length > 0)}
            onRetry={() => undefined}
            table={
              <ChartTable
                caption="Top rewards"
                rows={topRewards}
                rowId={(row) => row.reward}
                columns={[
                  { key: 'reward', header: 'Reward', rowHeader: true },
                  {
                    key: 'redemptions',
                    header: 'Redemptions',
                    width: '120',
                    cell: (row) => ({ children: formatPoints(row.redemptions) }),
                  },
                ]}
              />
            }
          >
            <NlBarChart
              title="Top rewards"
              data={topRewards}
              xKey="reward"
              orientation="horizontal"
              showValues
              series={[{ key: 'redemptions', label: 'Redemptions' }]}
            />
          </NlChartFrame>
          <NlChartFrame
            title="Members by tier"
            description="All members"
            status={frameStatus(tiers.length > 0)}
            table={
              <ChartTable
                caption="Members by tier"
                rows={tiers}
                rowId={(row) => row.key}
                columns={[
                  { key: 'label', header: 'Tier', rowHeader: true },
                  {
                    key: 'value',
                    header: 'Members',
                    width: '120',
                    cell: (row) => ({ children: formatPoints(row.value) }),
                  },
                ]}
              />
            }
          >
            <NlDonutChart title="Members by tier" data={tiers} sortBy="data" totalLabel="Members" />
          </NlChartFrame>
        </div>

        <section className="nl:flex nl:flex-col nl:gap-l" aria-label="Recent activity">
          <div className="nl:flex nl:items-center nl:justify-between nl:gap-l">
            <NlTextBlock type="headline-small" headingAs="h2" heading="Recent activity" />
            <NlButton
              variant="link"
              size="small"
              onClick={() => {
                goTo('#members');
              }}
            >
              View all
            </NlButton>
          </div>
          {/* The grey header's titles are 4.46:1 in Dark: known issue K8 (accepted with NlTableHeaderCell #66). */}
          <div data-a11y-known-issue="K8">
            <NlTable
              caption="Recent activity"
              columns={activityColumns}
              rows={empty ? [] : recentActivity}
              getRowId={(row) => row.id}
              loading={status === 'loading'}
              toolbar={false}
              pagination={false}
              empty={{
                icon: 'person',
                heading: 'No activity yet',
                description: 'Member events appear here as they happen.',
              }}
            />
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
