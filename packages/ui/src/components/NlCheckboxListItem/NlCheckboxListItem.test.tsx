import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NlCheckboxListItem } from './NlCheckboxListItem';

const row = (box: HTMLElement) => box.closest('label') as HTMLElement;

describe('NlCheckboxListItem', () => {
  it('a label row named by its text, with the ring round the row and the box following the row', () => {
    render(<NlCheckboxListItem title="Tier 2" description="1,200 members" />);
    const box = screen.getByRole('checkbox', { name: /^Tier 2 ?1,200 members$/ });
    expect(box).not.toBeChecked();
    expect(row(box)).toHaveClass(
      'nl:group/list-item',
      'nl:has-focus-visible:outline-2',
      'nl:has-focus-visible:outline-focused',
      'nl:hover:bg-secondary',
    );
    const control = box.closest('span');
    expect(control).not.toHaveClass('nl:has-focus-visible:outline-2');
    expect(control?.querySelector('[aria-hidden="true"]')).toHaveClass('nl:group-hover/list-item:border-hovered');
  });

  it('clicking anywhere on the row toggles it and takes the selected colours', async () => {
    const onCheckedChange = vi.fn();
    render(<NlCheckboxListItem title="Tier 2" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByText('Tier 2'));
    const box = screen.getByRole('checkbox');
    expect(box).toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(row(box)).toHaveClass('nl:bg-active', 'nl:hover:bg-active-hover');
    expect(row(box)).toHaveAttribute('data-checked', 'true');
  });

  it('Space toggles from the keyboard', async () => {
    render(<NlCheckboxListItem title="Tier 2" />);
    await userEvent.tab();
    const box = screen.getByRole('checkbox');
    expect(box).toHaveFocus();
    await userEvent.keyboard(' ');
    expect(box).toBeChecked();
  });

  it('controlled: follows `checked`', async () => {
    const onCheckedChange = vi.fn();
    render(<NlCheckboxListItem title="Tier 2" checked={false} onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByText('Tier 2'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('disabled: native disabled, no toggle, no hover group', async () => {
    render(<NlCheckboxListItem title="Tier 3" disabled />);
    const box = screen.getByRole('checkbox');
    expect(box).toBeDisabled();
    await userEvent.click(screen.getByText('Tier 3'));
    expect(box).not.toBeChecked();
    expect(row(box)).not.toHaveClass('nl:group/list-item');
    expect(row(box)).toHaveClass('nl:has-focus-visible:outline-2');
  });

  it('the checkbox lines up with the title: slot one title line high, content aligned to the top', () => {
    const { container, rerender } = render(<NlCheckboxListItem title="Tier 2" description="1,200 members" />);
    expect(container.querySelector('[data-slot="content"]')).toHaveClass('nl:items-start');
    expect(container.querySelector('[data-slot="leading"]')).toHaveClass('nl:h-lh', 'nl:text-headline-small-h6');
    rerender(<NlCheckboxListItem title="Tier 2" size="small" />);
    expect(container.querySelector('[data-slot="leading"]')).toHaveClass('nl:h-lh', 'nl:text-label-m');
  });

  it('trailing checkbox, form value and name', () => {
    const { container } = render(
      <NlCheckboxListItem title="Tier 2" controlSide="trailing" name="tiers" value="tier-2" />,
    );
    expect(container.querySelector('[data-slot="trailing"] input')).not.toBeNull();
    expect(container.querySelector('[data-slot="leading"]')).toBeNull();
    expect(screen.getByRole('checkbox')).toHaveAttribute('name', 'tiers');
    expect(screen.getByRole('checkbox')).toHaveAttribute('value', 'tier-2');
  });

  it('body replaces the description and is part of the name', () => {
    render(<NlCheckboxListItem title="A" description="Gone" body={<em>Custom</em>} />);
    expect(screen.queryByText('Gone')).toBeNull();
    expect(screen.getByRole('checkbox', { name: /^A ?Custom$/ })).toBeInTheDocument();
  });
});
