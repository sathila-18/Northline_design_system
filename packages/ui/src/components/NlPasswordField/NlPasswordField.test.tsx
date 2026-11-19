import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlPasswordField } from './NlPasswordField';

const input = () => screen.getByLabelText<HTMLInputElement>('Password');
const toggle = () => screen.getByRole('button', { name: 'Show password' });

describe('NlPasswordField', () => {
  it('is a hidden password input, large, with current-password by default', () => {
    const { container } = render(<NlPasswordField label="Password" />);
    expect(input()).toHaveAttribute('type', 'password');
    expect(input()).toHaveAttribute('autocomplete', 'current-password');
    expect(container.firstElementChild).toHaveAttribute('data-size', 'large');
    expect(toggle()).toHaveAttribute('aria-pressed', 'false');
    expect(toggle()).toHaveAttribute('type', 'button');
  });

  it('uses the xsmall tertiary icon-only button with visibility_off, then visibility', async () => {
    const { container } = render(<NlPasswordField label="Password" />);
    expect(toggle()).toHaveAttribute('data-size', 'xsmall');
    expect(toggle()).toHaveAttribute('data-icon', 'only-icon');
    expect(container.querySelector('[data-icon="visibility_off"]')).not.toBeNull();
    await userEvent.click(toggle());
    expect(container.querySelector('[data-icon="visibility"]')).not.toBeNull();
  });

  it('shows and hides on click, keeping the value and one accessible name', async () => {
    render(<NlPasswordField label="Password" defaultValue="track-day-42" />);
    await userEvent.click(toggle());
    expect(input()).toHaveAttribute('type', 'text');
    expect(input()).toHaveValue('track-day-42');
    expect(toggle()).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(toggle());
    expect(input()).toHaveAttribute('type', 'password');
    expect(toggle()).toHaveAttribute('aria-pressed', 'false');
  });

  it('puts the caret back after the switch', async () => {
    render(<NlPasswordField label="Password" defaultValue="track-day-42" />);
    input().setSelectionRange(3, 6);
    await userEvent.click(toggle());
    expect(input().selectionStart).toBe(3);
    expect(input().selectionEnd).toBe(6);
  });

  it('is a separate tab stop after the input, toggled with Enter and Space', async () => {
    render(<NlPasswordField label="Password" />);
    await userEvent.tab();
    expect(input()).toHaveFocus();
    await userEvent.tab();
    expect(toggle()).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(input()).toHaveAttribute('type', 'text');
    await userEvent.keyboard(' ');
    expect(input()).toHaveAttribute('type', 'password');
  });

  it('starts shown with defaultShowPassword', () => {
    render(<NlPasswordField label="Password" defaultShowPassword />);
    expect(input()).toHaveAttribute('type', 'text');
    expect(toggle()).toHaveAttribute('aria-pressed', 'true');
  });

  it('follows showPassword when controlled and reports the next value', async () => {
    const onChange = vi.fn();
    function Controlled() {
      const [shown, setShown] = useState(false);
      return (
        <NlPasswordField
          label="Password"
          showPassword={shown}
          onShowPasswordChange={(next) => {
            onChange(next);
            setShown(next);
          }}
        />
      );
    }
    render(<Controlled />);
    await userEvent.click(toggle());
    expect(onChange).toHaveBeenCalledWith(true);
    expect(input()).toHaveAttribute('type', 'text');
  });

  it('stays put when controlled and the parent ignores the change', async () => {
    const onChange = vi.fn();
    render(<NlPasswordField label="Password" showPassword={false} onShowPasswordChange={onChange} />);
    await userEvent.click(toggle());
    expect(onChange).toHaveBeenCalledWith(true);
    expect(input()).toHaveAttribute('type', 'password');
  });

  it('disables the button with the field', async () => {
    render(<NlPasswordField label="Password" disabled />);
    expect(input()).toBeDisabled();
    expect(toggle()).toBeDisabled();
    await userEvent.click(toggle());
    expect(input()).toHaveAttribute('type', 'password');
  });

  it('passes ref, autoComplete, required, error and helper text to the base', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <NlPasswordField
        label="Password"
        ref={ref}
        autoComplete="new-password"
        required
        error
        helperText="Use at least 12 characters."
      />,
    );
    expect(ref.current).toBe(input());
    expect(input()).toHaveAttribute('autocomplete', 'new-password');
    expect(input()).toBeRequired();
    expect(input()).toHaveAttribute('aria-invalid', 'true');
    expect(input()).toHaveAccessibleDescription('Use at least 12 characters.');
  });

  it('passes the small size to the base', () => {
    const { container } = render(<NlPasswordField label="Password" size="small" />);
    expect(container.firstElementChild).toHaveAttribute('data-size', 'small');
  });
});
