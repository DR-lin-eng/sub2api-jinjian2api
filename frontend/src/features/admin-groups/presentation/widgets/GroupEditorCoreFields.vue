<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Select from "@/common/widgets/forms/Select.vue";
import Icon from "@/common/widgets/icons/Icon.vue";
import GroupEditorMediaPricingFields from "./GroupEditorMediaPricingFields.vue";
import ReasoningEffortPolicyFields from "./ReasoningEffortPolicyFields.vue";
import {
  invertModelsListSelection,
  selectAllModelsListItems,
} from "../groupsModelsListResolver";
import { supportsReasoningEffortPolicyPlatform } from "../groupsReasoningEffort";
import type {
  GroupEditorDialogContext,
  GroupEditorOption,
} from "../groupEditorContext";

const { context, isEdit, statusOptions } = defineProps<{
  context: GroupEditorDialogContext;
  isEdit: boolean;
  statusOptions: GroupEditorOption[];
}>();
const { t } = useI18n();
const editorContext = context;
const {
  copyAccountsOptions,
  form,
  modelsListLoading,
  modelsListSelectedCount,
  modelsListState,
  moveModelsListItem,
  platformOptions,
  reasoningEffortPolicyRef,
} = context;
</script>

<template>
    <div>
      <label class="input-label">{{ t("admin.groups.form.name") }}</label>
      <input
        v-model="form.name"
        type="text"
        required
        class="input"
        :placeholder="isEdit ? undefined : t('admin.groups.enterGroupName')"
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
      v-if="supportsReasoningEffortPolicyPlatform(form.platform)"
      ref="reasoningEffortPolicyRef"
      :id-prefix="isEdit ? 'edit-group-reasoning' : 'create-group-reasoning'"
      :platform="form.platform"
      v-model:max-effort="form.max_reasoning_effort"
      v-model:mappings="form.reasoning_effort_mappings"
    />
    <div v-if="isEdit">
      <label class="input-label">{{ t("admin.groups.form.status") }}</label>
      <Select v-model="form.status" :options="statusOptions" />
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

</template>
