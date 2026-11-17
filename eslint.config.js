// ESLint flat config: type-aware TypeScript rules, React hooks, and the Northline Tailwind and token rules
// from CLAUDE.md (scripts/lint/eslint-plugin-northline.mjs, tested in scripts/lint/rules.test.mjs).
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import northline from './scripts/lint/eslint-plugin-northline.mjs';

export default tseslint.config(
  {
    // apps/nextjs-check is outside the workspace and is type-checked by next build (pnpm nextjs-check).
    ignores: ['**/dist/**', '**/storybook-static/**', '**/coverage/**', '**/node_modules/**', 'apps/nextjs-check/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname } },
    rules: {
      // Numbers in template strings (sizes, percentages) are safe to print.
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['**/*.{js,mjs,cjs}', '**/scripts/**', '**/*.config.{js,ts}', 'packages/tokens/**/*.ts'],
    languageOptions: { globals: globals.node },
  },
  {
    // The Tailwind and token rules apply to the library and to Storybook.
    files: [
      'packages/ui/src/**/*.{ts,tsx}',
      'apps/storybook/src/**/*.{ts,tsx}',
      'apps/storybook/.storybook/**/*.{ts,tsx}',
    ],
    plugins: { northline },
    rules: {
      'northline/class-prefix': ['error', { allow: ['material-symbols-rounded'] }],
      'northline/no-arbitrary-values': 'error',
      'northline/no-important': 'error',
      'northline/no-dark-variant': 'error',
      'northline/no-raw-values': 'error',
      'northline/focus-ring-outline': 'error',
      'northline/literal-classes': 'error',
      'northline/theme-classes': 'error',
    },
  },
  prettier,
);
