/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    css: true,
    exclude: [
      '**/node_modules/**',
      '**/test/e2e/**',
      '**/*.e2e.*',
      '**/*.playwright.*',
    ],
    include: ['**/test/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
        'src/components/ui/**', // shadcn/ui components
        '**/*.stories.*',
      ],
      thresholds: {
        global: {
          functions: 80,
          lines: 80,
          statements: 80,
        },
        // Stricter pour logique critique selon stratégie TDD
        'src/lib/business/**': {
          functions: 95,
          lines: 95,
          statements: 95,
        },
        // tRPC routers moved to shared package
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
