import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./src/tests/setup.ts'],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8', reporter: ['text', 'lcov'], reportsDirectory: './coverage',
      include: ['src/modules/**/*.ts', 'src/routes/**/*.ts'],
      thresholds: { lines: 70, functions: 70, statements: 70, branches: 60 },
    },
  },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
});
