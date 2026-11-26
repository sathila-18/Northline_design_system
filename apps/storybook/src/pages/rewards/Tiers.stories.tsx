import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tiers } from './Tiers';

/**
 * Tiers (DESIGN.md §8.6, P6). Storybook only, built from library components and the tier fixtures; member counts come
 * from the member fixtures. A row's Edit button opens the edit drawer. Designed for 1440 wide.
 */
const meta: Meta<typeof Tiers> = {
  title: 'Pages/Rewards/Tiers',
  component: Tiers,
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

type Story = StoryObj<typeof Tiers>;

/** Members by tier and the tier rules table. */
export const Default: Story = {};

/** The edit drawer open on Gold. */
export const Editing: Story = { args: { initialEditId: 'tier-gold' } };

/** The drawer after Save with no name, points outside Silver to Platinum, and no perks. */
export const ValidationErrors: Story = {
  name: 'Validation errors',
  args: {
    initialEditId: 'tier-gold',
    initialDraft: { name: '', pointsToReach: '45,000', perkIds: [] },
    initialShowErrors: true,
  },
};

/** Cancel with a changed multiplier: the discard dialog. */
export const UnsavedChanges: Story = {
  name: 'Unsaved changes',
  args: { initialEditId: 'tier-gold', initialDraft: { multiplier: '1.75' }, initialDiscard: true },
};

/** Right after saving Gold with a 1.75x multiplier: the table and the success snackbar. */
export const Saved: Story = {
  args: { initialSave: { id: 'tier-gold', draft: { multiplier: '1.75' } } },
};

/** The chart and table loading. */
export const Loading: Story = { args: { status: 'loading' } };

/** The tiers failed to load. Try again shows them. */
export const Error: Story = { args: { status: 'error' } };
