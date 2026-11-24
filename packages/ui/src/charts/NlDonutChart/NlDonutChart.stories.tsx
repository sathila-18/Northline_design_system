import type { Meta, StoryObj } from '@storybook/react-vite';
import { membersByTier, rewardsByKind } from '../../../../../apps/storybook/src/pages/_fixtures/charts';
import { NlTable } from '../../components/NlTable';
import { NlChartFrame, type NlChartFrameStatus } from '../NlChartFrame';
import { formatNumber } from '../shared/format';
import { NlDonutChart, shares } from './NlDonutChart';

const membersFormat = (value: number) => `${formatNumber(value)} members`;

/** Members by tier as an NlTable, for "View as table". */
function TierTable() {
  const percent = shares(membersByTier.map((t) => t.value));
  const rows = membersByTier.map((t, i) => ({ ...t, share: `${String(percent[i] ?? 0)}%` }));
  return (
    // The grey header's titles are 4.46:1 in Dark: known issue K8 (accepted with NlTableHeaderCell #66).
    <div data-a11y-known-issue="K8">
      <NlTable
        caption="Members by tier"
        columns={[
          { key: 'label', header: 'Tier', rowHeader: true },
          { key: 'value', header: 'Members', width: '120', cell: (row) => ({ children: formatNumber(row.value) }) },
          { key: 'share', header: 'Share', width: '120' },
        ]}
        rows={rows}
        getRowId={(row) => row.key}
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
        title="Members by tier"
        description="All members, 24/11/2026"
        status={status}
        table={<TierTable />}
        defaultView={defaultView}
        onRetry={() => undefined}
      >
        <NlDonutChart title="Members by tier" data={membersByTier} sortBy="data" formatValue={formatNumber} />
      </NlChartFrame>
    </div>
  );
}

const meta = {
  title: 'Components/Charts/Donut chart',
  component: NlDonutChart,
  parameters: { layout: 'padded' },
  args: { title: 'Members by tier', data: membersByTier, sortBy: 'data', totalLabel: 'Members', height: '320' },
  argTypes: {
    sortBy: { control: 'inline-radio', options: ['value', 'data'] },
    legendPosition: { control: 'inline-radio', options: [undefined, 'end', 'below'] },
    height: { control: 'inline-radio', options: ['240', '320'] },
    data: { control: false },
  },
  render: (args) => (
    <div className="nl:max-w-720">
      <NlDonutChart {...args} />
    </div>
  ),
} satisfies Meta<typeof NlDonutChart>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Members by tier, in tier order (sortBy data): the total in the centre, the legend beside the ring with shares. Tab in, then use the arrow keys. */
export const Default: Story = {};

/** Largest first (sortBy value, the default). */
export const ByValue: Story = { name: 'By value', args: { sortBy: 'value' } };

/** Eight kinds: the largest 4 and "Other", last. */
export const MostSlices: Story = {
  name: 'Most slices',
  args: { title: 'Rewards redeemed by kind', data: rewardsByKind, sortBy: 'value', totalLabel: 'Redeemed' },
};

/** One slice: a full ring, no gap. */
export const SingleSlice: Story = { name: 'Single slice', args: { data: membersByTier.slice(0, 1) } };

/** Long labels are cut in the legend (Size-240) and tooltip; the table view has them in full. */
export const LongLabels: Story = {
  name: 'Long labels',
  args: {
    data: [
      { key: 'a', label: 'Members who joined through a track day voucher', value: 412 },
      { key: 'b', label: 'Members who joined through an event pass', value: 260 },
      { key: 'c', label: 'Members invited by another member', value: 118 },
    ],
  },
};

/** Narrower than Size-560: the legend goes below the ring. */
export const Narrow: Story = {
  render: (args) => (
    <div className="nl:max-w-320">
      <NlDonutChart {...args} />
    </div>
  ),
};

/** Size-240 high, with a custom value format. */
export const Short: Story = { args: { height: '240', formatValue: membersFormat } };

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
