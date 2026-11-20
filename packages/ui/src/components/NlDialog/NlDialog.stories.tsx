import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ComponentProps } from 'react';
import { NlButton } from '../NlButton';
import { NlTextField } from '../NlTextField';
import { NlDialog } from './NlDialog';

type Args = Partial<ComponentProps<typeof NlDialog>>;

function Demo({ trigger, ...props }: Args & { trigger: string }) {
  const [open, setOpen] = useState(false);
  const close = () => {
    setOpen(false);
  };
  return (
    <>
      <NlButton
        variant="secondary"
        size="small"
        onClick={() => {
          setOpen(true);
        }}
      >
        {trigger}
      </NlButton>
      <NlDialog
        title="Dialog"
        {...props}
        open={open}
        onOpenChange={setOpen}
        primaryAction={props.primaryAction && { ...props.primaryAction, onClick: close }}
        secondaryAction={props.secondaryAction && { ...props.secondaryAction, onClick: close }}
        startAction={props.startAction && { ...props.startAction, onClick: close }}
      />
    </>
  );
}

const meta = {
  title: 'Components/Molecules/Dialog',
  component: NlDialog,
  args: {
    open: false,
    onOpenChange: () => undefined,
    title: 'Move Member 0042 to Tier 2?',
    children: 'Their points and rewards move with them. You can move them back at any time.',
    size: 'small',
    hideClose: false,
    dismissible: true,
  },
  argTypes: {
    open: { control: false },
    onOpenChange: { control: false },
    title: { control: 'text' },
    children: { control: 'text' },
    size: { control: 'inline-radio', options: ['small', 'large'] },
    hideClose: { control: 'boolean' },
    dismissible: { control: 'boolean' },
    primaryAction: { control: false },
    secondaryAction: { control: false },
    startAction: { control: false },
  },
} satisfies Meta<typeof NlDialog>;
export default meta;

type Story = StoryObj<typeof meta>;

/** A short task with a primary and secondary action. Focus starts on the primary. */
export const Default: Story = {
  render: (args) => (
    <Demo
      {...args}
      trigger="Open dialog"
      primaryAction={{ children: 'Move member' }}
      secondaryAction={{ children: 'Cancel' }}
    />
  ),
};

/** Destructive confirmation: role alertdialog, focus starts on Cancel (OD-180). */
export const Destructive: Story = {
  render: () => (
    <Demo
      trigger="Delete reward"
      title="Delete Reward X?"
      primaryAction={{ children: 'Delete', tone: 'destructive' }}
      secondaryAction={{ children: 'Cancel' }}
    >
      Members who saved it lose it. This can't be undone.
    </Demo>
  ),
};

/** A form body: focus starts in the first field. With a start action. */
export const Form: Story = {
  render: () => (
    <Demo
      trigger="Add reward"
      title="Add reward"
      size="large"
      startAction={{ children: 'Reset' }}
      secondaryAction={{ children: 'Cancel' }}
      primaryAction={{ children: 'Add reward' }}
    >
      <div className="nl:flex nl:flex-col nl:gap-xl">
        <NlTextField label="Reward name" />
        <NlTextField label="Points" />
      </div>
    </Demo>
  ),
};

/** Required confirmation: the overlay doesn't close it; no close button (Escape still closes). */
export const Required: Story = {
  render: () => (
    <Demo
      trigger="Publish changes"
      title="Publish changes to every tier?"
      dismissible={false}
      hideClose
      secondaryAction={{ children: 'Not now' }}
      primaryAction={{ children: 'Publish' }}
    >
      Members see the new rewards straight away.
    </Demo>
  ),
};

/** Long content: the panel stays Space-3XL from the window edges and the body scrolls (OD-181). */
export const LongContent: Story = {
  render: () => (
    <Demo trigger="Open terms" title="Programme terms" size="large" primaryAction={{ children: 'Done' }}>
      <div className="nl:flex nl:flex-col nl:gap-l">
        {Array.from({ length: 30 }, (_, index) => (
          <p key={index} className="nl:m-none nl:text-body-l nl:text-secondary">
            {`Section ${index + 1}. Points expire 12 months after they are earned unless the member stays in Tier 2.`}
          </p>
        ))}
      </div>
    </Demo>
  ),
};
