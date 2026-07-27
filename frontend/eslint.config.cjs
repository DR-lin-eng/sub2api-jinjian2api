const js = require('@eslint/js')
const typescriptPlugin = require('@typescript-eslint/eslint-plugin')
const typescriptParser = require('@typescript-eslint/parser')
const vuePlugin = require('eslint-plugin-vue')
const vueParser = require('vue-eslint-parser')
const globals = require('globals')

module.exports = [
  {
    ignores: [
      '.cache/**',
      '.vite/**',
      'dist/**',
      'node_modules/**',
      'vite.config.d.ts',
      'vite.config.js',
    ],
  },
  js.configs.recommended,
  ...vuePlugin.configs['flat/essential'],
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        extraFileExtensions: ['.vue'],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      'no-constant-condition': 'off',
      'no-mixed-spaces-and-tabs': 'off',
      'no-useless-assignment': 'off',
      'no-useless-escape': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-use-v-if-with-v-for': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx,cts,mts,vue}'],
    rules: {
      'no-undef': 'off',
    },
  },
  {
    files: ['**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]
