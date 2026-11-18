import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlRadio } from './NlRadio';

const rootOf = (radio: HTMLElement) => {
  const root = radio.parentElement;
  if (!root) throw new Error('NlRadio input has no root');
  return root;
};

function Group({ onChange }: { onChange?: (value: string) => void }) {
  const [value, setValue] = useState('tier-2');
  return (
    <div role="radiogroup" aria-label="Tier">
      {['tier-1', 'tier-2', 'tier-3'].map((tier, i) => (
        <label key={tier}>
          <NlRadio
            name="tier"
            value={tier}
            checked={value === tier}
            onChange={(e) => {
              setValue(e.target.value);
              onChange?.(e.target.value);
            }}
          />
          Tier {i + 1}
        </label>
      ))}
    </div>
  );
}

describe('NlRadio', () => {
  it('is a native radio named by aria-label, not selected by default', () => {
    render(<NlRadio aria-label="Tier 2" />);
    const radio = screen.getByRole('radio', { name: 'Tier 2' });
    expect(radio).toHaveAttribute('type', 'radio');
    expect(radio).not.toBeChecked();
  });

  it('can be named by a wrapping label, and clicking the label selects it', async () => {
    render(
      <label>
        <NlRadio name="t" value="a" />
        Tier 1
      </label>,
    );
    await userEvent.click(screen.getByText('Tier 1'));
    expect(screen.getByRole('radio', { name: 'Tier 1' })).toBeChecked();
  });

  it('uncontrolled: defaultChecked, and selects on click', async () => {
    const onChange = vi.fn();
    render(<NlRadio aria-label="A" onChange={onChange} />);
    const radio = screen.getByRole('radio');
    await userEvent.click(radio);
    expect(radio).toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('controlled in a group: one selected, Space selects, a click moves the selection', async () => {
    const onChange = vi.fn();
    render(<Group onChange={onChange} />);
    const [one, two, three] = screen.getAllByRole('radio') as [HTMLElement, HTMLElement, HTMLElement];
    expect(two).toBeChecked();
    await userEvent.click(three);
    expect(three).toBeChecked();
    expect(two).not.toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith('tier-3');
    one.focus();
    await userEvent.keyboard(' ');
    expect(one).toBeChecked();
  });

  it('disabled: native disabled, not focusable, no change on click, no pointer events on the box', async () => {
    const onChange = vi.fn();
    render(<NlRadio aria-label="A" disabled onChange={onChange} />);
    const radio = screen.getByRole('radio');
    expect(radio).toBeDisabled();
    radio.focus();
    expect(radio).not.toHaveFocus();
    await userEvent.click(radio);
    expect(onChange).not.toHaveBeenCalled();
    expect(radio).not.toBeChecked();
    expect(rootOf(radio)).toHaveClass('nl:has-disabled:pointer-events-none');
  });

  it('draws a ring and a dot hidden from screen readers, inside a Size-24 named group', () => {
    render(<NlRadio aria-label="A" />);
    const root = rootOf(screen.getByRole('radio'));
    const [, ring, dot] = [...root.children] as HTMLElement[];
    expect(root).toHaveClass('nl:group/radio', 'nl:size-24', 'nl:rounded-full');
    expect(ring).toHaveAttribute('aria-hidden', 'true');
    expect(dot).toHaveAttribute('aria-hidden', 'true');
    expect(ring).toHaveClass('nl:size-20', 'nl:border-2', 'nl:border-strong', 'nl:rounded-full');
    expect(dot).toHaveClass('nl:size-12', 'nl:bg-fg-action', 'nl:opacity-0', 'nl:group-has-checked/radio:opacity-100');
  });

  it('uses the spec colours for every state', () => {
    render(<NlRadio aria-label="A" />);
    const [, ring, dot] = [...rootOf(screen.getByRole('radio')).children] as HTMLElement[];
    expect(ring).toHaveClass(
      'nl:group-hover/radio:border-hovered',
      'nl:group-hover/radio:bg-active',
      'nl:group-active/radio:border-pressed',
      'nl:group-active/radio:bg-active-hover',
      'nl:group-has-disabled/radio:border-fg-disabled',
      'nl:group-has-checked/radio:border-fg-action',
      'nl:group-has-checked/radio:group-hover/radio:border-fg-hovered',
      'nl:group-has-checked/radio:group-active/radio:border-fg-pressed',
    );
    expect(dot).toHaveClass(
      'nl:group-hover/radio:bg-fg-hovered',
      'nl:group-active/radio:bg-fg-pressed',
      'nl:group-has-disabled/radio:bg-fg-disabled',
    );
  });

  it('shows the standard focus ring around the box on keyboard focus only', () => {
    render(<NlRadio aria-label="A" />);
    expect(rootOf(screen.getByRole('radio'))).toHaveClass(
      'nl:has-focus-visible:outline-2',
      'nl:has-focus-visible:-outline-offset-1',
      'nl:has-focus-visible:outline-focused',
    );
  });

  it('puts className on the root and ref and native attributes on the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<NlRadio aria-label="A" className="nl:me-xs" name="tier" value="t1" id="probe" ref={ref} />);
    const radio = screen.getByRole('radio');
    expect(rootOf(radio).className.split(' ').at(-1)).toBe('nl:me-xs');
    expect(radio).toHaveAttribute('name', 'tier');
    expect(radio).toHaveAttribute('value', 't1');
    expect(radio).toHaveAttribute('id', 'probe');
    expect(ref.current).toBe(radio);
  });
});
