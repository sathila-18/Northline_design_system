import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlIcon } from '../../icons';
import { NlAvatar } from '../NlAvatar';
import { NlBadge } from '../NlBadge';
import { NlListItemBase } from './NlListItemBase';

const chevron = <NlIcon name="chevron_right" size={24} tone="inherit" />;
const personIcon = <NlIcon name="person" size={24} tone="inherit" />;
const infoIcon = <NlIcon name="info" size={16} tone="inherit" />;

/**
 * Internal: the list items map onto this base. The samples use plain wrappers; the mapped items add the role, keyboard
 * and ARIA. The extra icon is decorative.
 */
const meta = {
  title: 'Internal/List item base',
  component: NlListItemBase,
  args: {
    appearance: 'plain',
    size: 'large',
    density: 'default',
    title: 'Member 0042',
    description: 'Tier 2 · joined in March',
    topLabel: '',
    divider: true,
    selected: false,
    disabled: false,
    actionable: false,
  },
  argTypes: {
    appearance: { control: 'inline-radio', options: ['plain', 'filled'] },
    size: { control: 'inline-radio', options: ['large', 'small'] },
    density: { control: 'inline-radio', options: ['default', 'compact'] },
    title: { control: 'text' },
    description: { control: 'text' },
    topLabel: { control: 'text' },
    leading: { control: false },
    trailing: { control: false },
    extraIcon: { control: false },
    body: { control: false },
    as: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="nl:w-full nl:bg-primary nl:p-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NlListItemBase>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One row with every option as a control. Top label is hidden until you type one (OD-149). Disabled text: K3. */
export const Default: Story = {
  args: { leading: personIcon, trailing: chevron },
  render: (args) => (
    <div {...(args.disabled ? { 'data-a11y-known-issue': 'K3' } : {})}>
      <NlListItemBase {...args} />
    </div>
  ),
};

/** Plain rows with dividers: default, selected, disabled. */
export const Plain: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col">
      <NlListItemBase {...args} leading={personIcon} trailing={chevron} />
      <NlListItemBase {...args} title="Member 0043" leading={personIcon} trailing={chevron} selected />
      <div data-a11y-known-issue="K3">
        <NlListItemBase {...args} title="Member 0044" leading={personIcon} trailing={chevron} disabled />
      </div>
    </div>
  ),
};

/** Filled cards, Space-L apart (the list sets the gap): default, selected, disabled. */
export const Filled: Story = {
  args: { appearance: 'filled' },
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-l">
      <NlListItemBase {...args} leading={personIcon} trailing={chevron} />
      <NlListItemBase {...args} title="Member 0043" leading={personIcon} trailing={chevron} selected />
      <div data-a11y-known-issue="K3">
        <NlListItemBase {...args} title="Member 0044" leading={personIcon} trailing={chevron} disabled />
      </div>
    </div>
  ),
};

/** Actionable rows (rendered as buttons here): hover and press for the colours, Tab for the focus ring. */
export const Actionable: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-l">
      <NlListItemBase {...args} as="button" type="button" actionable leading={personIcon} trailing={chevron} />
      <NlListItemBase
        {...args}
        as="button"
        type="button"
        title="Member 0043"
        actionable
        selected
        aria-pressed="true"
        leading={personIcon}
        trailing={chevron}
      />
      <NlListItemBase
        {...args}
        as="button"
        type="button"
        appearance="filled"
        title="Member 0045"
        actionable
        leading={personIcon}
        trailing={chevron}
      />
      <NlListItemBase
        {...args}
        as="button"
        type="button"
        appearance="filled"
        title="Member 0046"
        actionable
        selected
        aria-pressed="true"
        leading={personIcon}
        trailing={chevron}
      />
    </div>
  ),
};

/** Large and small, in both densities. */
export const SizesAndDensity: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col">
      <NlListItemBase {...args} size="large" title="Large, default" leading={personIcon} trailing={chevron} />
      <NlListItemBase
        {...args}
        size="large"
        density="compact"
        title="Large, compact"
        leading={personIcon}
        trailing={chevron}
      />
      <NlListItemBase {...args} size="small" title="Small, default" leading={personIcon} trailing={chevron} />
      <NlListItemBase
        {...args}
        size="small"
        density="compact"
        title="Small, compact"
        leading={personIcon}
        trailing={chevron}
      />
    </div>
  ),
};

/** Top label, extra icon (Space-M from the title) and a body slot in place of the description. */
export const Slots: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col">
      <NlListItemBase {...args} topLabel="Top label" leading={personIcon} trailing={chevron} />
      <NlListItemBase {...args} title="Track day voucher" extraIcon={infoIcon} leading={personIcon} />
      <NlListItemBase
        {...args}
        title="Reward X"
        body={<NlBadge tone="success">Active</NlBadge>}
        leading={<NlAvatar size="medium" initials="M4" />}
        trailing={<NlBadge tone="neutral">Tier 2</NlBadge>}
      />
      <NlListItemBase {...args} title="No accessories" divider={false} />
    </div>
  ),
};
