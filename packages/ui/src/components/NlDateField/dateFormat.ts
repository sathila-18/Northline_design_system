// Date pattern helpers for NlDateField (DESIGN.md §9, NlDateField, OD-137). No locale formatting: dates are ISO
// strings (YYYY-MM-DD) and the display follows the `format` pattern only.

export type NlDatePart = 'DD' | 'MM' | 'YYYY';

export interface NlDatePattern {
  /** The parts in display order. */
  parts: NlDatePart[];
  /** The one separator character between parts. */
  separator: string;
  /** The pattern as written, for example "DD/MM/YYYY". */
  text: string;
}

const LENGTH: Record<NlDatePart, number> = { DD: 2, MM: 2, YYYY: 4 };

/** Reads a pattern of DD, MM and YYYY in any order with one separator. Throws on anything else. */
export function parsePattern(format: string): NlDatePattern {
  const match = /^(DD|MM|YYYY)(\W)(DD|MM|YYYY)\2(DD|MM|YYYY)$/.exec(format);
  const parts = match ? ([match[1], match[3], match[4]] as NlDatePart[]) : [];
  if (!match || new Set(parts).size !== 3) {
    throw new Error(`NlDateField: format "${format}" must use DD, MM and YYYY once each, with one separator.`);
  }
  return { parts, separator: match[2] ?? '/', text: format };
}

/**
 * The digits laid out in the pattern, a separator added only once the next part has started ("010" → "01/0").
 * At most 8 digits.
 */
export function mask(digits: string, pattern: NlDatePattern): string {
  const clean = digits.replace(/\D/g, '').slice(0, 8);
  let out = '';
  let index = 0;
  for (const [position, part] of pattern.parts.entries()) {
    const piece = clean.slice(index, index + LENGTH[part]);
    if (piece === '') break;
    if (position > 0) out += pattern.separator;
    out += piece;
    index += LENGTH[part];
  }
  return out;
}

/** Where the caret goes in masked text so that `digitsBefore` digits are before it. */
export function caretAfterDigits(text: string, digitsBefore: number): number {
  if (digitsBefore <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < text.length; i += 1) {
    if (/\d/.test(text.charAt(i))) seen += 1;
    if (seen === digitsBefore) return i + 1;
  }
  return text.length;
}

const pad = (value: number, length: number) => String(value).padStart(length, '0');

/** A real calendar date as ISO, or null. */
function toISO(year: number, month: number, day: number): string | null {
  if (year < 1 || month < 1 || month > 12 || day < 1) return null;
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (day > last) return null;
  return `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`;
}

/** The typed text as an ISO date, or null when it isn't a complete, real date. */
export function textToISO(text: string, pattern: NlDatePattern): string | null {
  const digits = text.replace(/\D/g, '');
  if (digits.length !== 8) return null;
  const values: Partial<Record<NlDatePart, number>> = {};
  let index = 0;
  for (const part of pattern.parts) {
    values[part] = Number(digits.slice(index, index + LENGTH[part]));
    index += LENGTH[part];
  }
  return toISO(values.YYYY ?? 0, values.MM ?? 0, values.DD ?? 0);
}

/** An ISO date written in the pattern ("2026-11-21" → "21/11/2026"); '' for anything that isn't ISO. */
export function isoToText(iso: string | null | undefined, pattern: NlDatePattern): string {
  const match = iso ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso) : null;
  if (!match) return '';
  const values: Record<NlDatePart, string> = { YYYY: match[1] ?? '', MM: match[2] ?? '', DD: match[3] ?? '' };
  return pattern.parts.map((part) => values[part]).join(pattern.separator);
}
