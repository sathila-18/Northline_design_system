import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { NlCalendarDay, type NlCalendarDayType } from './NlCalendarDay';

/** Disabled text is under 4.5:1 by design (inactive control, WCAG 1.4.3): known issue K3. */
const knownIssue = (disabled: boolean) => (disabled ? { 'data-a11y-known-issue': 'K3' } : {});

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** The day only lives in NlCalendar's grid; stories give it a grid and a row so the roles are valid. */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="grid" aria-label={label}>
      <div role="row" className="nl:flex">
        {children}
      </div>
    </div>
  );
}

/** A day in March 2027 (the 1st is a Monday), with its ISO date and name. */
const march = (day: number) => ({
  day,
  date: `2027-03-${String(day).padStart(2, '0')}`,
  label: `${weekdays[(day - 1) % 7] ?? ''} ${String(day)} March`,
});

const types: NlCalendarDayType[] = [
  'default',
  'outside',
  'selected',
  'range-start',
  'range-middle',
  'range-end',
  'disabled',
];

const meta = {
  title: 'Internal/Calendar day',
  component: NlCalendarDay,
  args: { ...march(3), type: 'default', today: false },
  argTypes: {
    day: { control: { type: 'number', min: 1, max: 31 } },
    type: { control: 'select', options: types },
    today: { control: 'boolean' },
    date: { control: false },
    label: { control: 'text' },
  },
  render: (args) => (
    <div {...knownIssue(args.type === 'disabled')}>
      <Row label="March 2027">
        <NlCalendarDay {...args} />
      </Row>
    </div>
  ),
} satisfies Meta<typeof NlCalendarDay>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One day with every option as a control. */
export const Default: Story = {};

/** Every type at rest. Hover, press and Tab to see the states. */
export const Types: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-l">
      {types.map((type, index) => (
        <div key={type} className="nl:flex nl:items-center nl:gap-l" {...knownIssue(type === 'disabled')}>
          <Row label={type}>
            <NlCalendarDay {...march(index + 1)} type={type} />
          </Row>
          <span className="nl:text-body-s nl:text-secondary">{type}</span>
        </div>
      ))}
    </div>
  ),
};

/** A selected range across a week: the band joins start, middle and end. */
export const Range: Story = {
  render: () => (
    <Row label="March 2027">
      <NlCalendarDay {...march(1)} />
      <NlCalendarDay {...march(2)} type="range-start" />
      <NlCalendarDay {...march(3)} type="range-middle" />
      <NlCalendarDay {...march(4)} type="range-middle" today />
      <NlCalendarDay {...march(5)} type="range-middle" />
      <NlCalendarDay {...march(6)} type="range-end" />
      <NlCalendarDay {...march(7)} />
    </Row>
  ),
};

/** Today with each type (OD-27): the border shows except on filled days; border-disabled when disabled. */
export const Today: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-l">
      {types.map((type) => (
        <div key={type} className="nl:flex nl:items-center nl:gap-l" {...knownIssue(type === 'disabled')}>
          <Row label={`Today, ${type}`}>
            <NlCalendarDay {...march(17)} type={type} today />
          </Row>
          <span className="nl:text-body-s nl:text-secondary">today + {type}</span>
        </div>
      ))}
    </div>
  ),
};
