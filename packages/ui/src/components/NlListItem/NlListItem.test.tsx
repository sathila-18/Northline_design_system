import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NlListItem } from './NlListItem';

describe('NlListItem', () => {
  it('static without chevron or action: a div with no hover and no focus (OD-98)', () => {
    const { container } = render(<NlListItem title="Member 0042" description="Tier 2" />);
    const row = container.firstElementChild as HTMLElement;
    expect(row.tagName).toBe('DIV');
    expect(row).toHaveAttribute('data-kind', 'static');
    expect(row).not.toHaveAttribute('tabindex');
    expect(row).not.toHaveAttribute('aria-labelledby');
    expect(row).not.toHaveClass('nl:hover:bg-secondary');
  });

  it('chevron makes the whole row a button, named by its text in order (WCAG 2.5.3)', async () => {
    const onClick = vi.fn();
    render(<NlListItem title="Member 0042" description="Tier 2" caption="Today" chevron onClick={onClick} />);
    const row = screen.getByRole('button', { name: /^Member 0042 Tier 2 ?Today$/ });
    expect(row).toHaveAttribute('type', 'button');
    expect(row).toHaveClass('nl:hover:bg-secondary', 'nl:active:bg-secondary');
    await userEvent.tab();
    expect(row).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('chevron alone (no onClick) still makes a focusable button', () => {
    render(<NlListItem title="A" chevron />);
    expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument();
  });

  it('filled always shows the chevron and is actionable', () => {
    const { container } = render(<NlListItem appearance="filled" title="A" />);
    expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument();
    expect(container.querySelector('[data-slot="trailing"] [aria-hidden="true"]')).not.toBeNull();
  });

  it('href makes a link; the page sets aria-current (OD-152)', () => {
    render(<NlListItem title="Member 0042" href="#m" selected aria-current="page" />);
    const link = screen.getByRole('link', { name: 'Member 0042' });
    expect(link).toHaveAttribute('href', '#m');
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass('nl:bg-active');
  });

  it('disabled (OD-153): native disabled button; link loses href and gets aria-disabled', () => {
    const { rerender } = render(<NlListItem title="A" chevron disabled />);
    expect(screen.getByRole('button', { name: 'A' })).toBeDisabled();
    rerender(<NlListItem title="A" href="#a" disabled />);
    const link = screen.getByText('A').closest('a');
    expect(link).not.toHaveAttribute('href');
    expect(link).toHaveAttribute('aria-disabled', 'true');
  });

  it('menu rows: role option with aria-selected and tabIndex -1; disabled is aria-disabled and does nothing', async () => {
    const onClick = vi.fn();
    render(
      <>
        <NlListItem role="option" title="Tier 1" selected />
        <NlListItem role="option" title="Tier 3" disabled onClick={onClick} />
      </>,
    );
    const first = screen.getByRole('option', { name: 'Tier 1' });
    expect(first).toHaveAttribute('aria-selected', 'true');
    expect(first).toHaveAttribute('tabindex', '-1');
    const disabled = screen.getByRole('option', { name: 'Tier 3' });
    expect(disabled).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(disabled);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('leading: icon or avatar (medium); avatar wins', () => {
    const { container, rerender } = render(<NlListItem title="A" icon="person" />);
    expect(container.querySelector('[data-slot="leading"]')).not.toBeNull();
    rerender(<NlListItem title="A" icon="person" avatar={{ initials: 'M4' }} />);
    expect(screen.getByText('M4')).toBeInTheDocument();
  });

  it('caption is NlListCaption small and follows disabled', () => {
    render(<NlListItem title="A" caption="Today" disabled />);
    expect(screen.getByText('Today')).toHaveAttribute('data-disabled');
  });

  it('body replaces the description and is part of the name', () => {
    render(<NlListItem title="A" description="Gone" body={<em>Custom</em>} chevron />);
    expect(screen.queryByText('Gone')).toBeNull();
    expect(screen.getByRole('button', { name: 'A Custom' })).toBeInTheDocument();
  });

  it('divider can be turned off (OD-154)', () => {
    const { container, rerender } = render(<NlListItem title="A" />);
    expect(container.querySelector('[data-type="divider"]')).not.toBeNull();
    rerender(<NlListItem title="A" divider={false} />);
    expect(container.querySelector('[data-type="divider"]')).toBeNull();
  });
  it('a menu row with href is a link with role menuitem (navigation menus)', () => {
    render(<NlListItem role="menuitem" href="#rewards" title="Rewards" />);
    const row = screen.getByRole('menuitem', { name: 'Rewards' });
    expect(row.tagName).toBe('A');
    expect(row).toHaveAttribute('href', '#rewards');
    expect(row).toHaveAttribute('tabindex', '-1');
  });
});
