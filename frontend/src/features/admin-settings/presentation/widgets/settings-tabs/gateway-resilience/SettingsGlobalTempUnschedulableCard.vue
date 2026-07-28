<template>
  <div class="card">
    <div
      class="border-b border-gray-100 px-6 py-4 dark:border-dark-700"
    >
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ t("admin.settings.globalTempUnschedulable.title") }}
      </h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ t("admin.settings.globalTempUnschedulable.description") }}
      </p>
    </div>
    <div class="space-y-5 p-6">
      <div
        v-if="globalTempUnschedulableLoading"
        class="flex items-center gap-2 text-gray-500"
      >
        {{ t("common.loading") }}
      </div>

      <template v-else>
        <div class="flex items-center justify-between gap-4">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">
              {{ t("admin.settings.globalTempUnschedulable.enabled") }}
            </label>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.globalTempUnschedulable.enabledHint") }}
            </p>
          </div>
          <Toggle v-model="globalTempUnschedulableForm.enabled" />
        </div>

        <div
          v-if="!globalTempUnschedulableForm.enabled"
          class="border-t border-gray-100 pt-4 text-sm text-amber-700 dark:border-dark-700 dark:text-amber-300"
        >
          {{ t("admin.settings.globalTempUnschedulable.disabledHint") }}
        </div>

        <div
          class="flex justify-end border-t border-gray-100 pt-4 dark:border-dark-700"
        >
          <button
            type="button"
            @click="saveGlobalTempUnschedulableSettings"
            :disabled="globalTempUnschedulableSaving"
            class="btn btn-primary btn-sm"
          >
            {{
              globalTempUnschedulableSaving
                ? t("common.saving")
                : t("common.save")
            }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import Toggle from '@/common/widgets/forms/Toggle.vue'
import { useSettingsPageContext } from '@/features/admin-settings/presentation/composables/settingsPageContext'

const {
  globalTempUnschedulableForm,
  globalTempUnschedulableLoading,
  globalTempUnschedulableSaving,
  saveGlobalTempUnschedulableSettings,
  t,
} = useSettingsPageContext()
</script>
