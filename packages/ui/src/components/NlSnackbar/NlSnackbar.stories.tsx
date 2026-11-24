import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlButton } from '../NlButton';
import { NlSnackbar, type NlSnackbarTone } from './NlSnackbar';
import { NlSnackbarProvider, useNlSnackbar } from './NlSnackbarProvider';

const tones: NlSnackbarTone[] = ['neutral', 'success', 'warning', 'error'];
const messages: Record<NlSnackbarTone, string> = {
  neutral: 'Reward saved',
  success: 'Member 0042 moved to Tier 2',
  warning: 'Sync is running late',
  error: 'Reward not saved',
};

const meta = {
  title: 'Components/Molecules/Snackbar',
  component: NlSnackbar,
  args: {
    tone: 'neutral',
    children: 'Reward saved',
    layout: 'single',
    showIcon: true,
    showClose: true,
  },
  argTypes: {
    tone: { control: 'select', options: tones },
    layout: { control: 'inline-radio', options: ['single', 'stacked'] },
    children: { control: 'text' },
    showIcon: { control: 'boolean' },
    showClose: { control: 'boolean' },
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
} satisfies Meta<typeof NlSnackbar>;
export default meta;

type Story = StoryObj<typeof meta>;

/** The look on its own, with every option as a control. Pages show it through NlSnackbarProvider. */
export const Default: Story = {
  args: { action: { label: 'Undo', onClick: () => undefined } },
};

/** Every tone, single line, with an action and close. Error uses the `error` icon (OD-111). */
export const Tones: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-l">
      {tones.map((tone) => (
        <NlSnackbar {...args} key={tone} tone={tone} action={{ label: 'Undo', onClick: () => undefined }}>
          {messages[tone]}
        </NlSnackbar>
      ))}
    </div>
  ),
};

/** Stacked: the message wraps on top, the buttons sit on a row of their own aligned to the end (OD-167). */
export const Stacked: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-l">
      {tones.map((tone) => (
        <NlSnackbar
          {...args}
          key={tone}
          tone={tone}
          layout="stacked"
          action={{ label: 'View details', onClick: () => undefined }}
        >
          {`${messages[tone]}. The change shows on the member's profile after the next sync.`}
        </NlSnackbar>
      ))}
    </div>
  ),
};

/** Message only; message and close; no icon. */
export const Content: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-l">
      <NlSnackbar {...args} showClose={false}>
        Reward saved
      </NlSnackbar>
      <NlSnackbar {...args}>Reward saved</NlSnackbar>
      <NlSnackbar {...args} showIcon={false} tone="success">
        Member 0042 moved to Tier 2
      </NlSnackbar>
    </div>
  ),
};

function Triggers() {
  const { show } = useNlSnackbar();
  return (
    <div className="nl:flex nl:flex-wrap nl:gap-m">
      <NlButton
        variant="secondary"
        size="small"
        onClick={() => {
          show({ message: 'Reward saved' });
        }}
      >
        Neutral, auto-dismiss
      </NlButton>
      <NlButton
        variant="secondary"
        size="small"
        onClick={() => {
          show({ message: 'Reward deleted', action: { label: 'Undo', onClick: () => undefined } });
        }}
      >
        With action (stays)
      </NlButton>
      <NlButton
        variant="secondary"
        size="small"
        onClick={() => {
          show({ tone: 'success', message: 'Member 0042 moved to Tier 2' });
        }}
      >
        Success
      </NlButton>
      <NlButton
        variant="secondary"
        size="small"
        onClick={() => {
          show({ tone: 'error', message: 'Reward not saved' });
        }}
      >
        Error (alert)
      </NlButton>
    </div>
  );
}

/**
 * Live: NlSnackbarProvider and useNlSnackbar. One at a time; a new one replaces the old. Without an action it goes
 * after 6 s (paused while hovered or focused); with one it stays. Press F6 to move focus into it (OD-110).
 */
export const Live: Story = {
  render: () => (
    <NlSnackbarProvider>
      <Triggers />
    </NlSnackbarProvider>
  ),
};

/** Top end (OD-245): the region sits Space-3XL from the top and end, and the snackbar comes down into place. */
export const TopEnd: Story = {
  name: 'Top end',
  render: () => (
    <NlSnackbarProvider placement="top-end">
      <Triggers />
    </NlSnackbarProvider>
  ),
};
