import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlMenu, nlMenuTriggerProps, type NlMenuKind } from './NlMenu';

function Harness({
  kind = 'action',
  multiple = false,
  initiallyOpen = true,
  rows,
  header,
  footer,
  onOpenChange,
}: {
  kind?: NlMenuKind;
  multiple?: boolean;
  initiallyOpen?: boolean;
  rows?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(initiallyOpen);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const change = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };
  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        onClick={() => {
          change(!open);
        }}
        {...nlMenuTriggerProps({ kind, open, menuId: 'menu' })}
      >
        Trigger
      </button>
      <NlMenu
        id="menu"
        aria-label="Member actions"
        kind={kind}
        multiple={multiple}
        open={open}
        onOpenChange={change}
        anchorRef={anchorRef}
        header={header}
        footer={footer}
      >
        {rows}
      </NlMenu>
      <button type="button">After</button>
    </>
  );
}

const actionRows = (onEdit = vi.fn()) => (
  <>
    <button type="button" role="menuitem" tabIndex={-1} onClick={onEdit}>
      Edit
    </button>
    <button type="button" role="menuitem" tabIndex={-1}>
      Duplicate
    </button>
    <button type="button" role="menuitem" tabIndex={-1} aria-disabled="true">
      Archive
    </button>
    <button type="button" role="menuitem" tabIndex={-1}>
      Delete
    </button>
  </>
);

describe('NlMenu', () => {
  it('action: role menu named by aria-label, with the trigger wired to it', () => {
    render(<Harness rows={actionRows()} />);
    const menu = screen.getByRole('menu', { name: 'Member actions' });
    expect(menu).toHaveAttribute('id', 'menu');
    const trigger = screen.getByRole('button', { name: 'Trigger' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', 'menu');
  });

  it.each([
    ['select', 'listbox', 'listbox'],
    ['navigation', 'menu', 'menu'],
    ['filter', 'dialog', 'dialog'],
  ] as const)('%s: role %s, trigger aria-haspopup %s', (kind, role, haspopup) => {
    render(<Harness kind={kind} />);
    expect(screen.getByRole(role, { name: 'Member actions' })).toHaveAttribute('id', 'menu');
    expect(screen.getByRole('button', { name: 'Trigger' })).toHaveAttribute('aria-haspopup', haspopup);
  });

  it('select multiple sets aria-multiselectable', () => {
    render(<Harness kind="select" multiple />);
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
  });

  it('focuses the first row on open, then arrows wrap, skip disabled rows, Home and End', async () => {
    render(<Harness rows={actionRows()} />);
    const [edit, duplicate, , del] = screen.getAllByRole('menuitem');
    await waitFor(() => {
      expect(edit).toHaveFocus();
    });
    await userEvent.keyboard('{ArrowDown}');
    expect(duplicate).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(del).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(edit).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    expect(del).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(edit).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(del).toHaveFocus();
  });

  it('a letter jumps to the next row starting with it', async () => {
    render(<Harness rows={actionRows()} />);
    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
    });
    await userEvent.keyboard('d');
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
    await userEvent.keyboard('d');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
  });

  it('Enter activates the row, closes, and returns focus to the trigger', async () => {
    const onEdit = vi.fn();
    const onOpenChange = vi.fn();
    render(<Harness rows={actionRows(onEdit)} onOpenChange={onOpenChange} />);
    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
    });
    await userEvent.keyboard('{Enter}');
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus();
  });

  it('a disabled row does nothing and keeps the menu open', async () => {
    const onOpenChange = vi.fn();
    render(<Harness rows={actionRows()} onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole('menuitem', { name: 'Archive' }));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('Escape closes and returns focus to the trigger', async () => {
    const onOpenChange = vi.fn();
    render(<Harness rows={actionRows()} onOpenChange={onOpenChange} />);
    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
    });
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus();
  });

  it('a click outside closes; a click on the trigger is left to the trigger', async () => {
    const onOpenChange = vi.fn();
    render(<Harness rows={actionRows()} onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'After' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('Tab closes an action menu', async () => {
    const onOpenChange = vi.fn();
    render(<Harness rows={actionRows()} onOpenChange={onOpenChange} />);
    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
    });
    await userEvent.tab();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('select single: focuses the selected option and closes on select', async () => {
    const onOpenChange = vi.fn();
    render(
      <Harness
        kind="select"
        onOpenChange={onOpenChange}
        rows={
          <>
            <div role="option" tabIndex={-1} aria-selected="false">
              Tier 1
            </div>
            <div role="option" tabIndex={-1} aria-selected="true">
              Tier 2
            </div>
          </>
        }
      />,
    );
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Tier 2' })).toHaveFocus();
    });
    await userEvent.keyboard('{ArrowUp}{Enter}');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('select multiple: selecting keeps the menu open', async () => {
    const onOpenChange = vi.fn();
    render(
      <Harness
        kind="select"
        multiple
        onOpenChange={onOpenChange}
        rows={
          <div role="option" tabIndex={-1} aria-selected="false">
            Tier 1
          </div>
        }
      />,
    );
    await userEvent.click(screen.getByRole('option'));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('filter: focuses the first field in the header; Tab moves on without closing; footer is a row', async () => {
    const onOpenChange = vi.fn();
    render(
      <Harness
        kind="filter"
        onOpenChange={onOpenChange}
        header={<input aria-label="Search" />}
        rows={<input type="checkbox" aria-label="Tier 1" />}
        footer={
          <>
            <button type="button">Reset</button>
            <button type="button">Apply</button>
          </>
        }
      />,
    );
    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Search' })).toHaveFocus();
    });
    await userEvent.tab();
    expect(screen.getByRole('checkbox', { name: 'Tier 1' })).toHaveFocus();
    expect(onOpenChange).not.toHaveBeenCalled();
    const footerRow = screen.getByRole('button', { name: 'Apply' }).parentElement;
    expect(footerRow).toHaveClass('nl:flex', 'nl:justify-end', 'nl:gap-m');
    expect(footerRow?.parentElement).toHaveClass('nl:p-xl', 'nl:border-t', 'nl:border-subtle');
    expect(screen.getByRole('textbox').parentElement).toHaveClass('nl:p-l', 'nl:border-b', 'nl:border-subtle');
  });

  it('closed: stays in the page, hidden (display none), so it can fade out', () => {
    render(<Harness initiallyOpen={false} rows={actionRows()} />);
    const panel = document.querySelector('[data-kind]');
    expect(panel).toHaveAttribute('data-open', 'false');
    expect(panel).toHaveClass('nl:hidden');
    expect(screen.getByRole('button', { name: 'Trigger' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('uses the spec panel tokens', () => {
    render(<Harness rows={actionRows()} />);
    expect(document.querySelector('[data-kind]')).toHaveClass(
      'nl:fixed',
      'nl:z-menu',
      'nl:rounded-m',
      'nl:border',
      'nl:border-subtle',
      'nl:bg-primary',
      'nl:shadow-menu',
      'nl:menu-position',
      'nl:transition',
      'nl:motion-reduce:transition-none',
    );
  });

  it('maxHeight sets the Size token as the panel limit', () => {
    function Max() {
      const anchorRef = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button ref={anchorRef} type="button">
            T
          </button>
          <NlMenu aria-label="M" open onOpenChange={vi.fn()} anchorRef={anchorRef} maxHeight="320" />
        </>
      );
    }
    render(<Max />);
    const panel = document.querySelector<HTMLElement>('[data-kind]');
    expect(panel?.style.getPropertyValue('--nl-menu-max-height')).toBe('var(--nl-size-320)');
  });
});
