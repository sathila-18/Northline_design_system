import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlSwitch } from './NlSwitch';

const handleOf = (sw: HTMLElement) => sw.firstElementChild as HTMLElement;

describe('NlSwitch', () => {
  it('is a native button with role switch, named by aria-label, off by default', () => {
    render(<NlSwitch aria-label="Email updates" />);
    const sw = screen.getByRole('switch', { name: 'Email updates' });
    expect(sw.tagName).toBe('BUTTON');
    expect(sw).toHaveAttribute('type', 'button');
    expect(sw).toHaveAttribute('aria-checked', 'false');
    expect(sw).toHaveAttribute('data-state', 'off');
  });

  it('can be named by a visible label', () => {
    render(
      <>
        <span id="cap">Email updates</span>
        <NlSwitch aria-labelledby="cap" />
      </>,
    );
    expect(screen.getByRole('switch', { name: 'Email updates' })).toBeInTheDocument();
  });

  it('uncontrolled: toggles on click, Space and Enter, calling onCheckedChange', async () => {
    const onCheckedChange = vi.fn();
    render(<NlSwitch aria-label="A" onCheckedChange={onCheckedChange} />);
    const sw = screen.getByRole('switch');
    await userEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    sw.focus();
    await userEvent.keyboard(' ');
    expect(sw).toHaveAttribute('aria-checked', 'false');
    await userEvent.keyboard('{Enter}');
    expect(sw).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenCalledTimes(3);
  });

  it('starts from defaultChecked', () => {
    render(<NlSwitch aria-label="A" defaultChecked />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('controlled: shows checked and only changes when the parent updates it', async () => {
    const onCheckedChange = vi.fn();
    const { rerender } = render(<NlSwitch aria-label="A" checked={false} onCheckedChange={onCheckedChange} />);
    const sw = screen.getByRole('switch');
    await userEvent.click(sw);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(sw).toHaveAttribute('aria-checked', 'false');
    rerender(<NlSwitch aria-label="A" checked onCheckedChange={onCheckedChange} />);
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('works as a controlled component in a parent', async () => {
    function Parent() {
      const [on, setOn] = useState(false);
      return <NlSwitch aria-label="A" checked={on} onCheckedChange={setOn} />;
    }
    render(<Parent />);
    const sw = screen.getByRole('switch');
    await userEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onClick, and preventDefault in it stops the toggle', async () => {
    const onCheckedChange = vi.fn();
    render(
      <NlSwitch
        aria-label="A"
        onClick={(e) => {
          e.preventDefault();
        }}
        onCheckedChange={onCheckedChange}
      />,
    );
    await userEvent.click(screen.getByRole('switch'));
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('disabled: native disabled, not focusable, does not toggle', async () => {
    const onCheckedChange = vi.fn();
    render(<NlSwitch aria-label="A" disabled onCheckedChange={onCheckedChange} />);
    const sw = screen.getByRole('switch');
    expect(sw).toBeDisabled();
    sw.focus();
    expect(sw).not.toHaveFocus();
    await userEvent.click(sw);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('defaults to large: Size-56 × Size-32 track, Size-24 handle sliding Space-3XL', () => {
    render(<NlSwitch aria-label="A" />);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveAttribute('data-size', 'large');
    expect(sw).toHaveClass('nl:w-56', 'nl:h-32', 'nl:p-xs', 'nl:rounded-full');
    expect(handleOf(sw)).toHaveClass('nl:size-24', 'nl:group-aria-checked/switch:translate-x-3xl');
  });

  it('small: Size-40 × Size-24 track, Size-16 handle sliding Space-XL', () => {
    render(<NlSwitch aria-label="A" size="small" />);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveAttribute('data-size', 'small');
    expect(sw).toHaveClass('nl:w-40', 'nl:h-24');
    expect(handleOf(sw)).toHaveClass('nl:size-16', 'nl:group-aria-checked/switch:translate-x-xl');
  });

  it('uses the spec colours, with no hover or pressed change (OD-13b)', () => {
    render(<NlSwitch aria-label="A" />);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveClass(
      'nl:bg-fg-placeholder',
      'nl:aria-checked:bg-fg-brand',
      'nl:disabled:bg-border-disabled',
      'nl:disabled:aria-checked:bg-disabled',
      'nl:focus-visible:outline-focused',
    );
    expect(sw.className).not.toMatch(/hover:|active:/);
    expect(handleOf(sw)).toHaveClass(
      'nl:bg-fg-white-both',
      'nl:group-disabled/switch:bg-fg-disabled',
      'nl:group-disabled/switch:group-aria-checked/switch:bg-fg-disabled-on-bg',
    );
    expect(handleOf(sw)).toHaveAttribute('aria-hidden', 'true');
  });

  it('passes className, native attributes and ref to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<NlSwitch aria-label="A" className="nl:ms-xs" id="probe" name="updates" ref={ref} />);
    const sw = screen.getByRole('switch');
    expect(sw.className.split(' ').at(-1)).toBe('nl:ms-xs');
    expect(sw).toHaveAttribute('id', 'probe');
    expect(ref.current).toBe(sw);
  });
});
