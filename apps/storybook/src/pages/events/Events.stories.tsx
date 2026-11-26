import type { Meta, StoryObj } from '@storybook/react-vite';
import { events } from '../_fixtures/events';
import { Events } from './Events';

/**
 * Events (DESIGN.md §8.6, P7). Storybook only, built from library components and the fixture events. Search,
 * filters, sorting, pagination, the drawer and its actions work in story state. Every status and date check uses the
 * fixtures' fixed today, 26/11/2026, so the stories never change. Designed for 1440 wide.
 */
const meta: Meta<typeof Events> = {
  title: 'Pages/Events',
  component: Events,
  parameters: { layout: 'fullscreen', controls: { disable: true } },
  args: { events },
};
export default meta;

type Story = StoryObj<typeof Events>;

/** The Status filter on Upcoming (shown as a chip), soonest first. */
export const Default: Story = {};

/** The Status filter on Past, most recent first. */
export const Past: Story = { args: { initial: { statuses: ['past'] } } };

/** Status Upcoming, Type Track day between 01/12/2026 and 31/03/2027, shown as chips with Clear filters. */
export const Filtered: Story = {
  args: { initial: { types: ['track-day'], from: '2026-12-01', to: '2027-03-31' } },
};

/** A row click or View opens the event drawer: an upcoming event with Edit, Export attendees and Cancel event. */
export const DrawerOpen: Story = { name: 'Drawer open', args: { initialDrawer: 'EV-0048' } };

/** The drawer on a full event with a waitlist. */
export const FullEvent: Story = { name: 'Full event', args: { initialDrawer: 'EV-0047' } };

/** Cancel event asks first. Cancel event marks it cancelled and shows a success snackbar. */
export const CancelConfirm: Story = { name: 'Cancel confirm', args: { initialCancel: 'EV-0047' } };

/** A search with no matches: the empty state offers Clear filters. */
export const NoResults: Story = { name: 'No results', args: { initial: { query: 'no such event' } } };

/** No upcoming events: the empty state offers Create event. Other statuses keep their events. */
export const Empty: Story = { args: { events: events.filter((event) => event.status !== 'upcoming') } };

/** Waiting for the events: skeleton rows; the filters and toolbar stay. */
export const Loading: Story = { args: { status: 'loading' } };

/** The events couldn't load. Try again shows the list. */
export const Error: Story = { args: { status: 'error' } };
