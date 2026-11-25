import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { NlTableHeaderCell } from '../NlTableHeaderCell';
import type { NlCalendarRange } from '../NlCalendar';
import { NlTableColumnFilter, type NlTableColumnFilterOption } from './NlTableColumnFilter';

const tiers: NlTableColumnFilterOption[] = [
  { value: 'tier-1', label: 'Tier 1' },
  { value: 'tier-2', label: 'Tier 2' },
  { value: 'tier-3', label: 'Tier 3' },
  { value: 'tier-4', label: 'Tier 4' },
];

const members: NlTableColumnFilterOption[] = Array.from({ length: 12 }, (_, index) => {
  const id = String(index + 1).padStart(4, '0');
  return { value: `member-${id}`, label: `Member ${id}` };
});

/** A table header with one filterable column, wired as a table would: the header cell's button opens the filter. */
function Demo({
  column,
  options,
  multiple = true,
  searchable,
  initial,
}: {
  column: string;
  options: NlTableColumnFilterOption[];
  multiple?: boolean;
  searchable?: boolean;
  initial?: string[] | string;
}) {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<string[]>(Array.isArray(initial) ? initial : []);
  const [one, setOne] = useState(typeof initial === 'string' ? initial : '');
  const filterRef = useRef<HTMLButtonElement>(null);
  const applied = multiple ? list.length > 0 : one !== '';
  return (
    <div className="nl:w-full nl:max-w-320 nl:pb-12xl">
      <p className="nl:mb-xl nl:text-body-m nl:text-secondary">
        Applied: {multiple ? list.join(', ') || 'none' : one || 'all'}
      </p>
      <table className="nl:w-full nl:border-collapse">
        <thead>
          <tr>
            <NlTableHeaderCell
              filter={open ? 'open' : applied ? 'applied' : 'available'}
              filterRef={filterRef}
              onFilterClick={() => {
                setOpen(!open);
              }}
            >
              {column}
            </NlTableHeaderCell>
          </tr>
        </thead>
      </table>
      {multiple ? (
        <NlTableColumnFilter
          open={open}
          onOpenChange={setOpen}
          anchorRef={filterRef}
          column={column}
          options={options}
          searchable={searchable}
          value={list}
          onApply={setList}
        />
      ) : (
        <NlTableColumnFilter
          multiple={false}
          open={open}
          onOpenChange={setOpen}
          anchorRef={filterRef}
          column={column}
          options={options}
          searchable={searchable}
          value={one}
          onApply={setOne}
        />
      )}
    </div>
  );
}

const meta = {
  title: 'Components/Data display/Table column filter',
  tags: ['organism'],
  component: NlTableColumnFilter,
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof NlTableColumnFilter>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Checkboxes: choices apply with Apply; Reset clears them; Escape or a click outside closes without applying. */
export const Checkbox: Story = {
  args: {
    open: false,
    onOpenChange: () => undefined,
    anchorRef: { current: null },
    column: '',
    options: [],
    value: [],
    onApply: () => undefined,
  },
  render: () => <Demo column="Tier" options={tiers} initial={['tier-2']} />,
};

/** Radios: "All" first; choosing applies and closes; arrow keys apply and keep it open. */
export const Radio: Story = {
  args: Checkbox.args,
  render: () => <Demo column="Tier" options={tiers} multiple={false} />,
};

/** More than 8 values: a search header; "All" hides while searching; type "zzz" for "No results". */
export const WithSearch: Story = {
  args: Checkbox.args,
  render: () => <Demo column="Member" options={members} />,
};

/** Radios with search. */
export const RadioWithSearch: Story = {
  args: Checkbox.args,
  render: () => <Demo column="Member" options={members} multiple={false} initial="member-0003" />,
};

function DateRangeDemo() {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<NlCalendarRange>({ start: '2026-03-02', end: '2026-03-13' });
  const filterRef = useRef<HTMLButtonElement>(null);
  const applied = range.start !== null || range.end !== null;
  return (
    <div className="nl:w-full nl:max-w-320 nl:pb-12xl">
      <p className="nl:mb-xl nl:text-body-m nl:text-secondary">
        Applied: {applied ? `${range.start ?? '…'} to ${range.end ?? '…'}` : 'none'}
      </p>
      <table className="nl:w-full nl:border-collapse">
        <thead>
          <tr>
            <NlTableHeaderCell
              filter={open ? 'open' : applied ? 'applied' : 'available'}
              filterRef={filterRef}
              onFilterClick={() => {
                setOpen(!open);
              }}
            >
              Join date
            </NlTableHeaderCell>
          </tr>
        </thead>
      </table>
      <NlTableColumnFilter
        type="date-range"
        open={open}
        onOpenChange={setOpen}
        anchorRef={filterRef}
        column="Join date"
        value={range}
        onApply={setRange}
      />
    </div>
  );
}

/** Date range (OD-241): NlCalendar in range mode, two months; Reset clears, Apply applies the start and end. */
export const DateRange: Story = {
  args: {
    open: false,
    onOpenChange: () => undefined,
    anchorRef: { current: null },
    column: '',
    options: [],
    value: [],
    onApply: () => undefined,
  },
  render: () => <DateRangeDemo />,
};
