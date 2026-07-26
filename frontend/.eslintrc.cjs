module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: "latest",
    sourceType: "module",
    extraFileExtensions: [".vue"],
  },
  plugins: ["vue", "@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "no-constant-condition": "off",
    "no-mixed-spaces-and-tabs": "off",
    "no-useless-escape": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "vue/multi-word-component-names": "off",
    "vue/no-use-v-if-with-v-for": "off",
  },
  overrides: [
    // ========================================================================
    // Layer boundary guards — per .bin/frontend_layer_spec.md §12
    //
    // Status: WARNING-ONLY during Wave 0-10 migration.
    // Wave 11 收尾时统一升级为 error（见 migration_plan.md §3 Wave 11）。
    // ========================================================================

    // --- core/** 内部规则 (spec §3 R2) ---

    // core/utils, core/constants, core/types MUST be pure TS,
    // FORBIDDEN 引用其它 core/* 子目录
    {
      files: ["src/core/utils/**/*.{ts,vue}", "src/core/constants/**/*.{ts,vue}", "src/core/types/**/*.{ts,vue}"],
      rules: {
        "no-restricted-imports": ["error", {
          patterns: [
            { group: ["@/core/networks/**"], message: "core/utils|constants|types MUST 是纯 TS，禁止引用其它 core/* 子目录（spec §3 R2）" },
            { group: ["@/core/stores/**"], message: "core/utils|constants|types MUST 是纯 TS，禁止引用其它 core/* 子目录（spec §3 R2）" },
            { group: ["@/core/routes/**"], message: "core/utils|constants|types MUST 是纯 TS，禁止引用其它 core/* 子目录（spec §3 R2）" },
            { group: ["@/core/services/**"], message: "core/utils|constants|types MUST 是纯 TS，禁止引用其它 core/* 子目录（spec §3 R2）" },
            { group: ["@/core/i18n/**"], message: "core/utils|constants|types MUST 是纯 TS，禁止引用其它 core/* 子目录（spec §3 R2）" },
            { group: ["@/core/themes/**"], message: "core/utils|constants|types MUST 是纯 TS，禁止引用其它 core/* 子目录（spec §3 R2）" },
            { group: ["@/core/animations/**"], message: "core/utils|constants|types MUST 是纯 TS，禁止引用其它 core/* 子目录（spec §3 R2）" },
            { group: ["@/common/**"], message: "core/** MUST NOT import common/**（spec §3 R2）" },
            { group: ["@/features/**"], message: "core/** MUST NOT import features/**（spec §3 R2）" },
          ],
        }],
      },
    },

    // core/networks MUST NOT import core/stores | core/routes | core/i18n（避免循环）
    {
      files: ["src/core/networks/**/*.{ts,vue}"],
      rules: {
        "no-restricted-imports": ["error", {
          patterns: [
            { group: ["@/core/stores/**"], message: "core/networks MUST NOT import core/stores（避免循环，spec §3 R2）" },
            { group: ["@/core/routes/**"], message: "core/networks MUST NOT import core/routes（避免循环，spec §3 R2）" },
            { group: ["@/core/i18n/**"], message: "core/networks MUST NOT import core/i18n（避免循环，spec §3 R2）" },
            { group: ["@/common/**"], message: "core/** MUST NOT import common/**（spec §3 R2）" },
            { group: ["@/features/**"], message: "core/** MUST NOT import features/**（spec §3 R2）" },
          ],
        }],
      },
    },

    // core/i18n, core/themes, core/animations 是自包含叶子
    {
      files: ["src/core/i18n/**/*.{ts,vue}", "src/core/themes/**/*.{ts,vue}", "src/core/animations/**/*.{ts,vue}"],
      rules: {
        "no-restricted-imports": ["error", {
          patterns: [
            { group: ["@/core/networks/**"], message: "core/i18n|themes|animations MUST 是自包含叶子模块（spec §3 R2）" },
            { group: ["@/core/stores/**"], message: "core/i18n|themes|animations MUST 是自包含叶子模块（spec §3 R2）" },
            { group: ["@/core/routes/**"], message: "core/i18n|themes|animations MUST 是自包含叶子模块（spec §3 R2）" },
            { group: ["@/core/services/**"], message: "core/i18n|themes|animations MUST 是自包含叶子模块（spec §3 R2）" },
            { group: ["@/common/**"], message: "core/** MUST NOT import common/**（spec §3 R2）" },
            { group: ["@/features/**"], message: "core/** MUST NOT import features/**（spec §3 R2）" },
          ],
        }],
      },
    },

    // core/routes 只能 import feature barrel（spec §10.2），禁止内部路径
    {
      files: ["src/core/routes/**/*.{ts,vue}"],
      rules: {
        "no-restricted-imports": ["error", {
          patterns: [
            { group: ["@/common/**"], message: "core/** MUST NOT import common/**（spec §3 R2）" },
            { group: ["@/features/*/**"], message: "core/routes MUST 只 import feature barrel（@/features/<name>），禁止 feature 内部路径（spec §10.2）" },
          ],
        }],
      },
    },

    // 兜底：所有 core/** 都禁止引用 common/ 与 features/
    {
      files: ["src/core/**/*.{ts,vue}"],
      excludedFiles: ["src/core/routes/**/*.{ts,vue}"],
      rules: {
        "no-restricted-imports": ["error", {
          patterns: [
            { group: ["@/common/**"], message: "core/** MUST NOT import common/**（spec §3 R2）" },
            { group: ["@/features/**"], message: "core/** MUST NOT import features/**（spec §3 R2）" },
          ],
        }],
      },
    },

    // --- common/** 内部规则 (spec §3 R2) ---

    // common/composables 禁止 import widgets/pages/features
    {
      files: ["src/common/composables/**/*.{ts,vue}"],
      rules: {
        "no-restricted-imports": ["error", {
          patterns: [
            { group: ["@/common/widgets/**"], message: "common/composables MUST NOT import common/widgets（spec §3 R2）" },
            { group: ["@/common/pages/**"], message: "common/composables MUST NOT import common/pages（spec §3 R2）" },
            { group: ["@/features/**"], message: "common/** MUST NOT import features/**（spec §3 R2）" },
          ],
        }],
      },
    },

    // common/pages 禁止 import features
    {
      files: ["src/common/pages/**/*.{ts,vue}"],
      rules: {
        "no-restricted-imports": ["error", {
          patterns: [
            { group: ["@/features/**"], message: "common/** MUST NOT import features/**（spec §3 R2）" },
          ],
        }],
      },
    },

    // common/widgets 禁止 import features
    {
      files: ["src/common/widgets/**/*.{ts,vue}"],
      rules: {
        "no-restricted-imports": ["error", {
          patterns: [
            { group: ["@/features/**"], message: "common/** MUST NOT import features/**（spec §3 R2）" },
          ],
        }],
      },
    },

    // common/types 禁止运行时依赖
    {
      files: ["src/common/types/**/*.{ts,vue}"],
      rules: {
        "no-restricted-imports": ["error", {
          patterns: [
            { group: ["vue"], message: "common/types MUST 是纯 TypeScript（spec §3 R2）" },
            { group: ["pinia"], message: "common/types MUST 是纯 TypeScript（spec §3 R2）" },
            { group: ["vue-router"], message: "common/types MUST 是纯 TypeScript（spec §3 R2）" },
            { group: ["axios"], message: "common/types MUST 是纯 TypeScript（spec §3 R2）" },
            { group: ["@/features/**"], message: "common/** MUST NOT import features/**（spec §3 R2）" },
          ],
        }],
      },
    },

    // --- features/** 内部规则 (spec §3 R2) ---

    // features/*/domain/** MUST 是纯 TS
    // 使用 @typescript-eslint/no-restricted-imports 以支持 allowTypeImports
    {
      files: ["src/features/*/domain/**/*.{ts,vue}"],
      rules: {
        "no-restricted-imports": "off",
        "@typescript-eslint/no-restricted-imports": ["error", {
          patterns: [
            { group: ["axios"], message: "features/*/domain/** MUST 是纯 TypeScript（spec §3 R2）" },
            { group: ["pinia"], message: "features/*/domain/** MUST 是纯 TypeScript（spec §3 R2）" },
            { group: ["vue"], message: "features/*/domain/** MUST 是纯 TypeScript（spec §3 R2）" },
            { group: ["vue-router"], message: "features/*/domain/** MUST 是纯 TypeScript（spec §3 R2）" },
            { group: ["vue-i18n"], message: "features/*/domain/** MUST 是纯 TypeScript（spec §3 R2）" },
            { group: ["@/features/*/data/**"], message: "domain MUST NOT import data 层运行时；`import type` 从 datasource 拿签名允许（Repository interface typeof 复用）", allowTypeImports: true },
            { group: ["@/features/*/presentation/**"], message: "domain MUST NOT import presentation 层（spec §3 R2）" },
          ],
        }],
      },
    },

    // features/*/data/** 只能 import 自己 domain + core/networks
    {
      files: ["src/features/*/data/**/*.{ts,vue}"],
      rules: {
        "no-restricted-imports": ["error", {
          patterns: [
            { group: ["@/features/*/presentation/**"], message: "data/** MUST NOT import presentation/**（spec §3 R2）" },
            { group: ["pinia"], message: "data/** MUST 与状态管理解耦，禁止 import pinia（spec §3 R2）" },
            { group: ["vue"], message: "data/** MUST 与视图解耦，禁止 import vue（spec §3 R2）" },
          ],
        }],
      },
    },

    // features/*/presentation/stores/** & composables/** 禁止穿透 datasource；
    // 允许 import data/repositories/*Impl（因为 §5.4 R5.1 双导出模式要 new Impl）。
    // Type-only import from datasource 允许（读取共享类型 signature）。
    {
      files: ["src/features/*/presentation/stores/**/*.{ts,vue}", "src/features/*/presentation/composables/**/*.{ts,vue}"],
      rules: {
        "no-restricted-imports": "off",
        "@typescript-eslint/no-restricted-imports": ["error", {
          patterns: [
            { group: ["axios"], message: "store/composable MUST NOT import axios（spec §5.4 R5 / §5.5 R6）" },
            { group: ["@/core/networks/client*"], message: "store/composable MUST NOT import apiClient（spec §5.4 R5 / §5.5 R6）" },
            { group: ["@/features/*/data/datasources/**"], message: "store/composable MUST NOT import datasource 运行时；MUST 通过 domain/repositories interface（spec §5.4 R5 / §5.5 R6）；type-only import 允许", allowTypeImports: true },
            { group: ["@/features/*/data/models/**"], message: "store/composable MUST NOT import DTO；MUST 通过 domain/models（spec §5.4 R5）", allowTypeImports: true },
          ],
        }],
      },
    },

    // features/*/presentation/pages/** 禁止 axios/datasource/DTO 直接依赖；
    // Page MUST 通过 composable/store 拿数据（§5.6 R7）
    {
      files: ["src/features/*/presentation/pages/**/*.{ts,vue}"],
      rules: {
        "no-restricted-imports": ["error", {
          patterns: [
            { group: ["axios"], message: "Page MUST NOT import axios（spec §5.6 R7）" },
            { group: ["@/features/*/data/datasources/**"], message: "Page MUST NOT import datasource（spec §5.6 R7）" },
            { group: ["@/features/*/data/models/**"], message: "Page MUST NOT import DTO；MUST 通过 domain/models（spec §5.6 R7）" },
            { group: ["@/features/*/data/repositories/**"], message: "Page MUST NOT import Repository Impl；MUST 通过 domain/repositories interface + store（spec §5.6 R7）" },
          ],
        }],
      },
    },

    // 跨 feature 引用禁止：features/A/** MUST NOT import features/B/**
    // (无法在单个 override 里表达"排除自身"，交给 CI grep 兜底或 codemod 时排查)

    // --- SPEC EXCEPTION (temporary): useBatchImageAccess ---
    // 逻辑跨 keys + batch-image 两个 feature，spec 无合法归属地。
    // 计划：待后端在 /auth/me 或 /settings 返回 canUseBatchImage 字段后消除此文件与所有豁免。
    {
      files: ["src/features/batch-image/presentation/composables/useBatchImageAccess.ts"],
      rules: { "no-restricted-imports": "off" },
    },
    {
      files: [
        "src/common/widgets/layout/AppSidebar.vue",
        "src/features/dashboard-user/presentation/widgets/UserDashboardQuickActions.vue",
        "src/features/admin-dashboard/presentation/pages/DashboardPage.vue",
      ],
      rules: { "no-restricted-imports": "off" },
    },
  ],
};
