import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NlButton } from '../NlButton';
import { NlTooltip } from './NlTooltip';

const tooltipOf = () => screen.getByRole('tooltip', { hidden: true });

afterEach(() => {
  vi.useRealTimers();
});

describe('NlTooltip', () => {
  it('describes its trigger, hidden until needed', () => {
    render(
      <NlTooltip content="More actions">
        <NlButton variant="tertiary" icon="only-icon" iconName="more_vert">
          More actions
        </NlButton>
      </NlTooltip>,
    );
    const tooltip = tooltipOf();
    const button = screen.getByRole('button', { name: 'More actions' });
    expect(button).toHaveAttribute('aria-describedby', tooltip.id);
    expect(button).toHaveAccessibleDescription('More actions');
    expect(tooltip).toHaveAttribute('data-shown', 'false');
    expect(tooltip).toHaveAttribute('data-type', 'single');
    expect(tooltip).toHaveClass('nl:hidden');
  });

  it('keeps the trigger’s own aria-describedby, ref and handlers', async () => {
    const ref = createRef<HTMLButtonElement>();
    const onFocus = vi.fn();
    render(
      <>
        <span id="extra">Opens a menu</span>
        <NlTooltip content="Filters">
          <NlButton ref={ref} aria-describedby="extra" onFocus={onFocus}>
            Filters
          </NlButton>
        </NlTooltip>
      </>,
    );
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-describedby')).toBe(`extra ${tooltipOf().id}`);
    expect(ref.current).toBe(button);
    await userEvent.tab();
    expect(onFocus).toHaveBeenCalled();
  });

  it('shows at once on keyboard focus and hides on blur', async () => {
    render(
      <NlTooltip content="Add reward">
        <NlButton icon="only-icon" iconName="add">
          Add reward
        </NlButton>
      </NlTooltip>,
    );
    await userEvent.tab();
    expect(tooltipOf()).toHaveAttribute('data-shown', 'true');
    expect(tooltipOf()).toHaveClass('nl:block');
    await userEvent.tab();
    expect(tooltipOf()).toHaveAttribute('data-shown', 'false');
  });

  it('Escape hides it without moving focus', async () => {
    render(
      <NlTooltip content="Add reward">
        <NlButton>Add</NlButton>
      </NlTooltip>,
    );
    await userEvent.tab();
    expect(tooltipOf()).toHaveAttribute('data-shown', 'true');
    await userEvent.keyboard('{Escape}');
    expect(tooltipOf()).toHaveAttribute('data-shown', 'false');
    expect(screen.getByRole('button')).toHaveFocus();
  });

  it('shows after a delay on hover, and stays while the pointer moves into it', () => {
    vi.useFakeTimers();
    render(
      <NlTooltip content="Add reward">
        <NlButton>Add</NlButton>
      </NlTooltip>,
    );
    const button = screen.getByRole('button');
    fireEvent.pointerEnter(button, { pointerType: 'mouse' });
    expect(tooltipOf()).toHaveAttribute('data-shown', 'false');
    act(() => {
      vi.runAllTimers();
    });
    expect(tooltipOf()).toHaveAttribute('data-shown', 'true');
    // Into the tooltip: stays. Out of the tooltip to elsewhere: hides.
    fireEvent.pointerLeave(button, { relatedTarget: tooltipOf() });
    expect(tooltipOf()).toHaveAttribute('data-shown', 'true');
    fireEvent.pointerLeave(tooltipOf(), { relatedTarget: document.body });
    expect(tooltipOf()).toHaveAttribute('data-shown', 'false');
  });

  it('does not show on touch', () => {
    vi.useFakeTimers();
    render(
      <NlTooltip content="Add reward">
        <NlButton>Add</NlButton>
      </NlTooltip>,
    );
    fireEvent.pointerEnter(screen.getByRole('button'), { pointerType: 'touch' });
    act(() => {
      vi.runAllTimers();
    });
    expect(tooltipOf()).toHaveAttribute('data-shown', 'false');
  });

  it('single line: dark box, Caption L, text-inverse, no wrapping', () => {
    render(
      <NlTooltip content="Add reward">
        <NlButton>Add</NlButton>
      </NlTooltip>,
    );
    const tooltip = tooltipOf();
    expect(tooltip).toHaveClass(
      'nl:fixed',
      'nl:z-tooltip',
      'nl:p-xs',
      'nl:tooltip-position',
      'nl:duration-base',
      'nl:motion-reduce:transition-none',
    );
    expect(tooltip.firstElementChild).toHaveClass(
      'nl:rounded-s',
      'nl:bg-direct',
      'nl:py-m',
      'nl:px-xl',
      'nl:whitespace-nowrap',
      'nl:text-caption-l',
      'nl:text-inverse',
    );
  });

  it('rich: heading and description in an inverse NlTextBlock, up to Size-320, all in the description', () => {
    render(
      <NlTooltip heading="Tier 2" description="Members with 1,000 points or more.">
        <NlButton>Tier 2</NlButton>
      </NlTooltip>,
    );
    const tooltip = tooltipOf();
    expect(tooltip).toHaveAttribute('data-type', 'rich');
    expect(tooltip.firstElementChild).toHaveClass('nl:py-l', 'nl:px-xl', 'nl:max-w-320');
    expect(screen.getByRole('button')).toHaveAccessibleDescription('Tier 2 Members with 1,000 points or more.');
  });
});
