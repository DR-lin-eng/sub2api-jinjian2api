<template>
  <div class="card">
    <div
      class="border-b border-gray-100 px-6 py-4 dark:border-dark-700"
    >
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ t("admin.settings.linuxdo.title") }}
      </h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ t("admin.settings.linuxdo.description") }}
      </p>
    </div>
    <div class="space-y-5 p-6">
      <div>
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t("admin.settings.scheduling.requestPriorityAdmission") }}
            </label>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.scheduling.requestPriorityAdmissionHint") }}
            </p>
          </div>
          <Toggle
            v-model="form.request_priority_admission_enabled"
            data-testid="request-priority-admission-toggle"
          />
        </div>

        <div
          v-if="form.request_priority_admission_enabled"
          class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <label class="block">
            <span class="input-label">{{
              t("admin.settings.scheduling.requestPriorityPendingLimit")
            }}</span>
            <input
              v-model.number="form.request_priority_pending_limit_per_instance"
              type="number"
              min="1"
              required
              class="input"
              data-testid="request-priority-pending-limit"
            />
            <span class="mt-1 block text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.scheduling.requestPriorityPendingLimitHint") }}
            </span>
          </label>
          <label class="block">
            <span class="input-label">{{
              t("admin.settings.scheduling.requestPriorityPendingMiB")
            }}</span>
            <input
              v-model.number="form.request_priority_pending_mib_per_instance"
              type="number"
              min="1"
              required
              class="input"
              data-testid="request-priority-pending-mib"
            />
            <span class="mt-1 block text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.scheduling.requestPriorityPendingMiBHint") }}
            </span>
          </label>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div>
          <label class="font-medium text-gray-900 dark:text-white">{{
            t("admin.settings.linuxdo.enable")
          }}</label>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ t("admin.settings.linuxdo.enableHint") }}
          </p>
        </div>
        <Toggle v-model="form.linuxdo_connect_enabled" />
      </div>

      <div
        v-if="form.linuxdo_connect_enabled"
        class="border-t border-gray-100 pt-4 dark:border-dark-700"
      >
        <div class="grid grid-cols-1 gap-6">
          <div>
            <label
              class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("admin.settings.linuxdo.clientId") }}
            </label>
            <input
              v-model="form.linuxdo_connect_client_id"
              type="text"
              class="input font-mono text-sm"
              :placeholder="
                t('admin.settings.linuxdo.clientIdPlaceholder')
              "
            />
            <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.linuxdo.clientIdHint") }}
            </p>
          </div>

          <div>
            <label
              class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("admin.settings.linuxdo.clientSecret") }}
            </label>
            <input
              v-model="form.linuxdo_connect_client_secret"
              type="password"
              class="input font-mono text-sm"
              :placeholder="
                form.linuxdo_connect_client_secret_configured
                  ? t(
                      'admin.settings.linuxdo.clientSecretConfiguredPlaceholder',
                    )
                  : t('admin.settings.linuxdo.clientSecretPlaceholder')
              "
            />
            <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {{
                form.linuxdo_connect_client_secret_configured
                  ? t(
                      "admin.settings.linuxdo.clientSecretConfiguredHint",
                    )
                  : t("admin.settings.linuxdo.clientSecretHint")
              }}
            </p>
          </div>

          <div>
            <label
              class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("admin.settings.linuxdo.redirectUrl") }}
            </label>
            <input
              v-model="form.linuxdo_connect_redirect_url"
              type="url"
              class="input font-mono text-sm"
              :placeholder="
                t('admin.settings.linuxdo.redirectUrlPlaceholder')
              "
            />
            <div
              class="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3"
            >
              <button
                type="button"
                class="btn btn-secondary btn-sm w-fit"
                @click="setAndCopyLinuxdoRedirectUrl"
              >
                {{ t("admin.settings.linuxdo.quickSetCopy") }}
              </button>
              <code
                v-if="linuxdoRedirectUrlSuggestion"
                class="select-all break-all rounded bg-gray-50 px-2 py-1 font-mono text-xs text-gray-600 dark:bg-dark-800 dark:text-gray-300"
              >
                {{ linuxdoRedirectUrlSuggestion }}
              </code>
            </div>
            <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.linuxdo.redirectUrlHint") }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Toggle from '@/common/widgets/forms/Toggle.vue'
import { useSettingsPageContext } from '@/features/admin-settings/presentation/composables/settingsPageContext'

const {
  form,
  linuxdoRedirectUrlSuggestion,
  setAndCopyLinuxdoRedirectUrl,
  t,
} = useSettingsPageContext()
</script>
