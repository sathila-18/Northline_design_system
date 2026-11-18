// Tests for the Northline lint rules. Run: node --test scripts/lint (part of pnpm test).
import { after, describe, it } from 'node:test';
import { RuleTester } from 'eslint';
import tseslint from 'typescript-eslint';
import plugin from './eslint-plugin-northline.mjs';

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.afterAll = after;

const tester = new RuleTester({
  languageOptions: { parser: tseslint.parser, parserOptions: { ecmaFeatures: { jsx: true } } },
});
const tsx = (code) => ({ code, filename: 'Example.tsx' });
const styles = (code) => ({ code, filename: 'NlExample.styles.ts' });
const rule = (name) => plugin.rules[name];

tester.run('class-prefix', rule('class-prefix'), {
  valid: [
    tsx('<div className="nl:flex nl:gap-xl" />'),
    styles("export const root = 'nl:flex nl:hover:bg-active';"),
    {
      ...tsx('<span className="material-symbols-rounded nl:text-fg-primary" />'),
      options: [{ allow: ['material-symbols-rounded'] }],
    },
  ],
  invalid: [
    { ...tsx('<div className="flex nl:gap-xl" />'), errors: [{ messageId: 'missing' }] },
    { ...styles("export const size = { large: 'nl:h-48 px-xl' };"), errors: [{ messageId: 'missing' }] },
    { ...tsx("<div className={open ? 'nl:flex' : 'hidden'} />"), errors: [{ messageId: 'missing' }] },
  ],
});

tester.run('no-arbitrary-values', rule('no-arbitrary-values'), {
  valid: [tsx('<div className="nl:p-xl nl:w-1/2" />')],
  invalid: [
    { ...tsx('<div className="nl:p-[13px]" />'), errors: [{ messageId: 'arbitrary' }] },
    { ...styles("export const root = 'nl:[&>svg]:size-24';"), errors: [{ messageId: 'arbitrary' }] },
  ],
});

tester.run('no-important', rule('no-important'), {
  valid: [tsx('<div className="nl:bg-primary" />')],
  invalid: [
    { ...tsx('<div className="nl:bg-primary!" />'), errors: [{ messageId: 'important' }] },
    { ...tsx('<div className="nl:!bg-primary" />'), errors: [{ messageId: 'important' }] },
  ],
});

tester.run('no-dark-variant', rule('no-dark-variant'), {
  valid: [tsx('<div className="nl:bg-primary nl:text-dark-both" />')],
  invalid: [{ ...tsx('<div className="nl:dark:bg-secondary" />'), errors: [{ messageId: 'dark' }] }],
});

tester.run('no-raw-values', rule('no-raw-values'), {
  valid: [
    tsx('<div className="nl:p-xl" style={{ width: "var(--nl-size-24)", margin: 0 }} />'),
    tsx('<div style={{ backgroundColor: `var(${name})` }} />'),
  ],
  invalid: [
    { ...tsx('<div style={{ color: "#1532EA" }} />'), errors: [{ messageId: 'raw' }] },
    { ...tsx('<div style={{ width: "24px" }} />'), errors: [{ messageId: 'raw' }] },
    { ...tsx('<div style={{ padding: 8 }} />'), errors: [{ messageId: 'number' }] },
    { ...tsx('<div style={{ boxShadow: `0 1px 2px ${shade}` }} />'), errors: [{ messageId: 'raw' }] },
    { ...tsx('<div style={{ color: "rgb(0 0 0)" }} />'), errors: [{ messageId: 'raw' }] },
  ],
});

tester.run('focus-ring-outline', rule('focus-ring-outline'), {
  valid: [
    tsx(
      '<button className="nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused nl:focus:not-focus-visible:outline-none" />',
    ),
    tsx('<div className="nl:outline-none" />'),
  ],
  invalid: [
    {
      ...tsx('<button className="nl:outline-none nl:focus-visible:outline-2 nl:focus-visible:outline-focused" />'),
      errors: [{ messageId: 'outline' }],
    },
  ],
});

tester.run('literal-classes', rule('literal-classes'), {
  valid: [
    tsx('<div className={`${styles.root} ${size[props.size]} ${className}`} />'),
    styles("export const variant = { primary: 'nl:bg-action-primary', secondary: 'nl:bg-action-secondary' };"),
  ],
  invalid: [
    { ...tsx('<div className={`nl:bg-${tone}`} />'), errors: [{ messageId: 'piece' }] },
    {
      ...tsx('<div className={`nl:p-xl nl:text-${tone}-primary`} />'),
      errors: [{ messageId: 'piece' }, { messageId: 'piece' }],
    },
    { ...tsx("<div className={'nl:bg-' + tone} />"), errors: [{ messageId: 'concat' }] },
    { ...styles("export const root = 'nl:text-' + size;"), errors: [{ messageId: 'concat' }] },
  ],
});

tester.run('theme-classes', rule('theme-classes'), {
  valid: [
    tsx(
      '<div className="nl:bg-primary nl:p-xl nl:text-body-m nl:enabled:hover:bg-action-primary-hovered nl:size-24" />',
    ),
    tsx('<div className="nl:group nl:group/row nl:peer nl:peer/input nl:peer-hover:bg-fg-hovered" />'),
  ],
  invalid: [
    { ...tsx('<div className="nl:bg-red-500" />'), errors: [{ messageId: 'unknown' }] },
    {
      ...tsx('<div className="nl:peerx nl:group/Row" />'),
      errors: [{ messageId: 'unknown' }, { messageId: 'unknown' }],
    },
    {
      ...tsx('<div className="nl:p-4 nl:rounded-lg" />'),
      errors: [{ messageId: 'unknown' }, { messageId: 'unknown' }],
    },
    { ...styles("export const root = 'nl:shadow-md';"), errors: [{ messageId: 'unknown' }] },
  ],
});
