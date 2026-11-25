import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { nlIconNames } from '../../icons';
import { NlBadge } from '../NlBadge';
import { NlListItem } from './NlListItem';

const k3 = (disabled: boolean | undefined) => (disabled ? { 'data-a11y-known-issue': 'K3' } : {});

const meta = {
  title: 'Components/Data display/List item',
  tags: ['molecule'],
  component: NlListItem,
  args: {
    appearance: 'plain',
    size: 'large',
    density: 'default',
    title: 'Member 0042',
    description: 'Tier 2 · joined in March',
    caption: '',
    chevron: true,
    divider: true,
    selected: false,
    disabled: false,
    icon: 'person',
  },
  argTypes: {
    appearance: { control: 'inline-radio', options: ['plain', 'filled'] },
    size: { control: 'inline-radio', options: ['large', 'small'] },
    density: { control: 'inline-radio', options: ['default', 'compact'] },
    title: { control: 'text' },
    description: { control: 'text' },
    caption: { control: 'text' },
    icon: { control: 'select', options: [undefined, ...nlIconNames] },
    avatar: { control: false },
    body: { control: false },
    as: { control: false },
    role: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="nl:w-full nl:bg-primary nl:p-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NlListItem>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One row with every option as a control. The chevron makes it a button; turn it off for a static row. */
export const Default: Story = {
  render: (args) => (
    <div {...k3(args.disabled)}>
      <NlListItem {...args} />
    </div>
  ),
};

/** Leading: none, icon, avatar. Trailing: caption, chevron, both. */
export const Accessories: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col">
      <NlListItem {...args} icon={undefined} title="No leading" chevron={false} />
      <NlListItem {...args} title="Icon and chevron" />
      <NlListItem {...args} icon={undefined} avatar={{ initials: 'M4' }} title="Avatar and caption" caption="Today" />
      <NlListItem {...args} icon="info" title="Caption and chevron" caption="3 rewards" />
    </div>
  ),
};

/** Link, button, static. Static rows have no hover and no focus (OD-98). The page sets aria-current (OD-152). */
export const Elements: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col">
      <NlListItem {...args} title="Link row" href="#member-0042" />
      <NlListItem {...args} title="Current page link" href="#member-0043" selected aria-current="page" />
      <NlListItem {...args} title="Button row" onClick={() => undefined} />
      <NlListItem {...args} title="Static row" chevron={false} caption="Read only" />
    </div>
  ),
};

/** Filled cards, Space-L apart (the list sets the gap). Always with a chevron. */
export const Filled: Story = {
  args: { appearance: 'filled' },
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-l">
      <NlListItem {...args} />
      <NlListItem {...args} title="Member 0043" selected aria-current="true" />
      <div data-a11y-known-issue="K3">
        <NlListItem {...args} title="Member 0044" caption="Expired" disabled />
      </div>
    </div>
  ),
};

/**
 * Accessory alignment (OD-262): centred on the row (default) or at the top, on the title's first line, for rows
 * with several lines of body, such as reward cards.
 */
export const AccessoryAlign: Story = {
  name: 'Accessory align',
  args: { appearance: 'filled', icon: 'event' },
  render: (args) => (
    <div className="nl:grid nl:max-w-720 nl:grid-cols-2 nl:gap-l">
      {(['center', 'title'] as const).map((accessoryAlign) => (
        <NlListItem
          key={accessoryAlign}
          {...args}
          accessoryAlign={accessoryAlign}
          title={accessoryAlign === 'center' ? 'Centred (default)' : 'Top (title)'}
          body={
            <span className="nl:flex nl:flex-col">
              <span>Experiences</span>
              <span>5,100 points</span>
              <span>Live</span>
            </span>
          }
        />
      ))}
    </div>
  ),
};

/** Selected and disabled, as a button, a link and a static row. */
export const States: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col">
      <NlListItem {...args} title="Selected" selected aria-current="true" />
      <div data-a11y-known-issue="K3">
        <NlListItem {...args} title="Disabled button" caption="Locked" disabled />
        <NlListItem {...args} title="Disabled link" href="#member" disabled />
      </div>
    </div>
  ),
};

/** Large and small, in both densities. The last row has no divider. */
export const SizesAndDensity: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col">
      <NlListItem {...args} title="Large, default" />
      <NlListItem {...args} density="compact" title="Large, compact" />
      <NlListItem {...args} size="small" title="Small, default" caption="Today" />
      <NlListItem {...args} size="small" density="compact" title="Small, compact" divider={false} />
    </div>
  ),
};

/** Body in place of the description (OD-155). */
export const Body: Story = {
  render: (args) => <NlListItem {...args} title="Reward X" body={<NlBadge tone="success">Active</NlBadge>} />,
};

function SelectMenuSample() {
  const [value, setValue] = useState('tier-2');
  const options = [
    { id: 'tier-1', title: 'Tier 1' },
    { id: 'tier-2', title: 'Tier 2' },
    { id: 'tier-3', title: 'Tier 3', disabled: true },
  ];
  return (
    <div role="listbox" aria-label="Tier" className="nl:flex nl:flex-col">
      {options.map((option) => (
        <NlListItem
          key={option.id}
          role="option"
          size="small"
          density="compact"
          divider={false}
          title={option.title}
          selected={value === option.id}
          disabled={option.disabled}
          tabIndex={value === option.id ? 0 : -1}
          onClick={() => {
            setValue(option.id);
          }}
        />
      ))}
    </div>
  );
}

/** Rows as options, the way NlMenu (select) holds them: role option, aria-selected, tabIndex -1. */
export const MenuRows: Story = {
  render: () => (
    <div data-a11y-known-issue="K3">
      <SelectMenuSample />
    </div>
  ),
};
