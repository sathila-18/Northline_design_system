import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// Builds src/styles/index.css into dist/index.css with Tailwind, and copies the font files to dist/fonts/.
// Runs after the component build (vite.config.ts), so it must not empty dist/.
export default defineConfig({
  plugins: [tailwindcss()],
  base: './', // font URLs relative to dist/index.css, so they work wherever the package is installed
  build: {
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      input: { index: fileURLToPath(new URL('src/styles/index.css', import.meta.url)) },
      output: {
        assetFileNames: (asset) =>
          asset.names.some((name) => name.endsWith('.css')) ? '[name][extname]' : 'fonts/[name][extname]',
      },
    },
  },
});
