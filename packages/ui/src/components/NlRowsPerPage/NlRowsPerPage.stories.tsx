import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { NlMenu } from '../NlMenu';
import { NlRowsPerPage } from './NlRowsPerPage';

// Option rows are plain elements with the right role, as in the NlMenu stories, until NlListItem is built.
const row =
  'nl:flex nl:w-full nl:items-center nl:p-l nl:text-start nl:text-body-m nl:text-primary nl:aria-selected:text-action nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused';

const meta = {
  title: 'Components/Atoms L1/Rows per page',
  component: NlRowsPerPage,
  args: { value: 10, open: false, disabled: false, label: 'Rows per page' },
  argTypes: {
    value: { control: 'select', options: [10, 25, 50, 100] },
    open: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    onOpenChange: { control: false },
  },
} satisfies Meta<typeof NlRowsPerPage>;
export default meta;

type Story = StoryObj<typeof meta>;

/** The trigger with every option as a control. Hover, press and tab to it to see the states. */
export const Default: Story = {};

/** Closed, open (pressed look, arrow up) and disabled. */
export const States: Story = {
  render: () => (
    <div className="nl:flex nl:items-center nl:gap-m">
      <NlRowsPerPage value={10} />
      <NlRowsPerPage value={10} open />
      <NlRowsPerPage value={10} disabled />
    </div>
  ),
};

/**
 * With an NlMenu (kind="select"), as NlTable will render it: click or press Down arrow to open, choose a number.
 * The menu closes, the value updates and focus returns to the trigger.
 */
export const WithMenu: Story = {
  name: 'With a menu',
  parameters: { layout: 'padded' },
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(10);
    const anchorRef = useRef<HTMLButtonElement>(null);
    return (
      <div>
        <NlRowsPerPage
          ref={anchorRef}
          value={value}
          open={open}
          onOpenChange={setOpen}
          aria-controls="story-rows-menu"
        />
        <NlMenu
          id="story-rows-menu"
          kind="select"
          aria-label="Rows per page"
          open={open}
          onOpenChange={setOpen}
          anchorRef={anchorRef}
        >
          {[10, 25, 50, 100].map((option) => (
            <div
              key={option}
              role="option"
              tabIndex={-1}
              aria-selected={option === value}
              className={row}
              onClick={() => {
                setValue(option);
              }}
            >
              {option}
            </div>
          ))}
        </NlMenu>
      </div>
    );
  },
};
