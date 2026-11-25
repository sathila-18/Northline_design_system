import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlHelperText, type NlHelperTextTone } from './NlHelperText';

const tones = ['default', 'success', 'warning', 'error', 'disabled'] as const;

/** Disabled text is under 4.5:1 by design (inactive control, WCAG 1.4.3): known issue K3. */
const knownIssue = (tone: NlHelperTextTone | undefined) =>
  tone === 'disabled' ? { 'data-a11y-known-issue': 'K3' } : {};

const sample: Record<NlHelperTextTone, string> = {
  default: 'Use the member number on the card.',
  success: 'Member number found.',
  warning: 'This member is on Tier 1 until renewal.',
  error: 'Enter a member number.',
  disabled: 'Member number can’t be changed.',
};

const meta = {
  title: 'Components/Forms and inputs/Helper text',
  tags: ['atom-l1'],
  component: NlHelperText,
  args: { tone: 'default', showIcon: true, children: sample.default },
  argTypes: {
    tone: { control: 'inline-radio', options: tones },
    showIcon: { control: 'boolean' },
    children: { control: 'text' },
  },
  render: (args) => <NlHelperText {...args} {...knownIssue(args.tone)} />,
  decorators: [
    (Story) => (
      <div className="nl:w-full nl:max-w-320">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NlHelperText>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One line with every option as a control. */
export const Default: Story = {};

/** The five tones. Error uses the `error` glyph, warning the `warning` glyph (OD-69). */
export const Tones: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-m">
      {tones.map((tone) => (
        <NlHelperText key={tone} tone={tone} {...knownIssue(tone)}>
          {sample[tone]}
        </NlHelperText>
      ))}
    </div>
  ),
};

/** Without the icon. */
export const WithoutIcon: Story = {
  name: 'Without icon',
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-m">
      {tones.map((tone) => (
        <NlHelperText key={tone} tone={tone} showIcon={false} {...knownIssue(tone)}>
          {sample[tone]}
        </NlHelperText>
      ))}
    </div>
  ),
};

/** A long message wraps; the icon stays centred on the first line (OD-70). */
export const Wrapping: Story = {
  render: (args) => (
    <div className="nl:w-full nl:max-w-320">
      <NlHelperText tone={args.tone} {...knownIssue(args.tone)}>
        Enter the member number exactly as it appears on the card, including any leading zeros, so the reward is added
        to the right account.
      </NlHelperText>
    </div>
  ),
};

/**
 * Under a field: the input points at the helper text with aria-describedby, so a screen reader reads it after the
 * field's name. A plain input stands in until NlInputBase is built.
 */
export const UnderAField: Story = {
  name: 'Under a field',
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xs">
      <label htmlFor="story-member" className="nl:text-label-m nl:text-primary">
        Member number
      </label>
      <input
        id="story-member"
        aria-describedby="story-member-help"
        aria-invalid="true"
        defaultValue=""
        className="nl:text-body-m nl:text-primary"
      />
      <NlHelperText id="story-member-help" tone="error">
        Enter a member number.
      </NlHelperText>
    </div>
  ),
};
