import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlSpinner } from './NlSpinner';

const meta = {
  title: 'Components/Atoms L1/Spinner',
  component: NlSpinner,
  args: { status: 'loading', label: 'Loading rewards' },
  argTypes: {
    status: { control: 'inline-radio', options: ['loading', 'success', 'error'] },
    value: { control: { type: 'range', min: 0, max: 100, step: 5 } },
    label: { control: 'text' },
  },
} satisfies Meta<typeof NlSpinner>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One spinner with every option as a control. Set a value for a ring that shows progress. */
export const Default: Story = {};

/** The three statuses. The result's label is announced through a status region. */
export const Statuses: Story = {
  render: () => (
    <div className="nl:flex nl:items-center nl:gap-xl">
      <NlSpinner label="Uploading file" />
      <NlSpinner status="success" label="Upload complete" />
      <NlSpinner status="error" label="Upload failed" />
    </div>
  ),
};

/** With a value: the arc length shows how much is done, and the ring doesn't turn (OD-62). */
export const WithValue: Story = {
  name: 'With a value',
  render: () => (
    <div className="nl:flex nl:items-center nl:gap-xl">
      {[25, 50, 75, 100].map((value) => (
        <NlSpinner key={value} value={value} label={`Uploading file, ${String(value)}%`} />
      ))}
    </div>
  ),
};
