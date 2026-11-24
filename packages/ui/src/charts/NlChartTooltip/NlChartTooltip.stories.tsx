import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlChartTooltip, type NlChartTooltipItem } from './NlChartTooltip';

const seven: NlChartTooltipItem[] = [
  { name: 'Members', value: '1,204', series: 1 },
  { name: 'New members', value: '96', series: 2 },
  { name: 'Returning members', value: '412', series: 3 },
  { name: 'Tier 2 members', value: '318', series: 4 },
  { name: 'Tier 3 members', value: '144', series: 5 },
  { name: 'Inactive members', value: '61', series: 6 },
  { name: 'Suspended members', value: '9', series: 7 },
];

const meta = {
  title: 'Components/Charts/Tooltip',
  component: NlChartTooltip,
  args: { heading: 'Mar 2026', items: seven.slice(0, 3) },
  argTypes: {
    heading: { control: 'text' },
    total: { control: 'text' },
    items: { control: 'object' },
  },
} satisfies Meta<typeof NlChartTooltip>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Three series: heading, then marker, name and value (Data S) per series. */
export const Default: Story = {};

/** One series. */
export const SingleSeries: Story = { name: 'Single series', args: { items: seven.slice(0, 1) } };

/** The most series a chart allows (7): markers repeat their shapes hollow from series 5. */
export const MostSeries: Story = { name: 'Most series', args: { items: seven } };

/** Long names are cut with an ellipsis at Size-240; values are never cut. */
export const LongLabels: Story = {
  name: 'Long labels',
  args: {
    heading: 'Track day voucher and event passes',
    items: [
      { name: 'Points earned from track day vouchers and events', value: '806,400', series: 1, shape: 'square' },
      { name: 'Points redeemed for rewards in every tier', value: '412,950', series: 2, shape: 'square' },
    ],
  },
};

/** Stacked bars: a total row, set apart by extra space (no divider). Square markers, as bars use. */
export const StackedTotal: Story = {
  name: 'Stacked total',
  args: {
    heading: 'Mar 2026',
    items: [
      { name: 'Earned', value: '12,480', series: 1, shape: 'square' },
      { name: 'Redeemed', value: '8,210', series: 2, shape: 'square' },
    ],
    total: '20,690',
  },
};
