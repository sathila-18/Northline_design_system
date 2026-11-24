import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dashboard } from './Dashboard';

/**
 * Dashboard (DESIGN.md §8.6, P3). Storybook only, built from library components and the fixtures; member numbers match
 * the Member list. Designed for 1440 wide.
 */
const meta: Meta<typeof Dashboard> = {
  title: 'Pages/Dashboard',
  component: Dashboard,
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

type Story = StoryObj<typeof Dashboard>;

/** The last 12 months. Switch the period at the top. */
export const Default: Story = {};

/** Every card and chart loading. */
export const Loading: Story = { args: { status: 'loading' } };

/** A new programme: no data yet; the cards show 0 and each chart its empty state. */
export const Empty: Story = { args: { status: 'empty' } };

/** Top rewards failed to load; everything else is there. */
export const PartialError: Story = { name: 'Partial error', args: { status: 'partial-error' } };
