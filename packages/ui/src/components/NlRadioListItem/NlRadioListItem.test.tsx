import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NlRadioListGroup } from './NlRadioListGroup';
import { NlRadioListItem } from './NlRadioListItem';

const row = (radio: HTMLElement) => radio.closest('label') as HTMLElement;

function Tiers(props: Partial<Parameters<typeof NlRadioListGroup>[0]>) {
  return (
    <NlRadioListGroup aria-label="Tier" {...props}>
      <NlRadioListItem value="tier-1" title="Tier 1" description="3,400 members" />
      <NlRadioListItem value="tier-2" title="Tier 2" />
      <NlRadioListItem value="tier-3" title="Tier 3" disabled />
    </NlRadioListGroup>
  );
}

describe('NlRadioListItem', () => {
  it('a named radiogroup of label rows named by their text; one shared name', () => {
    render(<Tiers />);
    expect(screen.getByRole('radiogroup', { name: 'Tier' })).toBeInTheDocument();
    const first = screen.getByRole('radio', { name: /^Tier 1 ?3,400 members$/ });
    const second = screen.getByRole('radio', { name: 'Tier 2' });
    expect(first.getAttribute('name')).toBe(second.getAttribute('name'));
    expect(row(first)).toHaveClass('nl:group/list-item', 'nl:has-focus-visible:outline-2', 'nl:hover:bg-secondary');
    expect(first.closest('span')).not.toHaveClass('nl:has-focus-visible:outline-2');
  });

  it('clicking a row selects it; the selected colours move with the value', async () => {
    const onValueChange = vi.fn();
    render(<Tiers defaultValue="tier-1" onValueChange={onValueChange} />);
    const first = screen.getByRole('radio', { name: /^Tier 1/ });
    const second = screen.getByRole('radio', { name: 'Tier 2' });
    expect(first).toBeChecked();
    expect(row(first)).toHaveClass('nl:bg-active');
    await userEvent.click(screen.getByText('Tier 2'));
    expect(second).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('tier-2');
    expect(row(second)).toHaveClass('nl:bg-active');
    expect(row(first)).not.toHaveClass('nl:bg-active');
  });

  it('arrow keys move and select (native); the disabled row is skipped', async () => {
    render(<Tiers defaultValue="tier-1" />);
    await userEvent.tab();
    expect(screen.getByRole('radio', { name: /^Tier 1/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Tier 2' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Tier 3' })).toBeDisabled();
  });

  it('controlled group follows `value`', async () => {
    const onValueChange = vi.fn();
    render(<Tiers value="tier-1" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByText('Tier 2'));
    expect(onValueChange).toHaveBeenCalledWith('tier-2');
    expect(screen.getByRole('radio', { name: /^Tier 1/ })).toBeChecked();
  });

  it('group disabled disables every row and drops the hover group', () => {
    render(<Tiers disabled />);
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toBeDisabled();
      expect(row(radio)).not.toHaveClass('nl:group/list-item');
    }
  });

  it('filled: the group sets the gap and the rows become cards (OD-160)', () => {
    render(<Tiers appearance="filled" />);
    expect(screen.getByRole('radiogroup')).toHaveClass('nl:gap-l');
    expect(row(screen.getByRole('radio', { name: 'Tier 2' }))).toHaveClass('nl:rounded-l', 'nl:inset-ring-subtle');
  });

  it('radio on the title line; trailing side', () => {
    const { container } = render(
      <NlRadioListGroup aria-label="Tier">
        <NlRadioListItem value="a" title="A" controlSide="trailing" />
      </NlRadioListGroup>,
    );
    expect(container.querySelector('[data-slot="trailing"]')).toHaveClass('nl:h-lh');
    expect(container.querySelector('[data-slot="trailing"] input')).not.toBeNull();
  });

  it('throws outside a group', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<NlRadioListItem value="a" title="A" />)).toThrow(/inside NlRadioListGroup/);
    spy.mockRestore();
  });
  it('showBody off hides the description and the body', () => {
    const body = <em>Custom</em>;
    render(
      <NlRadioListGroup aria-label="G">
        <NlRadioListItem value="a" title="A" description="Desc" body={body} showBody={false} />
      </NlRadioListGroup>,
    );
    expect(screen.queryByText('Desc')).toBeNull();
    expect(screen.queryByText('Custom')).toBeNull();
    expect(screen.getByRole('radio', { name: 'A' })).toBeInTheDocument();
  });
});
