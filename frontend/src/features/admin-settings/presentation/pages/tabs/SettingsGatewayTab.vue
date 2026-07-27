<template>
  <div class="space-y-6">

    <!-- Global Temporary Unschedulable Settings -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t("admin.settings.globalTempUnschedulable.title") }}
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t("admin.settings.globalTempUnschedulable.description") }}
        </p>
      </div>
      <div class="space-y-5 p-6">
        <div v-if="globalTempUnschedulableLoading" class="flex items-center gap-2 text-gray-500">
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
            <Toggle v-model="globalTempUnschedulableForm.enabled"/>
          </div>
          <div
              v-if="!globalTempUnschedulableForm.enabled"
              class="border-t border-gray-100 pt-4 text-sm text-amber-700 dark:border-dark-700 dark:text-amber-300"
          >
            {{ t("admin.settings.globalTempUnschedulable.disabledHint") }}
          </div>
          <div class="flex justify-end border-t border-gray-100 pt-4 dark:border-dark-700">
            <button
                type="button"
                @click="saveGlobalTempUnschedulableSettings"
                :disabled="globalTempUnschedulableSaving"
                class="btn btn-primary btn-sm"
            >
              {{ globalTempUnschedulableSaving ? t("common.saving") : t("common.save") }}
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Overload Cooldown (529) Settings -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t("admin.settings.overloadCooldown.title") }}
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t("admin.settings.overloadCooldown.description") }}
        </p>
      </div>
      <div class="space-y-5 p-6">
        <div v-if="overloadCooldownLoading" class="flex items-center gap-2 text-gray-500">
          <div class="h-4 w-4 animate-spin rounded-full border-b-2 border-primary-600"></div>
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
            <Toggle v-model="overloadCooldownForm.enabled"/>
          </div>
          <div v-if="overloadCooldownForm.enabled" class="space-y-4 border-t border-gray-100 pt-4 dark:border-dark-700">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t("admin.settings.overloadCooldown.cooldownMinutes") }}
              </label>
              <input
                  v-model.number="overloadCooldownForm.cooldown_minutes"
                  type="number" min="1" max="120"
                  class="input w-32"
              />
              <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                {{ t("admin.settings.overloadCooldown.cooldownMinutesHint") }}
              </p>
            </div>
          </div>
          <div class="flex justify-end border-t border-gray-100 pt-4 dark:border-dark-700">
            <button type="button" @click="saveOverloadCooldownSettings" :disabled="overloadCooldownSaving"
                    class="btn btn-primary btn-sm">
              {{ overloadCooldownSaving ? t("common.saving") : t("common.save") }}
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Rate Limit Cooldown (429) Settings -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t("admin.settings.rateLimit429Cooldown.title") }}
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t("admin.settings.rateLimit429Cooldown.description") }}
        </p>
      </div>
      <div class="space-y-5 p-6">
        <div v-if="rateLimit429CooldownLoading" class="flex items-center gap-2 text-gray-500">
          <div class="h-4 w-4 animate-spin rounded-full border-b-2 border-primary-600"></div>
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
            <Toggle v-model="rateLimit429CooldownForm.enabled"/>
          </div>
          <div v-if="rateLimit429CooldownForm.enabled"
               class="space-y-4 border-t border-gray-100 pt-4 dark:border-dark-700">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t("admin.settings.rateLimit429Cooldown.cooldownSeconds") }}
              </label>
              <input v-model.number="rateLimit429CooldownForm.cooldown_seconds" type="number" min="1" max="7200"
                     class="input w-32"/>
              <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                {{ t("admin.settings.rateLimit429Cooldown.cooldownSecondsHint") }}
              </p>
            </div>
          </div>
          <div class="flex justify-end border-t border-gray-100 pt-4 dark:border-dark-700">
            <button type="button" @click="saveRateLimit429CooldownSettings" :disabled="rateLimit429CooldownSaving"
                    class="btn btn-primary btn-sm">
              {{ rateLimit429CooldownSaving ? t("common.saving") : t("common.save") }}
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Stream Timeout Settings -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t("admin.settings.streamTimeout.title") }}
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t("admin.settings.streamTimeout.description") }}
        </p>
      </div>
      <div class="space-y-5 p-6">
        <div v-if="streamTimeoutLoading" class="flex items-center gap-2 text-gray-500">
          <div class="h-4 w-4 animate-spin rounded-full border-b-2 border-primary-600"></div>
          {{ t("common.loading") }}
        </div>
        <template v-else>
          <div class="flex items-center justify-between">
            <div>
              <label class="font-medium text-gray-900 dark:text-white">{{
                  t("admin.settings.streamTimeout.enabled")
                }}</label>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{
                  t("admin.settings.streamTimeout.enabledHint")
                }}</p>
            </div>
            <Toggle v-model="streamTimeoutForm.enabled"/>
          </div>
          <div v-if="streamTimeoutForm.enabled" class="space-y-4 border-t border-gray-100 pt-4 dark:border-dark-700">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t("admin.settings.streamTimeout.action") }}
              </label>
              <select v-model="streamTimeoutForm.action" class="input w-64">
                <option value="temp_unsched">{{ t("admin.settings.streamTimeout.actionTempUnsched") }}</option>
                <option value="error">{{ t("admin.settings.streamTimeout.actionError") }}</option>
                <option value="none">{{ t("admin.settings.streamTimeout.actionNone") }}</option>
              </select>
              <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{{
                  t("admin.settings.streamTimeout.actionHint")
                }}</p>
            </div>
            <div v-if="streamTimeoutForm.action === 'temp_unsched'">
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t("admin.settings.streamTimeout.tempUnschedMinutes") }}
              </label>
              <input v-model.number="streamTimeoutForm.temp_unsched_minutes" type="number" min="1" max="60"
                     class="input w-32"/>
              <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                {{ t("admin.settings.streamTimeout.tempUnschedMinutesHint") }}</p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t("admin.settings.streamTimeout.thresholdCount") }}
              </label>
              <input v-model.number="streamTimeoutForm.threshold_count" type="number" min="1" max="10"
                     class="input w-32"/>
              <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                {{ t("admin.settings.streamTimeout.thresholdCountHint") }}</p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t("admin.settings.streamTimeout.thresholdWindowMinutes") }}
              </label>
              <input v-model.number="streamTimeoutForm.threshold_window_minutes" type="number" min="1" max="60"
                     class="input w-32"/>
              <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                {{ t("admin.settings.streamTimeout.thresholdWindowMinutesHint") }}</p>
            </div>
          </div>
          <div class="flex justify-end border-t border-gray-100 pt-4 dark:border-dark-700">
            <button type="button" @click="saveStreamTimeoutSettings" :disabled="streamTimeoutSaving"
                    class="btn btn-primary btn-sm">
              {{ streamTimeoutSaving ? t("common.saving") : t("common.save") }}
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Request Rectifier Settings -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t("admin.settings.rectifier.title") }}
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t("admin.settings.rectifier.description") }}
        </p>
      </div>
      <div class="space-y-5 p-6">
        <div v-if="rectifierLoading" class="flex items-center gap-2 text-gray-500">
          <div class="h-4 w-4 animate-spin rounded-full border-b-2 border-primary-600"></div>
          {{ t("common.loading") }}
        </div>
        <template v-else>
          <div class="flex items-center justify-between">
            <div>
              <label class="font-medium text-gray-900 dark:text-white">{{
                  t("admin.settings.rectifier.enabled")
                }}</label>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ t("admin.settings.rectifier.enabledHint") }}</p>
            </div>
            <Toggle v-model="rectifierForm.enabled"/>
          </div>
          <div v-if="rectifierForm.enabled" class="space-y-4 border-t border-gray-100 pt-4 dark:border-dark-700">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                    t("admin.settings.rectifier.thinkingSignature")
                  }}</label>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ t("admin.settings.rectifier.thinkingSignatureHint") }}</p>
              </div>
              <Toggle v-model="rectifierForm.thinking_signature_enabled"/>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                    t("admin.settings.rectifier.thinkingBudget")
                  }}</label>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{
                    t("admin.settings.rectifier.thinkingBudgetHint")
                  }}</p>
              </div>
              <Toggle v-model="rectifierForm.thinking_budget_enabled"/>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t("admin.settings.rectifier.thinkingDisplay") }}
              </label>
              <select v-model="rectifierForm.thinking_display_mode" class="input w-64">
                <option value="off">{{ t("admin.settings.rectifier.thinkingDisplayOff") }}</option>
                <option value="display_only">{{ t("admin.settings.rectifier.thinkingDisplayOnlyMode") }}</option>
                <option value="force">{{ t("admin.settings.rectifier.thinkingDisplayForce") }}</option>
              </select>
              <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                {{ t("admin.settings.rectifier.thinkingDisplayHint") }}</p>
              <p v-if="rectifierForm.thinking_display_mode === 'force'"
                 class="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
                {{ t("admin.settings.rectifier.thinkingDisplayForceWarning") }}
              </p>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                    t("admin.settings.rectifier.apikeySignature")
                  }}</label>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{
                    t("admin.settings.rectifier.apikeySignatureHint")
                  }}</p>
              </div>
              <Toggle v-model="rectifierForm.apikey_signature_enabled"/>
            </div>
            <div v-if="rectifierForm.apikey_signature_enabled"
                 class="ml-4 space-y-3 border-l-2 border-gray-200 pl-4 dark:border-dark-600">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                    t("admin.settings.rectifier.apikeyPatterns")
                  }}</label>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{
                    t("admin.settings.rectifier.apikeyPatternsHint")
                  }}</p>
              </div>
              <div v-for="(_, index) in rectifierForm.apikey_signature_patterns" :key="index"
                   class="flex items-center gap-2">
                <input
                    v-model="rectifierForm.apikey_signature_patterns[index]"
                    type="text" class="input input-sm flex-1"
                    :placeholder="t('admin.settings.rectifier.apikeyPatternPlaceholder')"
                />
                <button type="button" @click="rectifierForm.apikey_signature_patterns.splice(index, 1)"
                        class="btn btn-ghost btn-xs text-red-500 hover:text-red-700">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <button type="button" @click="rectifierForm.apikey_signature_patterns.push('')"
                      class="btn btn-ghost btn-xs text-primary-600 dark:text-primary-400">
                + {{ t("admin.settings.rectifier.addPattern") }}
              </button>
            </div>
          </div>
          <div class="flex justify-end border-t border-gray-100 pt-4 dark:border-dark-700">
            <button type="button" @click="saveRectifierSettings" :disabled="rectifierSaving"
                    class="btn btn-primary btn-sm">
              {{ rectifierSaving ? t("common.saving") : t("common.save") }}
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Beta Policy Settings -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t("admin.settings.betaPolicy.title") }}
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t("admin.settings.betaPolicy.description") }}
        </p>
      </div>
      <div class="space-y-5 p-6">
        <div v-if="betaPolicyLoading" class="flex items-center gap-2 text-gray-500">
          <div class="h-4 w-4 animate-spin rounded-full border-b-2 border-primary-600"></div>
          {{ t("common.loading") }}
        </div>
        <template v-else>
          <div v-for="rule in betaPolicyForm.rules" :key="rule.betaToken"
               class="rounded-lg border border-gray-200 p-4 dark:border-dark-600">
            <div class="mb-3 flex items-center gap-2">
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{
                  getBetaDisplayName(rule.betaToken)
                }}</span>
              <span class="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-dark-700 dark:text-gray-400">{{
                  rule.betaToken
                }}</span>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{{
                    t("admin.settings.betaPolicy.action")
                  }}</label>
                <Select :modelValue="rule.action"
                        @update:modelValue="rule.action = $event as 'pass' | 'filter' | 'block'"
                        :options="betaPolicyActionOptions"/>
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{{
                    t("admin.settings.betaPolicy.scope")
                  }}</label>
                <Select :modelValue="rule.scope"
                        @update:modelValue="rule.scope = $event as 'all' | 'oauth' | 'apikey' | 'bedrock'"
                        :options="betaPolicyScopeOptions"/>
              </div>
            </div>
            <div v-if="rule.action === 'block'" class="mt-3">
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{{
                  t("admin.settings.betaPolicy.errorMessage")
                }}</label>
              <input v-model="rule.errorMessage" type="text" class="input"
                     :placeholder="t('admin.settings.betaPolicy.errorMessagePlaceholder')"/>
              <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {{ t("admin.settings.betaPolicy.errorMessageHint") }}</p>
            </div>
            <div v-if="betaPresets[rule.betaToken]?.length" class="mt-3">
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{{
                  t("admin.settings.betaPolicy.quickPresets")
                }}</label>
              <div class="flex flex-wrap gap-2">
                <button
                    v-for="preset in betaPresets[rule.betaToken]" :key="preset.label"
                    type="button"
                    class="inline-flex items-center gap-1 rounded-md border border-primary-200 bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100 dark:border-primary-800 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50"
                    @click="applyBetaPreset(rule, preset)" :title="preset.description"
                >{{ preset.label }}
                </button>
              </div>
            </div>
            <div class="mt-3">
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{{
                  t("admin.settings.betaPolicy.modelWhitelist")
                }}</label>
              <p class="mb-2 text-xs text-gray-400 dark:text-gray-500">
                {{ t("admin.settings.betaPolicy.modelWhitelistHint") }}</p>
              <div v-for="(_, index) in rule.modelWhitelist || []" :key="index" class="mb-1.5 flex items-center gap-2">
                <input v-model="rule.modelWhitelist![index]" type="text" class="input input-sm flex-1"
                       :placeholder="t('admin.settings.betaPolicy.modelPatternPlaceholder')"/>
                <button type="button" @click="rule.modelWhitelist!.splice(index, 1)"
                        class="shrink-0 rounded p-1 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <button type="button" @click="addModelWhitelistEntry(rule)"
                      class="mb-2 inline-flex items-center gap-1 text-xs text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                </svg>
                {{ t("admin.settings.betaPolicy.addModelPattern") }}
              </button>
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="text-xs text-gray-400 dark:text-gray-500">{{
                    t("admin.settings.betaPolicy.commonPatterns")
                  }}:</span>
                <button
                    v-for="pattern in commonModelPatterns" :key="pattern"
                    type="button"
                    class="rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-600 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-dark-600 dark:text-gray-400 dark:hover:border-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-300"
                    @click="addQuickPattern(rule, pattern)"
                >{{ pattern }}
                </button>
              </div>
            </div>
            <div v-if="rule.modelWhitelist && rule.modelWhitelist.length > 0" class="mt-3">
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{{
                  t("admin.settings.betaPolicy.fallbackAction")
                }}</label>
              <Select :modelValue="rule.fallbackAction || 'pass'"
                      @update:modelValue="rule.fallbackAction = $event as 'pass' | 'filter' | 'block'"
                      :options="betaPolicyActionOptions"/>
              <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {{ t("admin.settings.betaPolicy.fallbackActionHint") }}</p>
              <div v-if="rule.fallbackAction === 'block'" class="mt-2">
                <input v-model="rule.fallbackErrorMessage" type="text" class="input"
                       :placeholder="t('admin.settings.betaPolicy.fallbackErrorMessagePlaceholder')"/>
                <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  {{ t("admin.settings.betaPolicy.errorMessageHint") }}</p>
              </div>
            </div>
          </div>
          <div class="flex justify-end border-t border-gray-100 pt-4 dark:border-dark-700">
            <button type="button" @click="saveBetaPolicySettings" :disabled="betaPolicySaving"
                    class="btn btn-primary btn-sm">
              {{ betaPolicySaving ? t("common.saving") : t("common.save") }}
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- OpenAI Fast/Flex Policy Settings -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t("admin.settings.openaiFastPolicy.title") }}
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t("admin.settings.openaiFastPolicy.description") }}
        </p>
      </div>
      <div class="space-y-5 p-6">
        <div
            v-if="openaiFastPolicyForm.rules.length === 0"
            class="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500 dark:border-dark-600 dark:text-gray-400"
        >
          {{ t("admin.settings.openaiFastPolicy.empty") }}
        </div>
        <div
            v-for="(rule, ruleIndex) in openaiFastPolicyForm.rules" :key="ruleIndex"
            class="rounded-lg border border-gray-200 p-4 dark:border-dark-600"
        >
          <div class="mb-3 flex items-center justify-between">
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ t("admin.settings.openaiFastPolicy.ruleHeader", {index: ruleIndex + 1}) }}
            </span>
            <button type="button" @click="removeOpenAIFastPolicyRule(ruleIndex)"
                    class="rounded p-1 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    :title="t('admin.settings.openaiFastPolicy.removeRule')">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{{
                  t("admin.settings.openaiFastPolicy.serviceTier")
                }}</label>
              <Select :modelValue="rule.serviceTier"
                      @update:modelValue="rule.serviceTier = $event as 'all' | 'priority' | 'flex'"
                      :options="openaiFastPolicyTierOptions"/>
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{{
                  t("admin.settings.openaiFastPolicy.action")
                }}</label>
              <Select :modelValue="rule.action"
                      @update:modelValue="rule.action = $event as 'pass' | 'filter' | 'block' | 'force_priority'"
                      :options="openaiFastPolicyActionOptions"/>
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{{
                  t("admin.settings.openaiFastPolicy.scope")
                }}</label>
              <Select :modelValue="rule.scope"
                      @update:modelValue="rule.scope = $event as 'all' | 'oauth' | 'apikey' | 'bedrock'"
                      :options="openaiFastPolicyScopeOptions"/>
            </div>
          </div>
          <div v-if="rule.action === 'block'" class="mt-3">
            <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{{
                t("admin.settings.openaiFastPolicy.errorMessage")
              }}</label>
            <input v-model="rule.errorMessage" type="text" class="input"
                   :placeholder="t('admin.settings.openaiFastPolicy.errorMessagePlaceholder')"/>
            <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {{ t("admin.settings.openaiFastPolicy.errorMessageHint") }}</p>
          </div>
          <div class="mt-3">
            <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{{
                t("admin.settings.openaiFastPolicy.modelWhitelist")
              }}</label>
            <p class="mb-2 text-xs text-gray-400 dark:text-gray-500">
              {{ t("admin.settings.openaiFastPolicy.modelWhitelistHint") }}</p>
            <div v-for="(_, patternIdx) in rule.modelWhitelist || []" :key="patternIdx"
                 class="mb-1.5 flex items-center gap-2">
              <input v-model="rule.modelWhitelist![patternIdx]" type="text" class="input input-sm flex-1"
                     :placeholder="t('admin.settings.openaiFastPolicy.modelPatternPlaceholder')"/>
              <button type="button" @click="removeOpenAIFastPolicyModelPattern(rule, patternIdx)"
                      class="shrink-0 rounded p-1 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <button type="button" @click="addOpenAIFastPolicyModelPattern(rule)"
                    class="mb-2 inline-flex items-center gap-1 text-xs text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
              {{ t("admin.settings.openaiFastPolicy.addModelPattern") }}
            </button>
          </div>
          <div v-if="rule.modelWhitelist && rule.modelWhitelist.length > 0" class="mt-3">
            <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{{
                t("admin.settings.openaiFastPolicy.fallbackAction")
              }}</label>
            <Select :modelValue="rule.fallbackAction || 'pass'"
                    @update:modelValue="rule.fallbackAction = $event as 'pass' | 'filter' | 'block' | 'force_priority'"
                    :options="openaiFastPolicyActionOptions"/>
            <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {{ t("admin.settings.openaiFastPolicy.fallbackActionHint") }}</p>
            <div v-if="rule.fallbackAction === 'block'" class="mt-2">
              <input v-model="rule.fallbackErrorMessage" type="text" class="input"
                     :placeholder="t('admin.settings.openaiFastPolicy.fallbackErrorMessagePlaceholder')"/>
            </div>
          </div>
        </div>
        <div>
          <button type="button" @click="addOpenAIFastPolicyRule"
                  class="btn btn-secondary btn-sm inline-flex items-center gap-1">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            {{ t("admin.settings.openaiFastPolicy.addRule") }}
          </button>
          <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">{{
              t("admin.settings.openaiFastPolicy.saveHint")
            }}</p>
        </div>
      </div>
    </div>

    <!-- Claude Code Settings -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t("admin.settings.claudeCode.title") }}
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t("admin.settings.claudeCode.description") }}
        </p>
      </div>
      <div class="p-6">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t("admin.settings.claudeCode.minVersion") }}
          </label>
          <input v-model="form.minClaudeCodeVersion" type="text" class="input max-w-xs font-mono text-sm"
                 :placeholder="t('admin.settings.claudeCode.minVersionPlaceholder')"/>
          <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{{
              t("admin.settings.claudeCode.minVersionHint")
            }}</p>
        </div>
        <div class="mt-4">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t("admin.settings.claudeCode.maxVersion") }}
          </label>
          <input v-model="form.maxClaudeCodeVersion" type="text" class="input max-w-xs font-mono text-sm"
                 :placeholder="t('admin.settings.claudeCode.maxVersionPlaceholder')"/>
          <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{{
              t("admin.settings.claudeCode.maxVersionHint")
            }}</p>
        </div>
      </div>
    </div>

    <!-- Codex Settings -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
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
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t("admin.settings.gatewayForwarding.minCodexVersion") }}
            </label>
            <input v-model="form.minCodexVersion" type="text" class="input w-full font-mono text-sm"
                   :placeholder="t('admin.settings.gatewayForwarding.minCodexVersionPlaceholder')"/>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t("admin.settings.gatewayForwarding.maxCodexVersion") }}
            </label>
            <input v-model="form.maxCodexVersion" type="text" class="input w-full font-mono text-sm"
                   :placeholder="t('admin.settings.gatewayForwarding.maxCodexVersionPlaceholder')"/>
          </div>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{
            t("admin.settings.gatewayForwarding.codexVersionHint")
          }}</p>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t("admin.settings.gatewayForwarding.codexFingerprintSignals") }}
          </label>
          <p class="mb-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ t("admin.settings.gatewayForwarding.codexFingerprintSignalsDesc") }}
          </p>
          <div v-for="(row, i) in codexFingerprintRows" :key="`codex-fp-${i}`" class="mb-2 flex items-center gap-2">
            <select v-model="row.type" class="input w-32 text-sm">
              <option value="header_exact">{{ t("admin.settings.gatewayForwarding.codexFpTypeHeaderExact") }}</option>
              <option value="header_prefix">{{ t("admin.settings.gatewayForwarding.codexFpTypeHeaderPrefix") }}</option>
              <option value="body_path">{{ t("admin.settings.gatewayForwarding.codexFpTypeBodyPath") }}</option>
            </select>
            <input v-model="row.match" type="text" class="input flex-1 font-mono text-sm"
                   :placeholder="t('admin.settings.gatewayForwarding.codexFpMatchPlaceholder')"/>
            <label class="flex shrink-0 items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <input v-model="row.required" type="checkbox"/>
              {{ t("admin.settings.gatewayForwarding.codexFpRequired") }}
            </label>
            <button type="button"
                    class="btn btn-secondary btn-sm shrink-0 text-red-600 hover:text-red-700 dark:text-red-400"
                    @click="removeCodexFingerprintRow(i)">
              {{ t("admin.settings.gatewayForwarding.codexRemoveRow") }}
            </button>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" @click="addCodexFingerprintRow">
            {{ t("admin.settings.gatewayForwarding.codexAddRow") }}
          </button>
          <p v-if="codexFingerprintNoRequired" class="mt-2 text-xs text-amber-600 dark:text-amber-500">
            {{ t("admin.settings.gatewayForwarding.codexFingerprintNoRequiredWarn") }}
          </p>
        </div>
        <div class="flex items-center justify-between">
          <div class="pr-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t("admin.settings.gatewayForwarding.codexAllowAppServer") }}
            </label>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.gatewayForwarding.codexAllowAppServerDesc") }}
            </p>
          </div>
          <Toggle v-model="form.codexCliOnlyAllowAppServerClients"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t("admin.settings.gatewayForwarding.codexBlacklist") }}
          </label>
          <p class="mb-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ t("admin.settings.gatewayForwarding.codexBlacklistDesc") }}</p>
          <div v-for="(row, i) in codexBlacklistRows" :key="`codex-bl-${i}`" class="mb-2 flex gap-2">
            <input v-model="row.originator" type="text" class="input w-1/3 font-mono text-sm"
                   :placeholder="t('admin.settings.gatewayForwarding.codexOriginatorPlaceholder')"/>
            <input v-model="row.uaContains" type="text" class="input flex-1 font-mono text-sm"
                   :placeholder="t('admin.settings.gatewayForwarding.codexUaContainsPlaceholder')"/>
            <button type="button"
                    class="btn btn-secondary btn-sm shrink-0 text-red-600 hover:text-red-700 dark:text-red-400"
                    @click="removeCodexBlacklistRow(i)">
              {{ t("admin.settings.gatewayForwarding.codexRemoveRow") }}
            </button>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" @click="addCodexBlacklistRow">
            {{ t("admin.settings.gatewayForwarding.codexAddRow") }}
          </button>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t("admin.settings.gatewayForwarding.codexWhitelist") }}
          </label>
          <p class="mb-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ t("admin.settings.gatewayForwarding.codexWhitelistDesc") }}</p>
          <div v-for="(row, i) in codexWhitelistRows" :key="`codex-wl-${i}`" class="mb-2 flex gap-2">
            <input v-model="row.originator" type="text" class="input w-1/3 font-mono text-sm"
                   :placeholder="t('admin.settings.gatewayForwarding.codexOriginatorPlaceholder')"/>
            <input v-model="row.uaContains" type="text" class="input flex-1 font-mono text-sm"
                   :placeholder="t('admin.settings.gatewayForwarding.codexUaContainsPlaceholder')"/>
            <label class="flex shrink-0 items-center gap-1 text-xs text-gray-600 dark:text-gray-400"
                   :title="t('admin.settings.gatewayForwarding.codexWhitelistSkipFingerprintTooltip')">
              <input v-model="row.skipEngineFingerprint" type="checkbox"/>
              {{ t("admin.settings.gatewayForwarding.codexWhitelistSkipFingerprint") }}
            </label>
            <button type="button"
                    class="btn btn-secondary btn-sm shrink-0 text-red-600 hover:text-red-700 dark:text-red-400"
                    @click="removeCodexWhitelistRow(i)">
              {{ t("admin.settings.gatewayForwarding.codexRemoveRow") }}
            </button>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" @click="addCodexWhitelistRow">
            {{ t("admin.settings.gatewayForwarding.codexAddRow") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Upstream Billing Probe Settings -->
    <div class="card" data-testid="upstream-billing-probe-settings">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t("admin.settings.upstreamBillingProbe.title") }}</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{
            t("admin.settings.upstreamBillingProbe.description")
          }}</p>
      </div>
      <div class="space-y-5 p-6">
        <div v-if="upstreamBillingProbeLoading" class="flex items-center gap-2 text-gray-500">
          <div class="h-4 w-4 animate-spin rounded-full border-b-2 border-primary-600"></div>
          {{ t("common.loading") }}
        </div>
        <template v-else>
          <div class="flex items-center justify-between gap-4">
            <div>
              <label class="font-medium text-gray-900 dark:text-white">{{
                  t("admin.settings.upstreamBillingProbe.enabled")
                }}</label>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ t("admin.settings.upstreamBillingProbe.enabledHint") }}</p>
            </div>
            <Toggle v-model="upstreamBillingProbeForm.enabled" data-testid="upstream-billing-probe-enabled"/>
          </div>
          <div v-if="upstreamBillingProbeForm.enabled" class="border-t border-gray-100 pt-4 dark:border-dark-700">
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{{
                t("admin.settings.upstreamBillingProbe.intervalMinutes")
              }}</label>
            <input v-model.number="upstreamBillingProbeForm.intervalMinutes" type="number" min="5" max="1440"
                   class="input w-32" data-testid="upstream-billing-probe-interval"
                   @keydown.enter.prevent="saveUpstreamBillingProbeSettings"/>
            <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.upstreamBillingProbe.intervalHint") }}</p>
          </div>
          <div class="flex justify-end border-t border-gray-100 pt-4 dark:border-dark-700">
            <button type="button" class="btn btn-primary btn-sm" :disabled="upstreamBillingProbeSaving"
                    data-testid="upstream-billing-probe-save" @click="saveUpstreamBillingProbeSettings">
              {{ upstreamBillingProbeSaving ? t("common.saving") : t("common.save") }}
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Gateway Forwarding Behavior -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{
            t("admin.settings.gatewayForwarding.title")
          }}</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{
            t("admin.settings.gatewayForwarding.description")
          }}</p>
      </div>
      <div class="space-y-5 p-6">
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                t("admin.settings.gatewayForwarding.fingerprintUnification")
              }}</label>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.gatewayForwarding.fingerprintUnificationHint") }}</p>
          </div>
          <Toggle v-model="form.enableFingerprintUnification"/>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                t("admin.settings.gatewayForwarding.metadataPassthrough")
              }}</label>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.gatewayForwarding.metadataPassthroughHint") }}</p>
          </div>
          <Toggle v-model="form.enableMetadataPassthrough"/>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                t("admin.settings.gatewayForwarding.cchSigning")
              }}</label>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.gatewayForwarding.cchSigningHint") }}</p>
          </div>
          <Toggle v-model="form.enableCchSigning"/>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                t("admin.settings.gatewayForwarding.claudeOAuthSystemPromptInjection")
              }}</label>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.gatewayForwarding.claudeOAuthSystemPromptInjectionHint") }}</p>
          </div>
          <Toggle v-model="form.enableClaudeOauthSystemPromptInjection"/>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{{
              t("admin.settings.gatewayForwarding.claudeOAuthSystemPromptBlocks")
            }}</label>
          <div class="space-y-3">
            <div v-for="(block, index) in claudeOAuthSystemPromptBlocks" :key="block.id"
                 class="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-dark-700 dark:bg-dark-800/60">
              <div :class="['flex flex-wrap items-center justify-between gap-3', block.expanded && 'mb-3']">
                <div class="min-w-0">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ t("admin.settings.gatewayForwarding.systemBlockTitle", {index: index + 1}) }}
                  </div>
                  <div class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {{ getClaudeOAuthPresetLabel(block.preset) }}
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button type="button" class="btn btn-secondary btn-sm px-2"
                          @click="toggleClaudeOAuthSystemPromptBlock(index)">
                    <Icon :name="block.expanded ? 'eyeOff' : 'eye'" size="xs"/>
                  </button>
                  <button type="button" class="btn btn-secondary btn-sm px-2" :disabled="index === 0"
                          @click="moveClaudeOAuthSystemPromptBlock(index, -1)">
                    <Icon name="arrowUp" size="xs"/>
                  </button>
                  <button type="button" class="btn btn-secondary btn-sm px-2"
                          :disabled="index === claudeOAuthSystemPromptBlocks.length - 1"
                          @click="moveClaudeOAuthSystemPromptBlock(index, 1)">
                    <Icon name="arrowDown" size="xs"/>
                  </button>
                  <Toggle v-model="block.enabled"/>
                  <button type="button"
                          class="btn btn-secondary btn-sm px-2 text-red-600 hover:text-red-700 dark:text-red-400"
                          @click="removeClaudeOAuthSystemPromptBlock(index)">
                    <Icon name="trash" size="xs"/>
                  </button>
                </div>
              </div>
              <div v-show="block.expanded">
                <div class="grid gap-3 md:grid-cols-2">
                  <div>
                    <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">{{
                        t("admin.settings.gatewayForwarding.systemBlockPreset")
                      }}</label>
                    <Select v-model="block.preset" :options="claudeOAuthSystemPromptPresetOptions"
                            @change="(value) => applyClaudeOAuthSystemPromptPreset(index, value)"/>
                  </div>
                  <div>
                    <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">{{
                        t("admin.settings.gatewayForwarding.systemBlockType")
                      }}</label>
                    <Select v-model="block.type" :options="claudeOAuthSystemPromptBlockTypeOptions"/>
                  </div>
                </div>
                <div class="mt-3">
                  <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">{{
                      t("admin.settings.gatewayForwarding.systemBlockText")
                    }}</label>
                  <textarea v-model="block.text" rows="6" class="input w-full resize-y font-mono text-xs leading-5"
                            @input="markClaudeOAuthSystemPromptBlockCustom(block)"/>
                </div>
                <div class="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_160px]">
                  <div class="flex items-center justify-between gap-4">
                    <label class="text-xs font-medium text-gray-600 dark:text-gray-300">{{
                        t("admin.settings.gatewayForwarding.systemBlockCacheControl")
                      }}</label>
                    <Toggle v-model="block.cacheControlEnabled"/>
                  </div>
                  <div v-if="block.cacheControlEnabled">
                    <Select v-model="block.cacheControlTTL" :options="claudeOAuthSystemPromptCacheTTLOptions"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-3 flex flex-wrap gap-2">
            <button type="button" class="btn btn-secondary btn-sm" @click="addClaudeOAuthSystemPromptBlock">
              <Icon name="plus" size="xs"/>
              {{ t("admin.settings.gatewayForwarding.addSystemBlock") }}
            </button>
            <button type="button" class="btn btn-secondary btn-sm" @click="resetClaudeOAuthSystemPromptBlocks">
              <Icon name="refresh" size="xs"/>
              {{ t("admin.settings.gatewayForwarding.resetSystemBlocks") }}
            </button>
          </div>
          <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            {{ t("admin.settings.gatewayForwarding.claudeOAuthSystemPromptBlocksHint") }}</p>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                t("admin.settings.gatewayForwarding.anthropicCacheTTL1hInjection")
              }}</label>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.gatewayForwarding.anthropicCacheTTL1hInjectionHint") }}</p>
          </div>
          <Toggle v-model="form.enableAnthropicCacheTtl1hInjection"/>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                t("admin.settings.gatewayForwarding.rewriteMessageCacheControl")
              }}</label>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.gatewayForwarding.rewriteMessageCacheControlHint") }}</p>
          </div>
          <Toggle v-model="form.rewriteMessageCacheControl"/>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                t("admin.settings.gatewayForwarding.clientDatelineNormalization")
              }}</label>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.gatewayForwarding.clientDatelineNormalizationHint") }}</p>
          </div>
          <Toggle v-model="form.enableClientDatelineNormalization"/>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{{
              t("admin.settings.gatewayForwarding.antigravityUserAgentVersion")
            }}</label>
          <input v-model="form.antigravityUserAgentVersion" type="text" class="input max-w-xs font-mono text-sm"
                 :placeholder="t('admin.settings.gatewayForwarding.antigravityUserAgentVersionPlaceholder')"/>
          <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            {{ t("admin.settings.gatewayForwarding.antigravityUserAgentVersionHint") }}</p>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{{
              t("admin.settings.gatewayForwarding.openaiCodexUserAgent")
            }}</label>
          <input v-model="form.openaiCodexUserAgent" type="text" class="input w-full font-mono text-sm"
                 :placeholder="t('admin.settings.gatewayForwarding.openaiCodexUserAgentPlaceholder')"/>
          <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            {{ t("admin.settings.gatewayForwarding.openaiCodexUserAgentHint") }}</p>
        </div>
      </div>
    </div>

    <!-- Web Search Emulation -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{
            t("admin.settings.webSearchEmulation.title")
          }}</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{
            t("admin.settings.webSearchEmulation.description")
          }}</p>
      </div>
      <div class="space-y-5 p-6">
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                t("admin.settings.webSearchEmulation.enabled")
              }}</label>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.webSearchEmulation.enabledHint") }}</p>
          </div>
          <Toggle v-model="webSearchConfig.enabled"/>
        </div>
        <div v-if="webSearchConfig.enabled" class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                t("admin.settings.webSearchEmulation.providers")
              }}</label>
            <button type="button" class="btn btn-secondary btn-sm" @click="addWebSearchProvider">
              {{ t("admin.settings.webSearchEmulation.addProvider") }}
            </button>
          </div>
          <div v-if="webSearchConfig.providers.length === 0"
               class="rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-400 dark:border-dark-600">
            {{ t("admin.settings.webSearchEmulation.noProviders") }}
          </div>
          <div v-for="(provider, pIdx) in webSearchConfig.providers" :key="pIdx"
               class="rounded-lg border border-gray-200 dark:border-dark-600">
            <div class="flex cursor-pointer items-center justify-between px-4 py-3" @click="toggleProviderExpand(pIdx)">
              <div class="flex items-center gap-3">
                <svg class="h-4 w-4 text-gray-400 transition-transform"
                     :class="{ 'rotate-90': expandedProviders[pIdx] }" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
                <Select v-model="provider.type"
                        :options="[{ value: 'brave', label: 'Brave Search' }, { value: 'tavily', label: 'Tavily' }]"
                        class="w-36" @click.stop/>
                <span class="text-xs text-gray-400">{{
                    provider.quotaUsed ?? 0
                  }} / {{ provider.quotaLimit != null && provider.quotaLimit > 0 ? provider.quotaLimit : '∞' }}</span>
                <span v-if="!expandedProviders[pIdx] && provider.apiKeyConfigured" class="text-xs text-green-500">{{
                    t("admin.settings.webSearchEmulation.apiKeyConfigured")
                  }}</span>
              </div>
              <button type="button" class="text-red-500 hover:text-red-700 text-xs"
                      @click.stop="removeWebSearchProvider(pIdx)">
                {{ t("admin.settings.webSearchEmulation.removeProvider") }}
              </button>
            </div>
            <div v-if="expandedProviders[pIdx]"
                 class="space-y-3 border-t border-gray-100 px-4 pb-4 pt-3 dark:border-dark-700">
              <div>
                <label class="text-xs text-gray-500">{{ t("admin.settings.webSearchEmulation.apiKey") }}</label>
                <div class="relative">
                  <input v-model="provider.apiKey" :type="apiKeyVisible[pIdx] ? 'text' : 'password'"
                         class="input w-full text-sm"
                         :placeholder="provider.apiKeyConfigured ? '••••••••' : t('admin.settings.webSearchEmulation.apiKeyPlaceholder')"/>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs text-gray-500">{{ t("admin.settings.webSearchEmulation.quotaLimit") }}</label>
                  <input v-model="provider.quotaLimit" type="number" min="1" class="input text-sm" placeholder="∞"/>
                </div>
                <div>
                  <label class="text-xs text-gray-500">{{ t("admin.settings.webSearchEmulation.subscribedAt") }}</label>
                  <input :value="formatSubscribedAt(provider.subscribedAt)" type="date" class="input text-sm"
                         @input="provider.subscribedAt = parseSubscribedAt(($event.target as HTMLInputElement).value)"/>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500">{{ t("admin.settings.webSearchEmulation.quotaUsage") }}:</span>
                <div v-if="provider.quotaLimit != null && provider.quotaLimit > 0"
                     class="flex-1 rounded-full bg-gray-200 dark:bg-dark-600" style="height:6px">
                  <div class="h-full rounded-full transition-all"
                       :class="quotaPercentage(provider) > 90 ? 'bg-red-500' : quotaPercentage(provider) > 70 ? 'bg-yellow-500' : 'bg-green-500'"
                       :style="{ width: Math.min(quotaPercentage(provider), 100) + '%' }"/>
                </div>
                <div v-else class="flex-1"/>
                <span class="text-xs text-gray-500">{{
                    provider.quotaUsed ?? 0
                  }} / {{ provider.quotaLimit != null && provider.quotaLimit > 0 ? provider.quotaLimit : '∞' }}</span>
                <button v-if="(provider.quotaUsed ?? 0) > 0" type="button"
                        class="text-xs text-primary-600 hover:text-primary-700" @click="resetWebSearchUsage(pIdx)">
                  {{ t("admin.settings.webSearchEmulation.resetUsage") }}
                </button>
              </div>
              <div class="flex items-end gap-3">
                <div class="flex-1">
                  <label class="text-xs text-gray-500">{{ t("admin.settings.webSearchEmulation.proxy") }}</label>
                  <ProxySelector v-model="provider.proxyId" :proxies="webSearchProxies"/>
                </div>
                <button type="button" class="btn btn-secondary btn-sm whitespace-nowrap" @click="openTestDialog()">
                  {{ t("admin.settings.webSearchEmulation.test") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Web Search Test Dialog -->
    <div v-if="wsTestDialogOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
         @click.self="wsTestDialogOpen = false">
      <div class="mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-dark-800">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {{ t("admin.settings.webSearchEmulation.testResultTitle") }}</h3>
        <div class="flex items-center gap-2">
          <input v-model="wsTestQuery" type="text" class="input flex-1 text-sm"
                 :placeholder="t('admin.settings.webSearchEmulation.testDefaultQuery')"
                 @keyup.enter="testWebSearchProvider()"/>
          <button type="button" class="btn btn-primary btn-sm" :disabled="wsTestLoading"
                  @click="testWebSearchProvider()">{{
              wsTestLoading ? t("admin.settings.webSearchEmulation.testing") : t("admin.settings.webSearchEmulation.test")
            }}
          </button>
        </div>
        <div v-if="wsTestResult" class="mt-4 max-h-80 overflow-y-auto rounded-lg bg-gray-50 p-4 dark:bg-dark-700">
          <p class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t("admin.settings.webSearchEmulation.testResultProvider") }}: {{ wsTestResult.provider }}</p>
          <div v-if="wsTestResult.results.length === 0" class="text-sm text-gray-400">
            {{ t("admin.settings.webSearchEmulation.testNoResults") }}
          </div>
          <div v-for="(r, rIdx) in wsTestResult.results" :key="rIdx"
               class="mt-2 border-t border-gray-200 pt-2 first:mt-0 first:border-0 first:pt-0 dark:border-dark-600">
            <a :href="r.url" target="_blank"
               class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">{{ r.title }}</a>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{{ r.snippet }}</p>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button type="button" class="btn btn-secondary btn-sm" @click="wsTestDialogOpen = false">{{
              t("common.close")
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- Usage Records Settings -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{
            t('admin.settings.usageRecords.title')
          }}</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ t('admin.settings.usageRecords.description') }}</p>
      </div>
      <div class="space-y-4 p-6">
        <div class="flex items-center justify-between gap-4">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                t('admin.settings.user_usage_detail_view.label')
              }}</label>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ t('admin.settings.user_usage_detail_view.description') }}</p>
          </div>
          <label class="toggle shrink-0"><input v-model="form.allowUserViewUsageDetails"
                                                data-testid="allow-user-view-usage-details" type="checkbox"/><span
              class="toggle-slider"></span></label>
        </div>
        <div class="flex items-center justify-between gap-4 border-t border-gray-100 pt-4 dark:border-dark-700">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                t('admin.settings.user_error_view.label')
              }}</label>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{
                t('admin.settings.user_error_view.description')
              }}</p>
          </div>
          <label class="toggle shrink-0"><input v-model="form.allowUserViewErrorRequests" type="checkbox"/><span
              class="toggle-slider"></span></label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, computed, onMounted} from 'vue'
