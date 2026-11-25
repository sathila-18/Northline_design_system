import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { NlTableHeaderCell } from '../NlTableHeaderCell';
import { NlTableCell } from './NlTableCell';

function Table({ head, children, fixed = false }: { head: string[]; children: ReactNode; fixed?: boolean }) {
  return (
    <table className={fixed ? 'nl:w-full nl:table-fixed nl:border-collapse' : 'nl:w-full nl:border-collapse'}>
      <thead>
        <tr>
          {head.map((name) => (
            <NlTableHeaderCell
              key={name}
              hideTitle={name === 'Select' || name === 'Actions'}
              narrow={name === 'Select' || name === 'Actions'}
            >
              {name}
            </NlTableHeaderCell>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

/**
 * Flat controls for Storybook. The props are a union (each type has its own content prop), which Storybook's types
 * can't infer through, so the stories render the cells themselves.
 */
interface StoryArgs {
  text: string;
  narrow: boolean;
  rowHeader: boolean;
}

const meta = {
  title: 'Components/Data display/Table cell',
  tags: ['molecule'],
  args: { text: 'Member 0042', narrow: false, rowHeader: false },
  argTypes: {
    text: { control: 'text' },
    narrow: { control: 'boolean' },
    rowHeader: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="nl:w-full nl:bg-primary nl:p-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<StoryArgs>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One text cell with its options as controls. */
export const Default: Story = {
  render: (args) => (
    <Table head={['Member']}>
      <tr>
        <NlTableCell narrow={args.narrow} rowHeader={args.rowHeader}>
          {args.text}
        </NlTableCell>
      </tr>
    </Table>
  ),
};

/** Every type in one row: select + row header, text, badge, link, value checkbox, row actions. */
export const Types: Story = {
  render: function TypesStory() {
    const [selected, setSelected] = useState(false);
    const [canRedeem, setCanRedeem] = useState(true);
    const [open, setOpen] = useState(false);
    return (
      <Table head={['Member', 'Points', 'Tier', 'Profile', 'Can redeem', 'Actions']}>
        <tr>
          <NlTableCell
            rowHeader
            select={{
              checked: selected,
              onChange: (event) => {
                setSelected(event.currentTarget.checked);
              },
              label: 'Select Member 0042',
            }}
          >
            Member 0042
          </NlTableCell>
          <NlTableCell>12,480</NlTableCell>
          <NlTableCell type="badge" badge={{ tone: 'success', label: 'Tier 2' }} />
          <NlTableCell type="link" link={{ label: 'View profile', href: '#member-0042' }} />
          <NlTableCell
            type="checkbox"
            narrow
            checkbox={{
              checked: canRedeem,
              onChange: (event) => {
                setCanRedeem(event.currentTarget.checked);
              },
              label: 'Member 0042, Can redeem',
            }}
          />
          <NlTableCell
            type="row-actions"
            actions={{
              label: 'Actions for Member 0042',
              expanded: open,
              onClick: () => {
                setOpen(!open);
              },
            }}
          />
        </tr>
      </Table>
    );
  },
};

/** Text longer than its column is cut with an ellipsis; hover for the full text (OD-186). */
export const Truncated: Story = {
  render: () => (
    <div className="nl:max-w-320">
      <Table head={['Reward']} fixed>
        <tr>
          <NlTableCell>
            Track day voucher for two, valid at every partner circuit until the end of next year
          </NlTableCell>
        </tr>
      </Table>
    </div>
  ),
};

/** A wide table that scrolls sideways; the row-actions column stays at the end (OD-187). */
export const StickyActions: Story = {
  render: () => (
    <div className="nl:max-w-560 nl:overflow-x-auto" tabIndex={0} role="region" aria-label="Members table">
      <table className="nl:border-collapse nl:bg-primary">
        <thead>
          <tr>
            {['Member', 'Points', 'Tier', 'Region', 'Joined', 'Last visit'].map((name) => (
              <NlTableHeaderCell key={name}>{name}</NlTableHeaderCell>
            ))}
            <NlTableHeaderCell narrow hideTitle className="nl:sticky nl:end-none nl:z-sticky nl:bg-primary">
              Actions
            </NlTableHeaderCell>
          </tr>
        </thead>
        <tbody className="nl:bg-primary">
          {['0042', '0043', '0044'].map((id) => (
            <tr key={id} className="nl:bg-primary">
              <NlTableCell rowHeader>{`Member ${id}`}</NlTableCell>
              <NlTableCell>12,480</NlTableCell>
              <NlTableCell type="badge" badge={{ tone: 'neutral', label: 'Tier 2' }} />
              <NlTableCell>North</NlTableCell>
              <NlTableCell>March 2026</NlTableCell>
              <NlTableCell>Yesterday</NlTableCell>
              <NlTableCell
                type="row-actions"
                stickyEnd
                actions={{ label: `Actions for Member ${id}`, onClick: () => undefined }}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};
