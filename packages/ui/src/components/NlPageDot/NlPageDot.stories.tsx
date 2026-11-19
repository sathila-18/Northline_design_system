import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NlButton } from '../NlButton';
import { NlPageDot } from './NlPageDot';

const meta = {
  title: 'Internal/Page dot',
  component: NlPageDot,
  args: { current: false },
  argTypes: { current: { control: 'boolean' } },
} satisfies Meta<typeof NlPageDot>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One dot. Toggle current to see the width ease (none under reduced motion). */
export const Default: Story = {};

/** A row as NlPageDots will lay it out: page 2 of 5. NlPageDots supplies the text; the dots are hidden. */
export const InARow: Story = {
  name: 'In a row',
  render: () => (
    <div className="nl:flex nl:items-center nl:gap-xs">
      {[1, 2, 3, 4, 5].map((page) => (
        <NlPageDot key={page} current={page === 2} />
      ))}
    </div>
  ),
};

/** Move through the pages to see the pill travel. */
export const Moving: Story = {
  render: function Render() {
    const [page, setPage] = useState(1);
    return (
      <div className="nl:flex nl:flex-col nl:items-start nl:gap-l">
        <div className="nl:flex nl:items-center nl:gap-xs">
          {[1, 2, 3, 4, 5].map((n) => (
            <NlPageDot key={n} current={n === page} />
          ))}
        </div>
        <NlButton
          variant="secondary"
          size="small"
          onClick={() => {
            setPage((p) => (p % 5) + 1);
          }}
        >
          {`Next page (${String(page)} of 5)`}
        </NlButton>
      </div>
    );
  },
};
