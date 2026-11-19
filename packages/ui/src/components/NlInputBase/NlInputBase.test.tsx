import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlIcon } from '../../icons';
import { NlInputBase } from './NlInputBase';

const boxOf = (input: HTMLElement) => {
  const box = input.closest('.nl\\:group\\/field');
  if (!(box instanceof HTMLElement)) throw new Error('No box');
  return box;
};

describe('NlInputBase', () => {
  it('is a native input named by a real label, large by default', () => {
    render(<NlInputBase label="Member number" />);
    const input = screen.getByRole('textbox', { name: 'Member number' });
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('placeholder', ' ');
    expect(input).not.toHaveAttribute('aria-invalid');
    const box = boxOf(input);
    expect(box).toHaveClass(
      'nl:h-48',
      'nl:py-l',
      'nl:px-xl',
      'nl:gap-m',
      'nl:rounded-m',
      'nl:inset-ring',
      'nl:inset-ring-default',
    );
    expect(box).toHaveClass('nl:has-focus:outline-2', 'nl:has-focus:-outline-offset-1', 'nl:has-focus:outline-focused');
    expect(screen.getByText('Member number')).toHaveClass(
      'nl:peer-focus/input:-top-l',
      'nl:peer-not-placeholder-shown/input:text-label-s',
    );
  });

  it('the placeholder is a hint, never the name', () => {
    render(<NlInputBase label="Member number" placeholder="0042" />);
    const input = screen.getByRole('textbox', { name: 'Member number' });
    expect(input).toHaveAttribute('placeholder', '0042');
    expect(input).toHaveClass('nl:placeholder:text-transparent', 'nl:focus:placeholder:text-placeholder');
  });

  it('types, uncontrolled and controlled', async () => {
    const onChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState('');
      return (
        <NlInputBase
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
        <NlInputBase label="Uncontrolled" defaultValue="Tier" />
        <Controlled />
      </>,
    );
    await userEvent.type(screen.getByRole('textbox', { name: 'Uncontrolled' }), ' 2');
    expect(screen.getByRole('textbox', { name: 'Uncontrolled' })).toHaveValue('Tier 2');
    await userEvent.type(screen.getByRole('textbox', { name: 'Controlled' }), 'ab');
    expect(screen.getByRole('textbox', { name: 'Controlled' })).toHaveValue('ab');
    expect(onChange).toHaveBeenLastCalledWith('ab');
  });

  it('helper text describes the input inside a polite live region, without an icon by default', () => {
    render(<NlInputBase label="Member number" helperText="On the member card." />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAccessibleDescription('On the member card.');
    const helper = screen.getByText('On the member card.').parentElement;
    expect(helper).toHaveAttribute('data-tone', 'default');
    expect(helper?.querySelector('[data-slot="icon"]')).toBeNull();
    expect(helper?.parentElement).toHaveAttribute('aria-live', 'polite');
    expect(helper).toHaveClass('nl:mt-m');
  });

  it('keeps the live region when there is no helper text', () => {
    const { container } = render(<NlInputBase label="Member number" />);
    expect(container.querySelector('[aria-live="polite"]')).toBeEmptyDOMElement();
  });

  it('error: aria-invalid, border-error, error helper with its icon', () => {
    render(<NlInputBase label="Member number" error helperText="Enter a member number." />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(boxOf(input)).toHaveClass('nl:inset-ring-error');
    expect(boxOf(input)).not.toHaveClass('nl:inset-ring-default');
    const helper = screen.getByText('Enter a member number.').parentElement;
    expect(helper).toHaveAttribute('data-tone', 'error');
    expect(helper?.querySelector('[data-icon="error"]')).not.toBeNull();
  });

  it('disabled: native, disabled helper tone, disabled colours', () => {
    render(<NlInputBase label="Member number" disabled helperText="Can’t be changed." />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    const helper = screen.getByText('Can’t be changed.').parentElement;
    expect(helper).toHaveAttribute('data-tone', 'disabled');
    expect(helper?.querySelector('[data-slot="icon"]')).toBeNull();
    expect(boxOf(input)).toHaveClass('nl:has-disabled:inset-ring-disabled');
    expect(screen.getByText('Member number')).toHaveClass('nl:peer-disabled/input:text-disabled');
  });

  it('small size', () => {
    render(<NlInputBase label="Member number" size="small" />);
    const input = screen.getByRole('textbox');
    expect(boxOf(input)).toHaveClass('nl:h-40', 'nl:py-m');
    expect(screen.getByText('Member number')).toHaveClass('nl:peer-focus/input:-top-m');
  });

  it('prefix, suffix, leading and trailing in order', () => {
    render(
      <NlInputBase
        label="Points"
        prefix="+"
        suffix="pts"
        leading={<NlIcon name="search" size={24} tone="inherit" />}
        trailing={<NlIcon name="info" size={24} tone="inherit" />}
      />,
    );
    const box = boxOf(screen.getByRole('textbox'));
    const parts = [...box.children].map((child) => (child as HTMLElement).dataset.slot ?? child.textContent);
    expect(parts[0]).toBe('leading');
    expect(parts[1]).toBe('+');
    expect(parts.at(-2)).toBe('pts');
    expect(parts.at(-1)).toBe('trailing');
    expect(box.querySelector('[data-slot="leading"]')).toHaveClass(
      'nl:text-fg-secondary',
      'nl:group-has-disabled/field:text-fg-disabled',
    );
  });

  it('required is native; ref, attributes and className pass through', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(
      <NlInputBase
        label="Member number"
        required
        name="member"
        ref={ref}
        aria-describedby="extra"
        className="nl:mt-m"
      />,
    );
    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('name', 'member');
    expect(input).toHaveAttribute('aria-describedby', 'extra');
    expect(ref.current).toBe(input);
    expect((container.firstElementChild as HTMLElement).className.split(' ').at(-1)).toBe('nl:mt-m');
  });
});
