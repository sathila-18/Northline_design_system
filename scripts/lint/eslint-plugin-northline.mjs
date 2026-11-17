// ESLint rules for the Tailwind and token rules in CLAUDE.md ("Tokens and styling", "Tailwind rules").
// Each rule has tests in rules.test.mjs.
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseClass, tokensOf, visitClassStrings } from './classes.mjs';

const RAW_COLOUR = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/i;
const RAW_PIXELS = /\b\d+(?:\.\d+)?px\b/;

/** A rule that looks at every class name in every class string. */
const classRule = (description, messages, checkToken, extra = {}) => ({
  meta: { type: 'problem', docs: { description }, messages, schema: extra.schema ?? [] },
  create(context) {
    return visitClassStrings(context, (info) => {
      for (const token of tokensOf(info.text)) {
        const problem = checkToken(token, context.options[0] ?? {});
        if (problem) context.report({ node: info.node, messageId: problem, data: { token } });
      }
    });
  },
});

const rules = {
  // CLAUDE.md Tailwind rule 4: every class has the nl: prefix.
  'class-prefix': classRule(
    'Every class has the nl: prefix',
    { missing: '"{{token}}" has no nl: prefix. Every class starts with nl: (CLAUDE.md Tailwind rule 4).' },
    (token, options) => (token.startsWith('nl:') || (options.allow ?? []).includes(token) ? null : 'missing'),
    {
      schema: [
        {
          type: 'object',
          properties: { allow: { type: 'array', items: { type: 'string' } } },
          additionalProperties: false,
        },
      ],
    },
  ),

  // Tailwind rule 4: no arbitrary values or variants.
  'no-arbitrary-values': classRule(
    'No arbitrary values ([…]) in classes',
    { arbitrary: '"{{token}}" uses an arbitrary value. Use a theme utility (CLAUDE.md Tailwind rule 4).' },
    (token) => (/[[\]]/.test(token) ? 'arbitrary' : null),
  ),

  // Tailwind rule 4: no ! (important).
  'no-important': classRule(
    'No ! (important) in classes',
    { important: '"{{token}}" uses !. Never force a style (CLAUDE.md Tailwind rule 4).' },
    (token) => (/(^|:)!|!$/.test(token) ? 'important' : null),
  ),

  // Tailwind rule 4: no dark: (theme comes from data-theme).
  'no-dark-variant': classRule(
    'No dark: variant',
    { dark: '"{{token}}" uses dark:. The theme comes from the tokens (CLAUDE.md Tailwind rule 4).' },
    (token) => (parseClass(token).variants.includes('dark') ? 'dark' : null),
  ),

  // Hard rule: no hex, rgb or raw pixel values, in classes or in inline styles.
  'no-raw-values': {
    meta: {
      type: 'problem',
      docs: { description: 'No raw colours or pixel values' },
      messages: {
        raw: '"{{value}}" is a raw colour or pixel value. Use a token (CLAUDE.md "No hardcoded values").',
        number:
          'The number {{value}} becomes a pixel value. Use a token through var(--nl-…) (CLAUDE.md "No hardcoded values").',
      },
      schema: [],
    },
    create(context) {
      const visitors = visitClassStrings(context, (info) => {
        for (const token of tokensOf(info.text))
          if (RAW_COLOUR.test(token) || RAW_PIXELS.test(token))
            context.report({ node: info.node, messageId: 'raw', data: { value: token } });
      });
      const jsxAttribute = visitors.JSXAttribute;
      visitors.JSXAttribute = (node) => {
        jsxAttribute(node);
        if (node.name.name !== 'style' || node.value?.expression?.type !== 'ObjectExpression') return;
        for (const property of node.value.expression.properties) {
          const value = property.value;
          if (
            value?.type === 'Literal' &&
            typeof value.value === 'string' &&
            (RAW_COLOUR.test(value.value) || RAW_PIXELS.test(value.value))
          )
            context.report({ node: value, messageId: 'raw', data: { value: value.value } });
          if (value?.type === 'Literal' && typeof value.value === 'number' && value.value !== 0)
            context.report({ node: value, messageId: 'number', data: { value: String(value.value) } });
          if (value?.type === 'TemplateLiteral')
            for (const quasi of value.quasis)
              if (RAW_COLOUR.test(quasi.value.cooked ?? '') || RAW_PIXELS.test(quasi.value.cooked ?? ''))
                context.report({ node: value, messageId: 'raw', data: { value: quasi.value.cooked ?? '' } });
        }
      };
      return visitors;
    },
  },

  // Tailwind rule 5: never outline-none on an element that has a focus ring width.
  'focus-ring-outline': {
    meta: {
      type: 'problem',
      docs: { description: 'No outline-none next to a focus ring width' },
      messages: {
        outline:
          '"{{token}}" removes the outline on an element with a focus ring. Use nl:focus:not-focus-visible:outline-none (CLAUDE.md Tailwind rule 5).',
      },
      schema: [],
    },
    create(context) {
      return visitClassStrings(context, (info) => {
        const parsed = tokensOf(info.text).map((token) => ({ token, ...parseClass(token) }));
        const hasRing = parsed.some((c) => /^-?outline-\d+$/.test(c.utility));
        if (!hasRing) return;
        for (const c of parsed)
          if (c.utility === 'outline-none' && c.variants.join(':') !== 'nl:focus:not-focus-visible')
            context.report({ node: info.node, messageId: 'outline', data: { token: c.token } });
      });
    },
  },

  // Tailwind rule 1: whole literal class strings only, never a class built from pieces.
  'literal-classes': {
    meta: {
      type: 'problem',
      docs: { description: 'Class names are whole literal strings' },
      messages: {
        piece:
          '"{{piece}}" is joined onto an expression, so the class is built from pieces. Write whole class names (CLAUDE.md Tailwind rule 1).',
        concat:
          'Class strings are joined with +. Use whole literal strings in Nl<Name>.styles.ts (CLAUDE.md Tailwind rule 1).',
      },
      schema: [],
    },
    create(context) {
      return visitClassStrings(context, (info) => {
        if (info.concatenated) context.report({ node: info.node, messageId: 'concat' });
        for (const piece of info.pieces) context.report({ node: info.node, messageId: 'piece', data: { piece } });
      });
    },
  },

  // CLAUDE.md "Semantic utilities only": every class must exist in the Northline Tailwind theme.
  'theme-classes': {
    meta: {
      type: 'problem',
      docs: { description: 'Every class exists in the Northline Tailwind theme' },
      messages: {
        unknown:
          '"{{token}}" is not in the Northline theme (only this system\'s tokens exist; Tailwind\'s defaults are removed).',
      },
      schema: [],
    },
    create(context) {
      const found = [];
      return {
        ...visitClassStrings(context, (info) => {
          for (const token of tokensOf(info.text)) if (token.startsWith('nl:')) found.push({ token, node: info.node });
        }),
        'Program:exit'() {
          if (found.length === 0) return;
          const invalid = invalidClasses(found.map((f) => f.token));
          for (const { token, node } of found)
            if (invalid.has(token)) context.report({ node, messageId: 'unknown', data: { token } });
        },
      };
    },
  },
};

// Tailwind loads asynchronously, so the theme check runs in a child process; results are cached per class.
const known = new Map();
const validator = fileURLToPath(new URL('./validate-classes.mjs', import.meta.url));
function invalidClasses(tokens) {
  const unknown = [...new Set(tokens)].filter((token) => !known.has(token));
  if (unknown.length > 0) {
    const invalid = new Set(
      JSON.parse(execFileSync(process.execPath, [validator, JSON.stringify(unknown)], { encoding: 'utf8' })),
    );
    for (const token of unknown) known.set(token, !invalid.has(token));
  }
  return new Set(tokens.filter((token) => known.get(token) === false));
}

export default { meta: { name: 'eslint-plugin-northline' }, rules };
