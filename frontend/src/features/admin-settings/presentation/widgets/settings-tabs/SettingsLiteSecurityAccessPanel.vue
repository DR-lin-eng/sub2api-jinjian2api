<template>
  <div class="space-y-6">
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t('admin.settings.security.title') }}
        </h2>
      </div>
      <div class="space-y-5 p-6">
        <div class="flex items-center justify-between gap-4">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">
              {{ t('admin.settings.security.totp') }}
            </label>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('admin.settings.security.totpHint') }}
            </p>
            <p v-if="!form.totp_encryption_key_configured" class="mt-2 text-sm text-amber-600 dark:text-amber-400">
              {{ t('admin.settings.security.totpKeyNotConfigured') }}
            </p>
          </div>
          <Toggle v-model="form.totp_enabled" :disabled="!form.totp_encryption_key_configured" />
        </div>

        <div class="flex items-center justify-between gap-4 border-t border-gray-100 pt-4 dark:border-dark-700">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">
              {{ t('admin.settings.security.passkey') }}
            </label>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('admin.settings.security.passkeyHint') }}
            </p>
          </div>
          <Toggle v-model="form.passkey_enabled" :disabled="!form.passkey_configured" />
        </div>

        <div class="flex items-center justify-between gap-4 border-t border-gray-100 pt-4 dark:border-dark-700">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">
              {{ t('admin.settings.security.stepUp') }}
            </label>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('admin.settings.security.stepUpHint') }}
            </p>
          </div>
          <Toggle v-model="form.step_up_enabled" />
        </div>

        <div class="flex items-center justify-between gap-4 border-t border-gray-100 pt-4 dark:border-dark-700">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">
              {{ t('admin.settings.security.sessionBinding') }}
            </label>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('admin.settings.security.sessionBindingHint') }}
            </p>
          </div>
          <Toggle v-model="form.session_binding_enabled" />
        </div>

      </div>
    </div>

    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t('admin.settings.apiKeyAcl.title') }}
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t('admin.settings.apiKeyAcl.description') }}
        </p>
      </div>
      <div class="space-y-5 p-6">
        <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(240px,360px)] md:items-center">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">
              {{ t('admin.settings.apiKeyAcl.resolutionMode') }}
            </label>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('admin.settings.apiKeyAcl.resolutionModeHint') }}
            </p>
          </div>
          <Select
            :model-value="form.client_ip_resolution_mode"
            :options="clientIPResolutionModeOptions"
            :searchable="false"
            @update:model-value="form.client_ip_resolution_mode = $event as ClientIPResolutionMode"
          />
        </div>

        <div v-if="form.client_ip_resolution_mode !== 'direct'">
          <label class="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
            {{ t('admin.settings.apiKeyAcl.trustedProxies') }}
          </label>
          <textarea
            v-model="clientIPTrustedProxiesText"
            class="input min-h-24 font-mono text-sm"
            :placeholder="t('admin.settings.apiKeyAcl.trustedProxiesPlaceholder')"
            spellcheck="false"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ t('admin.settings.apiKeyAcl.trustedProxiesHint') }}
          </p>
        </div>

        <p v-if="form.client_ip_resolution_status.cloudflare_last_success_at" class="text-xs text-gray-500 dark:text-gray-400">
          {{ t('admin.settings.apiKeyAcl.lastRefresh', { time: clientIPLastRefreshText }) }}
        </p>
      </div>
    </div>

    <PanelRateLimitSettingsCard v-if="panelRateLimitSettingsMounted" />
  </div>
</template>

<script setup lang="ts">
import Select from '@/common/widgets/forms/Select.vue'
import Toggle from '@/common/widgets/forms/Toggle.vue'
import type { ClientIPResolutionMode } from '@/features/admin-settings/data/dtos/adminSystemSettingsDtos'
import PanelRateLimitSettingsCard from '@/features/admin-settings/presentation/widgets/PanelRateLimitSettingsCard.vue'
import { useSettingsPageContext } from '@/features/admin-settings/presentation/composables/settingsPageContext'

const {
  clientIPLastRefreshText,
  clientIPResolutionModeOptions,
  clientIPTrustedProxiesText,
  form,
  panelRateLimitSettingsMounted,
  t
} = useSettingsPageContext()
</script>
