import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlTable } from '../../components/NlTable';
import { NlChartLegend } from '../NlChartLegend';
import { NlChartFrame } from './NlChartFrame';

// Members by tier, in data order. Fake, generic data.
const tiers = [
  { tier: 'Bronze', members: '52', share: '43%' },
  { tier: 'Silver', members: '32', share: '27%' },
  { tier: 'Gold', members: '25', share: '21%' },
  { tier: 'Platinum', members: '11', share: '9%' },
];

/**
 * Story-only stand-in for the chart slot: the chart components come next (§8.5 C4 to C6). The frame takes any chart
 * as children; this fills the chart's height and shows the legend it will carry.
 */
function ChartSlot() {
  return (
    <div className="nl:flex nl:h-full nl:flex-col nl:justify-end nl:gap-l nl:rounded-s nl:border nl:border-dashed nl:border-default nl:p-xl">
      <p className="nl:m-none nl:text-body-s nl:text-tertiary">Chart slot (story only)</p>
      <NlChartLegend
        kind="block"
        items={tiers.map((t, index) => ({ label: t.tier, series: (index + 1) as 1 | 2 | 3 | 4 }))}
      />
    </div>
  );
}

const table = (
  // The grey header's titles are 4.46:1 in Dark: known issue K8 (accepted with NlTableHeaderCell #66).
  <div data-a11y-known-issue="K8">
    <NlTable
      caption="Members by tier"
      columns={[
        { key: 'tier', header: 'Tier', rowHeader: true },
        { key: 'members', header: 'Members', width: '120' },
        { key: 'share', header: 'Share', width: '120' },
      ]}
      rows={tiers}
      getRowId={(row) => row.tier}
      toolbar={false}
      pagination={false}
    />
  </div>
);

const meta = {
  title: 'Components/Charts/Chart frame',
  component: NlChartFrame,
  parameters: { layout: 'padded' },
  args: {
    title: 'Members by tier',
    description: 'All members, 24/11/2026',
    status: 'ready',
    height: '320',
    variant: 'card',
    children: <ChartSlot />,
    table,
  },
  argTypes: {
    status: { control: 'inline-radio', options: ['ready', 'loading', 'empty', 'error'] },
    height: { control: 'inline-radio', options: ['240', '320'] },
    variant: { control: 'inline-radio', options: ['card', 'plain'] },
    children: { control: false },
    table: { control: false },
  },
  render: (args) => (
    <div className="nl:max-w-720">
      <NlChartFrame {...args} />
    </div>
  ),
} satisfies Meta<typeof NlChartFrame>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Ready, card: the heading, the "View as" switch and the chart. */
export const Default: Story = {};

/** View as table: the same data in an NlTable, inside the chart's height. */
export const ViewAsTable: Story = { name: 'View as table', args: { defaultView: 'table' } };

/** Plain: no card; the page draws it. */
export const Plain: Story = { args: { variant: 'plain' } };

/** Size-240 high. */
export const Short: Story = { args: { height: '240' } };

/** Without a table there is no switch. */
export const NoTable: Story = { name: 'No table', args: { table: undefined } };

/** Loading: five skeleton bars at the chart's height; the switch keeps its place, hidden. */
export const Loading: Story = { args: { status: 'loading' } };

/** Empty: "No data for this period". */
export const Empty: Story = { args: { status: 'empty' } };

/** Error, with Try again. */
export const Error: Story = { args: { status: 'error' } };

/** A long title and description wrap; the switch stays at the end. */
export const LongTitle: Story = {
  name: 'Long title',
  args: {
    title: 'Points earned and redeemed by members in every tier, by month',
    description: 'Track day vouchers, event passes and Reward X, 01/01/2026 to 24/11/2026',
  },
};
