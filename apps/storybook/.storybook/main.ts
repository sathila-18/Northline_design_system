import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { mergeConfig } from 'vite';

/**
 * The GitHub repo URL for the Overview pages' Source code and Spec links, read from `git remote get-url origin`
 * at build time, so it is never written into a tracked file. Empty when there is no remote (the links are hidden).
 */
function repoUrl() {
  try {
    const remote = execFileSync('git', ['remote', 'get-url', 'origin'], { encoding: 'utf8' }).trim();
    return remote.replace(/^git@github\.com:/, 'https://github.com/').replace(/\.git$/, '');
  } catch {
    return '';
  }
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)', '../../../packages/ui/src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs', '@storybook/addon-links'],
  framework: { name: '@storybook/react-vite', options: {} },
  // Each component's docs page (src/overview/*.mdx) is called Overview and sits first in its folder.
  docs: { defaultName: 'Overview' },
  // The props table reads the component's own TypeScript props and their JSDoc, through the union types.
  // HTML attributes from React's types are left out, so the table lists only Northline props.
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      // The library's own project, so docgen sees the components (Storybook's project only holds their stories).
      tsconfigPath: fileURLToPath(new URL('../../../packages/ui/tsconfig.json', import.meta.url)),
      include: [fileURLToPath(new URL('../../../packages/ui/src/**/*.tsx', import.meta.url))],
      exclude: ['**/*.stories.tsx', '**/*.test.tsx'],
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => !prop.parent?.fileName.includes('node_modules'),
    },
  },
  // Story-only artwork (for example the NlAvatar placeholder image). Not part of the library.
  staticDirs: ['../public'],
  core: { disableTelemetry: true },
  // @northline/ui resolves to its source, so Storybook never needs the library build first.
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      plugins: [tailwindcss()],
      define: { __NL_REPO_URL__: JSON.stringify(repoUrl()) },
      resolve: {
        alias: [
          {
            find: /^@northline\/ui\/charts$/,
            replacement: fileURLToPath(new URL('../../../packages/ui/src/charts/index.ts', import.meta.url)),
          },
          {
            find: /^@northline\/ui$/,
            replacement: fileURLToPath(new URL('../../../packages/ui/src/index.ts', import.meta.url)),
          },
        ],
      },
    }),
};

export default config;
