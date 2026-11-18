import { fireEvent, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlSlider } from './NlSlider';

const rootOf = (slider: HTMLElement) => {
  const root = slider.parentElement;
  if (!root) throw new Error('NlSlider input has no root');
  return root;
};
const position = (slider: HTMLElement) => rootOf(slider).style.getPropertyValue('--nl-slider-value');

describe('NlSlider', () => {
  it('is a native range input named by aria-label, 0 to 100 step 1 by default', () => {
    render(<NlSlider aria-label="Points" />);
    const slider = screen.getByRole('slider', { name: 'Points' });
    expect(slider).toHaveAttribute('type', 'range');
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '100');
    expect(slider).toHaveAttribute('step', '1');
    expect(slider).toHaveValue('0');
  });

  it('can be named by a visible label', () => {
    render(
      <>
        <span id="cap">Reward points</span>
        <NlSlider aria-labelledby="cap" />
      </>,
    );
    expect(screen.getByRole('slider', { name: 'Reward points' })).toBeInTheDocument();
  });

  it('passes aria-valuetext for a unit', () => {
    render(<NlSlider aria-label="Points" defaultValue={50} aria-valuetext="50 points" />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '50 points');
  });

  // Arrow, Page and Home/End keys are the browser's own range behaviour; jsdom doesn't run them, so these tests drive
  // the change event. The keys are checked in a real browser (Storybook).
  it('uncontrolled: starts at defaultValue and moves on change, calling onChange with a number', () => {
    const onChange = vi.fn();
    render(<NlSlider aria-label="Points" defaultValue={50} onChange={onChange} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveValue('50');
    fireEvent.change(slider, { target: { value: '51' } });
    expect(slider).toHaveValue('51');
    expect(onChange).toHaveBeenLastCalledWith(51);
    expect(position(slider)).toBe('51%');
  });

  it('controlled: shows value and only moves when the parent updates it', () => {
    const onChange = vi.fn();
    const { rerender } = render(<NlSlider aria-label="Points" value={20} onChange={onChange} />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '60' } });
    expect(onChange).toHaveBeenCalledWith(60);
    expect(slider).toHaveValue('20');
    rerender(<NlSlider aria-label="Points" value={60} onChange={onChange} />);
    expect(slider).toHaveValue('60');
    expect(position(slider)).toBe('60%');
  });

  it('works as a controlled component in a parent', () => {
    function Parent() {
      const [v, setV] = useState(10);
      return <NlSlider aria-label="Points" value={v} onChange={setV} />;
    }
    render(<Parent />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '100' } });
    expect(slider).toHaveValue('100');
    expect(position(slider)).toBe('100%');
  });

  it.each([
    [0, 100, 50, '50%'],
    [10, 20, 15, '50%'],
    [0, 10, 2.5, '25%'],
    [5, 5, 5, '0%'],
  ])('min %s max %s value %s draws at %s', (min, max, value, expected) => {
    render(<NlSlider aria-label="Points" min={min} max={max} step={0.5} value={value} onChange={vi.fn()} />);
    expect(position(screen.getByRole('slider'))).toBe(expected);
  });

  it('disabled: native disabled, not focusable, no pointer events', () => {
    render(<NlSlider aria-label="Points" disabled />);
    const slider = screen.getByRole('slider');
    expect(slider).toBeDisabled();
    slider.focus();
    expect(slider).not.toHaveFocus();
    expect(slider).toHaveClass('nl:disabled:pointer-events-none');
    expect(rootOf(slider)).toHaveAttribute('data-disabled');
  });

  it('draws track, fill and thumb hidden from screen readers, after the input so they follow its state', () => {
    render(<NlSlider aria-label="Points" />);
    const slider = screen.getByRole('slider');
    const parts = [...rootOf(slider).children].slice(1);
    expect(rootOf(slider).firstElementChild).toBe(slider);
    expect(slider).toHaveClass('nl:peer', 'nl:opacity-0');
    expect(parts).toHaveLength(3);
    for (const part of parts) expect(part).toHaveAttribute('aria-hidden', 'true');
  });

  it('uses the spec colours and states', () => {
    render(<NlSlider aria-label="Points" />);
    const [track, fill, thumb] = [...rootOf(screen.getByRole('slider')).children].slice(1) as HTMLElement[];
    expect(track).toHaveClass('nl:h-8', 'nl:rounded-xs', 'nl:bg-active-hover', 'nl:peer-disabled:bg-disabled');
    expect(fill).toHaveClass(
      'nl:h-8',
      'nl:slider-fill',
      'nl:bg-fg-brand',
      'nl:peer-hover:bg-fg-hovered',
      'nl:peer-active:bg-fg-pressed',
      'nl:peer-disabled:bg-fg-disabled-on-bg',
    );
    expect(thumb).toHaveClass(
      'nl:size-24',
      'nl:rounded-full',
      'nl:slider-thumb',
      'nl:inset-ring-2',
      'nl:inset-ring-inverse',
      'nl:shadow-resting',
      'nl:peer-focus-visible:outline-focused',
      'nl:peer-disabled:shadow-none',
    );
  });

  it('puts className on the root and ref and native attributes on the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<NlSlider aria-label="Points" className="nl:mt-xl" name="points" id="probe" ref={ref} />);
    const slider = screen.getByRole('slider');
    expect(rootOf(slider).className.split(' ').at(-1)).toBe('nl:mt-xl');
    expect(slider).toHaveAttribute('name', 'points');
    expect(slider).toHaveAttribute('id', 'probe');
    expect(ref.current).toBe(slider);
  });
});
