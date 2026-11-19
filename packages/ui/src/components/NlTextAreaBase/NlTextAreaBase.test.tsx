import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlTextAreaBase } from './NlTextAreaBase';

const boxOf = (textarea: HTMLElement) => {
  const box = textarea.closest('.nl\\:group\\/field');
  if (!(box instanceof HTMLElement)) throw new Error('No box');
  return box;
};

describe('NlTextAreaBase', () => {
  it('is a native textarea named by a real label, 4 rows by default, with no hint text', () => {
    render(<NlTextAreaBase label="Notes" />);
    const textarea = screen.getByRole('textbox', { name: 'Notes' });
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('rows', '4');
    expect(textarea).toHaveAttribute('placeholder', ' ');
    expect(textarea).not.toHaveAttribute('aria-invalid');
    expect(textarea).toHaveClass('nl:p-xl', 'nl:text-body-l', 'nl:resize-y', 'nl:disabled:resize-none');
    expect(boxOf(textarea)).toHaveClass(
      'nl:rounded-m',
      'nl:inset-ring',
      'nl:inset-ring-default',
      'nl:has-focus:outline-2',
      'nl:has-focus:-outline-offset-1',
      'nl:has-focus:outline-focused',
    );
  });

  it('the label sits on the first line at rest and floats onto the top border', () => {
    render(<NlTextAreaBase label="Notes" />);
    expect(screen.getByText('Notes')).toHaveClass(
      'nl:top-xl',
      'nl:start-xl',
      'nl:text-placeholder',
      'nl:peer-focus/input:top-none',
      'nl:peer-focus/input:-translate-y-1/2',
      'nl:peer-not-placeholder-shown/input:text-label-s',
      'nl:peer-not-placeholder-shown/input:text-tertiary',
    );
  });

  it('takes rows', () => {
    render(<NlTextAreaBase label="Notes" rows={6} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '6');
  });

  it('ignores a placeholder: there is no hint text', () => {
    // @ts-expect-error placeholder is not part of the API
    render(<NlTextAreaBase label="Notes" placeholder="Add a note" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', ' ');
  });

  it('types, uncontrolled and controlled, across lines', async () => {
    const onChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState('');
      return (
        <NlTextAreaBase
          label="Controlled"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            onChange(event.target.value);
          }}
        />
      );
    }
    render(
      <>
        <NlTextAreaBase label="Uncontrolled" defaultValue="Tier 2" />
        <Controlled />
      </>,
    );
    await userEvent.type(screen.getByRole('textbox', { name: 'Uncontrolled' }), '{Enter}Reward X');
    expect(screen.getByRole('textbox', { name: 'Uncontrolled' })).toHaveValue('Tier 2\nReward X');
    await userEvent.type(screen.getByRole('textbox', { name: 'Controlled' }), 'ab');
    expect(onChange).toHaveBeenLastCalledWith('ab');
  });

  it('helper text describes the textarea inside a polite live region, without an icon by default', () => {
    render(<NlTextAreaBase label="Notes" helperText="Visible to admins only." />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAccessibleDescription('Visible to admins only.');
    const helper = screen.getByText('Visible to admins only.').parentElement;
    expect(helper).toHaveAttribute('data-tone', 'default');
    expect(helper?.querySelector('[data-slot="icon"]')).toBeNull();
    expect(helper?.parentElement).toHaveAttribute('aria-live', 'polite');
    expect(helper?.parentElement?.parentElement).toHaveClass('nl:ps-xl');
  });

  it('keeps the live region when there is no helper text', () => {
    const { container } = render(<NlTextAreaBase label="Notes" />);
    expect(container.querySelector('[aria-live="polite"]')).toBeEmptyDOMElement();
  });

  it('error: aria-invalid, border-error, error helper with its icon', () => {
    render(<NlTextAreaBase label="Notes" error helperText="Add a note before saving." />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(boxOf(textarea)).toHaveClass('nl:inset-ring-error');
    expect(boxOf(textarea)).not.toHaveClass('nl:inset-ring-default');
    const helper = screen.getByText('Add a note before saving.').parentElement;
    expect(helper).toHaveAttribute('data-tone', 'error');
    expect(helper?.querySelector('[data-icon="error"]')).not.toBeNull();
  });

  it('disabled: native, disabled helper tone, disabled colours', () => {
    render(<NlTextAreaBase label="Notes" disabled helperText="Can’t be changed." />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
    expect(screen.getByText('Can’t be changed.').parentElement).toHaveAttribute('data-tone', 'disabled');
    expect(boxOf(textarea)).toHaveClass('nl:has-disabled:inset-ring-disabled');
    expect(screen.getByText('Notes')).toHaveClass('nl:peer-disabled/input:text-disabled');
  });

  it('passes ref, id, required, maxLength and its own aria-describedby; className goes to the root', () => {
    const ref = createRef<HTMLTextAreaElement>();
    const { container } = render(
      <>
        <p id="extra">Extra</p>
        <NlTextAreaBase
          label="Notes"
          ref={ref}
          id="notes"
          required
          maxLength={200}
          aria-describedby="extra"
          helperText="Help"
          className="nl:mt-xl"
        />
      </>,
    );
    const textarea = screen.getByRole('textbox');
    expect(ref.current).toBe(textarea);
    expect(textarea).toHaveAttribute('id', 'notes');
    expect(textarea).toBeRequired();
    expect(textarea).toHaveAttribute('maxlength', '200');
    expect(textarea).toHaveAccessibleDescription('Extra Help Up to 200 characters.');
    expect(container.querySelector('.nl\\:mt-xl')).toBe(boxOf(textarea).parentElement);
  });
});
