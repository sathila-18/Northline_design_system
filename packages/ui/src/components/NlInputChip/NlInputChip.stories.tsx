import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { NlIcon } from '../../icons';
import { NlInputChip } from './NlInputChip';

const sizes = ['xsmall', 'small', 'large'] as const;

const meta = {
  title: 'Components/Atoms L1/Input chip',
  component: NlInputChip,
  args: { size: 'small', disabled: false, children: 'Tier 2' },
  argTypes: {
    size: { control: 'inline-radio', options: sizes },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
    removeLabel: { control: 'text' },
    leading: { control: false },
    onRemove: { action: 'remove' },
  },
} satisfies Meta<typeof NlInputChip>;
export default meta;

type Story = StoryObj<typeof meta>;

/** A disabled chip's label is under 4.5:1 by design (inactive control, WCAG 1.4.3): known issue K5. */
const knownIssue = (disabled: boolean | undefined) => (disabled ? { 'data-a11y-known-issue': 'K5' } : {});

/** One chip with every option as a control. Tab to the remove button; Enter, Space, Backspace or Delete removes. */
export const Default: Story = {
  render: (args) => <NlInputChip {...args} {...knownIssue(args.disabled)} />,
};

/** The three sizes. The remove button's 24 × 24 target doesn't change the chip's size. */
export const Sizes: Story = {
  render: () => (
    <div className="nl:flex nl:items-center nl:gap-m">
      {sizes.map((size) => (
        <NlInputChip key={size} size={size}>
          Tier 2
        </NlInputChip>
      ))}
    </div>
  ),
};

/** With a leading icon, which takes fg-secondary. */
export const WithLeading: Story = {
  name: 'With leading',
  render: (args) => (
    <NlInputChip
      size={args.size}
      leading={<NlIcon name="person" size={args.size === 'large' ? 20 : 16} tone="inherit" />}
    >
      Member 0042
    </NlInputChip>
  ),
};

/** Disabled: greyed, no border or shadow, and no remove button. */
export const Disabled: Story = {
  render: (args) => (
    <div className="nl:flex nl:items-center nl:gap-m">
      <NlInputChip size={args.size}>Tier 2</NlInputChip>
      <NlInputChip size={args.size} disabled {...knownIssue(true)}>
        Tier 2
      </NlInputChip>
    </div>
  ),
};

/**
 * A list of chosen values, as NlMultiSelect will show them. Removing one moves focus to the next chip's remove
 * button (or the previous one at the end), which is the caller's job.
 */
export const RemovableList: Story = {
  name: 'Removable list',
  render: function Render(args) {
    const [values, setValues] = useState(['Tier 1', 'Tier 2', 'Tier 3', 'Track day voucher']);
    const listRef = useRef<HTMLDivElement>(null);
    const remove = (index: number) => {
      setValues((current) => current.filter((_, i) => i !== index));
      // After React renders, focus the remove button that now sits at this index (or the last one).
      requestAnimationFrame(() => {
        const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[data-slot="remove"]');
        if (!buttons || buttons.length === 0) return;
        buttons[Math.min(index, buttons.length - 1)]?.focus();
      });
    };
    return (
      <div className="nl:flex nl:flex-col nl:gap-m">
        <div ref={listRef} className="nl:flex nl:flex-wrap nl:items-center nl:gap-s">
          {values.map((value, index) => (
            <NlInputChip
              key={value}
              size={args.size}
              onRemove={() => {
                remove(index);
              }}
            >
              {value}
            </NlInputChip>
          ))}
        </div>
        {values.length === 0 && <p className="nl:text-body-m nl:text-secondary">Nothing chosen</p>}
      </div>
    );
  },
};
