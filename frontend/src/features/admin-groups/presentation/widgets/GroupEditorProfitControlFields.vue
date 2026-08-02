<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { GroupEditorDialogContext } from "../groupEditorContext";
import { isProfitControlPlatform } from "../groupsProfitControl";

const { context } = defineProps<{ context: GroupEditorDialogContext }>();
const { t } = useI18n();
const { form } = context;
</script>

<template>
  <div v-if="isProfitControlPlatform(form.platform)" class="border-t pt-4">
    <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
      <input
        v-model="form.profit_control_enabled"
        type="checkbox"
        class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
      />
      <span>{{ t("admin.groups.profitControl.enable") }}</span>
    </label>
    <p class="mb-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
      {{
        t(
          form.profit_control_enabled
            ? "admin.groups.profitControl.enabledHint"
            : "admin.groups.profitControl.disabledHint",
        )
      }}
    </p>
    <div
      v-if="form.profit_control_enabled"
      class="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      <div>
        <label class="input-label">{{ t("admin.groups.profitControl.minMargin") }}</label>
        <input
          v-model.number="form.profit_min_margin_percent"
          type="number"
          step="0.1"
          min="0"
          max="99.99"
          class="input"
          placeholder="0"
          :title="t('admin.groups.profitControl.minMarginHint')"
        />
      </div>
      <div>
        <label class="input-label">{{ t("admin.groups.profitControl.safetyBuffer") }}</label>
        <input
          v-model.number="form.profit_safety_buffer_percent"
          type="number"
          step="0.1"
          min="0"
          max="99.99"
          class="input"
          placeholder="0"
          :title="t('admin.groups.profitControl.safetyBufferHint')"
        />
      </div>
    </div>
  </div>
</template>
