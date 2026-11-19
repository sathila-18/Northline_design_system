import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NlPasswordField } from './NlPasswordField';

/** Disabled text is under 4.5:1 by design (inactive control, WCAG 1.4.3): known issue K3. */
const knownIssue = (disabled: boolean | undefined) => (disabled ? { 'data-a11y-known-issue': 'K3' } : {});

const meta = {
  title: 'Components/Molecules/Password field',
  component: NlPasswordField,
  args: {
    label: 'Password',
    size: 'large',
    helperText: '',
    defaultShowPassword: false,
    error: false,
    disabled: false,
    required: false,
  },
  argTypes: {
    label: { control: 'text' },
    size: { control: 'inline-radio', options: ['large', 'small'] },
    helperText: { control: 'text' },
    defaultShowPassword: { control: 'boolean' },
    autoComplete: { control: 'inline-radio', options: ['current-password', 'new-password'] },
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
      <NlPasswordField key={String(args.defaultShowPassword)} {...args} />
    </div>
  ),
} satisfies Meta<typeof NlPasswordField>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Every option as a control. */
export const Default: Story = {};

/** Hidden (default) and shown. */
export const ShowPassword: Story = {
  name: 'Show password',
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <NlPasswordField label="Password" defaultValue="track-day-42" />
      <NlPasswordField label="Password" defaultValue="track-day-42" defaultShowPassword />
    </div>
  ),
};

/** Large (48) and small (40). The button is the 32 icon-only button in both (OD-80, OD-31). */
export const Sizes: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <NlPasswordField label="Password" defaultValue="track-day-42" />
      <NlPasswordField label="Password" defaultValue="track-day-42" size="small" />
    </div>
  ),
};

/** Error with its helper text. */
export const WithError: Story = {
  name: 'Error',
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <NlPasswordField label="Password" error helperText="Enter your password." />
      <NlPasswordField
        label="New password"
        autoComplete="new-password"
        error
        defaultValue="short"
        helperText="Use at least 12 characters."
      />
    </div>
  ),
};

/** Disabled: the button is disabled too. */
export const Disabled: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl" data-a11y-known-issue="K3">
      <NlPasswordField label="Password" disabled />
      <NlPasswordField label="Password" disabled defaultValue="track-day-42" helperText="Locked by an admin." />
    </div>
  ),
};

/** Controlled: the parent owns the value and whether it's shown. */
export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState('track-day-42');
    const [shown, setShown] = useState(false);
    return (
      <div className="nl:flex nl:flex-col nl:gap-m">
        <NlPasswordField
          label="New password"
          autoComplete="new-password"
          helperText="Use at least 12 characters."
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
          showPassword={shown}
          onShowPasswordChange={setShown}
        />
        <p className="nl:text-body-m nl:text-secondary">Shown: {shown ? 'yes' : 'no'}</p>
      </div>
    );
  },
};
