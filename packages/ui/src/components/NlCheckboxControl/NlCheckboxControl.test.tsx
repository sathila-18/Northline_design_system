import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlCheckboxControl } from './NlCheckboxControl';

const rootOf = (checkbox: HTMLElement) => {
  const root = checkbox.parentElement;
  if (!root) throw new Error('NlCheckboxControl input has no root');
  return root;
};

/** A parent "select all" that is mixed until clicked, as a table header would use it. */
function SelectAll({ onChange }: { onChange?: (checked: boolean) => void }) {
  const [checked, setChecked] = useState(false);
  const [mixed, setMixed] = useState(true);
  return (
    <NlCheckboxControl
      aria-label="Select all members"
      checked={checked}
      indeterminate={mixed}
      onChange={(e) => {
        setChecked(e.target.checked);
        setMixed(false);
        onChange?.(e.target.checked);
      }}
    />
  );
}

describe('NlCheckboxControl', () => {
  it('is a native checkbox named by aria-label, not checked by default', () => {
    render(<NlCheckboxControl aria-label="Member 0042" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Member 0042' });
    expect(checkbox).toHaveAttribute('type', 'checkbox');
    expect(checkbox).not.toBeChecked();
    expect(checkbox).not.toBePartiallyChecked();
  });

  it('is named by a wrapping label, and Space toggles it', async () => {
    const onChange = vi.fn();
    render(
      <label>
        <NlCheckboxControl onChange={onChange} />
        Member 0042
      </label>,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Member 0042' });
    await userEvent.tab();
    expect(checkbox).toHaveFocus();
    await userEvent.keyboard(' ');
    expect(checkbox).toBeChecked();
    await userEvent.click(screen.getByText('Member 0042'));
    expect(checkbox).not.toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('sets indeterminate on the element and is announced as mixed', () => {
    render(<NlCheckboxControl aria-label="Select all" indeterminate />);
    const checkbox = screen.getByRole('checkbox', { name: 'Select all' });
    expect((checkbox as HTMLInputElement).indeterminate).toBe(true);
    expect(checkbox).toBePartiallyChecked();
  });

  it('a mixed checkbox becomes checked on activation', async () => {
    const onChange = vi.fn();
    render(<SelectAll onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox', { name: 'Select all members' });
    expect(checkbox).toBePartiallyChecked();
    await userEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(checkbox).toBeChecked();
    expect(checkbox).not.toBePartiallyChecked();
  });

  it('keeps indeterminate when the caller keeps it true', async () => {
    render(<NlCheckboxControl aria-label="Select all" indeterminate checked={false} onChange={() => undefined} />);
    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);
    expect(checkbox).toBePartiallyChecked();
  });

  it('disabled: native, not focusable, no change', async () => {
    const onChange = vi.fn();
    render(<NlCheckboxControl aria-label="Member 0042" disabled onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
    await userEvent.tab();
    expect(checkbox).not.toHaveFocus();
    await userEvent.click(checkbox);
    expect(onChange).not.toHaveBeenCalled();
    expect(rootOf(checkbox)).toHaveClass('nl:has-disabled:pointer-events-none');
  });

  it('draws a Size-24 root with the focus ring and a Size-20 box with decorative tick and dash', () => {
    render(<NlCheckboxControl aria-label="Member 0042" defaultChecked />);
    const root = rootOf(screen.getByRole('checkbox'));
    expect(root).toHaveClass(
      'nl:group/checkbox',
      'nl:size-24',
      'nl:rounded-xs',
      'nl:has-focus-visible:outline-2',
      'nl:has-focus-visible:-outline-offset-1',
      'nl:has-focus-visible:outline-focused',
    );
    const box = root.querySelector('[aria-hidden="true"]');
    expect(box).toHaveClass('nl:size-20', 'nl:rounded-xs', 'nl:border-2', 'nl:border-strong');
    expect(box).toHaveClass('nl:group-has-checked/checkbox:bg-action-primary');
    expect(box).toHaveClass('nl:group-has-indeterminate/checkbox:bg-action-primary');
    expect(root.querySelector('[data-slot="check"] [data-icon="check"]')).toHaveAttribute('data-size', '16');
    expect(root.querySelector('[data-slot="dash"] [data-icon="remove"]')).toHaveAttribute('data-size', '16');
  });

  it('passes ref and native attributes to the input and className to the root', () => {
    const ref = createRef<HTMLInputElement>();
    render(<NlCheckboxControl aria-label="Member 0042" name="members" value="0042" ref={ref} className="nl:ms-xs" />);
    const checkbox = screen.getByRole('checkbox');
    expect(ref.current).toBe(checkbox);
    expect(checkbox).toHaveAttribute('name', 'members');
    expect(checkbox).toHaveAttribute('value', '0042');
    expect(rootOf(checkbox).className.split(' ').at(-1)).toBe('nl:ms-xs');
  });
});
