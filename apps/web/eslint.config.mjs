// @ts-check
import js from '@eslint/js';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import vitest from 'eslint-plugin-vitest';
import playwright from 'eslint-plugin-playwright';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Global ignores
  {
    ignores: [
      '.next/**',
      'dist/**',
      'node_modules/**',
      'public/**',
      'coverage/**',
      '*.config.{js,mjs,ts}',
      'playwright-report/**',
      'test-results/**',
      'src/types/supabase.ts', // Generated file
      'next-env.d.ts', // Generated file
    ],
  },

  // Base configurations
  js.configs.recommended,
  ...tseslint.configs.recommended,
  unicorn.configs['flat/recommended'],

  // Main configuration (Next.js 15.5 + React 19 + TypeScript 2025)
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      '@tanstack/query': tanstackQuery,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2024,
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      // === TypeScript Rules (2025 Standards) ===
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // === React 19 + Next.js 15 Rules ===
      'react/react-in-jsx-scope': 'off', // React 19 auto-import
      'react/prop-types': 'off', // TypeScript handles this
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          shorthandFirst: true,
          multiline: 'last',
          reservedFirst: true,
        },
      ],
      'react/self-closing-comp': 'error',
      'react/jsx-curly-brace-presence': ['error', 'never'],
      'react/jsx-boolean-value': ['error', 'never'],
      'react/no-array-index-key': 'warn',

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // === Import Organization ===
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      'import/no-duplicates': 'error',

      // === TanStack Query v5 ===
      '@tanstack/query/exhaustive-deps': 'error',

      // === Accessibility ===
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/click-events-have-key-events': 'warn',

      // === Unicorn (Modern JS Best Practices 2025) ===
      'unicorn/better-regex': 'error',
      'unicorn/prefer-spread': 'error',
      'unicorn/prefer-string-trim-start-end': 'error',
      'unicorn/prefer-array-flat-map': 'error',
      'unicorn/prefer-array-some': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-optional-catch-binding': 'error',
      'unicorn/prefer-string-starts-ends-with': 'error',
      'unicorn/no-null': 'off', // Too restrictive for React
      'unicorn/prevent-abbreviations': 'off', // Too strict for our conventions
      'unicorn/prefer-module': 'error',
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/no-unsafe-regex': 'error',
      'unicorn/no-useless-undefined': 'error',
      'unicorn/prefer-export-from': 'error',

      // === General Quality Rules ===
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
    },
  },

  // === Test Files (Vitest) ===
  {
    files: ['**/*.test.{js,ts,tsx}', '**/*.spec.{js,ts,tsx}'],
    plugins: {
      vitest,
    },
    rules: {
      'vitest/expect-expect': 'error',
      'vitest/no-disabled-tests': 'warn',
      'vitest/no-focused-tests': 'error',
    },
  },

  // === E2E Tests (Playwright) ===
  {
    files: ['**/*.e2e.{js,ts}', '**/e2e/**/*.{js,ts}', '**/playwright/**/*.{js,ts}'],
    plugins: {
      playwright,
    },
    rules: {
      'playwright/expect-expect': 'error',
    },
  },

  // === App Router Files ===
  {
    files: [
      '**/app/**/{page,layout,loading,error,not-found}.{js,ts,tsx}',
      '**/app/**/route.{js,ts}',
    ],
    rules: {
      'import/no-default-export': 'off', // App Router requires default exports
    },
  },
];