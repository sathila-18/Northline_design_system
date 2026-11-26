import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlButton, NlEmptyState } from '@northline/ui';
import { PageLayout } from './PageLayout';
import { goTo, type PageHref } from './navItems';

/**
 * Coming soon (DESIGN.md §8.6). Where side nav links and page links go until their page is built: the shared
 * layout with the right nav item current, and an NlEmptyState. One story per planned page, so the nav state is
 * right. A placeholder, not a page, so it has no Loading, Empty or Error stories.
 */
const meta: Meta = { title: 'Pages/Coming soon', parameters: { layout: 'fullscreen' } };
export default meta;

function ComingSoon({ title, active }: { title: string; active?: PageHref }) {
  return (
    <PageLayout title={title} active={active}>
      <NlEmptyState
        icon="info"
        heading="Coming soon"
        description="This page isn't built yet."
        action={
          <NlButton
            variant="primary"
            size="small"
            onClick={() => {
              goTo('#members');
            }}
          >
            Go to members
          </NlButton>
        }
      />
    </PageLayout>
  );
}

type Story = StoryObj;

/** Where a reward card, row click or View on All rewards goes until the reward details page is built. */
export const RewardDetails: Story = {
  name: 'Reward details',
  render: () => <ComingSoon title="Reward details" active="#rewards" />,
};
export const Events: Story = { render: () => <ComingSoon title="Events" active="#events" /> };
export const Messages: Story = { render: () => <ComingSoon title="Messages" active="#messages" /> };
export const Help: Story = { render: () => <ComingSoon title="Help" active="#help" /> };
