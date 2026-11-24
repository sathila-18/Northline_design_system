import type { Meta, StoryObj } from '@storybook/react-vite';
import { members } from '../_fixtures/members';
import { MemberList } from './MemberList';

/**
 * Member list (DESIGN.md §8.6, P2). Storybook only, built from library components and the fixture members.
 * Search, filters, sorting, pagination and selection work in story state; changing the search or a filter goes
 * back to page 1. Designed for 1440 wide, checked at 1024.
 */
const meta: Meta<typeof MemberList> = {
  title: 'Pages/Members/Member list',
  component: MemberList,
  parameters: { layout: 'fullscreen', controls: { disable: true } },
  args: { members },
};
export default meta;

type Story = StoryObj<typeof MemberList>;

/** The first three rows of the default sort (last activity, newest first). */
const firstThree = [...members]
  .sort((a, b) => b.lastActivity.localeCompare(a.lastActivity) || b.id.localeCompare(a.id))
  .slice(0, 3)
  .map((member) => member.id);

/** All 120 members, sorted by last activity, newest first. */
export const Default: Story = {};

/** Tier Gold and status Active applied, shown as chips with Clear filters. */
export const Filtered: Story = { args: { initial: { tiers: ['Gold'], statuses: ['active'] } } };

/** Three rows selected: the bulk action bar shows the count, Export and Change status. */
export const BulkSelected: Story = { name: 'Bulk selected', args: { initial: { selectedIds: firstThree } } };

/** A search with no matches: the empty state offers Clear filters. */
export const NoResults: Story = { name: 'No results', args: { initial: { query: 'no such member' } } };

/** A new programme with no members yet. */
export const Empty: Story = { args: { members: [] } };

/** Waiting for the members: skeleton rows; the header, filters and toolbar stay. */
export const Loading: Story = { args: { status: 'loading' } };

/** The members couldn't load. Try again shows the list. */
export const Error: Story = { args: { status: 'error' } };

/** A row click or View opens the member's details side sheet: their details, Suspend and Edit. */
export const DetailsOpen: Story = { name: 'Details open', args: { initialDetails: firstThree[0] } };

/** Suspend asks first (from a row, the side sheet or the bulk action bar). Suspend shows a success snackbar. */
export const SuspendDialog: Story = { name: 'Suspend dialog', args: { initialSuspend: [firstThree[0] ?? ''] } };

/** Suspending three selected members from the bulk action bar. */
export const BulkSuspendDialog: Story = {
  name: 'Bulk suspend dialog',
  args: { initial: { selectedIds: firstThree }, initialSuspend: firstThree },
};
