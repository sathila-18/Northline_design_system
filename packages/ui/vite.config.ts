import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Library mode, ES modules only, one output file per source file (preserveModules),
// so every 'use client' directive stays at the top of its own file (DESIGN.md §7.4).
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: fileURLToPath(new URL('src/index.ts', import.meta.url)),
      formats: ['es'],
    },
    minify: false,
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@northline\/tokens($|\/)/],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
});
