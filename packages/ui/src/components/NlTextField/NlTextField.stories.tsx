import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { nlIconNames } from '../../icons';
import { NlTextField } from './NlTextField';

/** Disabled text is under 4.5:1 by design (inactive control, WCAG 1.4.3): known issue K3. */
const knownIssue = (disabled: boolean | undefined) => (disabled ? { 'data-a11y-known-issue': 'K3' } : {});

const meta = {
  title: 'Components/Molecules/Text field',
  component: NlTextField,
  args: {
    label: 'Member name',
    size: 'large',
    inputType: 'text',
    helperText: '',
    error: false,
    disabled: false,
    required: false,
  },
  argTypes: {
    label: { control: 'text' },
    size: { control: 'inline-radio', options: ['large', 'small'] },
    inputType: { control: 'inline-radio', options: ['text', 'email', 'number', 'tel', 'url'] },
    trailingIcon: { control: 'select', options: [undefined, ...nlIconNames] },
    helperText: { control: 'text' },
    prefix: { control: 'text' },
    suffix: { control: 'text' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="nl:w-full nl:max-w-320 nl:pt-m">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <div {...knownIssue(args.disabled)}>
      <NlTextField {...args} />
    </div>
  ),
} satisfies Meta<typeof NlTextField>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Every option as a control. */
export const Default: Story = {};

/** The input types: each brings its own mobile keyboard and browser checks. */
export const InputTypes: Story = {
  name: 'Input types',
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <NlTextField label="Member name" />
      <NlTextField label="Email" inputType="email" />
      <NlTextField label="Points" inputType="number" suffix="pts" />
      <NlTextField label="Phone" inputType="tel" />
      <NlTextField label="Website" inputType="url" />
    </div>
  ),
};

/** A decorative trailing icon, any registry icon (OD-79). */
export const WithTrailingIcon: Story = {
  name: 'With trailing icon',
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <NlTextField label="Member number" trailingIcon="info" helperText="On the member card." />
      <NlTextField label="Member number" size="small" trailingIcon="person" />
    </div>
  ),
};

/** Error with its helper text. */
export const WithError: Story = {
  name: 'Error',
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <NlTextField label="Email" inputType="email" error helperText="Enter an email address." />
      <NlTextField label="Email" inputType="email" error defaultValue="member@" helperText="Add the part after @." />
    </div>
  ),
};

/** Large (48) and small (40). */
export const Sizes: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <NlTextField label="Member name" defaultValue="Member 0042" />
      <NlTextField label="Member name" defaultValue="Member 0042" size="small" />
    </div>
  ),
};

/** Controlled: the value lives in the parent. */
export const Controlled: Story = {
  render: function Render() {
    const [name, setName] = useState('Member 0042');
    return (
      <div className="nl:flex nl:flex-col nl:gap-m">
        <NlTextField
          label="Member name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <p className="nl:text-body-m nl:text-secondary">Value: {name || '(empty)'}</p>
      </div>
    );
  },
};