import {useI18n} from 'vue-i18n'
import Icon from '@/common/widgets/icons/Icon.vue'
import Toggle from '@/common/widgets/forms/Toggle.vue'
import Select from '@/common/widgets/forms/Select.vue'
import ProxySelector from '@/features/admin-proxies/presentation/widgets/ProxySelector.vue'
import {useAdminSettings} from '@/features/admin-settings/presentation/composables/useAdminSettings'
import {useAdminProxies} from '@/features/admin-proxies/presentation/composables/useAdminProxies'
import {useAdminAccounts} from '@/features/admin-accounts/presentation/composables/useAdminAccounts'
import {extractApiErrorMessage} from '@/core/utils/apiError'
import {useAppStore} from '@/core/stores/appStore'
import type {BetaPolicyRule} from '@/features/admin-settings/domain/models/betaPolicyRule'
import type {OpenAIFastPolicyRule} from '@/features/admin-settings/domain/models/openAIFastPolicyRule'
import type {ThinkingDisplayMode} from '@/features/admin-settings/domain/models/streamTimeoutSettings'
import type {WebSearchEmulationConfig} from '@/features/admin-settings/domain/models/webSearchEmulationConfig'
import type {WebSearchProviderConfig} from '@/features/admin-settings/domain/models/webSearchProviderConfig'
import type {WebSearchTestResult} from '@/features/admin-settings/domain/models/webSearchTestResult'
import type {Proxy} from '@/features/admin-proxies/domain/models/proxy'

