import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlSearchField } from './NlSearchField';

const box = () => screen.getByRole('searchbox');
const clearButton = () => screen.queryByRole('button', { name: 'Clear search' });

describe('NlSearchField', () => {
  it('is a search box named "Search" by a hidden label, with "Search" placeholder text', () => {
    render(<NlSearchField />);
    expect(box()).toHaveAttribute('type', 'search');
    expect(box()).toHaveAccessibleName('Search');
    expect(box()).toHaveAttribute('placeholder', 'Search');
    expect(screen.getByText('Search', { selector: 'label' })).toHaveClass('nl:sr-only');
  });

  it('takes its own name and placeholder', () => {
    render(<NlSearchField label="Search members" placeholder="Member or tier" />);
    expect(box()).toHaveAccessibleName('Search members');
    expect(box()).toHaveAttribute('placeholder', 'Member or tier');
  });

  it.each([
    ['large', '24'],
    ['small', '20'],
  ] as const)('a %s field draws a decorative search icon at %s', (size, iconSize) => {
    const { container } = render(<NlSearchField size={size} />);
    const icon = container.querySelector('[data-slot="leading"] [data-icon="search"]');
    expect(icon).toHaveAttribute('data-size', iconSize);
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows the xsmall clear button only while there is text', async () => {
    render(<NlSearchField />);
    expect(clearButton()).toBeNull();
    await userEvent.type(box(), 'Tier');
    expect(clearButton()).toHaveAttribute('data-size', 'xsmall');
    expect(clearButton()).toHaveAttribute('type', 'button');
  });

  it('clears with the button, calls onClear and puts focus back in the input', async () => {
    const onClear = vi.fn();
    render(<NlSearchField defaultValue="Tier 2" onClear={onClear} />);
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(box()).toHaveValue('');
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(box()).toHaveFocus();
    expect(clearButton()).toBeNull();
  });

  it('calls onSearch with the text on Enter', async () => {
    const onSearch = vi.fn();
    render(<NlSearchField onSearch={onSearch} />);
    await userEvent.type(box(), 'Reward X{Enter}');
    expect(onSearch).toHaveBeenCalledWith('Reward X');
  });

  it('Escape clears when there is text and stops there', () => {
    const onClear = vi.fn();
    const outer = vi.fn();
    render(
      <div onKeyDown={outer}>
        <NlSearchField defaultValue="Tier 2" onClear={onClear} />
      </div>,
    );
    fireEvent.keyDown(box(), { key: 'Escape' });
    expect(box()).toHaveValue('');
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(outer).not.toHaveBeenCalled();
  });

  it('Escape passes on when empty', () => {
    const onClear = vi.fn();
    const outer = vi.fn();
    render(
      <div onKeyDown={outer}>
        <NlSearchField onClear={onClear} />
      </div>,
    );
    fireEvent.keyDown(box(), { key: 'Escape' });
    expect(onClear).not.toHaveBeenCalled();
    expect(outer).toHaveBeenCalledTimes(1);
  });

  it('is controlled: the parent resets the value in onClear', async () => {
    function Controlled() {
      const [query, setQuery] = useState('Member 0042');
      return (
        <NlSearchField
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          onClear={() => {
            setQuery('');
          }}
        />
      );
    }
    render(<Controlled />);
    await userEvent.type(box(), '1');
    expect(box()).toHaveValue('Member 00421');
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(box()).toHaveValue('');
  });

  it('disables the clear button with the field', () => {
    render(<NlSearchField disabled defaultValue="Tier 2" />);
    expect(box()).toBeDisabled();
    expect(clearButton()).toBeDisabled();
  });

  it('passes ref, name and its own onKeyDown', async () => {
    const ref = createRef<HTMLInputElement>();
    const onKeyDown = vi.fn();
    render(<NlSearchField ref={ref} name="q" onKeyDown={onKeyDown} />);
    expect(ref.current).toBe(box());
    expect(box()).toHaveAttribute('name', 'q');
    await userEvent.type(box(), 'a');
    expect(onKeyDown).toHaveBeenCalled();
  });
});
