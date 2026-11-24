import type { Meta, StoryObj } from '@storybook/react-vite';
import { memberGrowth } from '../../../../../apps/storybook/src/pages/_fixtures/charts';
import { NlTable } from '../../components/NlTable';
import { NlChartFrame, type NlChartFrameStatus } from '../NlChartFrame';
import { formatMonthLong, formatNumber } from '../shared/format';
import { NlLineChart, type NlLineChartSeries } from './NlLineChart';

const two: NlLineChartSeries[] = [
  { key: 'members', label: 'Members' },
  { key: 'newMembers', label: 'New members' },
];
const seven: NlLineChartSeries[] = [
  { key: 'tier2', label: 'Tier 2 members' },
  { key: 'returning', label: 'Returning members' },
  { key: 'tier3', label: 'Tier 3 members' },
  { key: 'newMembers', label: 'New members' },
  { key: 'inactive', label: 'Inactive members' },
  { key: 'suspended', label: 'Suspended members' },
  { key: 'members', label: 'All members' },
];

/** The same data as an NlTable, for "View as table". */
function GrowthTable({ series }: { series: NlLineChartSeries[] }) {
  return (
    // The grey header's titles are 4.46:1 in Dark: known issue K8 (accepted with NlTableHeaderCell #66).
    <div data-a11y-known-issue="K8">
      <NlTable
        caption="Member growth"
        columns={[
          { key: 'month', header: 'Month', rowHeader: true, cell: (row) => ({ children: formatMonthLong(row.month) }) },
          ...series.map((s) => ({
            key: s.key,
            header: s.label,
            cell: (row: (typeof memberGrowth)[number]) => ({ children: formatNumber(Number(row[s.key])) }),
          })),
        ]}
        rows={memberGrowth}
        getRowId={(row) => row.month}
        toolbar={false}
        pagination={false}
      />
    </div>
  );
}

/** The line chart in its frame, as a page uses it. */
function InFrame({
  status = 'ready',
  series = two,
  height = '320',
  defaultView,
}: {
  status?: NlChartFrameStatus;
  series?: NlLineChartSeries[];
  height?: '240' | '320';
  defaultView?: 'chart' | 'table';
}) {
  return (
    <div className="nl:max-w-720">
      <NlChartFrame
        title="Member growth"
        description="Members at the end of each month"
        status={status}
        height={height}
        table={<GrowthTable series={series} />}
        defaultView={defaultView}
        onRetry={() => undefined}
      >
        <NlLineChart title="Member growth" data={memberGrowth} xKey="month" series={series} height={height} />
      </NlChartFrame>
    </div>
  );
}

const meta = {
  title: 'Components/Charts/Line chart',
  component: NlLineChart,
  parameters: { layout: 'padded' },
  args: { title: 'Member growth', data: memberGrowth, xKey: 'month', series: two, height: '320' },
  argTypes: {
    height: { control: 'inline-radio', options: ['240', '320'] },
    data: { control: false },
    series: { control: false },
  },
  render: (args) => (
    <div className="nl:max-w-720">
      <NlLineChart {...args} />
    </div>
  ),
} satisfies Meta<typeof NlLineChart>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Two series over 15 months: markers on every point, a legend, "Jan 2027" where the year changes. Tab in, then use the arrow keys, Home and End. */
export const Default: Story = {};

/** One series: no legend; the title names it. */
export const SingleSeries: Story = { name: 'Single series', args: { series: two.slice(0, 1) } };

/** The most series allowed (7): every series colour and marker shape. */
export const MostSeries: Story = { name: 'Most series', args: { series: seven } };

/** Long series names are cut in the legend and tooltip; the table view has them in full. */
export const LongLabels: Story = {
  name: 'Long labels',
  args: {
    series: [
      { key: 'members', label: 'Members across every tier, including track day voucher holders' },
      { key: 'newMembers', label: 'New members who joined through an event pass' },
    ],
  },
};

/** Size-240 high. */
export const Short: Story = { args: { height: '240' } };

/** In its frame: the title, the "View as" switch and the chart. */
export const Framed: Story = { render: () => <InFrame /> };

/** View as table: the same data in an NlTable. */
export const ViewAsTable: Story = { name: 'View as table', render: () => <InFrame defaultView="table" /> };

/** Loading, in the frame: skeleton bars at the chart's height. */
export const Loading: Story = { render: () => <InFrame status="loading" /> };

/** Empty, in the frame: "No data for this period". */
export const Empty: Story = { render: () => <InFrame status="empty" /> };

/** Error, in the frame, with Try again. */
export const Error: Story = { render: () => <InFrame status="error" /> };

/** Twelve months from December, at half width (as on the dashboard): the crowded January gives way, the months between
 * the ends stay, and the last label fits. */
const decemberStart = memberGrowth.slice(0, 12).map((row, index) => ({
  ...row,
  month: index === 0 ? '2025-12' : `2026-${String(index).padStart(2, '0')}`,
}));

export const DecemberStart: Story = {
  name: 'December start',
  args: { data: decemberStart, series: two.slice(0, 1) },
  render: (args) => (
    <div className="nl:max-w-560">
      <NlLineChart {...args} />
    </div>
  ),
};
