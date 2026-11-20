import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NlPagination } from './NlPagination';

const meta = {
  title: 'Components/Molecules/Pagination',
  component: NlPagination,
  args: { page: 4, pageCount: 10, siblingCount: 1, onPageChange: () => undefined },
  argTypes: {
    page: { control: { type: 'number', min: 1 } },
    pageCount: { control: { type: 'number', min: 1 } },
    siblingCount: { control: { type: 'number', min: 0, max: 3 } },
    onPageChange: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="nl:w-full nl:bg-primary nl:p-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NlPagination>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Working: click a page or use previous and next. Focus follows as described in the spec. */
export const Default: Story = {
  render: function DefaultStory(args) {
    const [page, setPage] = useState(args.page);
    return <NlPagination {...args} page={page} onPageChange={setPage} />;
  },
};

/** Few pages: every number shows, no gaps. */
export const FewPages: Story = {
  render: function FewStory() {
    const [page, setPage] = useState(1);
    return <NlPagination page={page} pageCount={5} onPageChange={setPage} />;
  },
};

/** Many pages: gaps on both sides of the current page. */
export const ManyPages: Story = {
  render: function ManyStory() {
    const [page, setPage] = useState(24);
    return <NlPagination page={page} pageCount={48} onPageChange={setPage} />;
  },
};

/** One page: previous and next are disabled and one page item shows. */
export const OnePage: Story = {
  args: { page: 1, pageCount: 1 },
};

/** A wider window: two pages either side of the current one. */
export const SiblingCount: Story = {
  render: function SiblingStory() {
    const [page, setPage] = useState(12);
    return <NlPagination page={page} pageCount={24} siblingCount={2} onPageChange={setPage} />;
  },
};
