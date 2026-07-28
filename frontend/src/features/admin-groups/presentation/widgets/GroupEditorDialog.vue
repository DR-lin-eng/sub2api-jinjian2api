<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import BaseDialog from "@/common/widgets/feedback/BaseDialog.vue";
import Select from "@/common/widgets/forms/Select.vue";
import Icon from "@/common/widgets/icons/Icon.vue";
import GroupEditorMediaPricingFields from "./GroupEditorMediaPricingFields.vue";
import ReasoningEffortPolicyFields from "./ReasoningEffortPolicyFields.vue";
import {
  invertModelsListSelection,
  selectAllModelsListItems,
} from "../groupsModelsListResolver";
import type {
  EditGroupDialogContext,
  GroupEditorDialogContext,
} from "../groupEditorContext";

type GroupEditorDialogProps =
  | { mode: "create"; context: GroupEditorDialogContext }
  | { mode: "edit"; context: EditGroupDialogContext };

const props = defineProps<GroupEditorDialogProps>();
const { t } = useI18n();
const isEdit = props.mode === "edit";
const editorContext = props.context;
const editingGroup = computed(() =>
  props.mode === "edit" ? props.context.editingGroup.value : null,
);
const statusOptions = computed(() =>
  props.mode === "edit" ? props.context.statusOptions.value : [],
);
const {
  accountSearchKeyword,
  accountSearchResults,
  addMessagesDispatchMapping,
  addRoutingRule,
  close,
  copyAccountsOptions,
  fallbackOptions,
  form,
  getMessagesDispatchRowKey,
  getRuleRenderKey,
  getRuleSearchKey,
  invalidRequestFallbackOptions,
  modelRoutingRules,
  modelsListLoading,
  modelsListSelectedCount,
  modelsListState,
  moveModelsListItem,
  onAccountSearchFocus,
  platformOptions,
  reasoningEffortPolicyRef,
  removeMessagesDispatchMapping,
  removeRoutingRule,
  removeSelectedAccount,
  searchAccountsByRule,
  selectAccount,
  show,
  showAccountDropdown,
  submit,
  submitting,
  subscriptionTypeOptions,
  toggleLive,
  toggleScope,
  webSearchFinalPricePreview,
} = editorContext;
</script>

<template>
<BaseDialog
  :show="show"
  :title="t(isEdit ? 'admin.groups.editGroup' : 'admin.groups.createGroup')"
  width="normal"
  @close="close"
