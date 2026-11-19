import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlPaginationItem } from './NlPaginationItem';

const page = (n: number) => screen.getByRole('button', { name: `Page ${String(n)}` });

describe('NlPaginationItem', () => {
  it('a page is a native button named "Page 3", showing the number, with the default colours', () => {
    render(<NlPaginationItem page={3} />);
    expect(page(3)).toHaveTextContent('3');
    expect(page(3)).toHaveAttribute('type', 'button');
    expect(page(3)).toHaveAttribute('data-kind', 'page');
    expect(page(3)).not.toHaveAttribute('aria-current');
    expect(page(3)).toHaveClass(
      'nl:h-32',
      'nl:min-w-32',
      'nl:p-xs',
      'nl:rounded-s',
      'nl:text-label-m',
      'nl:inset-ring',
      'nl:bg-secondary',
      'nl:inset-ring-subtle',
      'nl:text-secondary',
      'nl:hover:bg-tertiary',
      'nl:active:bg-tertiary',
      'nl:focus-visible:outline-focused',
    );
  });

  it('calls onSelect with the page on click, Enter and Space', async () => {
    const onSelect = vi.fn();
    render(<NlPaginationItem page={4} onSelect={onSelect} />);
    await userEvent.click(page(4));
    page(4).focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onSelect).toHaveBeenCalledTimes(3);
    expect(onSelect).toHaveBeenCalledWith(4);
  });

  it('the current page: aria-current, bg-active, focusable, never calls onSelect', async () => {
    const onSelect = vi.fn();
    render(<NlPaginationItem page={2} current onSelect={onSelect} />);
    expect(page(2)).toHaveAttribute('aria-current', 'page');
    expect(page(2)).toHaveClass('nl:bg-active', 'nl:inset-ring-active', 'nl:text-action');
    expect(page(2).className).not.toMatch(/hover:/);
    page(2).focus();
    expect(page(2)).toHaveFocus();
    await userEvent.click(page(2));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('the ellipsis is one "…" character, hidden from screen readers, with no button', () => {
    const { container } = render(<NlPaginationItem kind="ellipsis" />);
    const gap = container.querySelector('[data-kind="ellipsis"]');
    expect(gap?.tagName).toBe('SPAN');
    expect(gap).toHaveTextContent(/^…$/);
    expect(gap).toHaveAttribute('aria-hidden', 'true');
    expect(gap).toHaveClass('nl:h-32', 'nl:min-w-32', 'nl:text-label-l', 'nl:text-secondary');
    expect(gap).not.toHaveClass('nl:inset-ring');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('passes ref, attributes and its own onClick; className is appended for placement', async () => {
    const ref = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    render(<NlPaginationItem page={5} ref={ref} id="p5" onClick={onClick} className="nl:ms-xs" />);
    expect(ref.current).toBe(page(5));
    expect(page(5)).toHaveAttribute('id', 'p5');
    expect(page(5).className.endsWith('nl:ms-xs')).toBe(true);
    await userEvent.click(page(5));
    expect(onClick).toHaveBeenCalled();
  });
});