const props = defineProps<{ form: Record<string, any>; saving: boolean; loadFailed: boolean }>()

const {t} = useI18n()
const $settings = useAdminSettings()
const $proxies = useAdminProxies()
const $accounts = useAdminAccounts()
const appStore = useAppStore()

// ── Performance state (gateway#1 content) ──────────────────────────────────
const upstreamBillingProbeLoading = ref(true)
const upstreamBillingProbeSaving = ref(false)
const upstreamBillingProbeForm = reactive({enabled: true, intervalMinutes: 30})

const globalTempUnschedulableLoading = ref(true)
const globalTempUnschedulableSaving = ref(false)
const globalTempUnschedulableForm = reactive({enabled: true})

const overloadCooldownLoading = ref(true)
const overloadCooldownSaving = ref(false)
const overloadCooldownForm = reactive({enabled: true, cooldown_minutes: 10})

const rateLimit429CooldownLoading = ref(true)
const rateLimit429CooldownSaving = ref(false)
const rateLimit429CooldownForm = reactive({enabled: true, cooldown_seconds: 5})

const streamTimeoutLoading = ref(true)
const streamTimeoutSaving = ref(false)
const streamTimeoutForm = reactive({
  enabled: true,
  action: 'temp_unsched' as 'temp_unsched' | 'error' | 'none',
  temp_unsched_minutes: 5,
  threshold_count: 3,
  threshold_window_minutes: 10,
})

