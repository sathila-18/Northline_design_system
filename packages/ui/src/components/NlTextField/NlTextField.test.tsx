import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it } from 'vitest';
import { NlTextField } from './NlTextField';

describe('NlTextField', () => {
  it('is a text input built on NlInputBase, large by default', () => {
    const { container } = render(<NlTextField label="Member name" />);
    const input = screen.getByRole('textbox', { name: 'Member name' });
    expect(input).toHaveAttribute('type', 'text');
    expect(container.firstElementChild).toHaveAttribute('data-size', 'large');
    expect(container.querySelector('[data-slot="trailing"]')).toBeNull();
  });

  it.each(['email', 'number', 'tel', 'url'] as const)('passes inputType %s as the native type', (inputType) => {
    const { container } = render(<NlTextField label="Field" inputType={inputType} />);
    expect(container.querySelector('input')).toHaveAttribute('type', inputType);
  });

  it.each([
    ['large', '24'],
    ['small', '20'],
  ] as const)('a %s field draws the trailing icon at %s, decorative', (size, iconSize) => {
    const { container } = render(<NlTextField label="Points" size={size} trailingIcon="info" />);
    const icon = container.querySelector('[data-slot="trailing"] [data-icon="info"]');
    expect(icon).toHaveAttribute('data-size', iconSize);
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('passes label, helper text, error and value to the base', async () => {
    function Controlled() {
      const [value, setValue] = useState('');
      return (
        <NlTextField
          label="Member email"
          inputType="email"
          error
          helperText="Enter an email address."
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
      );
    }
    render(<Controlled />);
    const input = screen.getByRole('textbox', { name: 'Member email' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Enter an email address.');
    await userEvent.type(input, 'member@example.org');
    expect(input).toHaveValue('member@example.org');
  });

  it('passes ref, required, disabled and native attributes', () => {
    const ref = createRef<HTMLInputElement>();
    render(<NlTextField label="Member name" ref={ref} required disabled name="name" autoComplete="name" />);
    const input = screen.getByRole('textbox');
    expect(ref.current).toBe(input);
    expect(input).toBeRequired();
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('autocomplete', 'name');
  });
});
