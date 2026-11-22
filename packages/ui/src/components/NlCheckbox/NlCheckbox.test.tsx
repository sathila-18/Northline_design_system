import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlCheckbox } from './NlCheckbox';

const rowOf = (checkbox: HTMLElement) => {
  const row = checkbox.closest('label');
  if (!row) throw new Error('NlCheckbox has no row');
  return row;
};

describe('NlCheckbox', () => {
  it('is a checkbox named by its text, in a label row', () => {
    render(<NlCheckbox>Send a welcome email</NlCheckbox>);
    const checkbox = screen.getByRole('checkbox', { name: 'Send a welcome email' });
    expect(checkbox).not.toBeChecked();
    const row = rowOf(checkbox);
    expect(row).toHaveClass('nl:flex', 'nl:w-full', 'nl:items-start', 'nl:gap-l', 'nl:p-none');
    const text = screen.getByText('Send a welcome email');
    expect(text.tagName).toBe('P');
    expect(text).toHaveClass('nl:text-body-l', 'nl:text-secondary');
  });

  it('size small: Body M text, centred on the control (OD-237)', () => {
    render(<NlCheckbox size="small">Remember me</NlCheckbox>);
    const row = rowOf(screen.getByRole('checkbox', { name: 'Remember me' }));
    expect(row).toHaveClass('nl:items-center');
    expect(row).not.toHaveClass('nl:items-start');
    expect(row).toHaveAttribute('data-size', 'small');
    expect(screen.getByText('Remember me')).toHaveClass('nl:text-body-m', 'nl:text-secondary');
  });

  it('clicking the text toggles it; Space toggles it from the keyboard', async () => {
    const onChange = vi.fn();
    render(<NlCheckbox onChange={onChange}>Send a welcome email</NlCheckbox>);
    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(screen.getByText('Send a welcome email'));
    expect(checkbox).toBeChecked();
    // The click left focus on the checkbox, so Space toggles it.
    expect(checkbox).toHaveFocus();
    await userEvent.keyboard(' ');
    expect(checkbox).not.toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('passes indeterminate to the control', () => {
    function Parent() {
      const [mixed, setMixed] = useState(true);
      const [checked, setChecked] = useState(false);
      return (
        <NlCheckbox
          indeterminate={mixed}
          checked={checked}
          onChange={(event) => {
            setChecked(event.target.checked);
            setMixed(false);
          }}
        >
          Select all members
        </NlCheckbox>
      );
    }
    render(<Parent />);
    expect(screen.getByRole('checkbox')).toBePartiallyChecked();
  });

  it('disabled: the control is disabled and the text is text-disabled', async () => {
    render(
      <NlCheckbox disabled defaultChecked>
        Send a welcome email
      </NlCheckbox>,
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
    expect(screen.getByText('Send a welcome email')).toHaveClass('nl:text-disabled');
    expect(rowOf(checkbox)).toHaveClass('nl:has-disabled:cursor-default');
    await userEvent.click(screen.getByText('Send a welcome email'));
    expect(checkbox).toBeChecked();
  });

  it('hideLabel hides the text visually and keeps it as the name', () => {
    render(<NlCheckbox hideLabel>Select member 0042</NlCheckbox>);
    expect(screen.getByRole('checkbox', { name: 'Select member 0042' })).toBeInTheDocument();
    expect(screen.getByText('Select member 0042').closest('.nl\\:sr-only')).not.toBeNull();
  });

  it('passes ref and native attributes to the input and className to the row', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <NlCheckbox ref={ref} name="welcome" value="yes" className="nl:mt-m">
        Send a welcome email
      </NlCheckbox>,
    );
    const checkbox = screen.getByRole('checkbox');
    expect(ref.current).toBe(checkbox);
    expect(checkbox).toHaveAttribute('name', 'welcome');
    expect(checkbox).toHaveAttribute('value', 'yes');
    expect(rowOf(checkbox).className.split(' ').at(-1)).toBe('nl:mt-m');
  });
});
