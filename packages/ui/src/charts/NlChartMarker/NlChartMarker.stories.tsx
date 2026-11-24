import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlChartMarker, type NlChartSeries } from './NlChartMarker';

const all: NlChartSeries[] = [1, 2, 3, 4, 5, 6, 7];

const meta = {
  title: 'Internal/Chart marker',
  component: NlChartMarker,
  args: { series: 1, size: '12' },
  argTypes: {
    series: { control: 'select', options: all },
    shape: { control: 'select', options: [undefined, 'circle', 'square', 'triangle', 'diamond'] },
    size: { control: 'inline-radio', options: ['8', '12'] },
  },
} satisfies Meta<typeof NlChartMarker>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One marker with every option as a control. */
export const Default: Story = {};

/** Every series' own marker in both sizes: circle, square, triangle, diamond, then hollow from series 5. */
export const AllSeries: Story = {
  name: 'All series',
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-l">
      {(['8', '12'] as const).map((size) => (
        <div key={size} className="nl:flex nl:items-center nl:gap-l">
          {all.map((series) => (
            <NlChartMarker key={series} series={series} size={size} />
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Squares for bars and donut slices: every series filled. */
export const Squares: Story = {
  render: () => (
    <div className="nl:flex nl:items-center nl:gap-l">
      {all.map((series) => (
        <NlChartMarker key={series} series={series} shape="square" size="12" />
      ))}
    </div>
  ),
};
