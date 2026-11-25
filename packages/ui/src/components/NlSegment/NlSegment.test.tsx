import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlSegment } from './NlSegment';

const rootOf = (radio: HTMLElement) => {
  const root = radio.closest('label');
  if (!root) throw new Error('NlSegment input has no root');
  return root;
};

/** A minimal group: three named radios, as NlSegmentedButton will render them. */
function Group({ onChange, disabledValue }: { onChange?: (value: string) => void; disabledValue?: string }) {
  const [value, setValue] = useState('week');
  return (
    <div role="radiogroup" aria-label="Period">
      {['day', 'week', 'month'].map((option) => (
        <NlSegment
          key={option}
          name="period"
          value={option}
          selected={value === option}
          disabled={option === disabledValue}
          onChange={(event) => {
            setValue(event.target.value);
            onChange?.(event.target.value);
          }}
        >
          {option}
        </NlSegment>
      ))}
    </div>
  );
}

describe('NlSegment', () => {
  it('is a native radio named by its label, checked from selected', () => {
    const { rerender } = render(<NlSegment selected={false}>Day</NlSegment>);
    const radio = screen.getByRole('radio', { name: 'Day' });
    expect(radio).toHaveAttribute('type', 'radio');
    expect(radio).not.toBeChecked();
    expect(rootOf(radio)).toHaveAttribute('data-size', 'medium');
    rerender(<NlSegment selected>Day</NlSegment>);
    expect(screen.getByRole('radio', { name: 'Day' })).toBeChecked();
  });

  it('in a group: a click selects, arrow keys move and select, disabled is skipped', async () => {
    const onChange = vi.fn();
    render(<Group onChange={onChange} disabledValue="month" />);
    await userEvent.click(screen.getByRole('radio', { name: 'day' }));
    expect(screen.getByRole('radio', { name: 'day' })).toBeChecked();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'week' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'week' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'month' })).toBeDisabled();
    expect(onChange.mock.calls).toEqual([['day'], ['week']]);
  });

  it.each([
    [
      'medium',
      ['nl:h-40', 'nl:py-m', 'nl:px-3xl', 'nl:gap-m', 'nl:rounded-xs', 'nl:text-button-m'],
      ['nl:size-36', 'nl:p-m', 'nl:rounded-xs'],
      '20',
    ],
    [
      'small',
      ['nl:h-32', 'nl:py-xs', 'nl:px-l', 'nl:gap-xs', 'nl:rounded-xs', 'nl:text-button-s'],
      ['nl:p-xs', 'nl:rounded-xs'],
      '20',
    ],
    [
      'xsmall',
      ['nl:h-24', 'nl:py-none', 'nl:px-m', 'nl:gap-xs', 'nl:rounded-s', 'nl:text-button-s'],
      ['nl:size-24', 'nl:p-xs'],
      '16',
    ],
  ] as const)('size %s', (size, labelled, square, iconSize) => {
    const { rerender } = render(
      <NlSegment selected={false} size={size} icon="calendar_today">
        Day
      </NlSegment>,
    );
    let root = rootOf(screen.getByRole('radio'));
    expect(root).toHaveClass(...labelled);
    expect(root.querySelector('[data-icon]')).toHaveAttribute('data-size', iconSize);
    rerender(
      <NlSegment selected={false} size={size} iconOnly icon="calendar_today">
        Day
      </NlSegment>,
    );
    root = rootOf(screen.getByRole('radio', { name: 'Day' }));
    expect(root).toHaveClass(...square);
    expect(root).not.toHaveClass(labelled[0]);
    expect(screen.getByText('Day')).toHaveClass('nl:sr-only');
  });

  it('selected: its colours and a filled icon', () => {
    render(
      <NlSegment selected icon="calendar_today">
        Day
      </NlSegment>,
    );
    const root = rootOf(screen.getByRole('radio'));
    expect(root).toHaveAttribute('data-selected', 'true');
    expect(root).toHaveClass(
      'nl:bg-primary',
      'nl:text-primary',
      'nl:hover:bg-secondary',
      'nl:active:bg-tertiary',
      'nl:has-disabled:bg-disabled',
      'nl:has-disabled:text-disabled-on-bg',
    );
    expect(root.querySelector('[data-slot="icon"]')).toHaveClass(
      'nl:text-fg-secondary',
      'nl:group-has-disabled/segment:text-fg-disabled-on-bg',
    );
    expect(root.querySelector('[data-icon]')).toHaveClass('nl:icon-filled');
  });

  it('selected xsmall: bg-secondary, so it differs from the page background (OD-263)', () => {
    render(
      <NlSegment selected size="xsmall">
        Day
      </NlSegment>,
    );
    const root = rootOf(screen.getByRole('radio'));
    expect(root).toHaveClass('nl:bg-secondary', 'nl:text-primary', 'nl:active:bg-tertiary');
    expect(root).not.toHaveClass('nl:bg-primary');
  });

  it('unselected: no background, its label colours and an outlined icon', () => {
    render(
      <NlSegment selected={false} icon="calendar_today">
        Day
      </NlSegment>,
    );
    const root = rootOf(screen.getByRole('radio'));
    expect(root).toHaveClass(
      'nl:text-secondary',
      'nl:hover:text-tertiary',
      'nl:active:text-primary',
      'nl:has-disabled:text-disabled',
    );
    expect(root.className).not.toMatch(/nl:bg-/);
    expect(root.querySelector('[data-icon]')).not.toHaveClass('nl:icon-filled');
  });

  it('has the focus ring on the root and no pointer events when disabled', () => {
    render(
      <NlSegment selected={false} disabled>
        Day
      </NlSegment>,
    );
    const radio = screen.getByRole('radio');
    expect(radio).toBeDisabled();
    expect(rootOf(radio)).toHaveClass(
      'nl:has-focus-visible:outline-2',
      'nl:has-focus-visible:outline-focused',
      'nl:has-disabled:pointer-events-none',
    );
  });

  it('passes ref and native attributes to the input and className to the root', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <NlSegment selected={false} name="period" value="day" ref={ref} className="nl:flex-1">
        Day
      </NlSegment>,
    );
    const radio = screen.getByRole('radio');
    expect(ref.current).toBe(radio);
    expect(radio).toHaveAttribute('name', 'period');
    expect(radio).toHaveAttribute('value', 'day');
    expect(rootOf(radio).className.split(' ').at(-1)).toBe('nl:flex-1');
  });
});
