import { useId, useRef, useState } from 'react';
import { NlAssistChip, NlCheckboxListItem, NlListItem, NlMenu } from '@northline/ui';

interface Option {
  value: string;
  label: string;
}

interface ChipMenuCommonProps {
  /** The chip's name, also the menu's name ("Category"). */
  label: string;
  options: Option[];
}

/**
 * A grid view control: an NlAssistChip (dropdown) that opens an NlMenu (kind select) under it, as in the assist
 * chip's "With a menu" story. Several choices: NlCheckboxListItem rows, the menu stays open, as NlMultiSelect.
 * One choice: NlListItem option rows, choosing closes the menu. The chip shows the choice in its label.
 */
export function ChipMenu(
  props: ChipMenuCommonProps &
    (
      | { multiple: true; value: string[]; onValueChange: (value: string[]) => void }
      | { multiple?: false; value: string; onValueChange: (value: string) => void }
    ),
) {
  const { label, options } = props;
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const labelOf = (value: string) => options.find((option) => option.value === value)?.label ?? value;

  let chipText = label;
  if (props.multiple) {
    if (props.value.length === 1) chipText = `${label}: ${labelOf(props.value[0] ?? '')}`;
    else if (props.value.length > 1) chipText = `${label}: ${String(props.value.length)} selected`;
  } else {
    chipText = `${label}: ${labelOf(props.value)}`;
  }

  return (
    <>
      <NlAssistChip ref={anchorRef} dropdown popup="listbox" open={open} onOpenChange={setOpen} aria-controls={menuId}>
        {chipText}
      </NlAssistChip>
      <NlMenu
        id={menuId}
        kind="select"
        multiple={props.multiple}
        aria-label={label}
        open={open}
        onOpenChange={setOpen}
        anchorRef={anchorRef}
      >
        {props.multiple
          ? options.map((option) => (
              <NlCheckboxListItem
                key={option.value}
                role="option"
                size="small"
                density="compact"
                divider={false}
                title={option.label}
                checked={props.value.includes(option.value)}
                onCheckedChange={() => {
                  props.onValueChange(
                    props.value.includes(option.value)
                      ? props.value.filter((value) => value !== option.value)
                      : [...props.value, option.value],
                  );
                }}
              />
            ))
          : options.map((option) => (
              <NlListItem
                key={option.value}
                role="option"
                size="small"
                density="compact"
                divider={false}
                title={option.label}
                selected={props.value === option.value}
                onClick={() => {
                  props.onValueChange(option.value);
                  setOpen(false);
                }}
              />
            ))}
      </NlMenu>
    </>
  );
}
