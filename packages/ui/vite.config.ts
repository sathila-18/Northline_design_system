import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Library mode, ES modules only, one output file per source file (preserveModules),
// so every 'use client' directive stays at the top of its own file (DESIGN.md §7.4).
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      // Two entry points: the library, and @northline/ui/charts (DESIGN.md §9 "Charts"), so apps that don't use
      // charts never load them.
      entry: {
        index: fileURLToPath(new URL('src/index.ts', import.meta.url)),
        'charts/index': fileURLToPath(new URL('src/charts/index.ts', import.meta.url)),
      },
      formats: ['es'],
    },
    minify: false,
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      // Runtime dependencies stay imports, so the consumer's install provides them (one copy, deduplicated).
      external: [
        /^react($|\/)/,
        /^react-dom($|\/)/,
        /^react-is($|\/)/,
        /^recharts($|\/)/,
        /^@northline\/tokens($|\/)/,
        /^@floating-ui\//,
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
});
