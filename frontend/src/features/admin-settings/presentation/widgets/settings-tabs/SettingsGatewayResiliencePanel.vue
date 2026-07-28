<template>
        <div class="space-y-6">
          <!-- Global Temporary Unschedulable Settings -->
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

          <!-- Overload Cooldown (529) Settings -->
          <div class="card">
            <div
              class="border-b border-gray-100 px-6 py-4 dark:border-dark-700"
            >
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ t("admin.settings.overloadCooldown.title") }}
              </h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ t("admin.settings.overloadCooldown.description") }}
              </p>
            </div>
            <div class="space-y-5 p-6">
              <div
                v-if="overloadCooldownLoading"
                class="flex items-center gap-2 text-gray-500"
              >
                <div
                  class="h-4 w-4 animate-spin rounded-full border-b-2 border-primary-600"
                ></div>
                {{ t("common.loading") }}
              </div>

              <template v-else>
                <div class="flex items-center justify-between">
                  <div>
                    <label class="font-medium text-gray-900 dark:text-white">{{
                      t("admin.settings.overloadCooldown.enabled")
                    }}</label>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ t("admin.settings.overloadCooldown.enabledHint") }}
                    </p>
                  </div>
                  <Toggle v-model="overloadCooldownForm.enabled" />
                </div>

                <div
                  v-if="overloadCooldownForm.enabled"
                  class="space-y-4 border-t border-gray-100 pt-4 dark:border-dark-700"
                >
                  <div>
                    <label
                      class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {{ t("admin.settings.overloadCooldown.cooldownMinutes") }}
                    </label>
                    <input
                      v-model.number="overloadCooldownForm.cooldown_minutes"
                      type="number"
                      min="1"
                      max="120"
                      class="input w-32"
                    />
                    <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      {{
                        t("admin.settings.overloadCooldown.cooldownMinutesHint")
                      }}
                    </p>
                  </div>
                </div>

                <div
                  class="flex justify-end border-t border-gray-100 pt-4 dark:border-dark-700"
                >
                  <button
                    type="button"
                    @click="saveOverloadCooldownSettings"
                    :disabled="overloadCooldownSaving"
                    class="btn btn-primary btn-sm"
                  >
                    <svg
                      v-if="overloadCooldownSaving"
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
                      overloadCooldownSaving
                        ? t("common.saving")
                        : t("common.save")
                    }}
                  </button>
                </div>
              </template>
            </div>
          </div>

          <!-- Rate Limit Cooldown (429) Settings -->
          <div class="card">
            <div
              class="border-b border-gray-100 px-6 py-4 dark:border-dark-700"
            >
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ t("admin.settings.rateLimit429Cooldown.title") }}
              </h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ t("admin.settings.rateLimit429Cooldown.description") }}
              </p>
            </div>
            <div class="space-y-5 p-6">
              <div
                v-if="rateLimit429CooldownLoading"
                class="flex items-center gap-2 text-gray-500"
              >
                <div
                  class="h-4 w-4 animate-spin rounded-full border-b-2 border-primary-600"
                ></div>
                {{ t("common.loading") }}
              </div>

              <template v-else>
                <div class="flex items-center justify-between">
                  <div>
                    <label class="font-medium text-gray-900 dark:text-white">{{
                      t("admin.settings.rateLimit429Cooldown.enabled")
                    }}</label>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ t("admin.settings.rateLimit429Cooldown.enabledHint") }}
                    </p>
                  </div>
                  <Toggle v-model="rateLimit429CooldownForm.enabled" />
                </div>

                <div
                  v-if="rateLimit429CooldownForm.enabled"
                  class="space-y-4 border-t border-gray-100 pt-4 dark:border-dark-700"
                >
                  <div>
                    <label
                      class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {{
                        t(
                          "admin.settings.rateLimit429Cooldown.cooldownSeconds",
                        )
                      }}
                    </label>
                    <input
                      v-model.number="rateLimit429CooldownForm.cooldown_seconds"
                      type="number"
                      min="1"
                      max="7200"
                      class="input w-32"
                    />
                    <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      {{
                        t(
                          "admin.settings.rateLimit429Cooldown.cooldownSecondsHint",
                        )
                      }}
                    </p>
                  </div>
                </div>

                <div
                  class="flex justify-end border-t border-gray-100 pt-4 dark:border-dark-700"
                >
                  <button
                    type="button"
                    @click="saveRateLimit429CooldownSettings"
                    :disabled="rateLimit429CooldownSaving"
                    class="btn btn-primary btn-sm"
                  >
                    <svg
                      v-if="rateLimit429CooldownSaving"
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
                      rateLimit429CooldownSaving
                        ? t("common.saving")
                        : t("common.save")
                    }}
                  </button>
                </div>
              </template>
            </div>
          </div>

          <!-- Stream Timeout Settings -->
          <div class="card">
            <div
              class="border-b border-gray-100 px-6 py-4 dark:border-dark-700"
            >
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ t("admin.settings.streamTimeout.title") }}
              </h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ t("admin.settings.streamTimeout.description") }}
              </p>
            </div>
            <div class="space-y-5 p-6">
              <!-- Loading State -->
              <div
                v-if="streamTimeoutLoading"
                class="flex items-center gap-2 text-gray-500"
              >
                <div
                  class="h-4 w-4 animate-spin rounded-full border-b-2 border-primary-600"
                ></div>
                {{ t("common.loading") }}
              </div>

              <template v-else>
                <div class="flex items-center justify-between">
                  <div>
                    <label class="font-medium text-gray-900 dark:text-white">{{
                      t("admin.settings.streamTimeout.responseHeaderEnabled")
                    }}</label>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ t("admin.settings.streamTimeout.responseHeaderEnabledHint") }}
                    </p>
                  </div>
                  <Toggle
                    v-model="streamTimeoutForm.response_header_timeout_degradation_enabled"
                  />
                </div>

                <div
                  v-if="streamTimeoutForm.response_header_timeout_degradation_enabled"
                  class="border-t border-gray-100 pt-4 dark:border-dark-700"
                >
                  <label
                    class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {{ t("admin.settings.streamTimeout.timeoutSeconds") }}
                  </label>
                  <input
                    v-model.number="streamTimeoutForm.response_header_timeout_seconds"
                    type="number"
                    min="1"
                    max="300"
                    class="input w-32"
                  />
                  <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    {{ t("admin.settings.streamTimeout.timeoutSecondsHint") }}
                  </p>
                </div>

                <!-- Enable Stream Timeout -->
                <div
                  class="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-dark-700"
                >
                  <div>
                    <label class="font-medium text-gray-900 dark:text-white">{{
                      t("admin.settings.streamTimeout.enabled")
                    }}</label>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ t("admin.settings.streamTimeout.enabledHint") }}
                    </p>
                  </div>
                  <Toggle v-model="streamTimeoutForm.enabled" />
                </div>

                <!-- Settings - Only show when enabled -->
                <div
                  v-if="streamTimeoutForm.enabled"
                  class="space-y-4 border-t border-gray-100 pt-4 dark:border-dark-700"
                >
                  <!-- Action -->
                  <div>
                    <label
                      class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {{ t("admin.settings.streamTimeout.action") }}
                    </label>
                    <select
                      v-model="streamTimeoutForm.action"
                      class="input w-64"
                    >
                      <option value="temp_unsched">
                        {{
                          t("admin.settings.streamTimeout.actionTempUnsched")
                        }}
                      </option>
                      <option value="error">
                        {{ t("admin.settings.streamTimeout.actionError") }}
                      </option>
                      <option value="none">
                        {{ t("admin.settings.streamTimeout.actionNone") }}
                      </option>
                    </select>
                    <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      {{ t("admin.settings.streamTimeout.actionHint") }}
                    </p>
                  </div>

                  <!-- Temp Unsched Minutes (only show when action is temp_unsched) -->
                  <div v-if="streamTimeoutForm.action === 'temp_unsched'">
                    <label
                      class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {{ t("admin.settings.streamTimeout.tempUnschedMinutes") }}
                    </label>
                    <input
                      v-model.number="streamTimeoutForm.temp_unsched_minutes"
                      type="number"
                      min="1"
                      max="60"
                      class="input w-32"
                    />
                    <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      {{
                        t("admin.settings.streamTimeout.tempUnschedMinutesHint")
                      }}
                    </p>
                  </div>

                  <!-- Threshold Count -->
                  <div>
                    <label
                      class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {{ t("admin.settings.streamTimeout.thresholdCount") }}
                    </label>
                    <input
                      v-model.number="streamTimeoutForm.threshold_count"
                      type="number"
                      min="1"
                      max="10"
                      class="input w-32"
                    />
                    <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      {{ t("admin.settings.streamTimeout.thresholdCountHint") }}
                    </p>
                  </div>

                  <!-- Threshold Window Minutes -->
                  <div>
                    <label
                      class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {{
                        t("admin.settings.streamTimeout.thresholdWindowMinutes")
                      }}
                    </label>
                    <input
                      v-model.number="
                        streamTimeoutForm.threshold_window_minutes
                      "
                      type="number"
                      min="1"
                      max="60"
                      class="input w-32"
                    />
                    <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      {{
                        t(
                          "admin.settings.streamTimeout.thresholdWindowMinutesHint",
                        )
                      }}
                    </p>
                  </div>
                </div>

                <!-- Save Button -->
                <div
                  class="flex justify-end border-t border-gray-100 pt-4 dark:border-dark-700"
                >
                  <button
                    type="button"
                    @click="saveStreamTimeoutSettings"
                    :disabled="streamTimeoutSaving"
                    class="btn btn-primary btn-sm"
                  >
                    <svg
                      v-if="streamTimeoutSaving"
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
                      streamTimeoutSaving
                        ? t("common.saving")
                        : t("common.save")
                    }}
                  </button>
                </div>
              </template>
            </div>
          </div>

          <!-- Request Rectifier Settings -->
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
          <!-- Beta Policy Settings -->
          <div class="card">
            <div
              class="border-b border-gray-100 px-6 py-4 dark:border-dark-700"
            >
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ t("admin.settings.betaPolicy.title") }}
              </h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ t("admin.settings.betaPolicy.description") }}
              </p>
            </div>
            <div class="space-y-5 p-6">
              <!-- Loading State -->
              <div
                v-if="betaPolicyLoading"
                class="flex items-center gap-2 text-gray-500"
              >
                <div
                  class="h-4 w-4 animate-spin rounded-full border-b-2 border-primary-600"
                ></div>
                {{ t("common.loading") }}
              </div>

              <template v-else>
                <!-- Rule Cards -->
                <div
                  v-for="rule in betaPolicyForm.rules"
                  :key="rule.beta_token"
                  class="rounded-lg border border-gray-200 p-4 dark:border-dark-600"
                >
                  <div class="mb-3 flex items-center gap-2">
                    <span
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {{ getBetaDisplayName(rule.beta_token) }}
                    </span>
                    <span
                      class="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-dark-700 dark:text-gray-400"
                    >
                      {{ rule.beta_token }}
                    </span>
                  </div>

                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <!-- Action -->
                    <div>
                      <label
                        class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
                      >
                        {{ t("admin.settings.betaPolicy.action") }}
                      </label>
                      <Select
                        :modelValue="rule.action"
                        @update:modelValue="rule.action = $event as any"
                        :options="betaPolicyActionOptions"
                      />
                    </div>

                    <!-- Scope -->
                    <div>
                      <label
                        class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
                      >
                        {{ t("admin.settings.betaPolicy.scope") }}
                      </label>
                      <Select
                        :modelValue="rule.scope"
                        @update:modelValue="rule.scope = $event as any"
                        :options="betaPolicyScopeOptions"
                      />
                    </div>
                  </div>

                  <!-- Error Message (only when action=block) -->
                  <div v-if="rule.action === 'block'" class="mt-3">
                    <label
                      class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
                    >
                      {{ t("admin.settings.betaPolicy.errorMessage") }}
                    </label>
                    <input
                      v-model="rule.error_message"
                      type="text"
                      class="input"
                      :placeholder="
                        t('admin.settings.betaPolicy.errorMessagePlaceholder')
                      "
                    />
                    <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">
                      {{ t("admin.settings.betaPolicy.errorMessageHint") }}
                    </p>
                  </div>

                  <!-- Quick Presets (only for tokens with presets) -->
                  <div v-if="betaPresets[rule.beta_token]?.length" class="mt-3">
                    <label
                      class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
                    >
                      {{ t("admin.settings.betaPolicy.quickPresets") }}
                    </label>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="preset in betaPresets[rule.beta_token]"
                        :key="preset.label"
                        type="button"
                        class="inline-flex items-center gap-1 rounded-md border border-primary-200 bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100 dark:border-primary-800 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50"
                        @click="applyBetaPreset(rule, preset)"
                        :title="preset.description"
                      >
                        {{ preset.label }}
                      </button>
                    </div>
                  </div>

                  <!-- Model Whitelist -->
                  <div class="mt-3">
                    <label
                      class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
                    >
                      {{ t("admin.settings.betaPolicy.modelWhitelist") }}
                    </label>
                    <p class="mb-2 text-xs text-gray-400 dark:text-gray-500">
                      {{ t("admin.settings.betaPolicy.modelWhitelistHint") }}
                    </p>
                    <!-- Existing patterns -->
                    <div
                      v-for="(_, index) in rule.model_whitelist || []"
                      :key="index"
                      class="mb-1.5 flex items-center gap-2"
                    >
                      <input
                        v-model="rule.model_whitelist![index]"
                        type="text"
                        class="input input-sm flex-1"
                        :placeholder="
                          t('admin.settings.betaPolicy.modelPatternPlaceholder')
                        "
                      />
                      <button
                        type="button"
                        @click="rule.model_whitelist!.splice(index, 1)"
                        class="shrink-0 rounded p-1 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                      >
                        <svg
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <!-- Add pattern button -->
                    <button
                      type="button"
                      @click="
                        if (!rule.model_whitelist) rule.model_whitelist = [];
                        rule.model_whitelist.push('');
                      "
                      class="mb-2 inline-flex items-center gap-1 text-xs text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      <svg
                        class="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      {{ t("admin.settings.betaPolicy.addModelPattern") }}
                    </button>
                    <!-- Common pattern chips -->
                    <div class="flex flex-wrap items-center gap-1.5">
                      <span class="text-xs text-gray-400 dark:text-gray-500"
                        >{{
                          t("admin.settings.betaPolicy.commonPatterns")
                        }}:</span
                      >
                      <button
                        v-for="pattern in commonModelPatterns"
                        :key="pattern"
                        type="button"
                        class="rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-600 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-dark-600 dark:text-gray-400 dark:hover:border-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-300"
                        @click="addQuickPattern(rule, pattern)"
                      >
                        {{ pattern }}
                      </button>
                    </div>
                  </div>

                  <!-- Fallback Action (only when model_whitelist is non-empty) -->
                  <div
                    v-if="
                      rule.model_whitelist && rule.model_whitelist.length > 0
                    "
                    class="mt-3"
                  >
                    <label
                      class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
                    >
                      {{ t("admin.settings.betaPolicy.fallbackAction") }}
                    </label>
                    <Select
                      :modelValue="rule.fallback_action || 'pass'"
                      @update:modelValue="rule.fallback_action = $event as any"
                      :options="betaPolicyActionOptions"
                    />
                    <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">
                      {{ t("admin.settings.betaPolicy.fallbackActionHint") }}
                    </p>
                    <!-- Fallback Error Message (only when fallback_action=block) -->
                    <div v-if="rule.fallback_action === 'block'" class="mt-2">
                      <input
                        v-model="rule.fallback_error_message"
                        type="text"
                        class="input"
                        :placeholder="
                          t(
                            'admin.settings.betaPolicy.fallbackErrorMessagePlaceholder',
                          )
                        "
                      />
                      <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">
                        {{ t("admin.settings.betaPolicy.errorMessageHint") }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Save Button -->
                <div
                  class="flex justify-end border-t border-gray-100 pt-4 dark:border-dark-700"
                >
                  <button
                    type="button"
                    @click="saveBetaPolicySettings"
                    :disabled="betaPolicySaving"
                    class="btn btn-primary btn-sm"
                  >
                    <svg
                      v-if="betaPolicySaving"
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
                      betaPolicySaving ? t("common.saving") : t("common.save")
                    }}
                  </button>
                </div>
              </template>
            </div>
          </div>
          <!-- OpenAI Fast/Flex Policy Settings -->
          <div class="card">
            <div
              class="border-b border-gray-100 px-6 py-4 dark:border-dark-700"
            >
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ t("admin.settings.openaiFastPolicy.title") }}
              </h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ t("admin.settings.openaiFastPolicy.description") }}
              </p>
            </div>
            <div class="space-y-5 p-6">
              <!-- Empty state -->
              <div
                v-if="openaiFastPolicyForm.rules.length === 0"
                class="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500 dark:border-dark-600 dark:text-gray-400"
              >
                {{ t("admin.settings.openaiFastPolicy.empty") }}
              </div>

              <!-- Rule Cards -->
              <div
                v-for="(rule, ruleIndex) in openaiFastPolicyForm.rules"
                :key="ruleIndex"
                class="rounded-lg border border-gray-200 p-4 dark:border-dark-600"
              >
                <div class="mb-3 flex items-center justify-between">
                  <span
                    class="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {{
                      t("admin.settings.openaiFastPolicy.ruleHeader", {
                        index: ruleIndex + 1,
                      })
                    }}
                  </span>
                  <button
                    type="button"
                    @click="removeOpenAIFastPolicyRule(ruleIndex)"
                    class="rounded p-1 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    :title="t('admin.settings.openaiFastPolicy.removeRule')"
                  >
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <!-- Service Tier -->
                  <div>
                    <label
                      class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
                    >
                      {{ t("admin.settings.openaiFastPolicy.serviceTier") }}
                    </label>
                    <Select
                      :modelValue="rule.service_tier"
                      @update:modelValue="
                        rule.service_tier = $event as
                          | 'all'
                          | 'priority'
                          | 'flex'
                      "
                      :options="openaiFastPolicyTierOptions"
                    />
                  </div>

                  <!-- Action -->
                  <div>
                    <label
                      class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
                    >
                      {{ t("admin.settings.openaiFastPolicy.action") }}
                    </label>
                    <Select
                      :modelValue="rule.action"
                      @update:modelValue="
                        rule.action = $event as
                          | 'pass'
                          | 'filter'
                          | 'block'
                          | 'force_priority'
                      "
                      :options="openaiFastPolicyActionOptions"
                    />
                  </div>

                  <!-- Scope -->
                  <div>
                    <label
                      class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
                    >
                      {{ t("admin.settings.openaiFastPolicy.scope") }}
                    </label>
                    <Select
                      :modelValue="rule.scope"
                      @update:modelValue="
                        rule.scope = $event as
                          | 'all'
                          | 'oauth'
                          | 'apikey'
                          | 'bedrock'
                      "
                      :options="openaiFastPolicyScopeOptions"
                    />
                  </div>
                </div>

                <!-- User Scope -->
                <div class="mt-3">
                  <label
                    class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
                  >
                    {{ t("admin.settings.openaiFastPolicy.userIds") }}
                  </label>
                  <p class="mb-2 text-xs text-gray-400 dark:text-gray-500">
                    {{ t("admin.settings.openaiFastPolicy.userIdsHint") }}
                  </p>
                  <OpenAIFastPolicyUserSelector
                    :model-value="rule.user_ids || []"
                    @update:model-value="rule.user_ids = $event"
                  />
                </div>

                <!-- Error Message (only when action=block) -->
                <div v-if="rule.action === 'block'" class="mt-3">
                  <label
                    class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
                  >
                    {{ t("admin.settings.openaiFastPolicy.errorMessage") }}
                  </label>
                  <input
                    v-model="rule.error_message"
                    type="text"
                    class="input"
                    :placeholder="
                      t(
                        'admin.settings.openaiFastPolicy.errorMessagePlaceholder',
                      )
                    "
                  />
                  <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    {{ t("admin.settings.openaiFastPolicy.errorMessageHint") }}
                  </p>
                </div>

                <!-- Model Whitelist -->
                <div class="mt-3">
                  <label
                    class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
                  >
                    {{ t("admin.settings.openaiFastPolicy.modelWhitelist") }}
                  </label>
                  <p class="mb-2 text-xs text-gray-400 dark:text-gray-500">
                    {{
                      t("admin.settings.openaiFastPolicy.modelWhitelistHint")
                    }}
                  </p>
                  <div
                    v-for="(_, patternIdx) in rule.model_whitelist || []"
                    :key="patternIdx"
                    class="mb-1.5 flex items-center gap-2"
                  >
                    <input
                      v-model="rule.model_whitelist![patternIdx]"
                      type="text"
                      class="input input-sm flex-1"
                      :placeholder="
                        t(
                          'admin.settings.openaiFastPolicy.modelPatternPlaceholder',
                        )
                      "
                    />
                    <button
                      type="button"
                      @click="
                        removeOpenAIFastPolicyModelPattern(rule, patternIdx)
                      "
                      class="shrink-0 rounded p-1 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    >
                      <svg
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    @click="addOpenAIFastPolicyModelPattern(rule)"
                    class="mb-2 inline-flex items-center gap-1 text-xs text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <svg
                      class="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    {{ t("admin.settings.openaiFastPolicy.addModelPattern") }}
                  </button>
                </div>

                <!-- Fallback Action (only when model_whitelist is non-empty) -->
                <div
                  v-if="
                    rule.model_whitelist && rule.model_whitelist.length > 0
                  "
                  class="mt-3"
                >
                  <label
                    class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
                  >
                    {{ t("admin.settings.openaiFastPolicy.fallbackAction") }}
                  </label>
                  <Select
                    :modelValue="rule.fallback_action || 'pass'"
                    @update:modelValue="
                      rule.fallback_action = $event as
                        | 'pass'
                        | 'filter'
                        | 'block'
                        | 'force_priority'
                    "
                    :options="openaiFastPolicyActionOptions"
                  />
                  <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    {{
                      t("admin.settings.openaiFastPolicy.fallbackActionHint")
                    }}
                  </p>
                  <div v-if="rule.fallback_action === 'block'" class="mt-2">
                    <input
                      v-model="rule.fallback_error_message"
                      type="text"
                      class="input"
                      :placeholder="
                        t(
                          'admin.settings.openaiFastPolicy.fallbackErrorMessagePlaceholder',
                        )
                      "
                    />
                  </div>
                </div>
              </div>

              <!-- Add Rule Button -->
              <div>
                <button
                  type="button"
                  @click="addOpenAIFastPolicyRule"
                  class="btn btn-secondary btn-sm inline-flex items-center gap-1"
                >
                  <svg
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  {{ t("admin.settings.openaiFastPolicy.addRule") }}
                </button>
                <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  {{ t("admin.settings.openaiFastPolicy.saveHint") }}
                </p>
              </div>
            </div>
          </div>
        </div>
