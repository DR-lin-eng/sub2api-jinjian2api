<template>
        <div class="space-y-6">
          <div class="card">
            <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ t("admin.settings.performance.title") }}
              </h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ t("admin.settings.performance.description") }}
              </p>
            </div>
            <div class="space-y-5 p-6">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <label class="font-medium text-gray-900 dark:text-white">
                    {{ t("admin.settings.performance.streamMode.label") }}
                  </label>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {{ t("admin.settings.performance.streamMode.hint") }}
                  </p>
                </div>
                <Toggle
                  v-model="form.stream_mode_performance_enabled"
                  data-testid="stream-mode-performance-toggle"
                />
              </div>
              <div class="flex items-start gap-2 border-t border-gray-100 pt-4 text-sm text-gray-500 dark:border-dark-700 dark:text-gray-400">
                <Icon name="infoCircle" size="sm" class="mt-0.5 flex-shrink-0" />
                <span>{{ t("admin.settings.performance.streamMode.dockerNote") }}</span>
              </div>
            </div>
          </div>
        </div>
</template>

<script setup lang="ts">
import Icon from '@/common/widgets/icons/Icon.vue'
import Toggle from '@/common/widgets/forms/Toggle.vue'
import { useSettingsPageContext } from '@/features/admin-settings/presentation/composables/settingsPageContext'

const { form, t } = useSettingsPageContext()
</script>