const rectifierLoading = ref(true)
const rectifierSaving = ref(false)
const rectifierForm = reactive({
  enabled: true,
  thinking_signature_enabled: true,
  thinking_budget_enabled: true,
  thinking_display_mode: 'display_only' as ThinkingDisplayMode,
  apikey_signature_enabled: false,
  apikey_signature_patterns: [] as string[],
})

const betaPolicyLoading = ref(true)
const betaPolicySaving = ref(false)
const betaPolicyForm = reactive({rules: [] as BetaPolicyRule[]})

const openaiFastPolicyForm = reactive({rules: [] as OpenAIFastPolicyRule[]})
const openaiFastPolicyLoaded = ref(false)

// ── Codex rows ──────────────────────────────────────────────────────────────
interface CodexClientRow {
  originator: string;
  uaContains: string;
  skipEngineFingerprint?: boolean
}

interface FingerprintSignalRow {
  type: string;
  match: string;
  required: boolean
}

const codexBlacklistRows = ref<CodexClientRow[]>([])
const codexWhitelistRows = ref<CodexClientRow[]>([])
const codexFingerprintRows = ref<FingerprintSignalRow[]>([])
const codexFingerprintNoRequired = computed(() => !codexFingerprintRows.value.some((r: any) => r.required))

function addCodexFingerprintRow() {
  codexFingerprintRows.value.push({type: 'header_exact', match: '', required: false})
}

