import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NlCalendar, type NlCalendarRange } from './NlCalendar';

/** Disabled day numbers are under 4.5:1 by design (unavailable dates, WCAG 1.4.3): known issue K3. */
const k3 = { 'data-a11y-known-issue': 'K3' };

/**
 * Flat controls for Storybook. The props are a union (single takes a date, range a start and end), which Storybook's
 * types can't infer through.
 */
interface StoryArgs {
  mode: 'single' | 'range';
  weekStartsOn: 0 | 1;
  today: string;
}

const meta = {
  title: 'Components/Molecules/Calendar',
  args: { mode: 'single', weekStartsOn: 1, today: '2027-03-17' },
  argTypes: {
    mode: { control: 'inline-radio', options: ['single', 'range'] },
    weekStartsOn: { control: 'inline-radio', options: [1, 0], labels: { 1: 'Monday', 0: 'Sunday' } },
    today: { control: 'text' },
  },
  render: (args) =>
    args.mode === 'range' ? (
      <NlCalendar key="range" mode="range" weekStartsOn={args.weekStartsOn} today={args.today} />
    ) : (
      <NlCalendar key="single" weekStartsOn={args.weekStartsOn} today={args.today} />
    ),
} satisfies Meta<StoryArgs>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Single or range with controls. Click a day, or Tab in and use the arrow keys, Home, End and Page Up / Down. */
export const Default: Story = {};

/** One date chosen. Days of other months show as outside; picking one moves to its month. */
export const Single: Story = {
  render: () => <NlCalendar today="2027-03-17" defaultValue="2027-03-09" />,
};

/** A range across two months. While choosing the end, hovering or focusing a day previews the range. */
export const Range: Story = {
  render: () => (
    <NlCalendar mode="range" today="2027-03-17" defaultValue={{ start: '2027-03-24', end: '2027-04-06' }} />
  ),
};

/** Limits: 5 to 26 March, weekends unavailable. Previous and next stop at the limits. */
export const Limits: Story = {
  render: () => (
    <div {...k3}>
      <NlCalendar
        today="2027-03-17"
        defaultMonth="2027-03"
        minDate="2027-03-05"
        maxDate="2027-03-26"
        isDateDisabled={(date) => {
          const day = new Date(`${date}T00:00:00Z`).getUTCDay();
          return day === 0 || day === 6;
        }}
      />
    </div>
  ),
};

/** Weeks starting on Sunday. */
export const WeekStartsSunday: Story = {
  name: 'Week starts Sunday',
  render: () => <NlCalendar today="2027-03-17" weekStartsOn={0} />,
};

/** Controlled range: the parent holds the value and the month. */
export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState<NlCalendarRange>({ start: null, end: null });
    const [month, setMonth] = useState('2027-03');
    return (
      <div className="nl:flex nl:flex-col nl:gap-m">
        <NlCalendar
          mode="range"
          today="2027-03-17"
          value={value}
          onValueChange={setValue}
          month={month}
          onMonthChange={setMonth}
        />
        <p className="nl:text-body-m nl:text-secondary">
          {`Start: ${value.start ?? '–'} · End: ${value.end ?? '–'} · Month: ${month}`}
        </p>
      </div>
    );
  },
};
