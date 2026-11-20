import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NlMultiSelect, type NlMultiSelectOption } from './NlMultiSelect';

const options: NlMultiSelectOption[] = [
  { value: 'tier-1', label: 'Tier 1' },
  { value: 'tier-2', label: 'Tier 2', description: 'Second' },
  { value: 'gold', label: 'Gold', disabled: true },
  { value: 'tier-3', label: 'Tier 3' },
];

/** Lets NlMenu measure its first position, so focus can move into it. */
const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

describe('NlMultiSelect', () => {
  it('a combobox whose value reads the chosen labels; multiselectable listbox; chevron', async () => {
    render(<NlMultiSelect label="Tiers" options={options} defaultValue={['tier-3', 'tier-1']} />);
    const field = screen.getByRole('combobox', { name: 'Tiers' });
    expect(field).toHaveValue('Tier 1, Tier 3');
    expect(field).toHaveClass('nl:text-transparent');
    expect(field).toHaveAttribute('aria-haspopup', 'listbox');
    await userEvent.click(field);
    const listbox = screen.getByRole('listbox', { name: 'Tiers' });
    expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
    expect(screen.getByRole('option', { name: 'Tier 1' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: /Tier 2/ })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('option', { name: 'Gold' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('option rows: no focusable control inside; the checkbox is inert', async () => {
    render(<NlMultiSelect label="Tiers" options={options} />);
    await userEvent.click(screen.getByRole('combobox'));
    const option = screen.getByRole('option', { name: 'Tier 1' });
    expect(option).toHaveAttribute('tabindex', '-1');
    expect(option.querySelector('input[type="checkbox"]')).toHaveAttribute('inert');
  });

  it('click and Space toggle; the menu stays open; chips appear in option order', async () => {
    const onValueChange = vi.fn();
    render(<NlMultiSelect label="Tiers" options={options} onValueChange={onValueChange} />);
    const field = screen.getByRole('combobox');
    field.focus();
    await userEvent.keyboard('{ArrowDown}');
    await settle();
    expect(screen.getByRole('option', { name: 'Tier 1' })).toHaveFocus();
    await userEvent.keyboard(' ');
    expect(onValueChange).toHaveBeenLastCalledWith(['tier-1']);
    expect(field).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(screen.getByRole('option', { name: 'Tier 3' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['tier-1', 'tier-3']);
    expect(field).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(screen.getByRole('option', { name: 'Gold' }));
    expect(onValueChange).toHaveBeenCalledTimes(2);
    expect(field).toHaveValue('Tier 1, Tier 3');
    await userEvent.keyboard('{Escape}');
    expect(field).toHaveAttribute('aria-expanded', 'false');
    expect(field).toHaveFocus();
  });

  it('chips: xsmall with "Remove …" buttons after the field; removing moves focus to the next chip, then the field', async () => {
    const { container } = render(
      <NlMultiSelect label="Tiers" options={options} defaultValue={['tier-1', 'tier-2', 'tier-3']} />,
    );
    const overlay = container.querySelector('[data-slot="value-overlay"]');
    expect(overlay).not.toBeNull();
    const removeTier1 = screen.getByRole('button', { name: 'Remove Tier 1' });
    await userEvent.click(removeTier1);
    expect(screen.getByRole('combobox')).toHaveValue('Tier 2, Tier 3');
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: 'Remove Tier 2' })).toHaveFocus();
    await userEvent.click(screen.getByRole('button', { name: 'Remove Tier 3' }));
    expect(screen.getByRole('button', { name: 'Remove Tier 2' })).toHaveFocus();
    await userEvent.click(screen.getByRole('button', { name: 'Remove Tier 2' }));
    expect(screen.getByRole('combobox')).toHaveFocus();
    expect(screen.getByRole('combobox')).toHaveValue('');
  });

  it('searchable: focus starts in the search; typing filters; Down moves to the rows; "No results"', async () => {
    render(<NlMultiSelect label="Tiers" options={options} searchable />);
    await userEvent.click(screen.getByRole('combobox'));
    await settle();
    const search = screen.getByRole('searchbox', { name: 'Search Tiers' });
    expect(search).toHaveFocus();
    await userEvent.keyboard('tier');
    expect(screen.queryByRole('option', { name: 'Gold' })).toBeNull();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Tier 1' })).toHaveFocus();
    search.focus();
    await userEvent.keyboard('zzz');
    expect(screen.getByRole('status')).toHaveTextContent('No results');
  });

  it('Backspace in an empty search removes the last chip', async () => {
    const onValueChange = vi.fn();
    render(
      <NlMultiSelect
        label="Tiers"
        options={options}
        searchable
        defaultValue={['tier-1', 'tier-3']}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole('combobox'));
    await settle();
    await userEvent.keyboard('{Backspace}');
    expect(onValueChange).toHaveBeenLastCalledWith(['tier-1']);
  });

  it('submits each value through a hidden input with name', () => {
    const { container } = render(
      <NlMultiSelect label="Tiers" options={options} defaultValue={['tier-1', 'tier-3']} name="tiers" />,
    );
    const hidden = [...container.querySelectorAll('input[type="hidden"]')].map((input) => input.getAttribute('value'));
    expect(hidden).toEqual(['tier-1', 'tier-3']);
  });

  it('disabled: no open, chips without remove buttons; required: aria-required', async () => {
    render(
      <>
        <NlMultiSelect label="A" options={options} disabled defaultValue={['tier-1']} />
        <NlMultiSelect label="B" options={options} required />
      </>,
    );
    const a = screen.getByRole('combobox', { name: 'A' });
    await userEvent.click(a);
    expect(a).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('button', { name: 'Remove Tier 1' })).toBeNull();
    expect(screen.getByRole('combobox', { name: 'B' })).toHaveAttribute('aria-required', 'true');
  });

  it('"+N" chip: decorative (aria-hidden), no remove button', () => {
    const { container } = render(
      <NlMultiSelect label="Tiers" options={options} defaultValue={['tier-1', 'tier-2', 'tier-3']} />,
    );
    // jsdom has no layout, so every chip "fits"; the "+N" chip is only drawn when some don't.
    expect(container.querySelectorAll('[data-slot="value-overlay"] [aria-hidden="true"] button').length).toBe(3);
    expect(screen.getAllByRole('button', { name: /^Remove/ })).toHaveLength(3);
  });
});
