import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlTableColumnFilter, type NlTableColumnFilterOption } from './NlTableColumnFilter';

const tiers: NlTableColumnFilterOption[] = [
  { value: 'tier-1', label: 'Tier 1' },
  { value: 'tier-2', label: 'Tier 2' },
  { value: 'tier-3', label: 'Tier 3' },
];
const many: NlTableColumnFilterOption[] = Array.from({ length: 9 }, (_, i) => ({
  value: `m${String(i)}`,
  label: `Member ${String(i)}`,
}));

const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

function Harness({
  multiple = true,
  options = tiers,
  initial,
  onApply,
  searchable,
}: {
  multiple?: boolean;
  options?: NlTableColumnFilterOption[];
  initial?: string[] | string;
  onApply?: (value: string[] | string) => void;
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<string[]>(Array.isArray(initial) ? initial : []);
  const [one, setOne] = useState(typeof initial === 'string' ? initial : '');
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button
        ref={ref}
        type="button"
        onClick={() => {
          setOpen(!open);
        }}
      >
        Filter Tier
      </button>
      {multiple ? (
        <NlTableColumnFilter
          open={open}
          onOpenChange={setOpen}
          anchorRef={ref}
          column="Tier"
          options={options}
          searchable={searchable}
          value={list}
          onApply={(v) => {
            setList(v);
            onApply?.(v);
          }}
        />
      ) : (
        <NlTableColumnFilter
          multiple={false}
          open={open}
          onOpenChange={setOpen}
          anchorRef={ref}
          column="Tier"
          options={options}
          searchable={searchable}
          value={one}
          onApply={(v) => {
            setOne(v);
            onApply?.(v);
          }}
        />
      )}
    </>
  );
}

const openIt = async () => {
  await userEvent.click(screen.getByRole('button', { name: 'Filter Tier' }));
  await settle();
};

describe('NlTableColumnFilter', () => {
  it('checkbox: a dialog "Filter Tier" with small rows, dividers but the last, Reset and Apply; starts from applied', async () => {
    render(<Harness initial={['tier-2']} />);
    await openIt();
    const dialog = screen.getByRole('dialog', { name: 'Filter Tier' });
    const boxes = screen.getAllByRole('checkbox');
    expect(boxes).toHaveLength(3);
    expect(screen.getByRole('checkbox', { name: 'Tier 2' })).toBeChecked();
    expect(boxes[0]).toHaveFocus();
    const rows = dialog.querySelectorAll('[data-appearance][data-size="small"]');
    expect(rows).toHaveLength(3);
    expect(rows[0]?.querySelector('[aria-hidden="true"][data-type]')).not.toBeNull();
    expect(rows[2]?.querySelector('[aria-hidden="true"][data-type]')).toBeNull();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
  });

  it('checkbox: changes apply only with Apply (in option order); focus returns to the filter button', async () => {
    const onApply = vi.fn();
    render(<Harness onApply={onApply} />);
    await openIt();
    await userEvent.click(screen.getByRole('checkbox', { name: 'Tier 3' }));
    await userEvent.click(screen.getByRole('checkbox', { name: 'Tier 1' }));
    expect(onApply).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onApply).toHaveBeenCalledWith(['tier-1', 'tier-3']);
    expect(screen.getByRole('button', { name: 'Filter Tier' })).toHaveFocus();
  });

  it('checkbox: Escape closes without applying; reopening starts from the applied values', async () => {
    const onApply = vi.fn();
    render(<Harness initial={['tier-1']} onApply={onApply} />);
    await openIt();
    await userEvent.click(screen.getByRole('checkbox', { name: 'Tier 2' }));
    await userEvent.keyboard('{Escape}');
    expect(onApply).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Filter Tier' })).toHaveFocus();
    await openIt();
    expect(screen.getByRole('checkbox', { name: 'Tier 1' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Tier 2' })).not.toBeChecked();
  });

  it('checkbox: Reset clears the choice; Apply then applies an empty filter', async () => {
    const onApply = vi.fn();
    render(<Harness initial={['tier-1', 'tier-2']} onApply={onApply} />);
    await openIt();
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByRole('checkbox', { name: 'Tier 1' })).not.toBeChecked();
    expect(onApply).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onApply).toHaveBeenCalledWith([]);
  });

  it('radio: "All" first and checked with no filter; focus on the checked radio; choosing applies and closes', async () => {
    const onApply = vi.fn();
    render(<Harness multiple={false} onApply={onApply} />);
    await openIt();
    expect(screen.getByRole('radiogroup', { name: 'Filter Tier' })).toBeInTheDocument();
    const radios = screen.getAllByRole('radio');
    expect(radios[0]).toHaveAccessibleName('All');
    expect(radios[0]).toBeChecked();
    expect(radios[0]).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Apply' })).toBeNull();
    await userEvent.click(screen.getByRole('radio', { name: 'Tier 2' }));
    expect(onApply).toHaveBeenCalledWith('tier-2');
    // Closed menus stay in the page with display none (NlMenu), so check the open state instead.
    expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('data-open', 'false');
    expect(screen.getByRole('button', { name: 'Filter Tier' })).toHaveFocus();
  });

  it('radio: arrow keys apply and keep it open', async () => {
    const onApply = vi.fn();
    render(<Harness multiple={false} initial="tier-1" onApply={onApply} />);
    await openIt();
    expect(screen.getByRole('radio', { name: 'Tier 1' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(onApply).toHaveBeenLastCalledWith('tier-2');
    expect(screen.getByRole('dialog', { name: 'Filter Tier' })).toBeInTheDocument();
  });

  it('search: shown for more than 8 values, focused first; filters; hides "All"; announces "No results"', async () => {
    render(<Harness multiple={false} options={many} />);
    await openIt();
    const search = screen.getByRole('searchbox', { name: 'Search Tier' });
    expect(search).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'All' })).toBeInTheDocument();
    await userEvent.keyboard('member 1');
    expect(screen.queryByRole('radio', { name: 'All' })).toBeNull();
    expect(screen.getAllByRole('radio')).toHaveLength(1);
    await userEvent.keyboard('zzz');
    expect(screen.getByRole('status')).toHaveTextContent('No results');
  });

  it('search: off for 8 values or fewer; searchable forces it on or off', async () => {
    const { unmount } = render(<Harness />);
    await openIt();
    expect(screen.queryByRole('searchbox')).toBeNull();
    unmount();
    render(<Harness searchable />);
    await openIt();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });
});
