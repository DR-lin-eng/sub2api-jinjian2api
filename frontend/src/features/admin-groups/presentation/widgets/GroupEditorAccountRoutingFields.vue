<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Select from "@/common/widgets/forms/Select.vue";
import Icon from "@/common/widgets/icons/Icon.vue";
import type { GroupEditorDialogContext } from "../groupEditorContext";

const { context } = defineProps<{ context: GroupEditorDialogContext }>();
const { t } = useI18n();
const {
  accountSearchKeyword,
  accountSearchResults,
  addRoutingRule,
  form,
  getRuleRenderKey,
  getRuleSearchKey,
  invalidRequestFallbackOptions,
  modelRoutingRules,
  onAccountSearchFocus,
  removeRoutingRule,
  removeSelectedAccount,
  searchAccountsByRule,
  selectAccount,
  showAccountDropdown,
} = context;
</script>

<template>
    <!-- 账号过滤控制 (OpenAI/Antigravity/Anthropic/Gemini) -->
    <div
      v-if="
        ['openai', 'antigravity', 'anthropic', 'gemini'].includes(
          form.platform,
        )
      "
      class="border-t border-gray-200 dark:border-dark-400 pt-4 mt-4 space-y-4"
    >
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {{ t("admin.groups.accountFilters.title") }}
      </h4>

      <!-- require_oauth_only toggle -->
      <div class="flex items-center justify-between">
        <div>
          <label class="text-sm text-gray-600 dark:text-gray-400"
            >{{ t("admin.groups.accountFilters.oauthOnly") }}</label
          >
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{
              form.require_oauth_only
                ? t("admin.groups.accountFilters.oauthOnlyEnabled")
                : t("admin.groups.accountFilters.disabled")
            }}
          </p>
        </div>
        <button
          type="button"
          @click="
            form.require_oauth_only = !form.require_oauth_only
          "
          class="relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
          :class="
            form.require_oauth_only
              ? 'bg-primary-500'
              : 'bg-gray-300 dark:bg-dark-600'
          "
        >
          <span
            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            :class="
              form.require_oauth_only
                ? 'translate-x-6'
                : 'translate-x-1'
            "
          />
        </button>
      </div>

      <!-- require_privacy_set toggle -->
      <div class="flex items-center justify-between">
        <div>
          <label class="text-sm text-gray-600 dark:text-gray-400"
            >{{ t("admin.groups.accountFilters.privacySetOnly") }}</label
          >
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{
              form.require_privacy_set
                ? t("admin.groups.accountFilters.privacySetOnlyEnabled")
                : t("admin.groups.accountFilters.disabled")
            }}
          </p>
        </div>
        <button
          type="button"
          @click="
            form.require_privacy_set = !form.require_privacy_set
          "
          class="relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
          :class="
            form.require_privacy_set
              ? 'bg-primary-500'
              : 'bg-gray-300 dark:bg-dark-600'
          "
        >
          <span
            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            :class="
              form.require_privacy_set
                ? 'translate-x-6'
                : 'translate-x-1'
            "
          />
        </button>
      </div>
    </div>

    <!-- 无效请求兜底（仅 anthropic/antigravity 平台，且非订阅分组） -->
    <div
      v-if="
        ['anthropic', 'antigravity'].includes(form.platform) &&
        form.subscription_type !== 'subscription'
      "
      class="border-t pt-4"
    >
      <label class="input-label">{{
        t("admin.groups.invalidRequestFallback.title")
      }}</label>
      <Select
        v-model="form.fallback_group_id_on_invalid_request"
        :options="invalidRequestFallbackOptions"
        :placeholder="t('admin.groups.invalidRequestFallback.noFallback')"
      />
      <p class="input-hint">
        {{ t("admin.groups.invalidRequestFallback.hint") }}
      </p>
    </div>

    <!-- 模型路由配置（仅 anthropic 平台） -->
    <div v-if="form.platform === 'anthropic'" class="border-t pt-4">
      <div class="mb-1.5 flex items-center gap-1">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ t("admin.groups.modelRouting.title") }}
        </label>
        <!-- Help Tooltip -->
        <div class="group relative inline-flex">
          <Icon
            name="questionCircle"
            size="sm"
            :stroke-width="2"
            class="cursor-help text-gray-400 transition-colors hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400"
          />
          <div
            class="pointer-events-none absolute bottom-full left-0 z-50 mb-2 w-80 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100"
          >
            <div
              class="rounded-lg bg-gray-900 p-3 text-white shadow-lg dark:bg-gray-800"
            >
              <p class="text-xs leading-relaxed text-gray-300">
                {{ t("admin.groups.modelRouting.tooltip") }}
              </p>
              <div
                class="absolute -bottom-1.5 left-3 h-3 w-3 rotate-45 bg-gray-900 dark:bg-gray-800"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 启用开关 -->
      <div class="flex items-center gap-3 mb-3">
        <button
          type="button"
          @click="
            form.model_routing_enabled =
              !form.model_routing_enabled
          "
          :class="[
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            form.model_routing_enabled
              ? 'bg-primary-500'
              : 'bg-gray-300 dark:bg-dark-600',
          ]"
        >
          <span
            :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
              form.model_routing_enabled
                ? 'translate-x-6'
                : 'translate-x-1',
            ]"
          />
        </button>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{
            form.model_routing_enabled
              ? t("admin.groups.modelRouting.enabled")
              : t("admin.groups.modelRouting.disabled")
          }}
        </span>
      </div>
      <p
        v-if="!form.model_routing_enabled"
        class="text-xs text-gray-500 dark:text-gray-400 mb-3"
      >
        {{ t("admin.groups.modelRouting.disabledHint") }}
      </p>
      <p v-else class="text-xs text-gray-500 dark:text-gray-400 mb-3">
        {{ t("admin.groups.modelRouting.noRulesHint") }}
      </p>
      <!-- 路由规则列表（仅在启用时显示） -->
      <div v-if="form.model_routing_enabled" class="space-y-3">
        <div
          v-for="rule in modelRoutingRules"
          :key="getRuleRenderKey(rule)"
          class="rounded-lg border border-gray-200 p-3 dark:border-dark-600"
        >
          <div class="flex items-start gap-3">
            <div class="flex-1 space-y-2">
              <div>
                <label class="input-label text-xs">{{
                  t("admin.groups.modelRouting.modelPattern")
                }}</label>
                <input
                  v-model="rule.pattern"
                  type="text"
                  class="input text-sm"
                  :placeholder="
                    t('admin.groups.modelRouting.modelPatternPlaceholder')
                  "
                />
              </div>
              <div>
                <label class="input-label text-xs">{{
                  t("admin.groups.modelRouting.accounts")
                }}</label>
                <!-- 已选账号标签 -->
                <div
                  v-if="rule.accounts.length > 0"
                  class="flex flex-wrap gap-1.5 mb-2"
                >
                  <span
                    v-for="account in rule.accounts"
                    :key="account.id"
                    class="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                  >
                    {{ account.name }}
                    <button
                      type="button"
                      @click="removeSelectedAccount(rule, account.id)"
                      class="ml-0.5 text-primary-500 hover:text-primary-700 dark:hover:text-primary-200"
                    >
                      <Icon name="x" size="xs" />
                    </button>
                  </span>
                </div>
                <!-- 账号搜索输入框 -->
                <div class="relative account-search-container">
                  <input
                    v-model="
                      accountSearchKeyword[getRuleSearchKey(rule)]
                    "
                    type="text"
                    class="input text-sm"
                    :placeholder="
                      t(
                        'admin.groups.modelRouting.searchAccountPlaceholder',
                      )
                    "
                    @input="searchAccountsByRule(rule)"
                    @focus="onAccountSearchFocus(rule)"
                  />
                  <!-- 搜索结果下拉框 -->
                  <div
                    v-if="
                      showAccountDropdown[getRuleSearchKey(rule)] &&
                      accountSearchResults[getRuleSearchKey(rule)]
                        ?.length > 0
                    "
                    class="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-lg border bg-white shadow-lg dark:border-dark-600 dark:bg-dark-800"
                  >
                    <button
                      v-for="account in accountSearchResults[
                        getRuleSearchKey(rule)
                      ]"
                      :key="account.id"
                      type="button"
                      @click="selectAccount(rule, account)"
                      class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-dark-700"
                      :class="{
                        'opacity-50': rule.accounts.some(
                          (a) => a.id === account.id,
                        ),
                      }"
                      :disabled="
                        rule.accounts.some((a) => a.id === account.id)
                      "
                    >
                      <span>{{ account.name }}</span>
                      <span class="ml-2 text-xs text-gray-400"
                        >#{{ account.id }}</span
                      >
                    </button>
                  </div>
                </div>
                <p class="text-xs text-gray-400 mt-1">
                  {{ t("admin.groups.modelRouting.accountsHint") }}
                </p>
              </div>
            </div>
            <button
              type="button"
              @click="removeRoutingRule(rule)"
              class="mt-5 p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              :title="t('admin.groups.modelRouting.removeRule')"
            >
              <Icon name="trash" size="sm" />
            </button>
          </div>
        </div>
      </div>
      <!-- 添加规则按钮（仅在启用时显示） -->
      <button
        v-if="form.model_routing_enabled"
        type="button"
        @click="addRoutingRule"
        class="mt-3 flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
      >
        <Icon name="plus" size="sm" />
        {{ t("admin.groups.modelRouting.addRule") }}
      </button>
    </div>
</template>
