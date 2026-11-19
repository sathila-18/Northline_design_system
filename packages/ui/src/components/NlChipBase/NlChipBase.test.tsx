import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NlIcon } from '../../icons';
import { NlChipBase } from './NlChipBase';

const chipOf = (text: string) => {
  const chip = screen.getByText(text).parentElement;
  if (!chip) throw new Error('NlChipBase label has no root');
  return chip;
};

describe('NlChipBase', () => {
  it('defaults to a small, unselected span with only a label', () => {
    render(<NlChipBase>Tier 2</NlChipBase>);
    const chip = chipOf('Tier 2');
    expect(chip.tagName).toBe('SPAN');
    expect(chip).toHaveAttribute('data-look', 'unselected');
    expect(chip).toHaveAttribute('data-size', 'small');
    expect(chip).toHaveClass('nl:group/chip', 'nl:inline-flex', 'nl:whitespace-nowrap', 'nl:rounded-s');
    expect(chip.querySelector('[data-slot="leading"]')).toBeNull();
    expect(chip.querySelector('[data-slot="trailing"]')).toBeNull();
  });

  it.each([
    ['xsmall', ['nl:py-xs', 'nl:px-m', 'nl:gap-xs', 'nl:text-label-s'], '16'],
    ['small', ['nl:py-s', 'nl:px-l', 'nl:gap-m', 'nl:text-label-m'], '16'],
    ['large', ['nl:py-m', 'nl:px-l', 'nl:gap-m', 'nl:text-label-l'], '20'],
  ] as const)('size %s', (size, classes, iconSize) => {
    render(
      <NlChipBase size={size} trailingIcon="keyboard_arrow_down">
        Tier 2
      </NlChipBase>,
    );
    const chip = chipOf('Tier 2');
    expect(chip).toHaveClass(...classes);
    expect(chip.querySelector('[data-slot="trailing"] [data-icon]')).toHaveAttribute('data-size', iconSize);
  });

  it.each([
    [
      'unselected',
      ['nl:bg-primary', 'nl:inset-ring', 'nl:inset-ring-subtle', 'nl:text-primary'],
      'nl:text-fg-secondary',
    ],
    [
      'unselected-bordered',
      ['nl:bg-primary', 'nl:inset-ring', 'nl:inset-ring-default', 'nl:shadow-resting', 'nl:text-primary'],
      'nl:text-fg-secondary',
    ],
    ['selected', ['nl:bg-active', 'nl:inset-ring', 'nl:inset-ring-active', 'nl:text-action'], 'nl:text-fg-brand'],
  ] as const)('look %s has its resting colours', (look, chipClasses, leadingClass) => {
    render(
      <NlChipBase look={look} leading={<NlIcon name="check" size={16} tone="inherit" />} trailingIcon="close">
        Tier 2
      </NlChipBase>,
    );
    const chip = chipOf('Tier 2');
    expect(chip).toHaveClass(...chipClasses);
    expect(chip.querySelector('[data-slot="leading"]')).toHaveClass(leadingClass);
    expect(chip.querySelector('[data-slot="trailing"]')).toHaveClass('nl:text-fg-secondary');
  });

  it('puts leading before the label and the trailing icon after it, decorative', () => {
    render(
      <NlChipBase
        leading={<NlIcon name="calendar_today" size={16} tone="inherit" />}
        trailingIcon="keyboard_arrow_down"
      >
        This week
      </NlChipBase>,
    );
    const chip = chipOf('This week');
    expect((chip.firstElementChild as HTMLElement).dataset.slot).toBe('leading');
    expect((chip.lastElementChild as HTMLElement).dataset.slot).toBe('trailing');
    expect(chip.querySelector('[data-icon="keyboard_arrow_down"]')).toHaveAttribute('aria-hidden', 'true');
  });

  it('takes a trailing slot instead of the icon, for something interactive', () => {
    render(
      <NlChipBase
        trailing={
          <button type="button" aria-label="Remove Tier 2">
            x
          </button>
        }
      >
        Tier 2
      </NlChipBase>,
    );
    const chip = chipOf('Tier 2');
    expect(chip.querySelector('[data-slot="trailing"]')).toContainElement(
      screen.getByRole('button', { name: 'Remove Tier 2' }),
    );
  });

  it('replaces the resting colours with appearance', () => {
    render(
      <NlChipBase
        look="selected"
        leading={<NlIcon name="check" size={16} tone="inherit" />}
        appearance={{
          chip: 'nl:bg-disabled nl:text-disabled',
          leading: 'nl:text-fg-disabled',
          trailing: 'nl:text-fg-disabled',
        }}
      >
        Tier 2
      </NlChipBase>,
    );
    const chip = chipOf('Tier 2');
    expect(chip).toHaveClass('nl:bg-disabled', 'nl:text-disabled');
    expect(chip).not.toHaveClass('nl:bg-active', 'nl:text-action');
    expect(chip.querySelector('[data-slot="leading"]')).toHaveClass('nl:text-fg-disabled');
    expect(chip).toHaveAttribute('data-look', 'selected');
  });

  it('renders another element with as, and passes ref, attributes and className last', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <NlChipBase as="button" type="button" id="probe" className="nl:ms-xs" ref={ref}>
        Tier 2
      </NlChipBase>,
    );
    const chip = screen.getByRole('button', { name: 'Tier 2' });
    expect(chip).toHaveAttribute('id', 'probe');
    expect(ref.current).toBe(chip);
    expect(chip.className.split(' ').at(-1)).toBe('nl:ms-xs');
  });
});