function removeCodexFingerprintRow(i: number) {
  codexFingerprintRows.value.splice(i, 1)
}

function parseCodexEntriesToRows(raw: string): CodexClientRow[] {
  if (!raw?.trim()) return []
  try {
    const arr = JSON.parse(raw)
    if (!Array.isArray(arr)) return []
    return arr.map((e: any) => ({
      originator: e?.originator ?? '',
      uaContains: Array.isArray(e?.ua_contains) ? e.ua_contains.join(', ') : '',
      skipEngineFingerprint: e?.skip_engine_fingerprint === true
    }))
  } catch {
    return []
  }
}

function serializeCodexRowsToJSON(rows: CodexClientRow[]): string {
  const entries = rows.map((r: any) => {
    const e: any = {
      originator: r.originator.trim(),
      ua_contains: r.uaContains.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
    }
    if (r.skipEngineFingerprint) e.skip_engine_fingerprint = true
    return e
  }).filter((e: any) => e.originator !== '' || e.ua_contains.length > 0)
  return entries.length > 0 ? JSON.stringify(entries) : ''
}

function addCodexBlacklistRow() {
  codexBlacklistRows.value.push({originator: '', uaContains: ''})
}

function removeCodexBlacklistRow(i: number) {
  codexBlacklistRows.value.splice(i, 1)
}

