import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { NlDateField } from './NlDateField';

/** A form column (up to Size-320), with room below for the calendar. */
function Frame({ children }: { children: ReactNode }) {
  return <div className="nl:flex nl:w-full nl:max-w-320 nl:flex-col nl:gap-xl nl:pb-12xl">{children}</div>;
}

const meta = {
  title: 'Components/Organisms/Date field',
  component: NlDateField,
  args: { label: 'Start date', format: 'DD/MM/YYYY', error: false, disabled: false, helperText: '' },
  argTypes: {
    label: { control: 'text' },
    format: { control: 'inline-radio', options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
    minDate: { control: 'text' },
    maxDate: { control: 'text' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    helperText: { control: 'text' },
    ref: { control: false },
  },
} satisfies Meta<typeof NlDateField>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Every option as a control. Focus to see the pattern; type digits (slashes are added) or open the calendar. */
export const Default: Story = {
  render: (args) => (
    <Frame>
      <NlDateField {...args} />
    </Frame>
  ),
};

/** Enabled, complete, helper text, error, disabled empty and disabled complete. */
export const States: Story = {
  render: () => (
    <Frame>
      <NlDateField label="Start date" />
      <NlDateField label="Start date" defaultValue="2026-11-21" />
      <NlDateField label="Start date" helperText="The first day of the offer" />
      <NlDateField label="Start date" error helperText="Choose a start date" />
      <NlDateField label="Start date" disabled />
      <NlDateField label="Start date" disabled defaultValue="2026-11-21" />
    </Frame>
  ),
};

/** Limits: days outside them are disabled in the calendar; typing one shows "Choose a date from / until …". */
export const Limits: Story = {
  render: () => (
    <Frame>
      <NlDateField
        label="Event date"
        minDate="2026-11-10"
        maxDate="2026-12-15"
        defaultValue="2026-11-21"
        helperText="10/11/2026 to 15/12/2026"
      />
    </Frame>
  ),
};

/** Out-of-range dates, with their errors. Type 31/02/2026 in any field for "Enter a date as DD/MM/YYYY". */
export const Errors: Story = {
  render: () => (
    <Frame>
      <NlDateField label="Too early" minDate="2026-11-10" defaultValue="2026-11-01" />
      <NlDateField label="Too late" maxDate="2026-12-15" defaultValue="2026-12-31" />
    </Frame>
  ),
};

/** Other patterns: month first, and ISO order with dashes. */
export const Formats: Story = {
  render: () => (
    <Frame>
      <NlDateField label="Start date" format="MM/DD/YYYY" defaultValue="2026-11-21" />
      <NlDateField label="Start date" format="YYYY-MM-DD" defaultValue="2026-11-21" />
    </Frame>
  ),
};

/** Controlled by the page, which shows the ISO value. */
export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState('2026-11-21');
    return (
      <Frame>
        <NlDateField label="Start date" value={value} onValueChange={setValue} />
        <p className="nl:text-body-m nl:text-secondary">Value: {value || 'none'}</p>
      </Frame>
    );
  },
};
