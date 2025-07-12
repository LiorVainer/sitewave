import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'eslint/config';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsEslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintConfigPrettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import unicorn from 'eslint-plugin-unicorn';
import importPlugin from 'eslint-plugin-import';
import promise from 'eslint-plugin-promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

// /** @type {import("eslint").FlatConfig[]} */
export default defineConfig([
    { ignores: ['dist', 'src/components/ui/**', 'src/components/animate-ui/**'] },
    js.configs.recommended,
    ...tsEslint.configs.recommended,
    reactHooks.configs['recommended-latest'],
    reactRefresh.configs.recommended,
    unicorn.configs.recommended,
    // sonarjs.configs.recommended,
    promise.configs['flat/recommended'],
    eslintConfigPrettier,
    prettierRecommended,
    {
        extends: [importPlugin.flatConfigs.typescript],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            globals: globals.browser,
            parserOptions: {
                ecmaFeatures: { jsx: true },
                project: 'tsconfig.json',
            },
        },
        plugins: {
            react,
            'jsx-a11y': jsxA11y,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': 'off',
            'no-empty-pattern': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            'prettier/prettier': 'warn',
            'unicorn/prevent-abbreviations': 'off',
            'unicorn/filename-case': 'off',
            'unicorn/prefer-logical-operator-over-ternary': 'off',
            'unicorn/prefer-module': 'off',
            'unicorn/no-null': 'off',
            'sonarjs/no-unused-vars': 'off',
            'sonarjs/slow-regex': 'off',
            'sonarjs/prefer-read-only-props': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            'sonarjs/no-dead-store': 'off',
            'sonarjs/void-use': 'off',
            'unicorn/no-abusive-eslint-disable': 'off',
        },
        settings: {
            react: { version: 'detect' },
        },
    },
]);
