// Finds Tailwind class strings in source code, for the Northline ESLint rules.
// Class strings are: the className attribute in JSX, and every string in a *.styles.ts file (CLAUDE.md Tailwind rule 1).

/** True if this file keeps its classes in plain strings (Nl<Name>.styles.ts). */
export const isStylesFile = (filename) => /\.styles\.ts$/.test(filename);

/**
 * The class strings a node holds: { node, text, pieces }.
 * For a template literal, `text` is each static part and `pieces` lists class names joined onto an expression.
 */
export function classStrings(node) {
  if (node.type === 'Literal' && typeof node.value === 'string') return [{ node, text: node.value, pieces: [] }];
  if (node.type === 'TemplateLiteral') {
    const pieces = [];
    const last = node.quasis.length - 1;
    node.quasis.forEach((quasi, index) => {
      const text = quasi.value.cooked ?? '';
      if (index > 0 && /^\S/.test(text)) pieces.push(text.split(/\s/)[0]);
      if (index < last && /\S$/.test(text)) pieces.push(text.split(/\s/).at(-1));
    });
    const tokens = node.quasis.map((quasi, index) => {
      let text = quasi.value.cooked ?? '';
      // Drop the half-words joined onto an expression: they are reported as pieces.
      if (index > 0) text = text.replace(/^\S+/, '');
      if (index < last) text = text.replace(/\S+$/, '');
      return text;
    });
    return [{ node, text: tokens.join(' '), pieces }];
  }
  if (node.type === 'JSXExpressionContainer') return classStrings(node.expression);
  if (node.type === 'ConditionalExpression') return [...classStrings(node.consequent), ...classStrings(node.alternate)];
  if (node.type === 'LogicalExpression') return classStrings(node.right);
  return [];
}

export const tokensOf = (text) => text.split(/\s+/).filter(Boolean);

/** Splits "nl:focus-visible:outline-2" into variants ["nl", "focus-visible"] and the utility "outline-2". */
export function parseClass(token) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const char of token) {
    if (char === '[') depth += 1;
    if (char === ']') depth -= 1;
    if (char === ':' && depth === 0) {
      parts.push(current);
      current = '';
    } else current += char;
  }
  return { variants: parts, utility: current };
}

/**
 * Calls `check(info)` for every class string in a file:
 * JSX className attributes everywhere, and every string or template literal in *.styles.ts files.
 */
export function visitClassStrings(context, check) {
  const filename = context.filename ?? context.getFilename();
  const visitors = {
    JSXAttribute(node) {
      if (node.name.name !== 'className' || !node.value) return;
      if (node.value.type === 'JSXExpressionContainer' && node.value.expression.type === 'BinaryExpression') {
        check({ node: node.value.expression, text: '', pieces: [], concatenated: true });
        return;
      }
      for (const info of classStrings(node.value)) check(info);
    },
  };
  if (isStylesFile(filename)) {
    const inImportOrType = (node) =>
      ['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration', 'TSLiteralType'].includes(
        node.parent?.type,
      ) && node.parent.source === node;
    visitors.Literal = (node) => {
      if (typeof node.value === 'string' && !inImportOrType(node)) for (const info of classStrings(node)) check(info);
    };
    visitors.TemplateLiteral = (node) => {
      for (const info of classStrings(node)) check(info);
    };
    visitors.BinaryExpression = (node) => {
      if (
        node.operator === '+' &&
        [node.left, node.right].some((side) => side.type === 'Literal' || side.type === 'TemplateLiteral')
      )
        check({ node, text: '', pieces: [], concatenated: true });
    };
  }
  return visitors;
}
