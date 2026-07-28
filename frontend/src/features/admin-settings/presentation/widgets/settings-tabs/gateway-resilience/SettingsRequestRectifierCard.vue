<template>
  <div class="card">
    <div
      class="border-b border-gray-100 px-6 py-4 dark:border-dark-700"
    >
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ t("admin.settings.rectifier.title") }}
      </h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ t("admin.settings.rectifier.description") }}
      </p>
    </div>
    <div class="space-y-5 p-6">
      <!-- Loading State -->
      <div
        v-if="rectifierLoading"
        class="flex items-center gap-2 text-gray-500"
      >
        <div
          class="h-4 w-4 animate-spin rounded-full border-b-2 border-primary-600"
        ></div>
        {{ t("common.loading") }}
      </div>

      <template v-else>
        <!-- Master Toggle -->
        <div class="flex items-center justify-between">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">{{
              t("admin.settings.rectifier.enabled")
            }}</label>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.rectifier.enabledHint") }}
            </p>
          </div>
          <Toggle v-model="rectifierForm.enabled" />
        </div>

        <!-- Sub-toggles (only show when master is enabled) -->
        <div
          v-if="rectifierForm.enabled"
          class="space-y-4 border-t border-gray-100 pt-4 dark:border-dark-700"
        >
          <!-- Thinking Signature Rectifier -->
          <div class="flex items-center justify-between">
            <div>
              <label
                class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >{{
                  t("admin.settings.rectifier.thinkingSignature")
                }}</label
              >
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{
                  t("admin.settings.rectifier.thinkingSignatureHint")
                }}
              </p>
            </div>
            <Toggle
              v-model="rectifierForm.thinking_signature_enabled"
            />
          </div>

          <!-- Thinking Budget Rectifier -->
          <div class="flex items-center justify-between">
            <div>
              <label
                class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >{{
                  t("admin.settings.rectifier.thinkingBudget")
                }}</label
              >
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ t("admin.settings.rectifier.thinkingBudgetHint") }}
              </p>
            </div>
            <Toggle v-model="rectifierForm.thinking_budget_enabled" />
          </div>

          <!-- Thinking Summary Visibility -->
          <div>
            <label
              class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("admin.settings.rectifier.thinkingDisplay") }}
            </label>
            <select
              v-model="rectifierForm.thinking_display_mode"
              class="input w-64"
            >
              <option value="off">
                {{ t("admin.settings.rectifier.thinkingDisplayOff") }}
              </option>
              <option value="display_only">
                {{
                  t("admin.settings.rectifier.thinkingDisplayOnlyMode")
                }}
              </option>
              <option value="force">
                {{ t("admin.settings.rectifier.thinkingDisplayForce") }}
              </option>
            </select>
            <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.rectifier.thinkingDisplayHint") }}
            </p>
            <p
              v-if="rectifierForm.thinking_display_mode === 'force'"
              class="mt-1.5 text-xs text-amber-600 dark:text-amber-400"
            >
              {{
                t("admin.settings.rectifier.thinkingDisplayForceWarning")
              }}
            </p>
          </div>

          <!-- API Key Signature Rectifier -->
          <div class="flex items-center justify-between">
            <div>
              <label
                class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >{{
                  t("admin.settings.rectifier.apikeySignature")
                }}</label
              >
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ t("admin.settings.rectifier.apikeySignatureHint") }}
              </p>
            </div>
            <Toggle v-model="rectifierForm.apikey_signature_enabled" />
          </div>

          <!-- Custom Patterns (only when apikey_signature_enabled) -->
          <div
            v-if="rectifierForm.apikey_signature_enabled"
            class="ml-4 space-y-3 border-l-2 border-gray-200 pl-4 dark:border-dark-600"
          >
            <div>
              <label
                class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >{{
                  t("admin.settings.rectifier.apikeyPatterns")
                }}</label
              >
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ t("admin.settings.rectifier.apikeyPatternsHint") }}
              </p>
            </div>
            <div
              v-for="(
                _, index
              ) in rectifierForm.apikey_signature_patterns"
              :key="index"
              class="flex items-center gap-2"
            >
              <input
                v-model="rectifierForm.apikey_signature_patterns[index]"
                type="text"
                class="input input-sm flex-1"
                :placeholder="
                  t('admin.settings.rectifier.apikeyPatternPlaceholder')
                "
              />
              <button
                type="button"
                @click="
                  rectifierForm.apikey_signature_patterns.splice(
                    index,
                    1,
                  )
                "
                class="btn btn-ghost btn-xs text-red-500 hover:text-red-700"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <button
              type="button"
              @click="rectifierForm.apikey_signature_patterns.push('')"
              class="btn btn-ghost btn-xs text-primary-600 dark:text-primary-400"
            >
              + {{ t("admin.settings.rectifier.addPattern") }}
            </button>
          </div>
        </div>

        <!-- Save Button -->
        <div
          class="flex justify-end border-t border-gray-100 pt-4 dark:border-dark-700"
        >
          <button
            type="button"
            @click="saveRectifierSettings"
            :disabled="rectifierSaving"
            class="btn btn-primary btn-sm"
          >
            <svg
              v-if="rectifierSaving"
              class="mr-1 h-4 w-4 animate-spin"
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
              rectifierSaving ? t("common.saving") : t("common.save")
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
  rectifierForm,
  rectifierLoading,
  rectifierSaving,
  saveRectifierSettings,
  t,
} = useSettingsPageContext()
</script>
