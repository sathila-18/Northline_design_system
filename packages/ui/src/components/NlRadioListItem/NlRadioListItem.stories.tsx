import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NlBadge } from '../NlBadge';
import { NlRadioListGroup } from './NlRadioListGroup';
import { NlRadioListItem } from './NlRadioListItem';

const tiers = [
  { value: 'tier-1', title: 'Tier 1', description: '3,400 members' },
  { value: 'tier-2', title: 'Tier 2', description: '1,200 members' },
  { value: 'tier-3', title: 'Tier 3', description: '310 members' },
];

/** Rows always sit in NlRadioListGroup, which owns the value. */
const meta = {
  title: 'Components/Molecules/Radio list item',
  component: NlRadioListItem,
  args: {
    value: 'tier-1',
    title: 'Tier 1',
    description: '3,400 members',
    controlSide: 'leading',
    size: 'large',
    density: 'default',
    divider: true,
    showBody: true,
    disabled: false,
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    controlSide: { control: 'inline-radio', options: ['leading', 'trailing'] },
    size: { control: 'inline-radio', options: ['large', 'small'] },
    density: { control: 'inline-radio', options: ['default', 'compact'] },
    value: { control: false },
    body: { control: false },
    showBody: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="nl:w-full nl:bg-primary nl:p-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NlRadioListItem>;
export default meta;

type Story = StoryObj<typeof meta>;

/** A group of three with the row options as controls. Tab in, then use the arrow keys. */
export const Default: Story = {
  render: (args) => (
    <div {...(args.disabled ? { 'data-a11y-known-issue': 'K3' } : {})}>
      <NlRadioListGroup aria-label="Tier" defaultValue="tier-2">
        {tiers.map((tier) => (
          <NlRadioListItem {...args} key={tier.value} {...tier} />
        ))}
      </NlRadioListGroup>
    </div>
  ),
};

/** A controlled group with a visible label from the page (aria-labelledby, OD-162). */
export const Group: Story = {
  render: function GroupStory(args) {
    const [value, setValue] = useState<string | null>('tier-1');
    return (
      <div className="nl:flex nl:flex-col nl:gap-s">
        <span id="tier-label" className="nl:px-xl nl:text-label-m nl:text-tertiary">
          Tier
        </span>
        <NlRadioListGroup aria-labelledby="tier-label" value={value} onValueChange={setValue}>
          {tiers.map((tier) => (
            <NlRadioListItem {...args} key={tier.value} {...tier} />
          ))}
        </NlRadioListGroup>
      </div>
    );
  },
};

/** Filled cards: the group passes the appearance and sets the Space-L gap (OD-160). */
export const Filled: Story = {
  render: (args) => (
    <NlRadioListGroup aria-label="Tier" appearance="filled" defaultValue="tier-2">
      {tiers.map((tier) => (
        <NlRadioListItem {...args} key={tier.value} {...tier} />
      ))}
    </NlRadioListGroup>
  ),
};

/** Trailing radio; one disabled row; a whole disabled group. */
export const States: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-xl" data-a11y-known-issue="K3">
      <NlRadioListGroup aria-label="Tier, trailing" defaultValue="tier-1">
        {tiers.map((tier) => (
          <NlRadioListItem
            {...args}
            key={tier.value}
            {...tier}
            controlSide="trailing"
            disabled={tier.value === 'tier-3'}
          />
        ))}
      </NlRadioListGroup>
      <NlRadioListGroup aria-label="Tier, disabled" defaultValue="tier-2" disabled>
        {tiers.map((tier) => (
          <NlRadioListItem {...args} key={tier.value} {...tier} />
        ))}
      </NlRadioListGroup>
    </div>
  ),
};

/** Small and compact rows; the last row has no divider. */
export const SizesAndDensity: Story = {
  render: (args) => (
    <NlRadioListGroup aria-label="Tier" defaultValue="tier-1">
      {tiers.map((tier, index) => (
        <NlRadioListItem
          {...args}
          key={tier.value}
          {...tier}
          size="small"
          density="compact"
          divider={index < tiers.length - 1}
        />
      ))}
    </NlRadioListGroup>
  ),
};

/** Body in place of the description; showBody turns it (or the description) off. */
export const Body: Story = {
  render: (args) => (
    <NlRadioListGroup aria-label="Reward" defaultValue="reward-x">
      <NlRadioListItem {...args} value="reward-x" title="Reward X" body={<NlBadge tone="success">Active</NlBadge>} />
      <NlRadioListItem {...args} value="reward-y" title="Reward Y" body={<NlBadge tone="warning">Pending</NlBadge>} />
    </NlRadioListGroup>
  ),
};
