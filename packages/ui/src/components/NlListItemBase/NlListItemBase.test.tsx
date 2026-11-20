import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NlIcon } from '../../icons';
import { NlListItemBase } from './NlListItemBase';

const root = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('NlListItemBase', () => {
  it('defaults: plain, large, default density, a div with a divider and the focus ring', () => {
    const { container } = render(<NlListItemBase title="Member 0042" description="Tier 2" />);
    const row = root(container);
    expect(row.tagName).toBe('DIV');
    expect(row).toHaveAttribute('data-appearance', 'plain');
    expect(row).toHaveAttribute('data-size', 'large');
    expect(row).toHaveAttribute('data-density', 'default');
    expect(row).toHaveClass(
      'nl:px-xl',
      'nl:pt-xl',
      'nl:pb-none',
      'nl:gap-xl',
      'nl:bg-transparent',
      'nl:focus-visible:outline-2',
      'nl:focus-visible:outline-focused',
    );
    expect(row).not.toHaveClass('nl:hover:bg-secondary');
    expect(row.querySelector('[aria-hidden="true"][data-type="divider"]')).not.toBeNull();
    expect(screen.getByText('Member 0042')).toHaveClass('nl:text-headline-small-h6', 'nl:text-primary');
    expect(screen.getByText('Member 0042').tagName).toBe('SPAN');
    expect(screen.getByText('Tier 2')).toHaveClass('nl:text-body-m', 'nl:text-secondary');
  });

  it('small uses Label M and Body S (OD-14)', () => {
    render(<NlListItemBase size="small" title="Member 0042" description="Tier 2" />);
    expect(screen.getByText('Member 0042')).toHaveClass('nl:text-label-m');
    expect(screen.getByText('Tier 2')).toHaveClass('nl:text-body-s');
  });

  it('compact density and no divider', () => {
    const { container, rerender } = render(<NlListItemBase density="compact" title="A" />);
    expect(root(container)).toHaveClass('nl:px-m', 'nl:pt-m', 'nl:pb-none', 'nl:gap-m');
    rerender(<NlListItemBase density="compact" divider={false} title="A" />);
    expect(root(container)).toHaveClass('nl:p-m');
    expect(root(container).querySelector('[data-type="divider"]')).toBeNull();
  });

  it('filled: a card with Radius-L, a subtle inside border and no divider', () => {
    const { container } = render(<NlListItemBase appearance="filled" title="A" />);
    const row = root(container);
    expect(row).toHaveClass('nl:p-xl', 'nl:rounded-l', 'nl:inset-ring', 'nl:bg-primary', 'nl:inset-ring-subtle');
    expect(row.querySelector('[data-type="divider"]')).toBeNull();
  });

  it('selected and disabled colours per appearance', () => {
    const { container, rerender } = render(<NlListItemBase selected title="A" />);
    expect(root(container)).toHaveClass('nl:bg-active');
    rerender(<NlListItemBase appearance="filled" selected title="A" />);
    expect(root(container)).toHaveClass('nl:inset-ring-active');
    rerender(<NlListItemBase appearance="filled" disabled selected actionable title="A" />);
    expect(root(container)).toHaveClass('nl:inset-ring-disabled');
    expect(root(container)).not.toHaveClass('nl:hover:bg-secondary');
  });

  it('hover and pressed only when actionable (OD-97, OD-151)', () => {
    const { container, rerender } = render(<NlListItemBase actionable title="A" />);
    expect(root(container)).toHaveClass('nl:hover:bg-secondary', 'nl:active:bg-secondary');
    rerender(<NlListItemBase actionable selected title="A" />);
    expect(root(container)).toHaveClass('nl:hover:bg-active-hover', 'nl:active:bg-active-hover');
    rerender(<NlListItemBase appearance="filled" actionable selected title="A" />);
    expect(root(container)).toHaveClass('nl:hover:bg-secondary', 'nl:inset-ring-active');
  });

  it('disabled: text and accessories go to the disabled colours; the divider stays border-default (OD-148)', () => {
    const { container } = render(
      <NlListItemBase
        disabled
        title="A"
        description="B"
        leading={<NlIcon name="person" tone="inherit" />}
        trailing={<NlIcon name="chevron_right" tone="inherit" />}
      />,
    );
    expect(screen.getByText('A')).toHaveClass('nl:text-disabled');
    expect(screen.getByText('B')).toHaveClass('nl:text-disabled');
    expect(container.querySelector('[data-slot="leading"]')).toHaveClass('nl:text-fg-disabled');
    expect(container.querySelector('[data-slot="trailing"]')).toHaveClass('nl:text-fg-disabled');
    expect(container.querySelector('[data-type="divider"]')).toHaveClass('nl:border-default');
  });

  it('accessory slots hold any component, with fg-primary leading and fg-secondary trailing', () => {
    const { container } = render(
      <NlListItemBase title="A" leading={<input aria-label="Pick" type="checkbox" />} trailing={<button>Go</button>} />,
    );
    expect(container.querySelector('[data-slot="leading"]')).toHaveClass('nl:text-fg-primary');
    expect(container.querySelector('[data-slot="trailing"]')).toHaveClass('nl:text-fg-secondary', 'nl:gap-s');
    expect(screen.getByRole('checkbox', { name: 'Pick' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go' })).toBeInTheDocument();
  });

  it('top label only when given, small (OD-149)', () => {
    const { rerender } = render(<NlListItemBase title="A" />);
    expect(screen.queryByText('Top')).toBeNull();
    rerender(<NlListItemBase title="A" topLabel="Top" />);
    expect(screen.getByText('Top').closest('span.nl\\:text-label-s, .nl\\:text-label-s')).not.toBeNull();
  });

  it('extra icon sits Space-M from the title and is hidden from assistive tech (OD-150)', () => {
    const { container } = render(<NlListItemBase title="A" extraIcon={<NlIcon name="info" label="Info" />} />);
    const slot = container.querySelector('[data-slot="extra-icon"]');
    expect(slot).toHaveAttribute('aria-hidden', 'true');
    expect(slot?.parentElement).toHaveClass('nl:gap-m');
  });

  it('body replaces the description', () => {
    render(<NlListItemBase title="A" description="Gone" body={<em>Custom</em>} />);
    expect(screen.queryByText('Gone')).toBeNull();
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('renders as the element the mapped item picks, passes props and takes keyboard focus', async () => {
    const onClick = vi.fn();
    render(<NlListItemBase as="button" type="button" actionable title="Member 0042" onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Member 0042' });
    await userEvent.tab();
    expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('className goes last', () => {
    const { container } = render(<NlListItemBase title="A" className="nl:mt-m" />);
    expect(root(container).className.endsWith('nl:mt-m')).toBe(true);
  });
});
