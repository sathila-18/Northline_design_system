import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NlBadge } from '../NlBadge';
import { NlCheckboxListItem } from './NlCheckboxListItem';

const k3 = (disabled: boolean | undefined) => (disabled ? { 'data-a11y-known-issue': 'K3' } : {});

const meta = {
  title: 'Components/Forms and inputs/Checkbox list item',
  tags: ['molecule'],
  component: NlCheckboxListItem,
  args: {
    title: 'Tier 2',
    description: '1,200 members',
    controlSide: 'leading',
    appearance: 'plain',
    size: 'large',
    density: 'default',
    divider: true,
    showBody: true,
    disabled: false,
    defaultChecked: false,
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    controlSide: { control: 'inline-radio', options: ['leading', 'trailing'] },
    appearance: { control: 'inline-radio', options: ['plain', 'filled'] },
    size: { control: 'inline-radio', options: ['large', 'small'] },
    density: { control: 'inline-radio', options: ['default', 'compact'] },
    body: { control: false },
    showBody: { control: 'boolean' },
    checked: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="nl:w-full nl:bg-primary nl:p-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NlCheckboxListItem>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One row with every option as a control. Hover the row to see the box follow; Tab for the ring round the row. */
export const Default: Story = {
  render: (args) => (
    <div {...k3(args.disabled)}>
      <NlCheckboxListItem {...args} />
    </div>
  ),
};

/** A group with its label (role group, named "Tiers"); the page provides the wrapper. */
export const Group: Story = {
  render: function GroupStory(args) {
    const [picked, setPicked] = useState<string[]>(['tier-2']);
    const tiers = [
      { id: 'tier-1', title: 'Tier 1', description: '3,400 members' },
      { id: 'tier-2', title: 'Tier 2', description: '1,200 members' },
      { id: 'tier-3', title: 'Tier 3', description: '310 members' },
    ];
    return (
      <div role="group" aria-labelledby="tiers-label" className="nl:flex nl:flex-col">
        <span id="tiers-label" className="nl:px-xl nl:text-label-m nl:text-tertiary">
          Tiers
        </span>
        {tiers.map((tier) => (
          <NlCheckboxListItem
            {...args}
            key={tier.id}
            name="tiers"
            value={tier.id}
            title={tier.title}
            description={tier.description}
            checked={picked.includes(tier.id)}
            onCheckedChange={(on) => {
              setPicked((current) => (on ? [...current, tier.id] : current.filter((id) => id !== tier.id)));
            }}
          />
        ))}
      </div>
    );
  },
};

/** Unchecked, checked, disabled, disabled + checked; checkbox leading and trailing. */
export const States: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col">
      <NlCheckboxListItem {...args} title="Unchecked" />
      <NlCheckboxListItem {...args} title="Checked" defaultChecked />
      <NlCheckboxListItem {...args} title="Trailing checkbox" controlSide="trailing" defaultChecked />
      <div data-a11y-known-issue="K3">
        <NlCheckboxListItem {...args} title="Disabled" disabled />
        <NlCheckboxListItem {...args} title="Disabled, checked" disabled defaultChecked />
      </div>
    </div>
  ),
};

/** Filled cards, Space-L apart (the list sets the gap). */
export const Filled: Story = {
  args: { appearance: 'filled' },
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-l">
      <NlCheckboxListItem {...args} title="Tier 1" />
      <NlCheckboxListItem {...args} title="Tier 2" defaultChecked />
      <div data-a11y-known-issue="K3">
        <NlCheckboxListItem {...args} title="Tier 3" disabled />
      </div>
    </div>
  ),
};

/** Large and small, in both densities. */
export const SizesAndDensity: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col">
      <NlCheckboxListItem {...args} title="Large, default" />
      <NlCheckboxListItem {...args} density="compact" title="Large, compact" />
      <NlCheckboxListItem {...args} size="small" title="Small, default" />
      <NlCheckboxListItem {...args} size="small" density="compact" title="Small, compact" divider={false} />
    </div>
  ),
};

/** Body in place of the description; showBody turns it (or the description) off (OD-158). */
export const Body: Story = {
  render: (args) => <NlCheckboxListItem {...args} title="Reward X" body={<NlBadge tone="success">Active</NlBadge>} />,
};
