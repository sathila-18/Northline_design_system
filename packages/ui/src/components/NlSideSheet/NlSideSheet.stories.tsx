import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ComponentProps } from 'react';
import { NlButton } from '../NlButton';
import { NlTextField } from '../NlTextField';
import { NlSideSheet } from './NlSideSheet';

type Args = Omit<ComponentProps<typeof NlSideSheet>, 'open' | 'onOpenChange'>;

/** A trigger button and the sheet, as a page would wire them. */
function Demo({ trigger, ...props }: Args & { trigger: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <NlButton
        variant="secondary"
        onClick={() => {
          setOpen(true);
        }}
      >
        {trigger}
      </NlButton>
      <NlSideSheet {...props} open={open} onOpenChange={setOpen} />
    </>
  );
}

/** The story args without the open state, which the demo owns. */
function omitOpen(args: ComponentProps<typeof NlSideSheet>): Args {
  const rest: Partial<ComponentProps<typeof NlSideSheet>> = { ...args };
  delete rest.open;
  delete rest.onOpenChange;
  return rest as Args;
}

const rewardForm = (
  <>
    <NlTextField label="Reward name" defaultValue="Track day voucher" />
    <NlTextField label="Points" inputType="number" defaultValue="1200" />
    <NlTextField label="Tier" defaultValue="Tier 2" />
  </>
);

const longBody = Array.from({ length: 12 }, (_, index) => (
  <NlTextField key={index} label={`Field ${String(index + 1)}`} />
));

const footer = {
  primary: { children: 'Save' },
  secondary: { children: 'Cancel' },
};

const meta = {
  title: 'Components/Overlays/Side sheet',
  tags: ['organism'],
  component: NlSideSheet,
  args: {
    open: false,
    onOpenChange: () => undefined,
    title: 'Edit reward',
    size: 'small',
    divider: false,
    hideClose: false,
    dismissible: true,
  },
  argTypes: {
    title: { control: 'text' },
    size: { control: 'inline-radio', options: ['small', 'large'] },
    divider: { control: 'boolean' },
    hideClose: { control: 'boolean' },
    dismissible: { control: 'boolean' },
    open: { control: false },
    onOpenChange: { control: false },
    footer: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof NlSideSheet>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Every option as a control. Open it: focus goes to the first field; Escape, Close or the overlay closes it. */
export const Default: Story = {
  render: (args) => (
    <Demo {...omitOpen(args)} trigger="Edit reward" footer={footer}>
      {rewardForm}
    </Demo>
  ),
};

/** With a back button (a second step inside the sheet) and a divider under the header. */
export const WithBack: Story = {
  render: () => {
    function Steps() {
      const [open, setOpen] = useState(false);
      const [step, setStep] = useState(1);
      return (
        <>
          <NlButton
            variant="secondary"
            onClick={() => {
              setStep(1);
              setOpen(true);
            }}
          >
            New reward
          </NlButton>
          <NlSideSheet
            open={open}
            onOpenChange={setOpen}
            title={step === 1 ? 'New reward' : 'Choose tiers'}
            divider
            onBack={
              step === 2
                ? () => {
                    setStep(1);
                  }
                : undefined
            }
            footer={{
              primary: {
                children: step === 1 ? 'Next' : 'Save',
                onClick: () => {
                  if (step === 1) setStep(2);
                  else setOpen(false);
                },
              },
            }}
          >
            {step === 1 ? (
              <NlTextField label="Reward name" />
            ) : (
              <NlTextField label="Tiers" defaultValue="Tier 1, Tier 2" />
            )}
          </NlSideSheet>
        </>
      );
    }
    return <Steps />;
  },
};

/** A long body scrolls under the header; the dock stays at the bottom with its sticky look. */
export const LongBody: Story = {
  render: () => (
    <Demo trigger="Edit member" title="Edit member" footer={footer}>
      {longBody}
    </Demo>
  ),
};

/** Large: Size-720. */
export const Large: Story = {
  render: () => (
    <Demo trigger="Edit reward" title="Edit reward" size="large" footer={footer}>
      {rewardForm}
    </Demo>
  ),
};

/** No footer and no close button: Escape and the overlay still close it. */
export const Minimal: Story = {
  render: () => (
    <Demo trigger="Reward details" title="Reward details" hideClose>
      <p className="nl:m-none nl:text-body-l nl:text-primary">Track day voucher, 1200 points, Tier 2 and up.</p>
    </Demo>
  ),
};
