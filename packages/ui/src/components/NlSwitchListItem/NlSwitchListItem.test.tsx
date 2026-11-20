import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NlSwitchListItem } from './NlSwitchListItem';

const row = (control: HTMLElement) => control.closest('label') as HTMLElement;

describe('NlSwitchListItem', () => {
  it('one switch named by the title, described by the description; small; ring round the row', () => {
    render(<NlSwitchListItem title="Email updates" description="News about rewards" />);
    const control = screen.getByRole('switch', { name: 'Email updates' });
    expect(control).toHaveAccessibleDescription('News about rewards');
    expect(control).toHaveAttribute('aria-checked', 'false');
    expect(control).toHaveAttribute('data-size', 'small');
    expect(control).not.toHaveClass('nl:focus-visible:outline-2');
    expect(row(control)).toHaveClass('nl:has-focus-visible:outline-2', 'nl:hover:bg-secondary');
  });

  it('clicking anywhere on the row toggles once; an on row is not highlighted', async () => {
    const onCheckedChange = vi.fn();
    render(<NlSwitchListItem title="Email updates" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByText('Email updates'));
    const control = screen.getByRole('switch');
    expect(control).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(row(control)).not.toHaveClass('nl:bg-active');
    await userEvent.click(control);
    expect(control).toHaveAttribute('aria-checked', 'false');
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
  });

  it('Space toggles from the keyboard', async () => {
    render(<NlSwitchListItem title="Email updates" />);
    await userEvent.tab();
    const control = screen.getByRole('switch');
    expect(control).toHaveFocus();
    await userEvent.keyboard(' ');
    expect(control).toHaveAttribute('aria-checked', 'true');
  });

  it('disabled: native disabled, no toggle', async () => {
    render(<NlSwitchListItem title="Email updates" disabled />);
    const control = screen.getByRole('switch');
    expect(control).toBeDisabled();
    await userEvent.click(screen.getByText('Email updates'));
    expect(control).toHaveAttribute('aria-checked', 'false');
  });

  it('leading icon; switch on the title line (OD-163)', () => {
    const { container } = render(<NlSwitchListItem title="A" icon="notifications" />);
    expect(container.querySelector('[data-slot="leading"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="trailing"]')).toHaveClass('nl:h-lh');
    expect(container.querySelector('[data-slot="content"]')).toHaveClass('nl:items-start');
  });

  it('body describes the switch; showBody off hides it (OD-164)', () => {
    const { rerender } = render(<NlSwitchListItem title="A" description="Gone" body={<em>Custom</em>} />);
    expect(screen.queryByText('Gone')).toBeNull();
    expect(screen.getByRole('switch', { name: 'A' })).toHaveAccessibleDescription('Custom');
    rerender(<NlSwitchListItem title="A" description="Desc" showBody={false} />);
    expect(screen.queryByText('Desc')).toBeNull();
    expect(screen.getByRole('switch', { name: 'A' })).not.toHaveAttribute('aria-describedby');
  });
});
