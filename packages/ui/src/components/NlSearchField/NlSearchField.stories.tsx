import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NlSearchField } from './NlSearchField';

/** Disabled text is under 4.5:1 by design (inactive control, WCAG 1.4.3): known issue K3. */
const knownIssue = (disabled: boolean | undefined) => (disabled ? { 'data-a11y-known-issue': 'K3' } : {});

const meta = {
  title: 'Components/Forms and inputs/Search field',
  tags: ['molecule'],
  component: NlSearchField,
  args: {
    label: 'Search',
    placeholder: 'Search',
    size: 'large',
    disabled: false,
  },
  argTypes: {
    label: { control: 'text', description: 'Accessible name, never shown' },
    placeholder: { control: 'text' },
    size: { control: 'inline-radio', options: ['large', 'small'] },
    disabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="nl:w-full nl:max-w-320">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <div {...knownIssue(args.disabled)}>
      <NlSearchField {...args} />
    </div>
  ),
} satisfies Meta<typeof NlSearchField>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Every option as a control. Type to see the clear button; Escape clears too. */
export const Default: Story = {};

/** Empty (placeholder) and complete (with the clear button). */
export const States: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <NlSearchField />
      <NlSearchField defaultValue="Member 0042" />
    </div>
  ),
};

/** Large (48) and small (40). The clear button is the 32 icon-only button in both (OD-31). */
export const Sizes: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      <NlSearchField defaultValue="Tier 2" />
      <NlSearchField defaultValue="Tier 2" size="small" />
    </div>
  ),
};

/** Disabled: the clear button is disabled too (OD-82). */
export const Disabled: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl" data-a11y-known-issue="K3">
      <NlSearchField disabled />
      <NlSearchField disabled defaultValue="Member 0042" />
    </div>
  ),
};

/** Controlled, with Enter to search and a search landmark around it, as a page would place it. */
export const Controlled: Story = {
  render: function Render() {
    const [query, setQuery] = useState('');
    const [searched, setSearched] = useState('');
    return (
      <search className="nl:flex nl:flex-col nl:gap-m">
        <NlSearchField
          label="Search members"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          onSearch={setSearched}
          onClear={() => {
            setQuery('');
            setSearched('');
          }}
        />
        <p className="nl:text-body-m nl:text-secondary">Searched: {searched || '(nothing)'}</p>
      </search>
    );
  },
};
