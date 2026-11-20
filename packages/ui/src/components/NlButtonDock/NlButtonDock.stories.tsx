import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlButtonDock } from './NlButtonDock';

const meta = {
  title: 'Components/Molecules/Button dock',
  component: NlButtonDock,
  args: {
    sticky: false,
    accessory: 'Changes apply to every member in Tier 2.',
    tertiary: { children: 'Reset' },
    secondary: { children: 'Cancel' },
    primary: { children: 'Save' },
  },
  argTypes: {
    sticky: { control: 'boolean' },
    accessory: { control: 'text' },
    primary: { control: 'object' },
    secondary: { control: 'object' },
    tertiary: { control: 'object' },
  },
} satisfies Meta<typeof NlButtonDock>;
export default meta;

type Story = StoryObj<typeof meta>;

/** All three buttons and a note, with every option as a control. */
export const Default: Story = {};

/** The usual combinations: primary only; secondary and primary; tertiary and primary; note and primary. */
export const Combinations: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl nl:bg-secondary nl:p-xl">
      <NlButtonDock primary={{ children: 'Save' }} />
      <NlButtonDock secondary={{ children: 'Cancel' }} primary={{ children: 'Save' }} />
      <NlButtonDock tertiary={{ children: 'Reset' }} primary={{ children: 'Save' }} />
      <NlButtonDock accessory="You can change this later." primary={{ children: 'Continue' }} />
    </div>
  ),
};

/** Sticky: pinned to the bottom of a scrolling panel by the container, with the sticky shadow. */
export const Sticky: Story = {
  render: () => (
    <div className="nl:flex nl:h-320 nl:flex-col nl:overflow-hidden nl:bg-primary">
      <div className="nl:flex nl:flex-1 nl:flex-col nl:gap-m nl:overflow-y-auto nl:p-3xl" tabIndex={0}>
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index} className="nl:m-none nl:text-body-m nl:text-secondary">
            {`Member ${String(index + 1).padStart(4, '0')} · Tier 2`}
          </p>
        ))}
      </div>
      <NlButtonDock sticky secondary={{ children: 'Cancel' }} primary={{ children: 'Save' }} />
    </div>
  ),
};

/** In a form: the primary is the submit button. */
export const InForm: Story = {
  render: () => (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <NlButtonDock secondary={{ children: 'Cancel' }} primary={{ children: 'Save reward', type: 'submit' }} />
    </form>
  ),
};

/** A narrow container: the end group wraps and stays at the end (OD-170). */
export const Narrow: Story = {
  render: () => (
    <div className="nl:max-w-320">
      <NlButtonDock
        tertiary={{ children: 'Reset' }}
        secondary={{ children: 'Cancel' }}
        primary={{ children: 'Save changes' }}
      />
    </div>
  ),
};
