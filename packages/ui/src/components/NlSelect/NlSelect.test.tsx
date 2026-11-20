import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NlSelect, type NlSelectOption } from './NlSelect';

const options: NlSelectOption[] = [
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

describe('NlSelect', () => {
  it('a read-only combobox named by its label, with listbox popup ARIA and a chevron', () => {
    render(<NlSelect label="Tier" options={options} />);
    const field = screen.getByRole('combobox', { name: 'Tier' });
    expect(field).toHaveAttribute('readonly');
    expect(field).toHaveAttribute('aria-haspopup', 'listbox');
    expect(field).toHaveAttribute('aria-expanded', 'false');
    expect(field).toHaveValue('');
    expect(field).toHaveClass('nl:cursor-pointer', 'nl:caret-transparent');
    const chevron = field.closest('[data-size]')?.querySelector('[data-slot="trailing"] [data-icon]');
    expect(chevron).toHaveAttribute('data-icon', 'keyboard_arrow_down');
    expect(chevron).toHaveAttribute('data-size', '24');
  });

  it('small: chevron 20', () => {
    render(<NlSelect label="Tier" options={options} size="small" />);
    const field = screen.getByRole('combobox');
    expect(field.closest('[data-size]')?.querySelector('[data-icon]')).toHaveAttribute('data-size', '20');
  });

  it('click opens the listbox with small compact options; choosing sets the value, closes and returns focus', async () => {
    const onValueChange = vi.fn();
    render(<NlSelect label="Tier" options={options} onValueChange={onValueChange} />);
    const field = screen.getByRole('combobox');
    await userEvent.click(field);
    expect(field).toHaveAttribute('aria-expanded', 'true');
    const listbox = screen.getByRole('listbox', { name: 'Tier' });
    expect(field).toHaveAttribute('aria-controls', listbox.id);
    const option = screen.getByRole('option', { name: /Tier 2/ });
    expect(option).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('option', { name: 'Gold' })).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(option);
    expect(onValueChange).toHaveBeenCalledWith('tier-2');
    expect(field).toHaveValue('Tier 2');
    expect(field).toHaveAttribute('aria-expanded', 'false');
    expect(field).toHaveFocus();
  });

  it('keyboard: Down opens with focus on the chosen option; arrows skip disabled; Enter chooses', async () => {
    render(<NlSelect label="Tier" options={options} defaultValue="tier-2" />);
    const field = screen.getByRole('combobox');
    field.focus();
    await userEvent.keyboard('{ArrowDown}');
    await settle();
    expect(screen.getByRole('option', { name: /Tier 2/ })).toHaveFocus();
    expect(screen.getByRole('option', { name: /Tier 2/ })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Tier 3' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(field).toHaveValue('Tier 3');
    expect(field).toHaveFocus();
  });

  it('Escape closes without changing the value', async () => {
    render(<NlSelect label="Tier" options={options} defaultValue="tier-1" />);
    const field = screen.getByRole('combobox');
    field.focus();
    await userEvent.keyboard('{Enter}');
    await settle();
    await userEvent.keyboard('{ArrowDown}{Escape}');
    expect(field).toHaveAttribute('aria-expanded', 'false');
    expect(field).toHaveValue('Tier 1');
    expect(field).toHaveFocus();
  });

  it('type-ahead on the closed field picks the next enabled option starting with the letter', async () => {
    const onValueChange = vi.fn();
    render(<NlSelect label="Tier" options={options} onValueChange={onValueChange} />);
    const field = screen.getByRole('combobox');
    field.focus();
    await userEvent.keyboard('t');
    expect(field).toHaveValue('Tier 1');
    await userEvent.keyboard('t');
    expect(field).toHaveValue('Tier 2');
    await userEvent.keyboard('g');
    expect(field).toHaveValue('Tier 2');
    expect(field).toHaveAttribute('aria-expanded', 'false');
  });

  it('controlled: shows the given value, reports changes', async () => {
    const onValueChange = vi.fn();
    render(<NlSelect label="Tier" options={options} value="tier-3" onValueChange={onValueChange} />);
    const field = screen.getByRole('combobox');
    expect(field).toHaveValue('Tier 3');
    field.focus();
    await userEvent.keyboard('t');
    expect(onValueChange).toHaveBeenCalledWith('tier-1');
    expect(field).toHaveValue('Tier 3');
  });

  it('submits the value through a hidden input with name', () => {
    const { container } = render(<NlSelect label="Tier" options={options} defaultValue="tier-2" name="tier" />);
    const hidden = container.querySelector('input[type="hidden"]');
    expect(hidden).toHaveAttribute('name', 'tier');
    expect(hidden).toHaveValue('tier-2');
    expect(screen.getByRole('combobox')).not.toHaveAttribute('name');
  });

  it('disabled: no open; required: aria-required; error: aria-invalid', async () => {
    render(
      <>
        <NlSelect label="A" options={options} disabled />
        <NlSelect label="B" options={options} required error helperText="Choose a tier" />
      </>,
    );
    const a = screen.getByRole('combobox', { name: 'A' });
    expect(a).toBeDisabled();
    await userEvent.click(a);
    expect(a).toHaveAttribute('aria-expanded', 'false');
    const b = screen.getByRole('combobox', { name: 'B' });
    expect(b).toHaveAttribute('aria-required', 'true');
    expect(b).toHaveAttribute('aria-invalid', 'true');
    expect(b).toHaveAccessibleDescription(/Choose a tier/);
  });

  it('a click on the box (the chevron) opens it too', async () => {
    render(<NlSelect label="Tier" options={options} />);
    const field = screen.getByRole('combobox');
    const chevron = field.closest('[data-size]')?.querySelector('[data-slot="trailing"]');
    if (!chevron) throw new Error('no chevron');
    await userEvent.click(chevron);
    expect(field).toHaveAttribute('aria-expanded', 'true');
  });

  it('no options: the menu never opens', async () => {
    render(<NlSelect label="Tier" options={[]} />);
    const field = screen.getByRole('combobox');
    await userEvent.click(field);
    expect(field).toHaveAttribute('aria-expanded', 'false');
  });
});
