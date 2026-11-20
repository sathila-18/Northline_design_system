import { describe, expect, it } from 'vitest';
import { caretAfterDigits, isoToText, mask, parsePattern, textToISO } from './dateFormat';

const dmy = parsePattern('DD/MM/YYYY');
const iso = parsePattern('YYYY-MM-DD');

describe('dateFormat', () => {
  it('reads patterns and rejects others', () => {
    expect(dmy).toEqual({ parts: ['DD', 'MM', 'YYYY'], separator: '/', text: 'DD/MM/YYYY' });
    expect(parsePattern('MM.DD.YYYY').separator).toBe('.');
    expect(() => parsePattern('DD/MM/YY')).toThrow();
    expect(() => parsePattern('DD/DD/YYYY')).toThrow();
    expect(() => parsePattern('DD/MM-YYYY')).toThrow();
  });

  it('masks digits, adding a separator once the next part starts, at most 8 digits', () => {
    expect(mask('01', dmy)).toBe('01');
    expect(mask('010', dmy)).toBe('01/0');
    expect(mask('0102', dmy)).toBe('01/02');
    expect(mask('01022026999', dmy)).toBe('01/02/2026');
    expect(mask('a1b2/3', dmy)).toBe('12/3');
    expect(mask('20261', iso)).toBe('2026-1');
  });

  it('places the caret after a number of digits', () => {
    expect(caretAfterDigits('01/02/2026', 0)).toBe(0);
    expect(caretAfterDigits('01/02/2026', 2)).toBe(2);
    expect(caretAfterDigits('01/02/2026', 3)).toBe(4);
    expect(caretAfterDigits('01/0', 9)).toBe(4);
  });

  it('parses complete, real dates only', () => {
    expect(textToISO('21/11/2026', dmy)).toBe('2026-11-21');
    expect(textToISO('29/02/2028', dmy)).toBe('2028-02-29');
    expect(textToISO('29/02/2026', dmy)).toBeNull();
    expect(textToISO('31/04/2026', dmy)).toBeNull();
    expect(textToISO('00/11/2026', dmy)).toBeNull();
    expect(textToISO('21/13/2026', dmy)).toBeNull();
    expect(textToISO('21/11/202', dmy)).toBeNull();
    expect(textToISO('2026-11-21', iso)).toBe('2026-11-21');
  });

  it('writes ISO in the pattern', () => {
    expect(isoToText('2026-11-21', dmy)).toBe('21/11/2026');
    expect(isoToText('2026-11-21', parsePattern('MM/DD/YYYY'))).toBe('11/21/2026');
    expect(isoToText('', dmy)).toBe('');
    expect(isoToText('nope', dmy)).toBe('');
    expect(isoToText(undefined, dmy)).toBe('');
  });
});
