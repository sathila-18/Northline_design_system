import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it } from 'vitest';
import { NlTextArea } from './NlTextArea';

const count = (container: HTMLElement) => container.querySelector('[data-slot="count"]');
const announcement = (container: HTMLElement) => container.querySelector('[data-slot="count-announcement"]');

describe('NlTextArea', () => {
  it('is a 4-row textarea built on NlTextAreaBase, with no hint text and no count by default', () => {
    const { container } = render(<NlTextArea label="Notes" />);
    const textarea = screen.getByRole('textbox', { name: 'Notes' });
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('rows', '4');
    expect(textarea).toHaveAttribute('placeholder', ' ');
    expect(count(container)).toBeNull();
    expect(textarea).not.toHaveAttribute('aria-describedby');
  });

  it('Enter adds a new line and never submits a form', async () => {
    let submitted = false;
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitted = true;
        }}
      >
        <NlTextArea label="Notes" />
      </form>,
    );
    await userEvent.type(screen.getByRole('textbox'), 'Tier 2{Enter}Reward X');
    expect(screen.getByRole('textbox')).toHaveValue('Tier 2\nReward X');
    expect(submitted).toBe(false);
  });

  it('maxLength: native limit, a hidden visual count, and the limit in the description', async () => {
    const { container } = render(<NlTextArea label="Notes" maxLength={10} helperText="Short." />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('maxlength', '10');
    expect(textarea).toHaveAccessibleDescription('Short. Up to 10 characters.');
    expect(count(container)).toHaveTextContent('0 / 10');
    expect(count(container)).toHaveAttribute('aria-hidden', 'true');
    expect(count(container)).toHaveClass('nl:text-body-s', 'nl:text-tertiary', 'nl:mt-m');
    await userEvent.type(textarea, 'Track day voucher');
    expect(textarea).toHaveValue('Track day ');
    expect(count(container)).toHaveTextContent('10 / 10');
  });

  it('counts the default value and follows a controlled value', async () => {
    function Controlled() {
      const [text, setText] = useState('Tier 2');
      return (
        <>
          <NlTextArea
            label="Notes"
            maxLength={50}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
            }}
          />
          <button
            type="button"
            onClick={() => {
              setText('');
            }}
          >
            Reset
          </button>
        </>
      );
    }
    const { container } = render(<Controlled />);
    expect(count(container)).toHaveTextContent('6 / 50');
    await userEvent.type(screen.getByRole('textbox'), '!');
    expect(count(container)).toHaveTextContent('7 / 50');
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(count(container)).toHaveTextContent('0 / 50');
  });

  it('announces politely only when typing crosses 20, 10, 5 and 0 left', async () => {
    const { container } = render(<NlTextArea label="Notes" maxLength={30} />);
    const textarea = screen.getByRole('textbox');
    expect(announcement(container)).toHaveAttribute('aria-live', 'polite');
    await userEvent.type(textarea, '123456789');
    expect(announcement(container)).toBeEmptyDOMElement();
    await userEvent.type(textarea, '0');
    expect(announcement(container)).toHaveTextContent('20 characters left');
    await userEvent.type(textarea, '1');
    expect(announcement(container)).toHaveTextContent('20 characters left');
    await userEvent.type(textarea, '234567890');
    expect(announcement(container)).toHaveTextContent('10 characters left');
    await userEvent.type(textarea, '01234');
    expect(announcement(container)).toHaveTextContent('5 characters left');
    await userEvent.type(textarea, '56789');
    expect(announcement(container)).toHaveTextContent('Character limit reached');
  });

  it('a paste that jumps past a point announces what is left', async () => {
    const { container } = render(<NlTextArea label="Notes" maxLength={30} />);
    const textarea = screen.getByRole('textbox');
    textarea.focus();
    await userEvent.paste('a'.repeat(27));
    expect(announcement(container)).toHaveTextContent('3 characters left');
  });

  it('the count is text-disabled when disabled and stays text-tertiary with an error', () => {
    const { container, rerender } = render(<NlTextArea label="Notes" maxLength={10} disabled />);
    expect(count(container)).toHaveClass('nl:text-disabled');
    rerender(<NlTextArea label="Notes" maxLength={10} error helperText="Add a note." />);
    expect(count(container)).toHaveClass('nl:text-tertiary');
    expect(screen.getByText('Add a note.').parentElement).toHaveAttribute('data-tone', 'error');
  });

  it('passes ref, rows, required, error and helper text to the base', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<NlTextArea label="Notes" ref={ref} rows={6} required error helperText="Add a note." />);
    const textarea = screen.getByRole('textbox');
    expect(ref.current).toBe(textarea);
    expect(textarea).toHaveAttribute('rows', '6');
    expect(textarea).toBeRequired();
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAccessibleDescription('Add a note.');
  });
});