function addCodexWhitelistRow() {
  codexWhitelistRows.value.push({originator: '', uaContains: '', skipEngineFingerprint: false})
}

function removeCodexWhitelistRow(i: number) {
  codexWhitelistRows.value.splice(i, 1)
}

// ── ClaudeOAuth system prompt ───────────────────────────────────────────────
type ClaudeOAuthSystemPromptPreset = 'billing' | 'system' | 'expansion' | 'custom'

interface ClaudeOAuthSystemPromptBlock {
  id: string;
  enabled: boolean;
  expanded: boolean;
  type: 'text';
  preset: ClaudeOAuthSystemPromptPreset;
  text: string;
  cacheControlEnabled: boolean;
  cacheControlTTL: string
}

let claudeOAuthSystemPromptBlockID = 0

function nextClaudeOAuthSystemPromptBlockID() {
  return `claude-oauth-sp-${++claudeOAuthSystemPromptBlockID}`
}

function createClaudeOAuthSystemPromptBlock(opts: Partial<ClaudeOAuthSystemPromptBlock> = {}): ClaudeOAuthSystemPromptBlock {
  return {
    id: nextClaudeOAuthSystemPromptBlockID(),
    enabled: true,
    expanded: true,
    type: 'text',
    preset: 'custom',
    text: '',
    cacheControlEnabled: false,
    cacheControlTTL: '5m', ...opts
  }
}

const claudeOAuthSystemPromptBlocks = ref<ClaudeOAuthSystemPromptBlock[]>([])
const claudeOAuthSystemPromptPresetOptions = computed(() => [
  {value: 'billing', label: t('admin.settings.gatewayForwarding.systemBlockPresetBilling')},
  {value: 'system', label: t('admin.settings.gatewayForwarding.systemBlockPresetIdentity')},
  {value: 'expansion', label: t('admin.settings.gatewayForwarding.systemBlockPresetExpansion')},
  {value: 'custom', label: t('admin.settings.gatewayForwarding.systemBlockPresetCustom')},
])
const claudeOAuthSystemPromptBlockTypeOptions = computed(() => [{
  value: 'text',
  label: t('admin.settings.gatewayForwarding.systemBlockTypeText')
}])
const claudeOAuthSystemPromptCacheTTLOptions = computed(() => [
  {value: '5m', label: t('admin.settings.gatewayForwarding.cacheTTL5m')},
  {value: '1h', label: t('admin.settings.gatewayForwarding.cacheTTL1h')},
])

function getClaudeOAuthPresetLabel(preset: ClaudeOAuthSystemPromptPreset) {
  return claudeOAuthSystemPromptPresetOptions.value.find(o => o.value === preset)?.label ?? t('admin.settings.gatewayForwarding.systemBlockPresetCustom')
}

function syncClaudeOAuthSystemPromptBlocksFormField() {
  (props as any).form.claudeOauthSystemPromptBlocks = JSON.stringify(claudeOAuthSystemPromptBlocks.value.map((b: any) => {
    const raw: any = {enabled: b.enabled, type: b.type, text: b.text}
    if (b.cacheControlEnabled) raw.cache_control = {type: 'ephemeral', ttl: b.cacheControlTTL}
    return raw
  }), null, 2)
}

function addClaudeOAuthSystemPromptBlock() {
  claudeOAuthSystemPromptBlocks.value.push(createClaudeOAuthSystemPromptBlock({
    expanded: true,
    preset: 'custom',
    text: ''
  }));
  syncClaudeOAuthSystemPromptBlocksFormField()
}

function toggleClaudeOAuthSystemPromptBlock(index: number) {
  const b = claudeOAuthSystemPromptBlocks.value[index];
  if (b) b.expanded = !b.expanded
}

function removeClaudeOAuthSystemPromptBlock(index: number) {
  claudeOAuthSystemPromptBlocks.value.splice(index, 1);
  syncClaudeOAuthSystemPromptBlocksFormField()
}

function moveClaudeOAuthSystemPromptBlock(index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= claudeOAuthSystemPromptBlocks.value.length) return
  const blocks = claudeOAuthSystemPromptBlocks.value
  const cur = blocks[index];
  blocks[index] = blocks[target];
  blocks[target] = cur
  syncClaudeOAuthSystemPromptBlocksFormField()
}

