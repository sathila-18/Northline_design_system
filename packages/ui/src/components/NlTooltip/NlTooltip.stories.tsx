import type { Meta, StoryObj } from '@storybook/react-vite';
import { NlButton } from '../NlButton';
import { NlTooltip, type NlTooltipPlacement } from './NlTooltip';

const placements = ['top', 'bottom', 'start', 'end'] as const;

/** Flat controls for Storybook. The props are a union (single line or rich), checked in render. */
interface StoryArgs {
  placement: NlTooltipPlacement;
  rich: boolean;
  content: string;
  heading: string;
  description: string;
}

const meta = {
  title: 'Components/Overlays/Tooltip',
  tags: ['atom-l1'],
  parameters: { layout: 'centered' },
  args: {
    placement: 'top',
    rich: false,
    content: 'Add reward',
    heading: 'Tier 2',
    description: 'Members with 1,000 points or more get the track day voucher.',
  },
  argTypes: {
    placement: { control: 'inline-radio', options: placements },
    rich: { control: 'boolean' },
    content: { control: 'text', if: { arg: 'rich', truthy: false } },
    heading: { control: 'text', if: { arg: 'rich' } },
    description: { control: 'text', if: { arg: 'rich' } },
  },
  render: ({ placement, rich, content, heading, description }) => (
    <div className="nl:p-3xl">
      {rich ? (
        <NlTooltip placement={placement} heading={heading} description={description}>
          <NlButton variant="secondary">Tier 2</NlButton>
        </NlTooltip>
      ) : (
        <NlTooltip placement={placement} content={content}>
          <NlButton variant="tertiary" icon="only-icon" iconName="add">
            Add reward
          </NlButton>
        </NlTooltip>
      )}
    </div>
  ),
} satisfies Meta<StoryArgs>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Hover the button (after a short delay) or Tab to it. Escape hides the tooltip; you can move the pointer into it. */
export const Default: Story = {};

/** Single line on an icon-only button: it repeats the hidden label, as a description. */
export const SingleLine: Story = {
  name: 'Single line',
};

/** Rich: a heading and a description (NlTextBlock, inverse), up to Size-320 wide. */
export const Rich: Story = {
  args: { rich: true },
};

/** The four placements. Start and end follow the text direction. Tab through to see each one. */
export const Placements: Story = {
  render: () => (
    <div className="nl:flex nl:items-center nl:gap-3xl nl:p-3xl">
      {placements.map((placement) => (
        <NlTooltip key={placement} placement={placement} content={`Shown ${placement}`}>
          <NlButton variant="secondary" size="small">
            {placement}
          </NlButton>
        </NlTooltip>
      ))}
    </div>
  ),
};

/** Near the window's top edge: a top tooltip flips below, and keeps Space-M from the edge. */
export const NearTheEdge: Story = {
  name: 'Near the edge',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="nl:flex nl:justify-start">
      <NlTooltip content="Flipped below, away from the edge">
        <NlButton variant="tertiary" icon="only-icon" iconName="info">
          Help
        </NlButton>
      </NlTooltip>
    </div>
  ),
};
