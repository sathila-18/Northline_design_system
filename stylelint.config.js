// Stylelint for the hand-written CSS. Tailwind 4 at-rules are allowed so S2 and S4 can use them.
export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: ['**/dist/**', '**/storybook-static/**', '**/node_modules/**', '**/coverage/**'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'theme',
          'utility',
          'custom-variant',
          'variant',
          'source',
          'plugin',
          'apply',
          'reference',
          'config',
          'tailwind',
        ],
      },
    ],
    'import-notation': 'string',
  },
};
