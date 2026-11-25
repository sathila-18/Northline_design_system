import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlBulkActionBar, type NlBulkAction } from './NlBulkActionBar';

const noop = () => undefined;

const three: NlBulkAction[] = [
  { label: 'Export', icon: 'download', onSelect: noop },
  { label: 'Change status', icon: 'swap_horiz', onSelect: noop },
  { label: 'Suspend', icon: 'block', tone: 'destructive', onSelect: noop },
];

const many: NlBulkAction[] = [
  { label: 'Export', icon: 'download', onSelect: noop },
  { label: 'Change status', icon: 'swap_horiz', onSelect: noop },
  { label: 'Message', icon: 'mail', onSelect: noop },
  { label: 'Add to event', icon: 'event', onSelect: noop },
  { label: 'Give reward', icon: 'redeem', onSelect: noop },
  { label: 'Refresh points', icon: 'refresh', onSelect: noop },
  { label: 'Mark checked', icon: 'check_circle', onSelect: noop },
  { label: 'Add note', icon: 'info', onSelect: noop },
  { label: 'Remove', icon: 'delete', tone: 'destructive', onSelect: noop },
];

const meta = {
  title: 'Components/Actions/Bulk action bar',
  tags: ['molecule'],
  component: NlBulkActionBar,
  parameters: { layout: 'padded' },
  args: { count: 3, onClear: noop, actions: three },
  argTypes: {
    count: { control: { type: 'number', min: 1 } },
    actions: { control: false },
    onClear: { control: false },
  },
} satisfies Meta<typeof NlBulkActionBar>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Clear selection, the count, two actions and a destructive one (solid red, last). */
export const Default: Story = {};

/** Nine actions: seven show (the destructive one last), the rest are in the more menu. */
export const ManyActions: Story = { name: 'Many actions', args: { actions: many } };

/** A narrow container (Size-560): only the actions that fit show; the destructive one always does. */
export const Narrow: Story = {
  args: { actions: many },
  render: (args) => (
    <div className="nl:max-w-560">
      <NlBulkActionBar {...args} />
    </div>
  ),
};

/** A disabled action. */
export const DisabledAction: Story = {
  name: 'Disabled action',
  args: { actions: [three[0], { ...three[1], disabled: true }, three[2]] as NlBulkAction[] },
};
