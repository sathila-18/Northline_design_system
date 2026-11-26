import type { Meta, StoryObj } from '@storybook/react-vite';
import { messages } from '../_fixtures/messages';
import { Messages } from './Messages';

/**
 * Messages (DESIGN.md §8.6, P8). Storybook only, built from library components and the fixture campaigns. Search, the
 * status and channel filters, sorting, pagination, the drawer and its actions work in story state. Every date check uses the
 * fixtures' fixed today, 26/11/2026, so the stories never change. Designed for 1440 wide.
 */
const meta: Meta<typeof Messages> = {
  title: 'Pages/Messages',
  component: Messages,
  parameters: { layout: 'fullscreen', controls: { disable: true } },
  args: { messages },
};
export default meta;

type Story = StoryObj<typeof Messages>;

/** Every campaign, no filter selected, newest send date first. */
export const Default: Story = {};

/** The Status filter on Scheduled. */
export const Scheduled: Story = { args: { initial: { statuses: ['scheduled'] } } };

/** The Status filter on Drafts. */
export const Drafts: Story = { args: { initial: { statuses: ['draft'] } } };

/** The Channel filter on Email, with Clear filters. */
export const Filtered: Story = { args: { initial: { channels: ['email'] } } };

/** The drawer on a sent email: preview, and delivered, opened and clicked with their rates. Duplicate in the footer. */
export const SentCampaign: Story = { name: 'Sent campaign', args: { initialDrawer: 'MS-0028' } };

/** The drawer on a failed campaign: the reason in an error banner, and Retry. */
export const FailedCampaign: Story = { name: 'Failed campaign', args: { initialDrawer: 'MS-0026' } };

/** Cancel on a scheduled campaign asks first. Cancel campaign moves it back to Drafts and shows a success snackbar. */
export const CancelConfirm: Story = { name: 'Cancel confirm', args: { initialCancel: 'MS-0031' } };

/** A search with no matches: the empty state offers Clear filters. */
export const NoResults: Story = { name: 'No results', args: { initial: { query: 'no such campaign' } } };

/** No campaigns yet: the empty state offers Create campaign. */
export const Empty: Story = { args: { messages: [] } };

/** Waiting for the campaigns: skeleton rows; the filters and toolbar stay. */
export const Loading: Story = { args: { status: 'loading' } };

/** The campaigns couldn't load. Try again shows the list. */
export const Error: Story = { args: { status: 'error' } };
