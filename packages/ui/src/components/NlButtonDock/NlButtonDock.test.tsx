import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NlButtonDock } from './NlButtonDock';

describe('NlButtonDock', () => {
  it('padding, gap and background from the spec; not sticky by default', () => {
    const { container } = render(<NlButtonDock primary={{ children: 'Save' }} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('nl:bg-primary', 'nl:pt-xl', 'nl:px-3xl', 'nl:pb-6xl', 'nl:gap-3xl', 'nl:shadow-none');
    expect(root).not.toHaveAttribute('data-sticky');
  });

  it('all buttons small; variants fixed; DOM order tertiary, secondary, primary', async () => {
    render(
      <NlButtonDock
        primary={{ children: 'Save' }}
        secondary={{ children: 'Cancel' }}
        tertiary={{ children: 'Reset' }}
      />,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.map((b) => b.textContent)).toEqual(['Reset', 'Cancel', 'Save']);
    expect(buttons.map((b) => b.getAttribute('data-variant'))).toEqual(['tertiary', 'secondary', 'primary']);
    for (const button of buttons) expect(button).toHaveAttribute('data-size', 'small');
    await userEvent.tab();
    expect(buttons[0]).toHaveFocus();
  });

  it('passes button props through (onClick, type submit, disabled)', async () => {
    const onClick = vi.fn();
    render(
      <NlButtonDock
        primary={{ children: 'Save', type: 'submit', onClick }}
        secondary={{ children: 'X', disabled: true }}
      />,
    );
    const save = screen.getByRole('button', { name: 'Save' });
    expect(save).toHaveAttribute('type', 'submit');
    await userEvent.click(save);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'X' })).toBeDisabled();
  });

  it('a string accessory is an NlTextBlock description (Body M, text-secondary); a node is placed as is', () => {
    const { rerender } = render(<NlButtonDock accessory="Note" primary={{ children: 'Save' }} />);
    expect(screen.getByText('Note')).toHaveClass('nl:text-body-m', 'nl:text-secondary');
    rerender(<NlButtonDock accessory={<strong>Custom</strong>} primary={{ children: 'Save' }} />);
    expect(screen.getByText('Custom').tagName).toBe('STRONG');
  });

  it('sticky adds the sticky shadow', () => {
    const { container } = render(<NlButtonDock sticky primary={{ children: 'Save' }} />);
    expect(container.firstElementChild).toHaveClass('nl:shadow-sticky');
    expect(container.firstElementChild).toHaveAttribute('data-sticky', 'true');
  });

  it('the end group wraps and stays at the end (OD-170)', () => {
    render(<NlButtonDock secondary={{ children: 'Cancel' }} primary={{ children: 'Save' }} />);
    expect(screen.getByRole('button', { name: 'Save' }).parentElement).toHaveClass('nl:flex-wrap', 'nl:justify-end');
  });

  it('renders nothing with nothing to show (OD-171)', () => {
    const { container } = render(<NlButtonDock />);
    expect(container).toBeEmptyDOMElement();
  });
});
