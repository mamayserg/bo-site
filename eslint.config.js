import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginNuxt from 'eslint-plugin-nuxt';
import eslintPluginPerfectionist from 'eslint-plugin-perfectionist';
import vitestPlugin from 'eslint-plugin-vitest';
import eslintPluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default [
  {
    ignores: ['node_modules', 'dist', '.nuxt', 'playwright-report'],
  },
  {
    files: ['**/*.vue', '**/*.ts', '**/*.js'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2021,
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      vue: eslintPluginVue,
      nuxt: eslintPluginNuxt,
      perfectionist: eslintPluginPerfectionist,
      import: eslintPluginImport,
      '@typescript-eslint': typescriptPlugin,
      vitest: vitestPlugin,
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        typescript: {},
      },
    },
    rules: {
      'import/order': ['warn', { 'alphabetize': { order: 'asc' } }],
      'import/no-unresolved': 'error',
      'import/export': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/no-parsing-error': 'error',
      'nuxt/no-cjs-in-config': 'error',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2, {
        'SwitchCase': 1,
        'ignoredNodes': ['TemplateLiteral *'],
        'flatTernaryExpressions': false
      }],
      'no-trailing-spaces': 'error',
      'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
      '@typescript-eslint/ban-ts-comment': 'off',
      'object-curly-spacing': ['error', 'always'],
      '@typescript-eslint/no-explicit-any': 'off',
      'newline-before-return': 'error',
      'no-console': 'error',
      'no-debugger': 'warn',
      'no-inline-comments': 'error',
      'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 1 }],
      '@typescript-eslint/no-unused-vars': ['warn'],
      'max-len': [
        'error',
        120,
        2,
        {
          'ignoreUrls': true,
          'ignoreComments': false,
          'ignoreRegExpLiterals': true,
          'ignoreStrings': true,
          'ignoreTemplateLiterals': true
        }
      ],
      'prefer-destructuring': [
        'error',
        {
          'VariableDeclarator': {
            'array': false,
            'object': true
          },
          'AssignmentExpression': {
            'array': false,
            'object': false
          }
        },
        {
          'enforceForRenamedProperties': false
        }
      ],
      'eol-last': ['error', 'always'],
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
  },
];
