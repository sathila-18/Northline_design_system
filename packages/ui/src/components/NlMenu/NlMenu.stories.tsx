import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState, type ReactNode } from 'react';
import { NlDivider } from '../NlDivider';
import { NlSkeleton } from '../NlSkeleton';
import { NlMenu, nlMenuTriggerProps, type NlMenuKind, type NlMenuMaxHeight } from './NlMenu';

// Rows here are plain elements with the right role, styled only with classes the library already uses. NlListItem
// (a later component) will be the real row.
const row =
  'nl:flex nl:w-full nl:items-center nl:p-l nl:text-start nl:text-body-m nl:text-primary nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused';
const disabledRow = 'nl:flex nl:w-full nl:items-center nl:p-l nl:text-start nl:text-body-m nl:text-disabled';

function Demo({
  kind = 'action',
  label,
  triggerText,
  multiple,
  maxHeight,
  header,
  footer,
  children,
}: {
  kind?: NlMenuKind;
  label: string;
  triggerText: ReactNode;
  multiple?: boolean;
  maxHeight?: NlMenuMaxHeight;
  header?: ReactNode;
  footer?: (close: () => void) => ReactNode;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const close = () => {
    setOpen(false);
  };
  const id = `menu-${kind}`;
  return (
    <div className="nl:text-body-m nl:text-primary">
      <button
        ref={anchorRef}
        type="button"
        className="nl:rounded-m nl:border nl:border-subtle nl:p-l"
        onClick={() => {
          setOpen(!open);
        }}
        {...nlMenuTriggerProps({ kind, open, menuId: id })}
      >
        {triggerText}
      </button>
      <NlMenu
        id={id}
        aria-label={label}
        kind={kind}
        multiple={multiple}
        maxHeight={maxHeight}
        open={open}
        onOpenChange={setOpen}
        anchorRef={anchorRef}
        header={header}
        footer={footer?.(close)}
      >
        {children(close)}
      </NlMenu>
    </div>
  );
}

const meta: Meta<typeof NlMenu> = {
  title: 'Components/Overlays/Menu',
  tags: ['atom-l0'],
  component: NlMenu,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof NlMenu>;

/**
 * Action menu (role menu). Click the trigger, or Tab to it and press Enter. Arrows move (wrapping), Home and End,
 * a letter jumps, Enter activates and closes, Escape closes. Archive is disabled and skipped.
 */
export const Action: Story = {
  render: () => (
    <Demo label="Member actions" triggerText="Member 0042 actions">
      {() => (
        <>
          {['Edit', 'Duplicate'].map((text) => (
            <button key={text} type="button" role="menuitem" tabIndex={-1} className={row}>
              {text}
            </button>
          ))}
          <button type="button" role="menuitem" tabIndex={-1} aria-disabled="true" className={disabledRow}>
            Archive
          </button>
          <button type="button" role="menuitem" tabIndex={-1} className={row}>
            Delete
          </button>
        </>
      )}
    </Demo>
  ),
};

/** Select, single (role listbox). Opens on the selected option; choosing one closes the menu. */
export const SelectSingle: Story = {
  name: 'Select, single',
  render: function Render() {
    const [tier, setTier] = useState('Tier 2');
    return (
      <Demo kind="select" label="Member tier" triggerText={`Member tier: ${tier}`}>
        {() =>
          ['Tier 1', 'Tier 2', 'Tier 3'].map((option) => (
            <div
              key={option}
              role="option"
              tabIndex={-1}
              aria-selected={tier === option}
              className={row}
              onClick={() => {
                setTier(option);
              }}
            >
              {option}
              {tier === option ? ' ✓' : ''}
            </div>
          ))
        }
      </Demo>
    );
  },
};

/** Select, multiple (aria-multiselectable). Choosing toggles and keeps the menu open. */
export const SelectMultiple: Story = {
  name: 'Select, multiple',
  render: function Render() {
    const [picked, setPicked] = useState<string[]>(['Reward X']);
    return (
      <Demo kind="select" multiple label="Rewards" triggerText={`Rewards: ${String(picked.length)} selected`}>
        {() =>
          ['Reward X', 'Reward Y', 'Track day voucher'].map((option) => (
            <div
              key={option}
              role="option"
              tabIndex={-1}
              aria-selected={picked.includes(option)}
              className={row}
              onClick={() => {
                setPicked(picked.includes(option) ? picked.filter((p) => p !== option) : [...picked, option]);
              }}
            >
              {option}
              {picked.includes(option) ? ' ✓' : ''}
            </div>
          ))
        }
      </Demo>
    );
  },
};

/**
 * Filter (a non-modal dialog), with a search field in the sticky header and two buttons in the footer. Tab moves
 * through everything; it stays open until Apply, Reset, Escape or a click outside.
 */
export const Filter: Story = {
  render: () => (
    <Demo
      kind="filter"
      label="Filter members"
      triggerText="Filter"
      header={<input aria-label="Search tiers" placeholder="Search" className="nl:w-full nl:text-body-m" />}
      footer={(close) => (
        <>
          <button type="button" onClick={close}>
            Reset
          </button>
          <button type="button" onClick={close}>
            Apply
          </button>
        </>
      )}
    >
      {() =>
        ['Tier 1', 'Tier 2', 'Tier 3'].map((tier) => (
          <label key={tier} className={row}>
            <input type="checkbox" /> {tier}
          </label>
        ))
      }
    </Demo>
  ),
};

/** Navigation (role menu, rows are links with role menuitem). Enter follows the link. */
export const Navigation: Story = {
  render: () => (
    <Demo kind="navigation" label="Go to" triggerText="Go to">
      {() =>
        ['Members', 'Rewards', 'Events'].map((page) => (
          <a key={page} href={`#${page.toLowerCase()}`} role="menuitem" tabIndex={-1} className={row}>
            {page}
          </a>
        ))
      }
    </Demo>
  ),
};

/** Labelled groups (role group) with decorative dividers between them. */
export const Groups: Story = {
  render: () => (
    <Demo label="Member actions" triggerText="Grouped actions">
      {() => (
        <>
          <div role="group" aria-label="Edit">
            {['Rename', 'Change tier'].map((text) => (
              <button key={text} type="button" role="menuitem" tabIndex={-1} className={row}>
                {text}
              </button>
            ))}
          </div>
          <NlDivider decorative />
          <div role="group" aria-label="Danger">
            <button type="button" role="menuitem" tabIndex={-1} className={row}>
              Remove member
            </button>
          </div>
        </>
      )}
    </Demo>
  ),
};

/** A long list with a sticky header and maxHeight="320" (a Size token): the content scrolls, the header stays. */
export const LongList: Story = {
  name: 'Long list',
  render: () => (
    <Demo
      kind="select"
      label="Member"
      triggerText="Choose a member"
      maxHeight="320"
      header={<input aria-label="Search members" placeholder="Search" className="nl:w-full nl:text-body-m" />}
    >
      {() =>
        Array.from({ length: 30 }, (_, i) => `Member ${String(i + 1).padStart(4, '0')}`).map((member) => (
          <div key={member} role="option" tabIndex={-1} aria-selected={false} className={row}>
            {member}
          </div>
        ))
      }
    </Demo>
  ),
};

/** Near the bottom of the window the menu flips above the trigger. */
export const FlipsAbove: Story = {
  name: 'Flips above',
  render: () => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      {Array.from({ length: 24 }, (_, i) => (
        <NlSkeleton key={i} />
      ))}
      <Demo label="Member actions" triggerText="Near the bottom">
        {() =>
          ['Edit', 'Duplicate', 'Delete'].map((text) => (
            <button key={text} type="button" role="menuitem" tabIndex={-1} className={row}>
              {text}
            </button>
          ))
        }
      </Demo>
    </div>
  ),
};
