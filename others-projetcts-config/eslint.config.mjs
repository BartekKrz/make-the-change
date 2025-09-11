import pluginQuery from '@tanstack/eslint-plugin-query';
import importPlugin from 'eslint-plugin-import';
import lingui from 'eslint-plugin-lingui';
import nPlugin from 'eslint-plugin-n';
import prettier from 'eslint-plugin-prettier';
import promise from 'eslint-plugin-promise';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactNative from 'eslint-plugin-react-native';

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [eslint.configs.recommended, tseslint.configs.recommended],
  plugins: {
    lingui,
    'react-hooks': reactHooks,
    import: importPlugin,
    n: nPlugin,
    prettier,
    promise,
    react,
    'react-native': reactNative,
    ...pluginQuery.configs['flat/recommended']
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true
      }
    ],
    '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
    'no-restricted-imports': [
      'warn',
      {
        paths: [
          {
            name: 'react-native',
            importNames: ['SafeAreaView', 'StatusBar', 'Image', 'TextInput'],
            message:
              "Please use SafeAreaView from 'react-native-safe-area-context', StatusBar from 'expo-status-bar', Image from 'expo-image', and TextField from this project instead."
          },
          {
            name: 'react-native-paper',
            importNames: ['Button', 'Text', 'TouchableRipple'],
            message: 'Please use components from this project instead'
          },
          {
            name: 'react-native-screens',
            importNames: ['Screen'],
            message: 'Please use Screen from this project instead.'
          },
          {
            name: '@react-navigation/native',
            importNames: ['useTheme'],
            message: 'Please use useAppTheme from this project instead.'
          }
        ]
      }
    ]
  },
  ignores: [
    'metro.config.js',
    'babel.config.js',
    'node_modules/**/*',
    '.expo/**/*',
    'env.d.ts',
    './src/legacy-app/**/*',
    './src/locales/**/messages.ts'
  ]
});
