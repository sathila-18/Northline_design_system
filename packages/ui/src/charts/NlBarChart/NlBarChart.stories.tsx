import type { Meta, StoryObj } from '@storybook/react-vite';
import { pointsByMonth, topRewards } from '../../../../../apps/storybook/src/pages/_fixtures/charts';
import { NlTable } from '../../components/NlTable';
import { NlChartFrame, type NlChartFrameStatus } from '../NlChartFrame';
import { formatMonthLong, formatNumber } from '../shared/format';
import { NlBarChart, type NlBarChartSeries } from './NlBarChart';

const earnedRedeemed: NlBarChartSeries[] = [
  { key: 'earned', label: 'Earned' },
  { key: 'redeemed', label: 'Redeemed' },
];
const five: NlBarChartSeries[] = [
  { key: 'earned', label: 'Earned' },
  { key: 'redeemed', label: 'Redeemed' },
  { key: 'bonus', label: 'Bonus' },
  { key: 'expired', label: 'Expired' },
  { key: 'adjusted', label: 'Adjusted' },
];

/** The same data as an NlTable, for "View as table". */
function PointsTable({ series }: { series: NlBarChartSeries[] }) {
  return (
    // The grey header's titles are 4.46:1 in Dark: known issue K8 (accepted with NlTableHeaderCell #66).
    <div data-a11y-known-issue="K8">
      <NlTable
        caption="Points earned and redeemed"
        columns={[
          { key: 'month', header: 'Month', rowHeader: true, cell: (row) => ({ children: formatMonthLong(row.month) }) },
          ...series.map((s) => ({
            key: s.key,
            header: s.label,
            cell: (row: (typeof pointsByMonth)[number]) => ({ children: formatNumber(Number(row[s.key])) }),
          })),
        ]}
        rows={pointsByMonth}
        getRowId={(row) => row.month}
        toolbar={false}
        pagination={false}
      />
    </div>
  );
}

function InFrame({ status = 'ready', defaultView }: { status?: NlChartFrameStatus; defaultView?: 'chart' | 'table' }) {
  return (
    <div className="nl:max-w-720">
      <NlChartFrame
        title="Points earned and redeemed"
        description="By month, 2026"
        status={status}
        table={<PointsTable series={earnedRedeemed} />}
        defaultView={defaultView}
        onRetry={() => undefined}
      >
        <NlBarChart title="Points earned and redeemed" data={pointsByMonth} xKey="month" series={earnedRedeemed} />
      </NlChartFrame>
    </div>
  );
}

const meta = {
  title: 'Components/Charts/Bar chart',
  component: NlBarChart,
  parameters: { layout: 'padded' },
  args: {
    title: 'Points earned and redeemed',
    data: pointsByMonth,
    xKey: 'month',
    series: earnedRedeemed,
    orientation: 'vertical',
    layout: 'grouped',
    height: '320',
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    layout: { control: 'inline-radio', options: ['grouped', 'stacked'] },
    height: { control: 'inline-radio', options: ['240', '320'] },
    showValues: { control: 'boolean' },
    data: { control: false },
    series: { control: false },
  },
  render: (args) => (
    <div className="nl:max-w-720">
      <NlBarChart {...args} />
    </div>
  ),
} satisfies Meta<typeof NlBarChart>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Grouped, vertical: points earned vs redeemed by month. Tab in, then use the arrow keys, Home and End. */
export const Default: Story = {};

/** Stacked: segments add up; the tooltip and announcements have a total. */
export const Stacked: Story = { args: { layout: 'stacked' } };

/** The most stacked series allowed (5). */
export const MostSeries: Story = { name: 'Most series', args: { layout: 'stacked', series: five } };

/** Grouped is limited to 3 series; extra series are left out. */
export const GroupedThree: Story = { name: 'Grouped, three', args: { series: five.slice(0, 3) } };

/** Single series with value labels. */
export const SingleSeries: Story = {
  name: 'Single series',
  args: { series: earnedRedeemed.slice(0, 1), showValues: true },
};

/** Horizontal: top rewards, largest first (the page sorts); labels in a Size-120 column, long ones cut. */
export const Horizontal: Story = {
  args: {
    title: 'Top rewards',
    data: topRewards,
    xKey: 'reward',
    series: [{ key: 'redeemed', label: 'Times redeemed' }],
    orientation: 'horizontal',
    showValues: true,
  },
};

/** Long category labels on vertical bars: cut with an ellipsis to fit their slot. */
export const LongLabels: Story = {
  name: 'Long labels',
  args: {
    title: 'Top rewards',
    data: topRewards,
    xKey: 'reward',
    series: [{ key: 'redeemed', label: 'Times redeemed' }],
  },
};

/** In its frame. */
export const Framed: Story = { render: () => <InFrame /> };

/** View as table. */
export const ViewAsTable: Story = { name: 'View as table', render: () => <InFrame defaultView="table" /> };

/** Loading, in the frame. */
export const Loading: Story = { render: () => <InFrame status="loading" /> };

/** Empty, in the frame. */
export const Empty: Story = { render: () => <InFrame status="empty" /> };

/** Error, in the frame. */
export const Error: Story = { render: () => <InFrame status="error" /> };
