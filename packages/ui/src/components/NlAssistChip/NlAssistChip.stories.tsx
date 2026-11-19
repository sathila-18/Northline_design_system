import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { nlIconNames, type NlIconName } from '../../icons';
import type { NlChipBaseSize } from '../NlChipBase';
import { NlMenu } from '../NlMenu';
import { NlAssistChip } from './NlAssistChip';

const sizes = ['xsmall', 'small', 'large'] as const;

// Menu rows are plain elements with the right role, as in the NlMenu stories, until NlListItem is built.
const row =
  'nl:flex nl:w-full nl:items-center nl:p-l nl:text-start nl:text-body-m nl:text-primary nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused';

/** Flat controls for Storybook. The props are a union (open only with dropdown), checked in render. */
interface StoryArgs {
  size: NlChipBaseSize;
  dropdown: boolean;
  open: boolean;
  disabled: boolean;
  leadingIcon?: NlIconName;
  children: string;
}

const meta = {
  title: 'Components/Atoms L1/Assist chip',
  args: {
    size: 'small',
    dropdown: true,
    open: false,
    disabled: false,
    leadingIcon: 'calendar_today',
    children: 'Date range',
  },
  render: ({ dropdown, open, ...rest }) =>
    dropdown ? <NlAssistChip {...rest} dropdown open={open} /> : <NlAssistChip {...rest} />,
  argTypes: {
    size: { control: 'inline-radio', options: sizes },
    dropdown: { control: 'boolean' },
    open: { control: 'boolean', if: { arg: 'dropdown' } },
    disabled: { control: 'boolean' },
    leadingIcon: { control: 'select', options: [undefined, ...nlIconNames] },
    children: { control: 'text' },
  },
} satisfies Meta<StoryArgs>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One chip with every option as a control. Hover, press and tab to it to see the states. */
export const Default: Story = {};

/** An action chip: no arrow. It runs something when clicked. */
export const Action: Story = {
  render: (args) => (
    <div className="nl:flex nl:items-center nl:gap-m">
      <NlAssistChip size={args.size}>Export</NlAssistChip>
      <NlAssistChip size={args.size} leadingIcon="add">
        Add member
      </NlAssistChip>
      <NlAssistChip size={args.size} disabled>
        Export
      </NlAssistChip>
    </div>
  ),
};

/** Dropdown chips: closed, open (selected look, up arrow) and disabled. */
export const Dropdown: Story = {
  render: (args) => (
    <div className="nl:flex nl:items-center nl:gap-m">
      <NlAssistChip size={args.size} dropdown leadingIcon="calendar_today">
        Date range
      </NlAssistChip>
      <NlAssistChip size={args.size} dropdown open leadingIcon="calendar_today">
        Date range
      </NlAssistChip>
      <NlAssistChip size={args.size} dropdown disabled leadingIcon="calendar_today">
        Date range
      </NlAssistChip>
    </div>
  ),
};

/** The three sizes, closed and open. */
export const Sizes: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-m">
      {sizes.map((size) => (
        <div key={size} className="nl:flex nl:items-center nl:gap-m">
          <NlAssistChip size={size} dropdown leadingIcon="calendar_today">
            Date range
          </NlAssistChip>
          <NlAssistChip size={size} dropdown open leadingIcon="calendar_today">
            Date range
          </NlAssistChip>
        </div>
      ))}
    </div>
  ),
};

/**
 * With an NlMenu: click the chip or press Down arrow to open. Choosing a range closes the menu and updates the label;
 * Escape closes it and returns focus to the chip.
 */
export const WithMenu: Story = {
  name: 'With a menu',
  parameters: { layout: 'padded' },
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [range, setRange] = useState('This week');
    const anchorRef = useRef<HTMLButtonElement>(null);
    return (
      <div>
        <NlAssistChip
          ref={anchorRef}
          dropdown
          open={open}
          onOpenChange={setOpen}
          aria-controls="story-date-menu"
          leadingIcon="calendar_today"
        >
          {range}
        </NlAssistChip>
        <NlMenu id="story-date-menu" aria-label="Date range" open={open} onOpenChange={setOpen} anchorRef={anchorRef}>
          {['Today', 'This week', 'This month', 'This year'].map((option) => (
            <button
              key={option}
              type="button"
              role="menuitem"
              tabIndex={-1}
              className={row}
              onClick={() => {
                setRange(option);
              }}
            >
              {option}
            </button>
          ))}
        </NlMenu>
      </div>
    );
  },
};