</template>

<script setup lang="ts">
import OpenAIFastPolicyUserSelector from '@/features/admin-settings/presentation/widgets/OpenAIFastPolicyUserSelector.vue'
import Select from '@/common/widgets/forms/Select.vue'
import Toggle from '@/common/widgets/forms/Toggle.vue'
import { useSettingsPageContext } from '@/features/admin-settings/presentation/composables/settingsPageContext'

const { addOpenAIFastPolicyModelPattern, addOpenAIFastPolicyRule, addQuickPattern, applyBetaPreset, betaPolicyActionOptions, betaPolicyForm, betaPolicyLoading, betaPolicySaving, betaPolicyScopeOptions, betaPresets, commonModelPatterns, getBetaDisplayName, globalTempUnschedulableForm, globalTempUnschedulableLoading, globalTempUnschedulableSaving, openaiFastPolicyActionOptions, openaiFastPolicyForm, openaiFastPolicyScopeOptions, openaiFastPolicyTierOptions, overloadCooldownForm, overloadCooldownLoading, overloadCooldownSaving, rateLimit429CooldownForm, rateLimit429CooldownLoading, rateLimit429CooldownSaving, rectifierForm, rectifierLoading, rectifierSaving, removeOpenAIFastPolicyModelPattern, removeOpenAIFastPolicyRule, saveBetaPolicySettings, saveGlobalTempUnschedulableSettings, saveOverloadCooldownSettings, saveRateLimit429CooldownSettings, saveRectifierSettings, saveStreamTimeoutSettings, streamTimeoutForm, streamTimeoutLoading, streamTimeoutSaving, t } = useSettingsPageContext()
</script>
