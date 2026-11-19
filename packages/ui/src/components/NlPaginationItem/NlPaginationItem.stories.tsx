import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NlPaginationItem } from './NlPaginationItem';

/**
 * Flat controls for Storybook. The props are a union (a page needs a number, the ellipsis has none), which
 * Storybook's types can't infer through, so the render picks the kind.
 */
interface StoryArgs {
  kind: 'page' | 'ellipsis';
  page: number;
  current: boolean;
}

/** The item lives in NlPagination's named <nav>. */
const meta = {
  title: 'Internal/Pagination item',
  args: { kind: 'page', page: 3, current: false },
  argTypes: {
    kind: { control: 'inline-radio', options: ['page', 'ellipsis'] },
    page: { control: { type: 'number', min: 1 }, if: { arg: 'kind', eq: 'page' } },
    current: { control: 'boolean', if: { arg: 'kind', eq: 'page' } },
  },
  render: (args) =>
    args.kind === 'ellipsis' ? (
      <NlPaginationItem kind="ellipsis" />
    ) : (
      <NlPaginationItem page={args.page} current={args.current} />
    ),
  decorators: [
    (Story) => (
      <nav aria-label="Pagination" className="nl:flex nl:items-center nl:gap-xs">
        <Story />
      </nav>
    ),
  ],
} satisfies Meta<StoryArgs>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One page with every option as a control. Hover, press and Tab to see the states. */
export const Default: Story = {};

/** Default, current and the ellipsis. */
export const Kinds: Story = {
  render: () => (
    <>
      <NlPaginationItem page={1} />
      <NlPaginationItem page={2} current />
      <NlPaginationItem kind="ellipsis" />
      <NlPaginationItem page={9} />
    </>
  ),
};

/** Long numbers widen the item past Size-32 (OD-32). */
export const LongNumbers: Story = {
  name: 'Long numbers',
  render: () => (
    <>
      <NlPaginationItem page={9} />
      <NlPaginationItem page={99} />
      <NlPaginationItem page={100} current />
      <NlPaginationItem page={1250} />
    </>
  ),
};

/** A row as NlPagination will lay it out: pick a page to move the current one. */
export const InARow: Story = {
  name: 'In a row',
  render: function Render() {
    const [current, setCurrent] = useState(2);
    return (
      <>
        {[1, 2, 3].map((page) => (
          <NlPaginationItem key={page} page={page} current={page === current} onSelect={setCurrent} />
        ))}
        <NlPaginationItem kind="ellipsis" />
        <NlPaginationItem page={12} current={current === 12} onSelect={setCurrent} />
      </>
    );
  },
};
