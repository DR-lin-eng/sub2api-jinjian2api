const js = require('@eslint/js')
const typescriptPlugin = require('@typescript-eslint/eslint-plugin')
const typescriptParser = require('@typescript-eslint/parser')
const vuePlugin = require('eslint-plugin-vue')
const vueParser = require('vue-eslint-parser')
const globals = require('globals')
const architecturePlugin = require('./eslint/architecture-boundaries.cjs')

const legacyImportPatterns = [
  {
    group: [
      '@/views/**',
      '@/components/**',
      '@/composables/**',
      '@/constants/**',
      '@/i18n/**',
      '@/router/**',
      '@/styles/**',
      '@/utils/**',
    ],
    message: 'Import from the owning core/common/feature module instead of a retired top-level path.',
  },
]

const restrictedImports = (patterns = []) => [
  'error',
  { patterns: [...legacyImportPatterns, ...patterns] },
]

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
      architecture: architecturePlugin,
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
      'no-restricted-imports': restrictedImports(),
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
  // Enforce the PR's boundaries that already match the current mainline. More
  // invasive page/repository separation remains intentionally incremental.
  {
    files: ['src/core/utils/**/*.{ts,vue}'],
    ignores: ['**/__tests__/**'],
    rules: {
      'no-restricted-imports': restrictedImports([
        {
          group: [
            '@/core/networks/**',
            '@/core/routes/**',
            '@/core/services/**',
            '@/core/stores/**',
            '@/core/themes/**',
            '@/common/**',
            '@/features/**',
          ],
          message: 'core/utils must remain independent of state, routing, UI, and feature implementations.',
        },
      ]),
    },
  },
  {
    files: ['src/core/networks/**/*.{ts,vue}'],
    ignores: ['**/__tests__/**'],
    rules: {
      'no-restricted-imports': restrictedImports([
        {
          group: [
            '@/core/routes/**',
            '@/core/stores/**',
            '@/common/**',
            '@/features/**',
          ],
          message: 'core/networks must not depend on routing, stores, UI, or feature implementations.',
        },
      ]),
    },
  },
  {
    files: ['src/common/composables/**/*.{ts,vue}'],
    ignores: ['**/__tests__/**'],
    rules: {
      'no-restricted-imports': restrictedImports([
        {
          group: ['@/common/pages/**', '@/common/widgets/**', '@/features/**'],
          message: 'common composables must not depend on pages, widgets, or feature implementations.',
        },
      ]),
    },
  },
  {
    files: ['src/common/types/**/*.{ts,vue}'],
    ignores: ['**/__tests__/**'],
    rules: {
      'no-restricted-imports': restrictedImports([
        {
          group: ['axios', 'pinia', 'vue', 'vue-router', '@/features/**'],
          message: 'common/types must remain framework-independent TypeScript.',
        },
      ]),
    },
  },
  {
    files: ['src/features/*/domain/**/*.{ts,vue}'],
    ignores: ['**/__tests__/**'],
    rules: {
      'no-restricted-imports': restrictedImports([
        {
          group: [
            'axios',
            'pinia',
            'vue',
            'vue-i18n',
            'vue-router',
            '@/features/*/data/**',
            '@/features/*/presentation/**',
          ],
          message: 'feature domain code must remain framework-independent and must not import data or presentation.',
        },
      ]),
    },
  },
  {
    files: ['src/features/*/data/**/*.{ts,vue}'],
    ignores: ['**/__tests__/**'],
    rules: {
      'no-restricted-imports': restrictedImports([
        {
          group: ['pinia', 'vue', '@/features/*/presentation/**'],
          message: 'feature data code must remain independent of Vue state and presentation.',
        },
      ]),
    },
  },
  {
    files: [
      'src/features/*/presentation/pages/**/*.{ts,vue}',
      'src/features/*/presentation/stores/**/*.{ts,vue}',
      'src/features/*/presentation/composables/**/*.{ts,vue}',
    ],
    ignores: ['**/__tests__/**'],
    rules: {
      'no-restricted-imports': restrictedImports([
        {
          group: ['axios'],
          message: 'presentation code must use the shared network or feature datasource layer instead of Axios directly.',
        },
      ]),
    },
  },
  {
    files: ['src/**/*.{ts,vue}'],
    ignores: ['**/__tests__/**', '**/*.spec.ts', '**/*.test.ts'],
    rules: {
      'architecture/no-new-debt': 'error',
      // A repository-wide ceiling prevents a large module from being moved to
      // another layer just to bypass the page/widget rule.
      'max-lines': [
        'error',
        { max: 1500, skipBlankLines: true, skipComments: true },
      ],
    },
  },
]
