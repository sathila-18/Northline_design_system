import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)', '../../../packages/ui/src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs', '@storybook/addon-links'],
  framework: { name: '@storybook/react-vite', options: {} },
  // Story-only artwork (for example the NlAvatar placeholder image). Not part of the library.
  staticDirs: ['../public'],
  core: { disableTelemetry: true },
  // @northline/ui resolves to its source, so Storybook never needs the library build first.
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      plugins: [tailwindcss()],
      resolve: {
        alias: [
          {
            find: /^@northline\/ui$/,
            replacement: fileURLToPath(new URL('../../../packages/ui/src/index.ts', import.meta.url)),
          },
        ],
      },
    }),
};

export default config;
