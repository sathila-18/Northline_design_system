import { NlTextAreaBase, type NlTextAreaBaseProps } from '../NlTextAreaBase';

export type NlTextAreaProps = NlTextAreaBaseProps;

/**
 * A multi-line text input for notes, descriptions and messages (DESIGN.md §9, NlTextArea). Mapped onto
 * NlTextAreaBase with nothing fixed: label, rows (default 4), maxLength with its character count (OD-89), helper
 * text, error, disabled, required, value and `ref` are the base's. No hint text (designer's choice). Enter adds a new
 * line; a textarea never submits a form. The value is text-primary when filled (OD-88). Presentational, so no
 * 'use client' (the base has it).
 */
export function NlTextArea(props: NlTextAreaProps) {
  return <NlTextAreaBase {...props} />;
}