function applyClaudeOAuthSystemPromptPreset(index: number, value: unknown) {
  const block = claudeOAuthSystemPromptBlocks.value[index];
  if (!block) return
  const preset = String(value || 'custom') as ClaudeOAuthSystemPromptPreset
  block.preset = preset;
  block.type = 'text'
  if (preset === 'billing') {
    block.text = '{billing_header}';
    block.cacheControlEnabled = false
  } else if (preset === 'system') {
    block.text = 'You are Claude Code, official CLI for Anthropic.';
    block.cacheControlEnabled = false
  }
  syncClaudeOAuthSystemPromptBlocksFormField()
}

function markClaudeOAuthSystemPromptBlockCustom(block: ClaudeOAuthSystemPromptBlock) {
  block.preset = 'custom';
  syncClaudeOAuthSystemPromptBlocksFormField()
}

function resetClaudeOAuthSystemPromptBlocks() {
  claudeOAuthSystemPromptBlocks.value = [];
  syncClaudeOAuthSystemPromptBlocksFormField()
}

// ── Web Search ──────────────────────────────────────────────────────────────
const webSearchProxies = ref<Proxy[]>([])
const DEFAULT_WEB_SEARCH_QUOTA_LIMIT = 1000
const webSearchConfig = reactive<WebSearchEmulationConfig>({enabled: false, providers: []})
const expandedProviders = reactive<Record<number, boolean>>({})
const apiKeyVisible = reactive<Record<number, boolean>>({})
const wsTestQuery = ref('')
const wsTestLoading = ref(false)
const wsTestResult = ref<WebSearchTestResult | null>(null)
const wsTestDialogOpen = ref(false)

function openTestDialog() {
  wsTestResult.value = null;
  wsTestDialogOpen.value = true
}

function toggleProviderExpand(idx: number) {
  expandedProviders[idx] = !expandedProviders[idx]
}

function removeWebSearchProvider(idx: number) {
  webSearchConfig.providers.splice(idx, 1)
}

function addWebSearchProvider() {
  const idx = webSearchConfig.providers.length
  webSearchConfig.providers.push({
    type: 'brave',
    apiKey: '',
    apiKeyConfigured: false,
    quotaLimit: DEFAULT_WEB_SEARCH_QUOTA_LIMIT,
    subscribedAt: null,
    proxyId: null,
    expiresAt: null
  } as any)
  expandedProviders[idx] = true
}

function formatSubscribedAt(ts: number | null): string {
  if (!ts) return ''
  const d = new Date(ts * 1000)
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}

function parseSubscribedAt(dateStr: string): number | null {
  if (!dateStr) return null
  return Math.floor(new Date(dateStr + 'T00:00:00Z').getTime() / 1000)
}

function quotaPercentage(provider: WebSearchProviderConfig): number {
  if (!provider.quotaLimit || provider.quotaLimit <= 0) return 0
  return ((provider.quotaUsed ?? 0) / provider.quotaLimit) * 100
}

async function resetWebSearchUsage(idx: number) {
  const provider = webSearchConfig.providers[idx];
  if (!provider) return
  if (!confirm(t('admin.settings.webSearchEmulation.resetUsageConfirm'))) return
  try {
    await $settings.resetWebSearchUsage(provider.type);
    provider.quotaUsed = 0;
    appStore.showSuccess(t('admin.settings.webSearchEmulation.resetUsageSuccess'))
  } catch (err: unknown) {
    appStore.showError(extractApiErrorMessage(err, t('common.error')))
  }
}

function isWebSearchTestResult(v: unknown): v is WebSearchTestResult {
  return !!v && typeof v === 'object' && typeof (v as any).provider === 'string' && Array.isArray((v as any).results)
}

async function testWebSearchProvider() {
  wsTestLoading.value = true;
  wsTestResult.value = null
  try {
    const raw = await $settings.testWebSearchEmulation(wsTestQuery.value.trim() || t('admin.settings.webSearchEmulation.testDefaultQuery'));
    wsTestResult.value = isWebSearchTestResult(raw) ? raw : null
  } catch (err: unknown) {
    appStore.showError(extractApiErrorMessage(err, t('common.error')))
  } finally {
    wsTestLoading.value = false
  }
}

async function loadWebSearchConfig() {
  try {
    const [resp, proxiesResp] = await Promise.all([$settings.getWebSearchEmulationConfig(), $proxies.list().catch(() => ({items: [] as Proxy[]}))])
    if (resp) {
      webSearchConfig.enabled = resp.enabled || false;
      webSearchConfig.providers = resp.providers || []
    }
    webSearchProxies.value = proxiesResp.items || []
  } catch { /* 404 expected */
  }
}

async function saveWebSearchConfig(): Promise<boolean> {
  try {
    for (const p of webSearchConfig.providers) {
      const raw = p.quotaLimit
      if (raw != null && Number(raw) !== 0 && Number(raw) < 1) {
        appStore.showError(t('admin.settings.webSearchEmulation.quotaLimitMustBePositive'))
        return false
      }
    }
    const providers = webSearchConfig.providers.map((p: WebSearchProviderConfig) => ({
      ...p,
      quota_limit: Number(p.quotaLimit) > 0 ? Number(p.quotaLimit) : null,
    }))
    await $settings.updateWebSearchEmulationConfig({enabled: webSearchConfig.enabled, providers})
    return true
  } catch (err: unknown) {
    appStore.showError(extractApiErrorMessage(err, t('common.error')))
    return false
  }
}

// ── Beta / OpenAI Fast Policy ───────────────────────────────────────────────
const betaPolicyActionOptions = computed(() => [
  {value: 'pass', label: t('admin.settings.betaPolicy.actionPass')},
  {value: 'filter', label: t('admin.settings.betaPolicy.actionFilter')},
  {value: 'block', label: t('admin.settings.betaPolicy.actionBlock')},
])
const betaPolicyScopeOptions = computed(() => [
  {value: 'all', label: t('admin.settings.betaPolicy.scopeAll')},
  {value: 'oauth', label: t('admin.settings.betaPolicy.scopeOAuth')},
  {value: 'apikey', label: t('admin.settings.betaPolicy.scopeAPIKey')},
  {value: 'bedrock', label: t('admin.settings.betaPolicy.scopeBedrock')},
])
const betaDisplayNames: Record<string, string> = {
  'fast-mode-2026-02-01': 'Fast Mode',
  'context-1m-2025-08-07': 'Context 1M'
}
const betaPresets: Record<string, any[]> = {
  'context-1m-2025-08-07': [{
    label: t('admin.settings.betaPolicy.presetOpusOnly'),
    description: t('admin.settings.betaPolicy.presetOpusOnlyDesc'),
    action: 'pass',
    model_whitelist: ['claude-opus-4-6'],
    fallback_action: 'filter'
  }],
}
const commonModelPatterns = ['claude-opus-4-6', 'claude-sonnet-4-6', 'claude-opus-*', 'claude-sonnet-*']

function getBetaDisplayName(token: string) {
  return betaDisplayNames[token] || token
}

function applyBetaPreset(rule: BetaPolicyRule, preset: any) {
  rule.action = preset.action;
  rule.modelWhitelist = [...preset.model_whitelist];
  rule.fallbackAction = preset.fallback_action
}

function addQuickPattern(rule: BetaPolicyRule, pattern: string) {
  if (!rule.modelWhitelist) rule.modelWhitelist = [];
  if (!rule.modelWhitelist.includes(pattern)) rule.modelWhitelist.push(pattern)
}

function addModelWhitelistEntry(rule: BetaPolicyRule) {
  if (!rule.modelWhitelist) rule.modelWhitelist = [];
  rule.modelWhitelist.push('')
}

async function loadBetaPolicySettings() {
  betaPolicyLoading.value = true
  try {
    const s = await $settings.getBetaPolicySettings();
    betaPolicyForm.rules = s.rules
  } catch { /* silent */
  } finally {
    betaPolicyLoading.value = false
  }
}

async function saveBetaPolicySettings() {
  betaPolicySaving.value = true
  try {
    const cleaned = betaPolicyForm.rules.map((rule: BetaPolicyRule) => {
      const wl = rule.modelWhitelist?.filter((p: string) => p.trim() !== '')
      const hasWl = !!wl && wl.length > 0
      return {
        beta_token: rule.betaToken,
        action: rule.action,
        scope: rule.scope,
        error_message: rule.errorMessage,
        model_whitelist: hasWl ? wl : undefined,
        fallback_action: hasWl ? rule.fallbackAction || 'pass' : undefined,
        fallback_error_message: hasWl && rule.fallbackAction === 'block' ? rule.fallbackErrorMessage : undefined
      }
    })
    const updated = await $settings.updateBetaPolicySettings({rules: cleaned})
    betaPolicyForm.rules = updated.rules
    appStore.showSuccess(t('admin.settings.betaPolicy.saved'))
  } catch (err: unknown) {
    appStore.showError(extractApiErrorMessage(err, t('common.error')))
  } finally {
    betaPolicySaving.value = false
  }
}

