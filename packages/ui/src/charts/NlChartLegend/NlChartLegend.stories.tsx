import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlChartLegend, type NlChartLegendItem } from './NlChartLegend';

const seven: NlChartLegendItem[] = [
  { label: 'Members', series: 1 },
  { label: 'New members', series: 2 },
  { label: 'Returning members', series: 3 },
  { label: 'Tier 2 members', series: 4 },
  { label: 'Tier 3 members', series: 5 },
  { label: 'Inactive members', series: 6 },
  { label: 'Suspended members', series: 7 },
];

// Members by tier, in data order (as the tier donut shows it).
const tiers: NlChartLegendItem[] = [
  { label: 'Bronze', series: 1, value: '52 · 43%' },
  { label: 'Silver', series: 2, value: '32 · 27%' },
  { label: 'Gold', series: 3, value: '25 · 21%' },
  { label: 'Platinum', series: 4, value: '11 · 9%' },
];

const meta = {
  title: 'Components/Charts/Legend',
  component: NlChartLegend,
  args: { items: seven.slice(0, 3), kind: 'line', position: 'below' },
  argTypes: {
    kind: { control: 'inline-radio', options: ['line', 'block'] },
    position: { control: 'inline-radio', options: ['below', 'end'] },
    items: { control: 'object' },
  },
} satisfies Meta<typeof NlChartLegend>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Line chart legend: a short line with each series' shape, label in chart-axis-text. */
export const Default: Story = {};

/** Bar chart legend: squares. */
export const Bars: Story = {
  args: {
    kind: 'block',
    items: [
      { label: 'Earned', series: 1 },
      { label: 'Redeemed', series: 2 },
    ],
  },
};

/** Donut legend at the end: a column with each slice's value and share (Data S). */
export const DonutValues: Story = {
  name: 'Donut values',
  args: { kind: 'block', position: 'end', items: tiers },
};

/** One series. Charts leave the legend out for a single series; shown here for the look. */
export const SingleSeries: Story = { name: 'Single series', args: { items: seven.slice(0, 1) } };

/** The most series a chart allows (7): the row wraps; shapes repeat hollow from series 5. */
export const MostSeries: Story = {
  name: 'Most series',
  args: { items: seven },
  render: (args) => (
    <div className="nl:max-w-560">
      <NlChartLegend {...args} />
    </div>
  ),
};

/** Long labels are cut with an ellipsis at Size-240. */
export const LongLabels: Story = {
  name: 'Long labels',
  args: {
    kind: 'block',
    position: 'end',
    items: [
      { label: 'Points earned from track day vouchers and event passes', series: 1, value: '806,400 · 66%' },
      { label: 'Points redeemed for rewards in every tier', series: 2, value: '412,950 · 34%' },
    ],
  },
};
