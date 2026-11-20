import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NlDateField } from './NlDateField';

/** Lets NlMenu measure its first position, so focus can move into it. */
const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

describe('NlDateField', () => {
  it('a numeric text input named by its label, described by the format; format hint after the typed text', async () => {
    const { container } = render(<NlDateField label="Start date" />);
    const input = screen.getByRole('textbox', { name: 'Start date' });
    expect(input).toHaveAttribute('inputmode', 'numeric');
    expect(input).toHaveAccessibleDescription('Format: DD/MM/YYYY');
    await userEvent.type(input, '010');
    expect(input).toHaveValue('01/0');
    const hint = container.querySelector('[data-slot="format-hint"]');
    expect(hint).toHaveAttribute('aria-hidden', 'true');
    expect(hint).toHaveTextContent('01/0M/YYYY');
    expect(hint).toHaveClass('nl:invisible', 'nl:peer-focus/input:visible', 'nl:text-placeholder');
  });

  it('typing a complete, real date reports ISO; clearing reports empty', async () => {
    const onValueChange = vi.fn();
    render(<NlDateField label="Start date" onValueChange={onValueChange} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '21112026');
    expect(input).toHaveValue('21/11/2026');
    expect(onValueChange).toHaveBeenLastCalledWith('2026-11-21');
    await userEvent.clear(input);
    expect(onValueChange).toHaveBeenLastCalledWith('');
  });

  it('errors: a complete invalid date at once; an incomplete one on blur', async () => {
    render(<NlDateField label="Start date" helperText="First day" />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '31022026');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(/Enter a date as DD\/MM\/YYYY/);
    await userEvent.clear(input);
    await userEvent.type(input, '12');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).toHaveAccessibleDescription(/First day/);
    await userEvent.tab();
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('limits: errors written in the field format', async () => {
    render(<NlDateField label="A" minDate="2026-11-10" maxDate="2026-12-15" />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '01112026');
    expect(input).toHaveAccessibleDescription(/Choose a date from 10\/11\/2026/);
    await userEvent.clear(input);
    await userEvent.type(input, '31122026');
    expect(input).toHaveAccessibleDescription(/Choose a date until 15\/12\/2026/);
  });

  it('calendar button: named, opens a dialog with focus on the date; choosing fills, closes, returns focus', async () => {
    const onValueChange = vi.fn();
    render(<NlDateField label="Start date" defaultValue="2026-11-21" onValueChange={onValueChange} />);
    const button = screen.getByRole('button', { name: 'Change date, 21/11/2026' });
    expect(button).toHaveAttribute('aria-haspopup', 'dialog');
    await userEvent.click(button);
    await settle();
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const dialog = screen.getByRole('dialog', { name: 'Choose date' });
    expect(button).toHaveAttribute('aria-controls', dialog.id);
    const selected = dialog.querySelector('button[data-date="2026-11-21"]');
    expect(selected).toHaveFocus();
    const day = dialog.querySelector<HTMLButtonElement>('button[data-date="2026-11-25"]');
    if (!day) throw new Error('no day');
    await userEvent.click(day);
    expect(onValueChange).toHaveBeenLastCalledWith('2026-11-25');
    expect(screen.getByRole('textbox')).toHaveValue('25/11/2026');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('Escape closes the calendar and returns focus to the input', async () => {
    render(<NlDateField label="Start date" />);
    await userEvent.click(screen.getByRole('button', { name: 'Choose date' }));
    await settle();
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Choose date' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('days outside the limits are disabled in the calendar', async () => {
    render(<NlDateField label="A" defaultValue="2026-11-21" minDate="2026-11-10" />);
    await userEvent.click(screen.getByRole('button', { name: /Change date/ }));
    const early = screen.getByRole('dialog').querySelector('button[data-date="2026-11-05"]');
    expect(early).toHaveAttribute('aria-disabled', 'true');
  });

  it('controlled: a new value replaces the text', () => {
    const { rerender } = render(<NlDateField label="A" value="2026-11-21" />);
    expect(screen.getByRole('textbox')).toHaveValue('21/11/2026');
    rerender(<NlDateField label="A" value="2026-12-01" />);
    expect(screen.getByRole('textbox')).toHaveValue('01/12/2026');
  });

  it('other formats', () => {
    render(<NlDateField label="A" format="YYYY-MM-DD" defaultValue="2026-11-21" />);
    expect(screen.getByRole('textbox')).toHaveValue('2026-11-21');
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Format: YYYY-MM-DD');
  });

  it('submits ISO through a hidden input; disabled disables the button; required is native', () => {
    const { container } = render(<NlDateField label="A" name="start" defaultValue="2026-11-21" required disabled />);
    expect(container.querySelector('input[type="hidden"]')).toHaveValue('2026-11-21');
    expect(screen.getByRole('textbox')).toBeRequired();
    expect(screen.getByRole('textbox')).not.toHaveAttribute('name');
    expect(screen.getByRole('button', { name: /Change date/ })).toBeDisabled();
  });
});