const openaiFastPolicyTierOptions = computed(() => [{
  value: 'all',
  label: t('admin.settings.openaiFastPolicy.tierAll')
}, {value: 'priority', label: t('admin.settings.openaiFastPolicy.tierPriority')}, {
  value: 'flex',
  label: t('admin.settings.openaiFastPolicy.tierFlex')
}])
const openaiFastPolicyActionOptions = computed(() => [{
  value: 'pass',
  label: t('admin.settings.openaiFastPolicy.actionPass')
}, {value: 'filter', label: t('admin.settings.openaiFastPolicy.actionFilter')}, {
  value: 'force_priority',
  label: t('admin.settings.openaiFastPolicy.actionForcePriority')
}, {value: 'block', label: t('admin.settings.openaiFastPolicy.actionBlock')}])
const openaiFastPolicyScopeOptions = computed(() => [{
  value: 'all',
  label: t('admin.settings.openaiFastPolicy.scopeAll')
}, {value: 'oauth', label: t('admin.settings.openaiFastPolicy.scopeOAuth')}, {
  value: 'apikey',
  label: t('admin.settings.openaiFastPolicy.scopeAPIKey')
}, {value: 'bedrock', label: t('admin.settings.openaiFastPolicy.scopeBedrock')}])

function addOpenAIFastPolicyRule() {
  openaiFastPolicyForm.rules.push({
    serviceTier: 'priority',
    action: 'filter',
    scope: 'all',
    userIds: [],
    errorMessage: '',
    modelWhitelist: [],
    fallbackAction: 'pass',
    fallbackErrorMessage: ''
  } as any)
}

function removeOpenAIFastPolicyRule(index: number) {
  openaiFastPolicyForm.rules.splice(index, 1)
}

function addOpenAIFastPolicyModelPattern(rule: OpenAIFastPolicyRule) {
  if (!rule.modelWhitelist) rule.modelWhitelist = [];
  rule.modelWhitelist.push('')
}

function removeOpenAIFastPolicyModelPattern(rule: OpenAIFastPolicyRule, idx: number) {
  rule.modelWhitelist?.splice(idx, 1)
}

// ── Performance save helpers ────────────────────────────────────────────────
async function loadUpstreamBillingProbeSettings() {
  upstreamBillingProbeLoading.value = true
  try {
    Object.assign(upstreamBillingProbeForm, await $accounts.getUpstreamBillingProbeSettings())
  } catch { /* silent */
  } finally {
    upstreamBillingProbeLoading.value = false
  }
}

async function saveUpstreamBillingProbeSettings() {
  upstreamBillingProbeSaving.value = true
  try {
    const u = await $accounts.updateUpstreamBillingProbeSettings({...upstreamBillingProbeForm});
    Object.assign(upstreamBillingProbeForm, u);
    appStore.showSuccess(t('admin.settings.upstreamBillingProbe.saved'))
  } catch (err: unknown) {
    appStore.showError(extractApiErrorMessage(err, t('admin.settings.upstreamBillingProbe.saveFailed')))
  } finally {
    upstreamBillingProbeSaving.value = false
  }
}

async function loadGlobalTempUnschedulableSettings() {
  globalTempUnschedulableLoading.value = true
  try {
    Object.assign(globalTempUnschedulableForm, await $settings.getGlobalTempUnschedulableSettings())
  } catch { /* silent */
  } finally {
    globalTempUnschedulableLoading.value = false
  }
}

async function saveGlobalTempUnschedulableSettings() {
  globalTempUnschedulableSaving.value = true
  try {
    const u = await $settings.updateGlobalTempUnschedulableSettings({enabled: globalTempUnschedulableForm.enabled});
    Object.assign(globalTempUnschedulableForm, u);
    appStore.showSuccess(t('admin.settings.globalTempUnschedulable.saved'))
  } catch (err: unknown) {
    appStore.showError(extractApiErrorMessage(err, t('admin.settings.globalTempUnschedulable.saveFailed')))
  } finally {
    globalTempUnschedulableSaving.value = false
  }
}

async function loadOverloadCooldownSettings() {
  overloadCooldownLoading.value = true
  try {
    Object.assign(overloadCooldownForm, await $settings.getOverloadCooldownSettings())
  } catch { /* silent */
  } finally {
    overloadCooldownLoading.value = false
  }
}

async function saveOverloadCooldownSettings() {
  overloadCooldownSaving.value = true
  try {
    const u = await $settings.updateOverloadCooldownSettings({
      enabled: overloadCooldownForm.enabled,
      cooldown_minutes: overloadCooldownForm.cooldown_minutes
    });
    Object.assign(overloadCooldownForm, u);
    appStore.showSuccess(t('admin.settings.overloadCooldown.saved'))
  } catch (err: unknown) {
    appStore.showError(extractApiErrorMessage(err, t('admin.settings.overloadCooldown.saveFailed')))
  } finally {
    overloadCooldownSaving.value = false
  }
}

async function loadRateLimit429CooldownSettings() {
  rateLimit429CooldownLoading.value = true
  try {
    Object.assign(rateLimit429CooldownForm, await $settings.getRateLimit429CooldownSettings())
  } catch { /* silent */
  } finally {
    rateLimit429CooldownLoading.value = false
  }
}

async function saveRateLimit429CooldownSettings() {
  rateLimit429CooldownSaving.value = true
  try {
    const u = await $settings.updateRateLimit429CooldownSettings({
      enabled: rateLimit429CooldownForm.enabled,
      cooldown_seconds: rateLimit429CooldownForm.cooldown_seconds
    });
    Object.assign(rateLimit429CooldownForm, u);
    appStore.showSuccess(t('admin.settings.rateLimit429Cooldown.saved'))
  } catch (err: unknown) {
    appStore.showError(extractApiErrorMessage(err, t('admin.settings.rateLimit429Cooldown.saveFailed')))
  } finally {
    rateLimit429CooldownSaving.value = false
  }
}

async function loadStreamTimeoutSettings() {
  streamTimeoutLoading.value = true
  try {
    Object.assign(streamTimeoutForm, await $settings.getStreamTimeoutSettings())
  } catch { /* silent */
  } finally {
    streamTimeoutLoading.value = false
  }
}

async function saveStreamTimeoutSettings() {
  streamTimeoutSaving.value = true
  try {
    const u = await $settings.updateStreamTimeoutSettings({
      enabled: streamTimeoutForm.enabled,
      action: streamTimeoutForm.action,
      temp_unsched_minutes: streamTimeoutForm.temp_unsched_minutes,
      threshold_count: streamTimeoutForm.threshold_count,
      threshold_window_minutes: streamTimeoutForm.threshold_window_minutes
    });
    Object.assign(streamTimeoutForm, u);
    appStore.showSuccess(t('admin.settings.streamTimeout.saved'))
  } catch (err: unknown) {
    appStore.showError(extractApiErrorMessage(err, t('admin.settings.streamTimeout.saveFailed')))
  } finally {
    streamTimeoutSaving.value = false
  }
}

async function loadRectifierSettings() {
  rectifierLoading.value = true
  try {
    const s = await $settings.getRectifierSettings();
    Object.assign(rectifierForm, s);
    if (!Array.isArray(rectifierForm.apikey_signature_patterns)) rectifierForm.apikey_signature_patterns = []
  } catch { /* silent */
  } finally {
    rectifierLoading.value = false
  }
}

async function saveRectifierSettings() {
  rectifierSaving.value = true
  try {
    const u = await $settings.updateRectifierSettings({
      enabled: rectifierForm.enabled,
      thinking_signature_enabled: rectifierForm.thinking_signature_enabled,
      thinking_budget_enabled: rectifierForm.thinking_budget_enabled,
      thinking_display_mode: rectifierForm.thinking_display_mode,
      apikey_signature_enabled: rectifierForm.apikey_signature_enabled,
      apikey_signature_patterns: rectifierForm.apikey_signature_patterns.filter((p: string) => p.trim() !== '')
    });
    Object.assign(rectifierForm, u);
    appStore.showSuccess(t('admin.settings.rectifier.saved'))
  } catch (err: unknown) {
    appStore.showError(extractApiErrorMessage(err, t('admin.settings.rectifier.saveFailed')))
  } finally {
    rectifierSaving.value = false
  }
}

onMounted(() => {
  loadUpstreamBillingProbeSettings()
  loadGlobalTempUnschedulableSettings()
  loadOverloadCooldownSettings()
  loadRateLimit429CooldownSettings()
  loadStreamTimeoutSettings()
  loadRectifierSettings()
  loadBetaPolicySettings()
  loadWebSearchConfig()
})

defineExpose({
  claudeOAuthSystemPromptBlocks,
  serializeCodexRowsToJSON,
  codexBlacklistRows,
  codexWhitelistRows,
  codexFingerprintRows,
  parseCodexEntriesToRows,
  openaiFastPolicyForm,
  openaiFastPolicyLoaded,
  loadWebSearchConfig,
  saveWebSearchConfig,
  resetClaudeOAuthSystemPromptBlocks,
  syncClaudeOAuthSystemPromptBlocksFormField,
})
</script>
