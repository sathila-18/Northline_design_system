import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlSegmentedButton } from './NlSegmentedButton';

const period = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
] as [{ value: string; label: string }, { value: string; label: string }, { value: string; label: string }];

describe('NlSegmentedButton', () => {
  it('is a named radiogroup, medium, first option selected by default, filling its container', () => {
    render(<NlSegmentedButton aria-label="Period" options={period} />);
    const group = screen.getByRole('radiogroup', { name: 'Period' });
    expect(group).toHaveAttribute('data-size', 'medium');
    expect(group).toHaveClass('nl:bg-tertiary', 'nl:h-48', 'nl:p-xs', 'nl:gap-l', 'nl:rounded-s', 'nl:w-full');
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
    expect(radios[0]).toBeChecked();
    expect(new Set(radios.map((radio) => radio.getAttribute('name'))).size).toBe(1);
    expect(radios[0]?.closest('label')).toHaveClass('nl:flex-1', 'nl:min-w-0');
  });

  it('a click selects (uncontrolled) and calls onValueChange', async () => {
    const onValueChange = vi.fn();
    render(
      <NlSegmentedButton aria-label="Period" options={period} defaultValue="week" onValueChange={onValueChange} />,
    );
    expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked();
    await userEvent.click(screen.getByRole('radio', { name: 'Month' }));
    expect(screen.getByRole('radio', { name: 'Month' })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('month');
  });

  it('one tab stop; arrow keys move and select; Home and End go to the ends', async () => {
    function Controlled() {
      const [value, setValue] = useState('week');
      return <NlSegmentedButton aria-label="Period" options={period} value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);
    await userEvent.tab();
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Month' })).toBeChecked();
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('radio', { name: 'Day' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('radio', { name: 'Month' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Month' })).toHaveFocus();
    await userEvent.tab();
    expect(document.body).toHaveFocus();
  });

  it.each([
    ['small', ['nl:h-40', 'nl:p-xs', 'nl:gap-xs', 'nl:rounded-s']],
    ['xsmall', ['nl:h-24', 'nl:p-none', 'nl:gap-none', 'nl:rounded-s']],
  ] as const)('size %s', (size, classes) => {
    render(<NlSegmentedButton aria-label="Period" options={period} size={size} />);
    expect(screen.getByRole('radiogroup')).toHaveClass(...classes);
    expect(screen.getAllByRole('radio')[0]?.closest('label')).toHaveAttribute('data-size', size);
  });

  it('icon only: hugs, every segment named by its label and described by its tooltip', () => {
    render(
      <NlSegmentedButton
        aria-label="View"
        iconOnly
        options={[
          { value: 'list', label: 'List view', icon: 'menu' },
          { value: 'panel', label: 'Panel view', icon: 'dock_to_right' },
        ]}
      />,
    );
    expect(screen.getByRole('radiogroup')).toHaveClass('nl:w-fit');
    const list = screen.getByRole('radio', { name: 'List view' });
    expect(list).toHaveAccessibleDescription('List view');
    expect(list.closest('label')).toHaveAttribute('data-icon-only', 'true');
    expect(screen.getAllByRole('tooltip', { hidden: true })).toHaveLength(2);
  });

  it('disabled: every segment disabled', () => {
    render(<NlSegmentedButton aria-label="Period" options={period} disabled />);
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled();
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-disabled', 'true');
  });

  it('passes ref and native attributes and appends className last', () => {
    const ref = createRef<HTMLDivElement>();
    render(<NlSegmentedButton aria-label="Period" options={period} ref={ref} id="probe" className="nl:mt-m" />);
    const group = screen.getByRole('radiogroup');
    expect(ref.current).toBe(group);
    expect(group).toHaveAttribute('id', 'probe');
    expect(group.className.split(' ').at(-1)).toBe('nl:mt-m');
  });
});
