import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { NlTableHeaderCell, type NlTableHeaderCellFilter, type NlTableHeaderCellSort } from './NlTableHeaderCell';

/** Grey headers: text-tertiary on bg-tertiary is 4.46:1 in Dark (known issue K8, accepted). */
const k8 = (grey: boolean) => (grey ? { 'data-a11y-known-issue': 'K8' } : {});

function Row({ children, grey = false }: { children: ReactNode; grey?: boolean }) {
  return (
    <table className="nl:w-full nl:border-collapse" {...k8(grey)}>
      <thead>
        <tr>{children}</tr>
      </thead>
    </table>
  );
}

const meta = {
  title: 'Components/Molecules/Table header cell',
  component: NlTableHeaderCell,
  args: {
    children: 'Points',
    appearance: 'plain',
    narrow: false,
    sortable: true,
    sort: 'none',
    hideTitle: false,
  },
  argTypes: {
    children: { control: 'text' },
    appearance: { control: 'inline-radio', options: ['plain', 'grey'] },
    sort: { control: 'inline-radio', options: ['none', 'ascending', 'descending'] },
    filter: { control: 'select', options: [undefined, 'available', 'open', 'applied'] },
    selectAll: { control: false },
    filterRef: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="nl:w-full nl:bg-primary nl:p-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NlTableHeaderCell>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One header cell with every option as a control, inside a table row. */
export const Default: Story = {
  render: (args) => (
    <Row grey={args.appearance === 'grey'}>
      <NlTableHeaderCell {...args} />
    </Row>
  ),
};

/** Plain and grey rows; plain titles, sortable titles and filters. Grey in Dark: K8. */
export const Appearances: Story = {
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      {(['plain', 'grey'] as const).map((appearance) => (
        <Row key={appearance} grey={appearance === 'grey'}>
          <NlTableHeaderCell appearance={appearance}>Member</NlTableHeaderCell>
          <NlTableHeaderCell appearance={appearance} sortable sort="descending">
            Points
          </NlTableHeaderCell>
          <NlTableHeaderCell appearance={appearance} filter="available">
            Tier
          </NlTableHeaderCell>
        </Row>
      ))}
    </div>
  ),
};

/** Click a title to sort: none → ascending → descending → none, one column at a time. */
export const Sorting: Story = {
  render: function SortingStory() {
    const [sort, setSort] = useState<{ column: string; order: NlTableHeaderCellSort }>({
      column: 'Points',
      order: 'ascending',
    });
    return (
      <Row>
        {['Member', 'Points', 'Joined'].map((column) => (
          <NlTableHeaderCell
            key={column}
            sortable
            sort={sort.column === column ? sort.order : 'none'}
            onSortChange={(order) => {
              setSort({ column, order });
            }}
          >
            {column}
          </NlTableHeaderCell>
        ))}
      </Row>
    );
  },
};

/** Filter states: available, open, applied (named "Filter Tier, applied", OD-185). Click to toggle open. */
export const Filters: Story = {
  render: function FiltersStory() {
    const [state, setState] = useState<NlTableHeaderCellFilter>('available');
    return (
      <Row>
        <NlTableHeaderCell
          filter={state}
          onFilterClick={() => {
            setState(state === 'open' ? 'available' : 'open');
          }}
        >
          Tier
        </NlTableHeaderCell>
        <NlTableHeaderCell filter="open">Status</NlTableHeaderCell>
        <NlTableHeaderCell filter="applied">Region</NlTableHeaderCell>
        <NlTableHeaderCell sortable sort="ascending" filter="applied">
          Points
        </NlTableHeaderCell>
      </Row>
    );
  },
};

/** A narrow select-all column (title hidden), and a narrow row-action column. */
export const NarrowAndSelectAll: Story = {
  render: function SelectStory() {
    const [checked, setChecked] = useState(false);
    return (
      <Row>
        <NlTableHeaderCell
          narrow
          hideTitle
          selectAll={{
            checked,
            indeterminate: !checked,
            onChange: (event) => {
              setChecked(event.currentTarget.checked);
            },
          }}
        >
          Select
        </NlTableHeaderCell>
        <NlTableHeaderCell sortable>Member</NlTableHeaderCell>
        <NlTableHeaderCell narrow hideTitle>
          Actions
        </NlTableHeaderCell>
      </Row>
    );
  },
};
