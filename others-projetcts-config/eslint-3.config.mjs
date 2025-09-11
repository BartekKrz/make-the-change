import eslint from '@eslint/js';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import pluginLingui from 'eslint-plugin-lingui';
import react from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [tseslint.configs.recommended, eslint.configs.recommended, pluginLingui.configs['flat/recommended']],
  rules: {
    '@typescript-eslint/no-require-imports': 'off',
    'no-unused-vars': 'off', //@typescript-eslint/no-unused-vars is used instead
  },
  plugins: {
    react,
    tanstackQuery,
  },
  ignores: ['./vite.config.ts', './src/components/ui/**/*.ts', './src/components/ui/**/*.tsx'],
  languageOptions: {
    globals: {
      ...globals.browser,
      RequestInit: true,
    },
  },
});