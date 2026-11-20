import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { NlSelect, type NlSelectOption } from './NlSelect';

const tiers: NlSelectOption[] = [
  { value: 'tier-1', label: 'Tier 1' },
  { value: 'tier-2', label: 'Tier 2' },
  { value: 'tier-3', label: 'Tier 3' },
  { value: 'tier-4', label: 'Tier 4', disabled: true },
];

const statuses: NlSelectOption[] = [
  { value: 'active', label: 'Active', description: 'Can earn and spend points' },
  { value: 'paused', label: 'Paused', description: 'Keeps points, earns none' },
  { value: 'closed', label: 'Closed', description: 'No longer a member', disabled: true },
];

const members: NlSelectOption[] = Array.from({ length: 24 }, (_, index) => {
  const id = String(index + 1).padStart(4, '0');
  return { value: `member-${id}`, label: `Member ${id}` };
});

/** A form column (up to Size-320), with room below for the menu. */
function Frame({ children }: { children: ReactNode }) {
  return <div className="nl:flex nl:w-full nl:max-w-320 nl:flex-col nl:gap-xl nl:pb-12xl">{children}</div>;
}

const meta = {
  title: 'Components/Organisms/Select',
  component: NlSelect,
  args: { label: 'Tier', options: tiers, size: 'large', error: false, disabled: false, helperText: '' },
  argTypes: {
    label: { control: 'text' },
    size: { control: 'inline-radio', options: ['large', 'small'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    helperText: { control: 'text' },
    options: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof NlSelect>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Every option as a control. Click or press Enter, Space or Down to open; a letter on the closed field picks. */
export const Default: Story = {
  render: (args) => (
    <Frame>
      <NlSelect {...args} />
    </Frame>
  ),
};

/** Large (Size-48, chevron 24) and small (Size-40, chevron 20), empty and filled. */
export const Sizes: Story = {
  render: () => (
    <Frame>
      <NlSelect label="Tier" options={tiers} />
      <NlSelect label="Tier" options={tiers} defaultValue="tier-2" />
      <NlSelect label="Tier" options={tiers} size="small" />
      <NlSelect label="Tier" options={tiers} size="small" defaultValue="tier-2" />
    </Frame>
  ),
};

/** Enabled, complete, with helper text, error, disabled empty and disabled complete. Hover and focus them. */
export const States: Story = {
  render: () => (
    <Frame>
      <NlSelect label="Tier" options={tiers} />
      <NlSelect label="Tier" options={tiers} defaultValue="tier-1" />
      <NlSelect label="Tier" options={tiers} helperText="Sets the member's rewards" />
      <NlSelect label="Tier" options={tiers} error helperText="Choose a tier" />
      <NlSelect label="Tier" options={tiers} disabled />
      <NlSelect label="Tier" options={tiers} disabled defaultValue="tier-1" />
    </Frame>
  ),
};

/** Options with a description line; the last one is disabled and skipped by the keyboard. */
export const WithDescriptions: Story = {
  render: () => (
    <Frame>
      <NlSelect label="Status" options={statuses} defaultValue="active" />
    </Frame>
  ),
};

/** Many options: the menu stops at Size-320 and scrolls; the chosen one is focused when it opens. */
export const LongList: Story = {
  render: () => (
    <Frame>
      <NlSelect label="Member" options={members} defaultValue="member-0012" />
    </Frame>
  ),
};

/** Controlled by the page, which shows the chosen value. */
export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState('tier-3');
    return (
      <Frame>
        <NlSelect label="Tier" options={tiers} value={value} onValueChange={setValue} />
        <p className="nl:text-body-m nl:text-secondary">Chosen value: {value}</p>
      </Frame>
    );
  },
};
