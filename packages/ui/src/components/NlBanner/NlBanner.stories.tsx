import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NlButton } from '../NlButton';
import { NlBanner, type NlBannerTone } from './NlBanner';

const tones: NlBannerTone[] = ['info', 'success', 'error', 'warning', 'neutral'];

const samples: Record<NlBannerTone, { title: string; text: string }> = {
  info: { title: 'Sync scheduled', text: 'Member data syncs every night at 2 am.' },
  success: { title: 'Import complete', text: '1,200 members were added to Tier 2.' },
  error: { title: 'Import failed', text: 'The file has no member ID column. Fix it and try again.' },
  warning: { title: 'Sync delayed', text: 'Rewards may show old balances until the next sync.' },
  neutral: { title: 'Read only', text: 'You can view this programme but not change it.' },
};

const meta = {
  title: 'Components/Molecules/Banner',
  component: NlBanner,
  args: {
    tone: 'info',
    title: samples.info.title,
    children: samples.info.text,
    showIcon: true,
    live: false,
  },
  argTypes: {
    tone: { control: 'select', options: tones },
    title: { control: 'text' },
    children: { control: 'text' },
    showIcon: { control: 'boolean' },
    live: { control: 'boolean' },
    action: { control: false },
    onClose: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="nl:w-full nl:bg-primary nl:p-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NlBanner>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One banner with every option as a control, with an action and close. */
export const Default: Story = {
  args: {
    action: { label: 'View schedule', onClick: () => undefined },
    onClose: () => undefined,
  },
};

/** Every tone, with title, description, action and close. Error uses its own icon (OD-108). */
export const Tones: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-l">
      {tones.map((tone) => (
        <NlBanner
          key={tone}
          tone={tone}
          title={samples[tone].title}
          action={{ label: 'View details', onClick: () => undefined }}
          onClose={() => undefined}
        >
          {samples[tone].text}
        </NlBanner>
      ))}
    </div>
  ),
};

/** Without a title (the icon sits on the description's first line), without an icon, and text only. */
export const Content: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-l">
      <NlBanner tone="success">1,200 members were added to Tier 2.</NlBanner>
      <NlBanner tone="warning" title="Sync delayed" showIcon={false}>
        Rewards may show old balances until the next sync.
      </NlBanner>
      <NlBanner tone="info" title="Sync scheduled" onClose={() => undefined} />
    </div>
  ),
};

/** Added after load with `live`: announced as status (info, success, neutral) or alert (error, warning). */
export const Live: Story = {
  render: function LiveStory() {
    const [shown, setShown] = useState(false);
    return (
      <div className="nl:flex nl:flex-col nl:items-start nl:gap-l">
        <NlButton
          variant="secondary"
          size="small"
          onClick={() => {
            setShown(true);
          }}
        >
          Import members
        </NlButton>
        {shown && (
          <NlBanner
            live
            tone="error"
            title="Import failed"
            onClose={() => {
              setShown(false);
            }}
          >
            The file has no member ID column.
          </NlBanner>
        )}
      </div>
    );
  },
};
