import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NlOverlay } from './NlOverlay';

const meta = {
  title: 'Components/Atoms L0/Overlay',
  component: NlOverlay,
  args: { open: true },
  argTypes: {
    open: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="nl:flex nl:flex-col nl:gap-m nl:p-xl nl:text-body-m nl:text-primary">
        <p>Member 0042 · Tier 2</p>
        <p>Page content behind the overlay. The overlay dims it; a dialog or side sheet would sit above it.</p>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NlOverlay>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Shown over sample page content. Toggle open in the controls to see it fade in and out. */
export const Default: Story = {};

/** Hidden: stays in the page with display none, draws nothing and takes no clicks. */
export const Hidden: Story = { args: { open: false } };

/**
 * Click to close. The parent owns what a click does: here it closes the overlay. The button opens it again with a
 * fade in (none under reduced motion).
 */
export const ClickToClose: Story = {
  name: 'Click to close',
  render: function Render(args) {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button
          type="button"
          onClick={() => {
            setOpen(true);
          }}
        >
          Show overlay
        </button>
        <NlOverlay
          {...args}
          open={open}
          onClick={() => {
            setOpen(false);
          }}
        />
      </>
    );
  },
};