>
  <form
    v-if="!isEdit || editingGroup"
    :id="isEdit ? 'edit-group-form' : 'create-group-form'"
    @submit.prevent="submit"
    class="space-y-5"
  >
    <div>
      <label class="input-label">{{ t("admin.groups.form.name") }}</label>
      <input
        v-model="form.name"
        type="text"
        required
        class="input"
        :placeholder="isEdit ? undefined : t('admin.groups.enterGroupName')"
        :data-tour="isEdit ? 'edit-group-form-name' : 'group-form-name'"
      />
    </div>
    <div>
      <label class="input-label">{{
        t("admin.groups.form.description")
      }}</label>
      <textarea
        v-model="form.description"
        rows="3"
        class="input"
        :placeholder="isEdit ? undefined : t('admin.groups.optionalDescription')"
      ></textarea>
    </div>
    <div>
      <label class="input-label">{{
        t("admin.groups.form.platform")
      }}</label>
      <Select
        v-model="form.platform"
        :options="platformOptions"
        :disabled="isEdit"
        data-tour="group-form-platform"
        @change="!isEdit && (form.copy_accounts_from_group_ids = [])"
      />
      <p class="input-hint">
        {{
          t(
            isEdit
              ? "admin.groups.platformNotEditable"
              : "admin.groups.platformHint",
          )
        }}
      </p>
    </div>
    <!-- 从分组复制账号 -->
    <div v-if="copyAccountsOptions.length > 0">
      <div class="mb-1.5 flex items-center gap-1">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ t("admin.groups.copyAccounts.title") }}
        </label>
        <div class="group relative inline-flex">
          <Icon
            name="questionCircle"
            size="sm"
            :stroke-width="2"
            class="cursor-help text-gray-400 transition-colors hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400"
          />
          <div
            class="pointer-events-none absolute bottom-full left-0 z-50 mb-2 w-72 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100"
          >
            <div
              class="rounded-lg bg-gray-900 p-3 text-white shadow-lg dark:bg-gray-800"
            >
              <p class="text-xs leading-relaxed text-gray-300">
                {{
                  t(
                    isEdit
                      ? "admin.groups.copyAccounts.tooltipEdit"
                      : "admin.groups.copyAccounts.tooltip",
                  )
                }}
              </p>
              <div
                class="absolute -bottom-1.5 left-3 h-3 w-3 rotate-45 bg-gray-900 dark:bg-gray-800"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 已选分组标签 -->
      <div
        v-if="form.copy_accounts_from_group_ids.length > 0"
        class="flex flex-wrap gap-1.5 mb-2"
      >
        <span
          v-for="groupId in form.copy_accounts_from_group_ids"
          :key="groupId"
          class="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
        >
          {{
            copyAccountsOptions.find((o) => o.value === groupId)
              ?.label || `#${groupId}`
          }}
          <button
            type="button"
            @click="
              form.copy_accounts_from_group_ids =
                form.copy_accounts_from_group_ids.filter(
                  (id) => id !== groupId,
                )
            "
            class="ml-0.5 text-primary-500 hover:text-primary-700 dark:hover:text-primary-200"
          >
            <Icon name="x" size="xs" />
          </button>
        </span>
      </div>
      <!-- 分组选择下拉 -->
      <select
        class="input"
        @change="
          (e) => {
            const val = Number((e.target as HTMLSelectElement).value);
            if (
              val &&
              !form.copy_accounts_from_group_ids.includes(val)
            ) {
              form.copy_accounts_from_group_ids.push(val);
            }
            (e.target as HTMLSelectElement).value = '';
          }
        "
      >
        <option value="">
          {{ t("admin.groups.copyAccounts.selectPlaceholder") }}
        </option>
        <option
          v-for="opt in copyAccountsOptions"
          :key="opt.value"
          :value="opt.value"
          :disabled="
            form.copy_accounts_from_group_ids.includes(opt.value)
          "
        >
          {{ opt.label }}
        </option>
      </select>
      <p class="input-hint">
        {{
          t(
            isEdit
              ? "admin.groups.copyAccounts.hintEdit"
              : "admin.groups.copyAccounts.hint",
          )
        }}
      </p>
    </div>
    <div>
      <label class="input-label">{{
        t("admin.groups.form.rateMultiplier")
      }}</label>
      <input
        v-model.number="form.rate_multiplier"
        type="number"
        step="0.001"
        min="0.001"
        required
        class="input"
        data-tour="group-form-multiplier"
      />
      <p v-if="!isEdit" class="input-hint">
        {{ t("admin.groups.rateMultiplierHint") }}
      </p>
    </div>
    <div>
      <label class="input-label">{{ t("admin.groups.form.rpmLimit") }}</label>
      <input
        v-model.number="form.rpm_limit"
        type="number"
        min="0"
        step="1"
        class="input"
        :placeholder="t('admin.groups.form.rpmLimitPlaceholder')"
      />
      <p class="input-hint">{{ t("admin.groups.form.rpmLimitHint") }}</p>
    </div>
    <ReasoningEffortPolicyFields
      v-if="form.platform === 'openai'"
      ref="reasoningEffortPolicyRef"
      :id-prefix="isEdit ? 'edit-group-reasoning' : 'create-group-reasoning'"
      :platform="form.platform"
      v-model:max-effort="form.max_reasoning_effort"
      v-model:mappings="form.reasoning_effort_mappings"
    />
    <div
      v-if="form.subscription_type !== 'subscription'"
      :data-tour="isEdit ? undefined : 'group-form-exclusive'"
    >
      <div class="mb-1.5 flex items-center gap-1">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ t("admin.groups.form.exclusive") }}
        </label>
        <!-- Help Tooltip -->
        <div class="group relative inline-flex">
          <Icon
            name="questionCircle"
            size="sm"
            :stroke-width="2"
            class="cursor-help text-gray-400 transition-colors hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400"
          />
          <!-- Tooltip Popover -->
          <div
            class="pointer-events-none absolute bottom-full left-0 z-50 mb-2 w-72 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100"
          >
            <div
              class="rounded-lg bg-gray-900 p-3 text-white shadow-lg dark:bg-gray-800"
            >
              <p class="mb-2 text-xs font-medium">
                {{ t("admin.groups.exclusiveTooltip.title") }}
              </p>
              <p class="mb-2 text-xs leading-relaxed text-gray-300">
                {{ t("admin.groups.exclusiveTooltip.description") }}
              </p>
              <div class="rounded bg-gray-800 p-2 dark:bg-gray-700">
                <p class="text-xs leading-relaxed text-gray-300">
                  <span
                    class="inline-flex items-center gap-1 text-primary-400"
                    ><Icon name="lightbulb" size="xs" />
                    {{ t("admin.groups.exclusiveTooltip.example") }}</span
                  >
                  {{ t("admin.groups.exclusiveTooltip.exampleContent") }}
                </p>
              </div>
              <!-- Arrow -->
              <div
                class="absolute -bottom-1.5 left-3 h-3 w-3 rotate-45 bg-gray-900 dark:bg-gray-800"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="form.is_exclusive = !form.is_exclusive"
          :class="[
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            form.is_exclusive
              ? 'bg-primary-500'
              : 'bg-gray-300 dark:bg-dark-600',
          ]"
        >
          <span
            :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
              form.is_exclusive ? 'translate-x-6' : 'translate-x-1',
            ]"
          />
        </button>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{
            form.is_exclusive
              ? t("admin.groups.exclusive")
              : t("admin.groups.public")
          }}
        </span>
      </div>
    </div>

    <div v-if="isEdit">
      <label class="input-label">{{ t("admin.groups.form.status") }}</label>
      <Select v-model="form.status" :options="statusOptions" />
    </div>

    <!-- Subscription Configuration -->
    <div class="mt-4 border-t pt-4">
      <div>
        <label class="input-label">{{
          t("admin.groups.subscription.type")
        }}</label>
        <Select
          v-model="form.subscription_type"
          :options="subscriptionTypeOptions"
          :disabled="isEdit"
        />
        <p class="input-hint">
          {{
            t(
              isEdit
                ? "admin.groups.subscription.typeNotEditable"
                : "admin.groups.subscription.typeHint",
            )
          }}
        </p>
      </div>

      <!-- Subscription limits (only show when subscription type is selected) -->
      <div
        v-if="form.subscription_type === 'subscription'"
        class="space-y-4 border-l-2 border-primary-200 pl-4 dark:border-primary-800"
      >
        <div>
          <label class="input-label">{{
            t("admin.groups.subscription.dailyLimit")
          }}</label>
          <input
            v-model.number="form.daily_limit_usd"
            type="number"
            step="0.01"
            min="0"
            class="input"
            :placeholder="t('admin.groups.subscription.noLimit')"
          />
        </div>
        <div>
          <label class="input-label">{{
            t("admin.groups.subscription.weeklyLimit")
          }}</label>
          <input
            v-model.number="form.weekly_limit_usd"
            type="number"
            step="0.01"
            min="0"
            class="input"
            :placeholder="t('admin.groups.subscription.noLimit')"
          />
        </div>
        <div>
          <label class="input-label">{{
            t("admin.groups.subscription.monthlyLimit")
          }}</label>
          <input
            v-model.number="form.monthly_limit_usd"
            type="number"
            step="0.01"
            min="0"
            class="input"
            :placeholder="t('admin.groups.subscription.noLimit')"
          />
        </div>
      </div>
    </div>

    <div class="border-t pt-4">
      <div class="mb-3 flex items-center justify-between gap-3">
        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t("admin.groups.modelsList.title") }}
          </label>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ t("admin.groups.modelsList.hint") }}
          </p>
        </div>
        <button
          type="button"
          @click="modelsListState.enabled = !modelsListState.enabled"
          :class="[
            'relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors',
            modelsListState.enabled
              ? 'bg-primary-500'
              : 'bg-gray-300 dark:bg-dark-600',
          ]"
        >
          <span
            :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
              modelsListState.enabled ? 'translate-x-6' : 'translate-x-1',
            ]"
          />
        </button>
      </div>
      <div
        v-if="modelsListState.enabled"
        class="overflow-hidden rounded-lg border border-gray-200 bg-gray-50/50 dark:border-dark-600 dark:bg-dark-800/40"
      >
        <div
          v-if="!modelsListLoading && modelsListState.items.length > 0"
          class="flex items-center justify-between gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2 text-xs dark:border-dark-600 dark:bg-dark-800"
        >
          <span class="text-gray-500 dark:text-gray-400">
            {{
              t("admin.groups.modelsList.selectedSummary", {
                selected: modelsListSelectedCount,
                total: modelsListState.items.length,
              })
            }}
          </span>
          <div class="flex items-center gap-1.5">
            <button
              type="button"
              class="rounded px-2 py-1 font-medium text-primary-600 transition-colors hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20"
              @click="selectAllModelsListItems(modelsListState)"
            >
              {{ t("admin.groups.modelsList.selectAll") }}
            </button>
            <button
              type="button"
              class="rounded px-2 py-1 font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700"
              @click="invertModelsListSelection(modelsListState)"
            >
              {{ t("admin.groups.modelsList.invertSelection") }}
            </button>
          </div>
        </div>
        <div
          class="max-h-64 space-y-2 overflow-y-auto p-2"
        >
          <p v-if="modelsListLoading" class="text-xs text-gray-500 dark:text-gray-400">
            {{ t("admin.groups.modelsList.loading") }}
          </p>
          <p
            v-else-if="modelsListState.items.length === 0"
            class="text-xs text-gray-500 dark:text-gray-400"
          >
            {{ t("admin.groups.modelsList.empty") }}
          </p>
          <div
            v-for="(item, index) in modelsListState.items"
            :key="item.id"
            class="flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-2 dark:border-dark-600 dark:bg-dark-800"
          >
            <input
              v-model="item.selected"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span class="min-w-0 flex-1 break-all text-sm text-gray-700 dark:text-gray-300">
              {{ item.id }}
            </span>
            <button
              type="button"
              :disabled="index === 0"
              class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40 dark:hover:bg-dark-600 dark:hover:text-gray-200"
              @click="moveModelsListItem(index, index - 1)"
            >
              <Icon name="arrowUp" size="sm" />
            </button>
            <button
              type="button"
              :disabled="index === modelsListState.items.length - 1"
              class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40 dark:hover:bg-dark-600 dark:hover:text-gray-200"
              @click="moveModelsListItem(index, index + 1)"
            >
              <Icon name="arrowDown" size="sm" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <GroupEditorMediaPricingFields
      :context="editorContext"
    />

    <!-- 高峰时段倍率配置（仅订阅类型分组） -->
    <div v-if="form.subscription_type === 'subscription'" class="border-t pt-4">
      <div class="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            v-model="form.peak_rate_enabled"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span>{{ t("admin.groups.peakRate.enable") }}</span>
        </label>
      </div>
      <div
        v-if="form.peak_rate_enabled"
        class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        <div>
          <label class="input-label">{{ t("admin.groups.peakRate.peakStart") }}</label>
          <input
            v-model="form.peak_start"
            type="time"
            class="input"
          />
        </div>
        <div>
          <label class="input-label">{{ t("admin.groups.peakRate.peakEnd") }}</label>
          <input
            v-model="form.peak_end"
            type="time"
            class="input"
          />
        </div>
        <div>
          <label class="input-label">{{ t("admin.groups.peakRate.peakMultiplier") }}</label>
          <input
            v-model.number="form.peak_rate_multiplier"
            type="number"
            step="0.001"
            min="0"
            class="input"
            placeholder="1"
            :title="t('admin.groups.peakRate.multiplierHint')"
          />
        </div>
      </div>
    </div>

    <!-- 支持的模型系列（仅 antigravity 平台） -->
    <div v-if="form.platform === 'antigravity'" class="border-t pt-4">
      <div class="mb-1.5 flex items-center gap-1">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ t("admin.groups.supportedScopes.title") }}
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
            class="pointer-events-none absolute bottom-full left-0 z-50 mb-2 w-72 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100"
          >
            <div
              class="rounded-lg bg-gray-900 p-3 text-white shadow-lg dark:bg-gray-800"
            >
              <p class="text-xs leading-relaxed text-gray-300">
                {{ t("admin.groups.supportedScopes.tooltip") }}
              </p>
              <div
                class="absolute -bottom-1.5 left-3 h-3 w-3 rotate-45 bg-gray-900 dark:bg-gray-800"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="space-y-2">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            :checked="form.supported_model_scopes.includes('claude')"
            @change="toggleScope('claude')"
            class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-dark-600 dark:bg-dark-700"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">{{
            t("admin.groups.supportedScopes.claude")
          }}</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            :checked="
              form.supported_model_scopes.includes('gemini_text')
            "
            @change="toggleScope('gemini_text')"
            class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-dark-600 dark:bg-dark-700"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">{{
            t("admin.groups.supportedScopes.geminiText")
          }}</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            :checked="
              form.supported_model_scopes.includes('gemini_image')
            "
            @change="toggleScope('gemini_image')"
            class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-dark-600 dark:bg-dark-700"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">{{
            t("admin.groups.supportedScopes.geminiImage")
          }}</span>
        </label>
      </div>
      <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {{ t("admin.groups.supportedScopes.hint") }}
      </p>
    </div>

    <!-- MCP XML 协议注入（仅 antigravity 平台） -->
    <div v-if="form.platform === 'antigravity'" class="border-t pt-4">
      <div class="mb-1.5 flex items-center gap-1">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ t("admin.groups.mcpXml.title") }}
        </label>
        <div class="group relative inline-flex">
          <Icon
            name="questionCircle"
            size="sm"
            :stroke-width="2"
            class="cursor-help text-gray-400 transition-colors hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400"
          />
          <div
            class="pointer-events-none absolute bottom-full left-0 z-50 mb-2 w-72 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100"
          >
            <div
              class="rounded-lg bg-gray-900 p-3 text-white shadow-lg dark:bg-gray-800"
            >
              <p class="text-xs leading-relaxed text-gray-300">
                {{ t("admin.groups.mcpXml.tooltip") }}
              </p>
              <div
                class="absolute -bottom-1.5 left-3 h-3 w-3 rotate-45 bg-gray-900 dark:bg-gray-800"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="form.mcp_xml_inject = !form.mcp_xml_inject"
          :class="[
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            form.mcp_xml_inject
              ? 'bg-primary-500'
              : 'bg-gray-300 dark:bg-dark-600',
          ]"
        >
          <span
            :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
              form.mcp_xml_inject ? 'translate-x-6' : 'translate-x-1',
            ]"
          />
        </button>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{
            form.mcp_xml_inject
              ? t("admin.groups.mcpXml.enabled")
              : t("admin.groups.mcpXml.disabled")
          }}
        </span>
      </div>
    </div>

    <!-- Claude Code 客户端限制（仅 anthropic 平台） -->
    <div v-if="form.platform === 'anthropic'" class="border-t pt-4">
      <div class="mb-1.5 flex items-center gap-1">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ t("admin.groups.claudeCode.title") }}
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
            class="pointer-events-none absolute bottom-full left-0 z-50 mb-2 w-72 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100"
          >
            <div
              class="rounded-lg bg-gray-900 p-3 text-white shadow-lg dark:bg-gray-800"
            >
              <p class="text-xs leading-relaxed text-gray-300">
                {{ t("admin.groups.claudeCode.tooltip") }}
              </p>
              <div
                class="absolute -bottom-1.5 left-3 h-3 w-3 rotate-45 bg-gray-900 dark:bg-gray-800"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="
            form.claude_code_only = !form.claude_code_only
          "
          :class="[
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            form.claude_code_only
              ? 'bg-primary-500'
              : 'bg-gray-300 dark:bg-dark-600',
          ]"
        >
          <span
            :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
              form.claude_code_only
                ? 'translate-x-6'
                : 'translate-x-1',
            ]"
          />
        </button>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{
            form.claude_code_only
              ? t("admin.groups.claudeCode.enabled")
              : t("admin.groups.claudeCode.disabled")
          }}
        </span>
      </div>
      <!-- 降级分组选择（仅当启用 claude_code_only 时显示） -->
      <div v-if="form.claude_code_only" class="mt-3">
        <label class="input-label">{{
          t("admin.groups.claudeCode.fallbackGroup")
        }}</label>
        <Select
          v-model="form.fallback_group_id"
          :options="fallbackOptions"
          :placeholder="t('admin.groups.claudeCode.noFallback')"
        />
        <p class="input-hint">
          {{ t("admin.groups.claudeCode.fallbackHint") }}
        </p>
      </div>
    </div>

    <!-- Codex 网页搜索按次计费（仅 openai 平台） -->
    <div
      v-if="form.platform === 'openai'"
      class="border-t border-gray-200 dark:border-dark-400 pt-4 mt-4"
    >
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {{ t("admin.groups.webSearchPricing.title") }}
      </h4>
      <div>
        <label class="input-label">{{
          t("admin.groups.webSearchPricing.pricePerCall")
        }}</label>
        <input
          v-model.number="form.web_search_price_per_call"
          type="number"
          step="0.001"
          min="0"
          placeholder="0.01"
          class="input"
        />
        <p class="input-hint">
          {{ t("admin.groups.webSearchPricing.pricePerCallHint") }}
        </p>
        <div
          class="mt-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-600 dark:bg-dark-700 dark:text-gray-300"
        >
          {{
            t("admin.groups.webSearchPricing.finalPricePreview", {
              price: webSearchFinalPricePreview,
            })
          }}
        </div>
      </div>
    </div>

    <!-- OpenAI Live 开关（仅 openai 平台） -->
    <div
      v-if="form.platform === 'openai'"
      class="border-t border-gray-200 dark:border-dark-400 pt-4 mt-4"
    >
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {{ t("admin.groups.openaiLive.title") }}
      </h4>
      <div class="flex items-center justify-between">
        <label class="text-sm text-gray-600 dark:text-gray-400">{{
          t("admin.groups.openaiLive.allow")
        }}</label>
        <button
          type="button"
          @click="toggleLive()"
          class="relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
          :class="
            form.allow_live
              ? 'bg-primary-500'
              : 'bg-gray-300 dark:bg-dark-600'
          "
        >
          <span
            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            :class="form.allow_live ? 'translate-x-6' : 'translate-x-1'"
          />
        </button>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {{ t("admin.groups.openaiLive.hint") }}
      </p>
    </div>

    <!-- OpenAI Messages 调度配置（仅 openai 平台） -->
    <div
      v-if="form.platform === 'openai'"
      class="border-t border-gray-200 dark:border-dark-400 pt-4 mt-4"
    >
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {{ t("admin.groups.openaiMessages.title") }}
      </h4>

      <!-- 允许 Messages 调度开关 -->
      <div class="flex items-center justify-between">
        <label class="text-sm text-gray-600 dark:text-gray-400">{{
          t("admin.groups.openaiMessages.allowDispatch")
        }}</label>
        <button
          type="button"
          @click="
            form.allow_messages_dispatch =
              !form.allow_messages_dispatch
          "
          class="relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
          :class="
            form.allow_messages_dispatch
              ? 'bg-primary-500'
              : 'bg-gray-300 dark:bg-dark-600'
          "
        >
          <span
            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            :class="
              form.allow_messages_dispatch
                ? 'translate-x-6'
                : 'translate-x-1'
            "
          />
        </button>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {{ t("admin.groups.openaiMessages.allowDispatchHint") }}
      </p>

      <div v-if="form.allow_messages_dispatch" class="mt-3">
        <div
          class="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-dark-600 dark:bg-dark-800"
        >
          <div
            class="border-b border-gray-100 bg-gray-50/80 px-4 py-3 dark:border-dark-700 dark:bg-dark-700/50"
          >
            <div class="flex items-center gap-2">
              <div class="h-2 w-2 rounded-full bg-blue-500"></div>
              <label
                class="text-sm font-medium text-gray-900 dark:text-white"
                >{{
                  t("admin.groups.openaiMessages.familyMappingTitle")
                }}</label
              >
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.groups.openaiMessages.familyMappingHint") }}
            </p>
          </div>
          <div class="p-4">
            <div class="grid gap-4 md:grid-cols-3">
              <div>
                <label class="input-label">{{
                  t("admin.groups.openaiMessages.opusModel")
                }}</label>
                <input
                  v-model="form.opus_mapped_model"
                  type="text"
                  :placeholder="
                    t('admin.groups.openaiMessages.opusModelPlaceholder')
                  "
                  class="input"
                />
              </div>
              <div>
                <label class="input-label">{{
                  t("admin.groups.openaiMessages.sonnetModel")
                }}</label>
                <input
                  v-model="form.sonnet_mapped_model"
                  type="text"
                  :placeholder="
                    t('admin.groups.openaiMessages.sonnetModelPlaceholder')
                  "
                  class="input"
                />
              </div>
              <div>
                <label class="input-label">{{
                  t("admin.groups.openaiMessages.haikuModel")
                }}</label>
                <input
                  v-model="form.haiku_mapped_model"
                  type="text"
                  :placeholder="
                    t('admin.groups.openaiMessages.haikuModelPlaceholder')
                  "
                  class="input"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          class="mt-5 relative overflow-hidden rounded-xl border border-primary-200 bg-white shadow-sm dark:border-primary-900/50 dark:bg-dark-800"
        >
          <div
            class="border-b border-primary-100 bg-primary-50/80 px-4 py-3 dark:border-primary-900/40 dark:bg-primary-900/20"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <div class="h-2 w-2 rounded-full bg-primary-500"></div>
                  <label
                    class="text-sm font-medium text-primary-900 dark:text-primary-100"
                    >{{
                      t("admin.groups.openaiMessages.exactMappingTitle")
                    }}</label
                  >
                </div>
                <p
                  class="mt-1 text-xs text-primary-600/90 dark:text-primary-400/90"
                >
                  {{ t("admin.groups.openaiMessages.exactMappingHint") }}
                </p>
              </div>
            </div>
          </div>

          <div class="p-4 bg-gray-50/30 dark:bg-dark-800/30">
            <div
              v-if="form.exact_model_mappings.length === 0"
              class="flex items-center justify-between gap-3 rounded-xl border-2 border-dashed border-primary-200 bg-white px-5 py-4 text-sm text-primary-700 transition-colors hover:border-primary-300 dark:border-primary-900/40 dark:bg-dark-800 dark:text-primary-300 dark:hover:border-primary-800"
            >
              <span>{{
                t("admin.groups.openaiMessages.noExactMappings")
              }}</span>
              <button
                type="button"
                @click="addMessagesDispatchMapping"
                class="flex items-center gap-1.5 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                <Icon name="plus" size="sm" />
                {{ t("admin.groups.openaiMessages.addExactMapping") }}
              </button>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="row in form.exact_model_mappings"
                :key="getMessagesDispatchRowKey(row)"
                class="group relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-primary-300 hover:shadow-md dark:border-dark-600 dark:bg-dark-700 dark:hover:border-primary-700"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="grid flex-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-start"
                  >
                    <div>
                      <label class="input-label">{{
                        t("admin.groups.openaiMessages.claudeModel")
                      }}</label>
                      <input
                        v-model="row.claude_model"
                        type="text"
                        :placeholder="
                          t(
                            'admin.groups.openaiMessages.claudeModelPlaceholder',
                          )
                        "
                        class="input bg-gray-50 focus:bg-white dark:bg-dark-800 dark:focus:bg-dark-900"
                      />
                    </div>
                    <div
                      class="hidden md:flex md:justify-center md:pt-7 text-primary-300 dark:text-primary-700"
                    >
                      <Icon
                        name="arrowRight"
                        size="sm"
                        class="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                    <div>
                      <label class="input-label">{{
                        t("admin.groups.openaiMessages.targetModel")
                      }}</label>
                      <input
                        v-model="row.target_model"
                        type="text"
                        :placeholder="
                          t(
                            'admin.groups.openaiMessages.targetModelPlaceholder',
                          )
                        "
                        class="input bg-gray-50 focus:bg-white dark:bg-dark-800 dark:focus:bg-dark-900"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="removeMessagesDispatchMapping(row)"
                    class="mt-6 flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    :title="
                      t('admin.groups.openaiMessages.removeExactMapping')
                    "
                  >
                    <Icon name="trash" size="sm" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                @click="addMessagesDispatchMapping"
                class="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white py-3 text-sm font-medium text-gray-500 transition-all hover:border-primary-300 hover:bg-primary-50/50 hover:text-primary-600 dark:border-dark-600 dark:bg-dark-800 dark:text-gray-400 dark:hover:border-primary-800 dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
              >
                <Icon name="plus" size="sm" />
                {{ t("admin.groups.openaiMessages.addExactMapping") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

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
  </form>

  <template #footer>
    <div class="flex justify-end gap-3 pt-4">
      <button
        @click="close"
        type="button"
        class="btn btn-secondary"
      >
        {{ t("common.cancel") }}
      </button>
      <button
        type="submit"
        :form="isEdit ? 'edit-group-form' : 'create-group-form'"
        :disabled="submitting"
        class="btn btn-primary"
        data-tour="group-form-submit"
      >
        <svg
          v-if="submitting"
          class="-ml-1 mr-2 h-4 w-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {{
          submitting
            ? t(isEdit ? "admin.groups.updating" : "admin.groups.creating")
            : t(isEdit ? "common.update" : "common.create")
        }}
      </button>
    </div>
  </template>
</BaseDialog>
</template>
