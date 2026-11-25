import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { NlMultiSelect, type NlMultiSelectOption } from './NlMultiSelect';

const tiers: NlMultiSelectOption[] = [
  { value: 'tier-1', label: 'Tier 1' },
  { value: 'tier-2', label: 'Tier 2' },
  { value: 'tier-3', label: 'Tier 3' },
  { value: 'tier-4', label: 'Tier 4', disabled: true },
];

const rewards: NlMultiSelectOption[] = [
  { value: 'reward-x', label: 'Reward X', description: 'Any tier' },
  { value: 'track-day', label: 'Track day voucher', description: 'Tier 2 and up' },
  { value: 'event-pass', label: 'Event pass', description: 'Tier 3 and up' },
  { value: 'gift-card', label: 'Gift card', description: 'Paused', disabled: true },
];

const members: NlMultiSelectOption[] = Array.from({ length: 24 }, (_, index) => {
  const id = String(index + 1).padStart(4, '0');
  return { value: `member-${id}`, label: `Member ${id}` };
});

/** A form column (up to Size-320), with room below for the menu. */
function Frame({ children }: { children: ReactNode }) {
  return <div className="nl:flex nl:w-full nl:max-w-320 nl:flex-col nl:gap-xl nl:pb-12xl">{children}</div>;
}

const meta = {
  title: 'Components/Forms and inputs/Multi select',
  tags: ['organism'],
  component: NlMultiSelect,
  args: {
    label: 'Tiers',
    options: tiers,
    size: 'large',
    searchable: false,
    error: false,
    disabled: false,
    helperText: '',
  },
  argTypes: {
    label: { control: 'text' },
    size: { control: 'inline-radio', options: ['large', 'small'] },
    searchable: { control: 'boolean' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    helperText: { control: 'text' },
    options: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof NlMultiSelect>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Every option as a control. Space toggles a row and the menu stays open; Escape or Tab closes it. */
export const Default: Story = {
  render: (args) => (
    <Frame>
      <NlMultiSelect {...args} />
    </Frame>
  ),
};

/** Large and small, empty and with chips (xsmall in both sizes). */
export const Sizes: Story = {
  render: () => (
    <Frame>
      <NlMultiSelect label="Tiers" options={tiers} />
      <NlMultiSelect label="Tiers" options={tiers} defaultValue={['tier-1', 'tier-2']} />
      <NlMultiSelect label="Tiers" options={tiers} size="small" />
      <NlMultiSelect label="Tiers" options={tiers} size="small" defaultValue={['tier-1', 'tier-2']} />
    </Frame>
  ),
};

/** Enabled, complete, helper text, error, disabled empty and disabled complete (no remove buttons). */
export const States: Story = {
  render: () => (
    <Frame>
      <NlMultiSelect label="Tiers" options={tiers} />
      <NlMultiSelect label="Tiers" options={tiers} defaultValue={['tier-1']} />
      <NlMultiSelect label="Tiers" options={tiers} helperText="Members in these tiers get the offer" />
      <NlMultiSelect label="Tiers" options={tiers} error helperText="Choose at least one tier" />
      {/* Disabled chips are under 4.5:1 by design (inactive control, WCAG 1.4.3): known issue K5. */}
      <div data-a11y-known-issue="K5" className="nl:flex nl:flex-col nl:gap-xl">
        <NlMultiSelect label="Tiers" options={tiers} disabled />
        <NlMultiSelect label="Tiers" options={tiers} disabled defaultValue={['tier-1', 'tier-2']} />
      </div>
    </Frame>
  ),
};

/** More chips than fit: the rest become one "+N" chip. Remove chips with their buttons (Tab after the field). */
export const Overflow: Story = {
  render: () => (
    <Frame>
      <NlMultiSelect label="Rewards" options={rewards} defaultValue={['reward-x', 'track-day', 'event-pass']} />
    </Frame>
  ),
};

/** Search in the menu header: typing filters the rows; Down moves into them; Backspace in an empty search removes the last chip. */
export const Searchable: Story = {
  render: () => (
    <Frame>
      <NlMultiSelect label="Members" options={members} searchable defaultValue={['member-0003', 'member-0007']} />
    </Frame>
  ),
};

/** Options with a description line; the last one is disabled. */
export const WithDescriptions: Story = {
  render: () => (
    <Frame>
      <NlMultiSelect label="Rewards" options={rewards} defaultValue={['reward-x']} />
    </Frame>
  ),
};

/** Controlled by the page, which shows the chosen values. */
export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState(['tier-2']);
    return (
      <Frame>
        <NlMultiSelect label="Tiers" options={tiers} value={value} onValueChange={setValue} />
        <p className="nl:text-body-m nl:text-secondary">Chosen values: {value.join(', ') || 'none'}</p>
      </Frame>
    );
  },
};
