import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  resolve: {
    conditions: ['default', 'module'],
  },
});