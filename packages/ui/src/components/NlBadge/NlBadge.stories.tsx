import type { Meta, StoryObj } from '@storybook/react-vite';
import { nlIconNames } from '../../icons';
import { NlBadge, type NlBadgeTone } from './NlBadge';

const statusTones = ['primary', 'secondary', 'success', 'error', 'info', 'warning', 'neutral', 'disabled'] as const;
const tierTones = ['bronze', 'silver', 'gold', 'platinum'] as const;
const tones = [...statusTones, ...tierTones];
const labels: Record<NlBadgeTone, string> = {
  primary: 'Tier 2',
  secondary: 'Draft',
  success: 'Active',
  error: 'Expired',
  info: 'New',
  warning: 'Pending',
  neutral: 'Member',
  disabled: 'Inactive',
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
};

const meta = {
  title: 'Components/Atoms L1/Badge',
  component: NlBadge,
  args: { tone: 'neutral', size: 'small', children: 'Member' },
  argTypes: {
    tone: { control: 'select', options: tones },
    size: { control: 'inline-radio', options: ['small', 'large'] },
    children: { control: 'text' },
    // Icons are off by default. Pick a name to show one.
    leadingIcon: { control: 'select', options: [undefined, ...nlIconNames] },
    trailingIcon: { control: 'select', options: [undefined, ...nlIconNames] },
  },
} satisfies Meta<typeof NlBadge>;
export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Disabled text is under 4.5:1 by design (known issue K4, accepted), so its samples are marked for the a11y check.
 */
const knownIssue = (tone: NlBadgeTone) => (tone === 'disabled' ? { 'data-a11y-known-issue': 'K4' } : {});

/** One badge with every option as a control. No icons by default. */
export const Default: Story = {};

export const Primary: Story = { args: { tone: 'primary', children: labels.primary } };
export const Secondary: Story = { args: { tone: 'secondary', children: labels.secondary } };
export const Success: Story = { args: { tone: 'success', children: labels.success } };
export const Error: Story = { args: { tone: 'error', children: labels.error } };
export const Info: Story = { args: { tone: 'info', children: labels.info } };
export const Warning: Story = { args: { tone: 'warning', children: labels.warning } };
export const Neutral: Story = { args: { tone: 'neutral', children: labels.neutral } };
export const Disabled: Story = {
  args: { tone: 'disabled', children: labels.disabled },
  render: (args) => (
    <span data-a11y-known-issue="K4">
      <NlBadge {...args} />
    </span>
  ),
};

/** All eight status tones in both sizes. */
export const AllTones: Story = {
  name: 'All tones',
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-m">
      {(['small', 'large'] as const).map((size) => (
        <div key={size} className="nl:flex nl:flex-wrap nl:items-center nl:gap-m">
          {statusTones.map((tone) => (
            <span key={tone} {...knownIssue(tone)}>
              <NlBadge {...args} size={size} tone={tone}>
                {labels[tone]}
              </NlBadge>
            </span>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Icons switched on, every status and tier tone: each takes the fg-* colour matching its tone's text. */
export const WithIcons: Story = {
  name: 'With icons',
  args: { leadingIcon: 'check_circle' },
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-m">
      {(['small', 'large'] as const).map((size) => (
        <div key={size} className="nl:flex nl:flex-wrap nl:items-center nl:gap-m">
          {tones.map((tone) => (
            <span key={tone} {...knownIssue(tone)}>
              <NlBadge {...args} size={size} tone={tone}>
                {labels[tone]}
              </NlBadge>
            </span>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** A long label stays on one line and widens the badge. */
export const LongLabel: Story = {
  name: 'Long label',
  args: { tone: 'info', children: 'Track day voucher, valid for one session' },
};

/**
 * Member tier tones (D20): identity, not status. A light 135° gradient with the tier's inside border and text, the
 * same in Light and Dark and in every brand. Both sizes.
 */
export const TierTones: Story = {
  name: 'Tier tones',
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-m">
      {(['small', 'large'] as const).map((size) => (
        <div key={size} className="nl:flex nl:flex-wrap nl:items-center nl:gap-m">
          {tierTones.map((tone) => (
            <NlBadge key={tone} {...args} size={size} tone={tone}>
              {labels[tone]}
            </NlBadge>
          ))}
        </div>
      ))}
    </div>
  ),
};
