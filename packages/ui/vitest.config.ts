import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Behaviour tests (CLAUDE.md "How to build a component", step 5): Vitest, Testing Library and jsdom.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    restoreMocks: true,
  },
});
