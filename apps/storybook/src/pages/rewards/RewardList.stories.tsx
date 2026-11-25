import type { Meta, StoryObj } from '@storybook/react-vite';
import { rewards } from '../_fixtures/rewards';
import { RewardList } from './RewardList';

/**
 * All rewards (DESIGN.md §8.6, P4). Storybook only, built from library components and the fixture rewards. Search,
 * filters, sort, view and pagination work in story state; changing the search or a filter goes back to page 1, and
 * switching the view keeps them. Designed for 1440 wide.
 */
const meta: Meta<typeof RewardList> = {
  title: 'Pages/Rewards/All rewards',
  component: RewardList,
  parameters: { layout: 'fullscreen', controls: { disable: true } },
  args: { rewards },
};
export default meta;

type Story = StoryObj<typeof RewardList>;

/** All 36 rewards as cards, most redeemed first, 12 per page. */
export const Default: Story = {};

/** The same rewards in NlTable, with sorting in sync with the toolbar. */
export const TableView: Story = { name: 'Table view', args: { initial: { view: 'table' } } };

/** Category Experiences and status Live, shown as chips with Clear filters. */
export const Filtered: Story = { args: { initial: { categories: ['experiences'], statuses: ['live'] } } };

/** A search with no matches: the empty state offers Clear filters. */
export const NoResults: Story = { name: 'No results', args: { initial: { query: 'no such reward' } } };

/** A new programme with no rewards yet. */
export const Empty: Story = { args: { rewards: [] } };

/** Waiting for the rewards: skeleton cards. */
export const Loading: Story = { args: { status: 'loading' } };

/** Waiting for the rewards in the table view: the table's loading rows. */
export const LoadingTable: Story = { name: 'Loading, table', args: { status: 'loading', initial: { view: 'table' } } };

/** The rewards couldn't load. Try again shows them. */
export const Error: Story = { args: { status: 'error' } };
