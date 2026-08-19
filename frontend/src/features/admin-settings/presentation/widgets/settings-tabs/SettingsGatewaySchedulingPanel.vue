<template>
<div class="space-y-6">
  <!-- Claude Code Settings -->
  <div class="card">
    <div
      class="border-b border-gray-100 px-6 py-4 dark:border-dark-700"
    >
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ t("admin.settings.claudeCode.title") }}
      </h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ t("admin.settings.claudeCode.description") }}
      </p>
    </div>
    <div class="p-6">
      <div>
        <label
          class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {{ t("admin.settings.claudeCode.minVersion") }}
        </label>
        <input
          v-model="form.min_claude_code_version"
          type="text"
          class="input max-w-xs font-mono text-sm"
          :placeholder="
            t('admin.settings.claudeCode.minVersionPlaceholder')
          "
        />
        <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          {{ t("admin.settings.claudeCode.minVersionHint") }}
        </p>
      </div>
      <div class="mt-4">
        <label
          class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {{ t("admin.settings.claudeCode.maxVersion") }}
        </label>
        <input
          v-model="form.max_claude_code_version"
          type="text"
          class="input max-w-xs font-mono text-sm"
          :placeholder="
            t('admin.settings.claudeCode.maxVersionPlaceholder')
          "
        />
        <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          {{ t("admin.settings.claudeCode.maxVersionHint") }}
        </p>
      </div>
    </div>
  </div>

  <!-- Codex Settings -->
  <div class="card">
    <div
      class="border-b border-gray-100 px-6 py-4 dark:border-dark-700"
    >
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ t("admin.settings.gatewayForwarding.codexHardeningTitle") }}
      </h2>
    </div>
    <div class="p-6 space-y-4">
        <div>
          <h3 class="text-base font-semibold text-gray-900 dark:text-white">
            {{ t("admin.settings.gatewayForwarding.codexClientRestrictionTitle") }}
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ t("admin.settings.gatewayForwarding.codexHardeningDesc") }}
          </p>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("admin.settings.gatewayForwarding.minCodexVersion") }}
            </label>
            <input
              v-model="form.min_codex_version"
              type="text"
              class="input w-full font-mono text-sm"
              :placeholder="
                t(
                  'admin.settings.gatewayForwarding.minCodexVersionPlaceholder',
                )
              "
            />
          </div>
          <div>
            <label
              class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("admin.settings.gatewayForwarding.maxCodexVersion") }}
            </label>
            <input
              v-model="form.max_codex_version"
              type="text"
              class="input w-full font-mono text-sm"
              :placeholder="
                t(
                  'admin.settings.gatewayForwarding.maxCodexVersionPlaceholder',
                )
              "
            />
          </div>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ t("admin.settings.gatewayForwarding.codexVersionHint") }}
        </p>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t("admin.settings.gatewayForwarding.codexFingerprintSignals") }}
          </label>
          <p class="mb-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ t("admin.settings.gatewayForwarding.codexFingerprintSignalsDesc") }}
          </p>
          <div
            v-for="(row, i) in codexFingerprintRows"
            :key="`codex-fp-${i}`"
            class="mb-2 flex items-center gap-2"
          >
            <select v-model="row.type" class="input w-32 text-sm">
              <option value="header_exact">{{ t("admin.settings.gatewayForwarding.codexFpTypeHeaderExact") }}</option>
              <option value="header_prefix">{{ t("admin.settings.gatewayForwarding.codexFpTypeHeaderPrefix") }}</option>
              <option value="body_path">{{ t("admin.settings.gatewayForwarding.codexFpTypeBodyPath") }}</option>
            </select>
            <input
              v-model="row.match"
              type="text"
              class="input flex-1 font-mono text-sm"
              :placeholder="t('admin.settings.gatewayForwarding.codexFpMatchPlaceholder')"
            />
            <label class="flex shrink-0 items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <input v-model="row.required" type="checkbox" />
              {{ t("admin.settings.gatewayForwarding.codexFpRequired") }}
            </label>
            <button
              type="button"
              class="btn btn-secondary btn-sm shrink-0 text-red-600 hover:text-red-700 dark:text-red-400"
              @click="removeCodexFingerprintRow(i)"
            >
              {{ t("admin.settings.gatewayForwarding.codexRemoveRow") }}
            </button>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" @click="addCodexFingerprintRow">
            {{ t("admin.settings.gatewayForwarding.codexAddRow") }}
          </button>
          <p
            v-if="codexFingerprintNoRequired"
            class="mt-2 text-xs text-amber-600 dark:text-amber-500"
          >
            {{ t("admin.settings.gatewayForwarding.codexFingerprintNoRequiredWarn") }}
          </p>
        </div>

        <div class="flex items-center justify-between">
          <div class="pr-4">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{
                t("admin.settings.gatewayForwarding.codexAllowAppServer")
              }}
            </label>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{
                t(
                  "admin.settings.gatewayForwarding.codexAllowAppServerDesc",
                )
              }}
            </p>
          </div>
          <Toggle
            v-model="form.codex_cli_only_allow_app_server_clients"
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {{ t("admin.settings.gatewayForwarding.codexBlacklist") }}
          </label>
          <p class="mb-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ t("admin.settings.gatewayForwarding.codexBlacklistDesc") }}
          </p>
          <div
            v-for="(row, i) in codexBlacklistRows"
            :key="`codex-bl-${i}`"
            class="mb-2 flex gap-2"
          >
            <input
              v-model="row.originator"
              type="text"
              class="input w-1/3 font-mono text-sm"
              :placeholder="
                t(
                  'admin.settings.gatewayForwarding.codexOriginatorPlaceholder',
                )
              "
            />
            <input
              v-model="row.uaContains"
              type="text"
              class="input flex-1 font-mono text-sm"
              :placeholder="
                t(
                  'admin.settings.gatewayForwarding.codexUaContainsPlaceholder',
                )
              "
            />
            <button
              type="button"
              class="btn btn-secondary btn-sm shrink-0 text-red-600 hover:text-red-700 dark:text-red-400"
              @click="removeCodexBlacklistRow(i)"
            >
              {{ t("admin.settings.gatewayForwarding.codexRemoveRow") }}
            </button>
          </div>
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            @click="addCodexBlacklistRow"
          >
            {{ t("admin.settings.gatewayForwarding.codexAddRow") }}
          </button>
        </div>

        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {{ t("admin.settings.gatewayForwarding.codexWhitelist") }}
          </label>
          <p class="mb-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ t("admin.settings.gatewayForwarding.codexWhitelistDesc") }}
          </p>
          <div
            v-for="(row, i) in codexWhitelistRows"
            :key="`codex-wl-${i}`"
            class="mb-2 flex gap-2"
          >
            <input
              v-model="row.originator"
              type="text"
              class="input w-1/3 font-mono text-sm"
              :placeholder="
                t(
                  'admin.settings.gatewayForwarding.codexOriginatorPlaceholder',
                )
              "
            />
            <input
              v-model="row.uaContains"
              type="text"
              class="input flex-1 font-mono text-sm"
              :placeholder="
                t(
                  'admin.settings.gatewayForwarding.codexUaContainsPlaceholder',
                )
              "
            />
            <label
              class="flex shrink-0 items-center gap-1 text-xs text-gray-600 dark:text-gray-400"
              :title="
                t(
                  'admin.settings.gatewayForwarding.codexWhitelistSkipFingerprintTooltip',
                )
              "
            >
              <input
                v-model="row.skipEngineFingerprint"
                type="checkbox"
              />
              {{
                t(
                  'admin.settings.gatewayForwarding.codexWhitelistSkipFingerprint',
                )
              }}
            </label>
            <button
              type="button"
              class="btn btn-secondary btn-sm shrink-0 text-red-600 hover:text-red-700 dark:text-red-400"
              @click="removeCodexWhitelistRow(i)"
            >
              {{ t("admin.settings.gatewayForwarding.codexRemoveRow") }}
            </button>
          </div>
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            @click="addCodexWhitelistRow"
          >
            {{ t("admin.settings.gatewayForwarding.codexAddRow") }}
          </button>
        </div>
    </div>
  </div>

  <!-- Upstream Billing Probe Settings -->
  <div class="card" data-testid="upstream-billing-probe-settings">
    <div
      class="border-b border-gray-100 px-6 py-4 dark:border-dark-700"
    >
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ t("admin.settings.upstreamBillingProbe.title") }}
      </h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ t("admin.settings.upstreamBillingProbe.description") }}
      </p>
    </div>
    <div class="space-y-5 p-6">
      <div
        v-if="upstreamBillingProbeLoading"
        class="flex items-center gap-2 text-gray-500"
      >
        <div
          class="h-4 w-4 animate-spin rounded-full border-b-2 border-primary-600"
        ></div>
        {{ t("common.loading") }}
      </div>

      <template v-else>
        <div class="flex items-center justify-between gap-4">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">
              {{ t("admin.settings.upstreamBillingProbe.enabled") }}
            </label>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.upstreamBillingProbe.enabledHint") }}
            </p>
          </div>
          <Toggle
            v-model="upstreamBillingProbeForm.enabled"
            :aria-label="t('admin.settings.upstreamBillingProbe.enabled')"
            data-testid="upstream-billing-probe-enabled"
          />
        </div>

        <div
          v-if="upstreamBillingProbeForm.enabled"
          class="border-t border-gray-100 pt-4 dark:border-dark-700"
        >
          <label
            class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            for="upstream-billing-probe-interval"
          >
            {{ t("admin.settings.upstreamBillingProbe.intervalMinutes") }}
          </label>
          <input
            id="upstream-billing-probe-interval"
            v-model.number="upstreamBillingProbeForm.interval_minutes"
            type="number"
            min="5"
            max="1440"
            class="input w-32"
            data-testid="upstream-billing-probe-interval"
            @keydown.enter.prevent="saveUpstreamBillingProbeSettings"
          />
          <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            {{ t("admin.settings.upstreamBillingProbe.intervalHint") }}
          </p>
        </div>

        <div
          class="flex justify-end border-t border-gray-100 pt-4 dark:border-dark-700"
        >
          <button
            type="button"
            class="btn btn-primary btn-sm"
            :disabled="upstreamBillingProbeSaving"
            data-testid="upstream-billing-probe-save"
            @click="saveUpstreamBillingProbeSettings"
          >
            {{
              upstreamBillingProbeSaving
                ? t("common.saving")
                : t("common.save")
            }}
          </button>
        </div>
      </template>
    </div>
  </div>

  <!-- Ollama Cloud Usage Settings -->
  <div class="card" data-testid="ollama-cloud-usage-global-settings">
    <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ t("admin.settings.ollamaCloudUsage.title") }}
      </h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ t("admin.settings.ollamaCloudUsage.description") }}
      </p>
    </div>
    <div class="space-y-5 p-6">
      <div v-if="ollamaCloudUsageLoading" class="flex items-center gap-2 text-gray-500">
        <div class="h-4 w-4 animate-spin rounded-full border-b-2 border-primary-600"></div>
        {{ t("common.loading") }}
      </div>
      <template v-else>
        <div class="flex items-center justify-between gap-4">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">
              {{ t("admin.settings.ollamaCloudUsage.enabled") }}
            </label>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.ollamaCloudUsage.enabledHint") }}
            </p>
          </div>
          <Toggle
            v-model="ollamaCloudUsageForm.enabled"
            :aria-label="t('admin.settings.ollamaCloudUsage.enabled')"
            data-testid="ollama-cloud-usage-global-enabled"
          />
        </div>
        <div v-if="ollamaCloudUsageForm.enabled" class="space-y-4 border-t border-gray-100 pt-4 dark:border-dark-700">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" for="ollama-cloud-usage-debounce">
              {{ t("admin.settings.ollamaCloudUsage.debounceMinutes") }}
            </label>
            <input
              id="ollama-cloud-usage-debounce"
              v-model.number="ollamaCloudUsageForm.debounce_minutes"
              type="number"
              min="1"
              max="60"
              class="input w-32"
              data-testid="ollama-cloud-usage-global-debounce"
              @keydown.enter.prevent="saveOllamaCloudUsageSettings"
            />
            <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.ollamaCloudUsage.debounceHint") }}
            </p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" for="ollama-cloud-usage-interval">
              {{ t("admin.settings.ollamaCloudUsage.intervalMinutes") }}
            </label>
            <input
              id="ollama-cloud-usage-interval"
              v-model.number="ollamaCloudUsageForm.interval_minutes"
              type="number"
              min="15"
              max="1440"
              class="input w-32"
              data-testid="ollama-cloud-usage-global-interval"
              @keydown.enter.prevent="saveOllamaCloudUsageSettings"
            />
            <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.ollamaCloudUsage.intervalHint") }}
            </p>
          </div>
        </div>
        <div class="flex justify-end border-t border-gray-100 pt-4 dark:border-dark-700">
          <button
            type="button"
            class="btn btn-primary btn-sm"
            :disabled="ollamaCloudUsageSaving"
            data-testid="ollama-cloud-usage-global-save"
            @click="saveOllamaCloudUsageSettings"
          >
            {{ ollamaCloudUsageSaving ? t("common.saving") : t("common.save") }}
          </button>
        </div>
      </template>
    </div>
  </div>

  <!-- Gateway Scheduling Settings -->
  <div class="card">
    <div
      class="border-b border-gray-100 px-6 py-4 dark:border-dark-700"
    >
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ t("admin.settings.scheduling.title") }}
      </h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ t("admin.settings.scheduling.description") }}
      </p>
    </div>
    <div class="space-y-5 p-6">
      <div class="flex items-center justify-between">
        <div>
          <label
            class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {{ t("admin.settings.scheduling.allowUngroupedKey") }}
          </label>
          <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {{ t("admin.settings.scheduling.allowUngroupedKeyHint") }}
          </p>
        </div>
        <Toggle v-model="form.allow_ungrouped_key_scheduling" />
      </div>

    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import Toggle from '@/common/widgets/forms/Toggle.vue'
import { useSettingsPageContext } from '@/features/admin-settings/presentation/composables/settingsPageContext'

const { addCodexBlacklistRow, addCodexFingerprintRow, addCodexWhitelistRow, codexBlacklistRows, codexFingerprintNoRequired, codexFingerprintRows, codexWhitelistRows, form, ollamaCloudUsageForm, ollamaCloudUsageLoading, ollamaCloudUsageSaving, removeCodexBlacklistRow, removeCodexFingerprintRow, removeCodexWhitelistRow, saveOllamaCloudUsageSettings, saveUpstreamBillingProbeSettings, t, upstreamBillingProbeForm, upstreamBillingProbeLoading, upstreamBillingProbeSaving } = useSettingsPageContext()
</script>
