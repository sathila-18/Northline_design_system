import type { Meta, StoryObj } from '@storybook/react-vite';
import type { NlCountBadgeTone } from '../NlCountBadge';
import { NlLabel, type NlLabelSize, type NlLabelTone } from './NlLabel';

const sizes = ['medium', 'small'] as const;
const tones = ['tertiary', 'primary', 'secondary', 'action'] as const;
const badgeTones = ['error', 'warning', 'success'] as const;

/** Flat controls for Storybook. The props are a union (badgeLabel is required with a badge), checked in render. */
interface StoryArgs {
  size: NlLabelSize;
  tone: NlLabelTone;
  badge: boolean;
  badgeTone: NlCountBadgeTone;
  badgeLabel: string;
  children: string;
}

const meta = {
  title: 'Components/Forms and inputs/Label',
  tags: ['atom-l1'],
  args: { size: 'medium', tone: 'tertiary', badge: false, badgeTone: 'error', badgeLabel: 'New', children: 'Tier 2' },
  render: ({ badge, badgeTone, badgeLabel, ...rest }) =>
    badge ? <NlLabel {...rest} badge badgeTone={badgeTone} badgeLabel={badgeLabel} /> : <NlLabel {...rest} />,
  argTypes: {
    size: { control: 'inline-radio', options: sizes },
    tone: { control: 'inline-radio', options: tones },
    badge: { control: 'boolean' },
    badgeTone: { control: 'inline-radio', options: badgeTones, if: { arg: 'badge' } },
    badgeLabel: { control: 'text', if: { arg: 'badge' } },
    children: { control: 'text' },
  },
} satisfies Meta<StoryArgs>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One label with every option as a control. */
export const Default: Story = {};

/** Medium (Label M) and small (Label S). */
export const Sizes: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:items-start nl:gap-m">
      {sizes.map((size) => (
        <NlLabel key={size} size={size} tone={args.tone}>
          {args.children}
        </NlLabel>
      ))}
    </div>
  ),
};

/** The four text colours (OD-50). Tertiary is the default. */
export const Tones: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:items-start nl:gap-m">
      {tones.map((tone) => (
        <NlLabel key={tone} size={args.size} tone={tone}>
          {args.children}
        </NlLabel>
      ))}
    </div>
  ),
};

/** With the dot badge in each tone (OD-65). Its meaning is hidden text, read after the label. */
export const WithBadge: Story = {
  name: 'With badge',
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:items-start nl:gap-m">
      {badgeTones.map((badgeTone) => (
        <NlLabel key={badgeTone} size={args.size} tone={args.tone} badge badgeTone={badgeTone} badgeLabel="New">
          Rewards
        </NlLabel>
      ))}
    </div>
  ),
};

/** As a form label (OD-66): it names the input, and clicking it focuses the input. */
export const AsFormLabel: Story = {
  name: 'As a form label',
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:items-start nl:gap-s">
      <NlLabel as="label" htmlFor="story-member-id" size={args.size} tone={args.tone}>
        Member ID
      </NlLabel>
      <input id="story-member-id" defaultValue="Member 0042" className="nl:text-body-m nl:text-primary" />
    </div>
  ),
};
