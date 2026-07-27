<template>
  <div class="space-y-6">
    <!-- Scoped Admin API Key panel -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t("admin.settings.adminApiKey.scopedTitle") }}
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t("admin.settings.adminApiKey.scopedDescription") }}
        </p>
      </div>
      <div class="space-y-5 p-6">
        <div class="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input v-model="adminApiKeyForm.name" class="input" type="text" maxlength="100"
                 :placeholder="t('admin.settings.adminApiKey.namePlaceholder')"/>
          <input v-model="adminApiKeyForm.expires_at" class="input" type="datetime-local"
                 :min="adminApiKeyMinExpiry"/>
          <button type="button" class="btn btn-primary"
                  :disabled="adminApiKeyPanelOperating || !adminApiKeyForm.name.trim()"
                  @click="createScopedAdminApiKey">
            {{
              editingAdminApiKeyId ? t("admin.settings.adminApiKey.saveScoped") : t("admin.settings.adminApiKey.createScoped")
            }}
          </button>
          <button v-if="editingAdminApiKeyId" type="button" class="btn btn-secondary"
                  @click="cancelEditScopedAdminApiKey">{{ t("admin.settings.adminApiKey.cancel") }}
          </button>
        </div>
        <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <label v-for="scope in adminApiKeyScopeOptions" :key="scope.value"
                 class="flex items-start gap-2 rounded border border-gray-200 p-2 text-xs dark:border-dark-600">
            <input v-model="adminApiKeyForm.scopes" type="checkbox" :value="scope.value" class="mt-0.5"/>
            <span><strong class="block text-gray-800 dark:text-gray-100">{{ scope.label }}</strong><span
                class="text-gray-500 dark:text-gray-400">{{ scope.value }}</span></span>
          </label>
        </div>
        <div v-if="adminApiKeyPanelSecret"
             class="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <p class="text-sm font-medium text-green-700 dark:text-green-300">
            {{ t("admin.settings.adminApiKey.secretOnce") }}</p>
          <div class="mt-2 flex gap-2"><code
              class="flex-1 select-all break-all rounded bg-white px-3 py-2 font-mono text-sm dark:bg-dark-800">{{
              adminApiKeyPanelSecret
            }}</code>
            <button type="button" class="btn btn-primary btn-sm" @click="copyScopedAdminApiKey">
              {{ t("admin.settings.adminApiKey.copyKey") }}
            </button>
          </div>
        </div>
        <div v-if="adminApiKeyPanelLoading" class="text-sm text-gray-500">{{ t("common.loading") }}</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
            <tr class="border-b border-gray-200 text-xs text-gray-500 dark:border-dark-700">
              <th class="py-2">{{ t("admin.settings.adminApiKey.name") }}</th>
              <th>{{ t("admin.settings.adminApiKey.scopes") }}</th>
              <th>{{ t("admin.settings.adminApiKey.status") }}</th>
              <th>{{ t("admin.settings.adminApiKey.lastUsed") }}</th>
              <th class="text-right">{{ t("admin.settings.adminApiKey.actions") }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="key in scopedAdminApiKeys" :key="key.id"
                class="border-b border-gray-100 dark:border-dark-800">
              <td class="py-3">
                <div class="font-medium">{{ key.name }}</div>
                <code class="text-xs text-gray-500">{{ key.keyPrefix }}...{{ key.lastFour }}</code></td>
              <td>
                <div class="flex max-w-md flex-wrap gap-1"><span v-for="scope in key.scopes" :key="scope"
                                                                 class="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] dark:bg-dark-700">{{
                    scope
                  }}</span></div>
              </td>
              <td><span :class="key.status === 'active' ? 'text-green-600' : 'text-red-500'">{{
                  key.status
                }}</span><span v-if="key.expiresAt" class="ml-1 text-xs text-gray-500">{{
                  formatAdminApiKeyDate(key.expiresAt)
                }}</span></td>
              <td class="text-xs text-gray-500">{{
                  key.lastUsedAt ? formatAdminApiKeyDate(key.lastUsedAt) : '—'
                }}
              </td>
              <td class="whitespace-nowrap text-right">
                <button v-if="key.id !== 'legacy' && key.status === 'active'" type="button"
                        class="btn btn-secondary btn-sm mr-1" :disabled="adminApiKeyPanelOperating"
                        @click="editScopedAdminApiKey(key)">{{ t("admin.settings.adminApiKey.edit") }}
                </button>
                <button v-if="key.id !== 'legacy' && key.status === 'active'" type="button"
                        class="btn btn-secondary btn-sm mr-1" :disabled="adminApiKeyPanelOperating"
                        @click="rotateScopedAdminApiKey(key.id)">{{ t("admin.settings.adminApiKey.rotate") }}
                </button>
                <button v-if="key.id !== 'legacy' && key.status === 'active'" type="button"
                        class="btn btn-secondary btn-sm text-red-600" :disabled="adminApiKeyPanelOperating"
                        @click="revokeScopedAdminApiKey(key.id)">{{ t("admin.settings.adminApiKey.revoke") }}
                </button>
              </td>
            </tr>
            </tbody>
          </table>
          <p v-if="!scopedAdminApiKeys.length" class="py-5 text-center text-sm text-gray-500">
            {{ t("admin.settings.adminApiKey.noScopedKeys") }}</p>
        </div>
      </div>
    </div>

    <!-- Admin API Key Settings -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t("admin.settings.adminApiKey.title") }}
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t("admin.settings.adminApiKey.description") }}
        </p>
      </div>
      <div class="space-y-4 p-6">
        <!-- Security Warning -->
        <div class="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <div class="flex items-start">
            <Icon name="exclamationTriangle" size="md" class="mt-0.5 flex-shrink-0 text-amber-500"/>
            <p class="ml-3 text-sm text-amber-700 dark:text-amber-300">
              {{ t("admin.settings.adminApiKey.securityWarning") }}
            </p>
          </div>
        </div>
        <!-- Loading State -->
        <div v-if="adminApiKeyLoading" class="flex items-center gap-2 text-gray-500">
          <div class="h-4 w-4 animate-spin rounded-full border-b-2 border-primary-600"></div>
          {{ t("common.loading") }}
        </div>
        <!-- No Key Configured -->
        <div v-else-if="!adminApiKeyExists" class="flex items-center justify-between">
          <span class="text-gray-500 dark:text-gray-400">
            {{ t("admin.settings.adminApiKey.notConfigured") }}
          </span>
          <button type="button" @click="createAdminApiKey" :disabled="adminApiKeyOperating" class="btn btn-primary btn-sm">
            <svg v-if="adminApiKeyOperating" class="mr-1 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ adminApiKeyOperating ? t("admin.settings.adminApiKey.creating") : t("admin.settings.adminApiKey.create") }}
          </button>
        </div>
        <!-- Key Exists -->
        <div v-else class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t("admin.settings.adminApiKey.currentKey") }}
              </label>
              <code class="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-900 dark:bg-dark-700 dark:text-gray-100">
                {{ adminApiKeyMasked }}
              </code>
            </div>
            <div class="flex gap-2">
              <button type="button" @click="regenerateAdminApiKey" :disabled="adminApiKeyOperating" class="btn btn-secondary btn-sm">
                {{ adminApiKeyOperating ? t("admin.settings.adminApiKey.regenerating") : t("admin.settings.adminApiKey.regenerate") }}
              </button>
              <button type="button" @click="deleteAdminApiKey" :disabled="adminApiKeyOperating"
                      class="btn btn-secondary btn-sm text-red-600 hover:text-red-700 dark:text-red-400">
                {{ t("admin.settings.adminApiKey.delete") }}
              </button>
            </div>
          </div>
          <!-- Newly Generated Key Display -->
          <div v-if="newAdminApiKey"
               class="space-y-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
            <p class="text-sm font-medium text-green-700 dark:text-green-300">
              {{ t("admin.settings.adminApiKey.keyWarning") }}
            </p>
            <div class="flex items-center gap-2">
              <code class="flex-1 select-all break-all rounded border border-green-300 bg-white px-3 py-2 font-mono text-sm dark:border-green-700 dark:bg-dark-800">
                {{ newAdminApiKey }}
              </code>
              <button type="button" @click="copyNewKey" class="btn btn-primary btn-sm flex-shrink-0">
                {{ t("admin.settings.adminApiKey.copyKey") }}
              </button>
            </div>
            <p class="text-xs text-green-600 dark:text-green-400">
              {{ t("admin.settings.adminApiKey.usage") }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Registration Settings -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t("admin.settings.registration.title") }}
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t("admin.settings.registration.description") }}
        </p>
      </div>
      <div class="space-y-5 p-6">
        <div class="flex items-center justify-between">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">{{ t("admin.settings.registration.enableRegistration") }}</label>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t("admin.settings.registration.enableRegistrationHint") }}</p>
          </div>
          <Toggle v-model="form.registrationEnabled"/>
        </div>
        <div class="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-dark-700">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">{{ t("admin.settings.registration.emailVerification") }}</label>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t("admin.settings.registration.emailVerificationHint") }}</p>
          </div>
          <Toggle v-model="form.emailVerifyEnabled"/>
        </div>
        <div class="border-t border-gray-100 pt-4 dark:border-dark-700">
          <label class="font-medium text-gray-900 dark:text-white">{{ t("admin.settings.registration.emailSuffixWhitelist") }}</label>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ t("admin.settings.registration.emailSuffixWhitelistHint") }}</p>
          <div class="mt-3 rounded-lg border border-gray-300 bg-white p-2 dark:border-dark-500 dark:bg-dark-700">
            <div class="flex flex-wrap items-center gap-2">
              <span v-for="suffix in registrationEmailSuffixWhitelistTags" :key="suffix"
                    class="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs font-mono text-gray-700 dark:bg-dark-600 dark:text-gray-200">
                <span>{{ suffix }}</span>
                <button type="button"
                        class="rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-dark-500 dark:hover:text-white"
                        @click="removeRegistrationEmailSuffixWhitelistTag(suffix)">
                  <Icon name="x" size="xs" class="h-3.5 w-3.5" :stroke-width="2"/>
                </button>
              </span>
              <div class="flex min-w-[220px] flex-1 items-center gap-1 rounded border border-transparent px-2 py-1 focus-within:border-primary-300 dark:focus-within:border-primary-700">
                <input v-model="registrationEmailSuffixWhitelistDraft" type="text"
                       class="w-full bg-transparent text-sm font-mono text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500"
                       :placeholder="t('admin.settings.registration.emailSuffixWhitelistPlaceholder')"
                       @input="handleRegistrationEmailSuffixWhitelistDraftInput"
                       @keydown="handleRegistrationEmailSuffixWhitelistDraftKeydown"
                       @blur="commitRegistrationEmailSuffixWhitelistDraft"
                       @paste="handleRegistrationEmailSuffixWhitelistPaste"/>
              </div>
            </div>
          </div>
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">{{ t("admin.settings.registration.emailSuffixWhitelistInputHint") }}</p>
        </div>
        <!-- Promo Code -->
        <div class="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-dark-700">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">{{ t("admin.settings.registration.promoCode") }}</label>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t("admin.settings.registration.promoCodeHint") }}</p>
          </div>
          <Toggle v-model="form.promoCodeEnabled"/>
        </div>
        <!-- Invitation Code -->
        <div class="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-dark-700">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">{{ t("admin.settings.registration.invitationCode") }}</label>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t("admin.settings.registration.invitationCodeHint") }}</p>
          </div>
          <Toggle v-model="form.invitationCodeEnabled"/>
        </div>
        <!-- Password Reset -->
        <div v-if="form.emailVerifyEnabled"
             class="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-dark-700">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">{{ t("admin.settings.registration.passwordReset") }}</label>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t("admin.settings.registration.passwordResetHint") }}</p>
          </div>
          <Toggle v-model="form.passwordResetEnabled"/>
        </div>
        <!-- Frontend URL -->
        <div v-if="form.emailVerifyEnabled && form.passwordResetEnabled"
             class="border-t border-gray-100 pt-4 dark:border-dark-700">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t("admin.settings.registration.frontendUrl") }}
          </label>
          <input v-model="form.frontendUrl" type="url" class="input"
                 :placeholder="t('admin.settings.registration.frontendUrlPlaceholder')"/>
          <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{{ t("admin.settings.registration.frontendUrlHint") }}</p>
        </div>
        <!-- TOTP 2FA -->
        <div class="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-dark-700">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">{{ t("admin.settings.registration.totp") }}</label>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t("admin.settings.registration.totpHint") }}</p>
            <p v-if="!form.totpEncryptionKeyConfigured" class="mt-2 text-sm text-amber-600 dark:text-amber-400">
              {{ t("admin.settings.registration.totpKeyNotConfigured") }}
            </p>
          </div>
          <Toggle v-model="form.totpEnabled" :disabled="!form.totpEncryptionKeyConfigured"/>
        </div>
        <!-- Step-up 2FA -->
        <div class="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-dark-700">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">{{ t("admin.settings.security.stepUp") }}</label>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t("admin.settings.security.stepUpHint") }}</p>
          </div>
          <Toggle v-model="form.stepUpEnabled"/>
        </div>
        <!-- Session Binding -->
        <div class="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-dark-700">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">{{ t("admin.settings.security.sessionBinding") }}</label>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t("admin.settings.security.sessionBindingHint") }}</p>
          </div>
          <Toggle v-model="form.sessionBindingEnabled"/>
        </div>
        <!-- Audit Log Retention -->
        <div class="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-dark-700">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">{{ t("admin.settings.security.auditRetention") }}</label>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t("admin.settings.security.auditRetentionHint") }}</p>
          </div>
          <input v-model.number="form.auditLogRetentionDays" type="number" min="0" class="input w-28 text-right"/>
        </div>
      </div>
    </div>

    <!-- API Key IP ACL Settings -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t("admin.settings.apiKeyAcl.title") }}</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ t("admin.settings.apiKeyAcl.description") }}</p>
      </div>
      <div class="space-y-5 p-6">
        <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(240px,360px)] md:items-center">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">{{ t("admin.settings.apiKeyAcl.resolutionMode") }}</label>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t("admin.settings.apiKeyAcl.resolutionModeHint") }}</p>
          </div>
          <Select :modelValue="form.clientIpResolutionMode"
                  @update:modelValue="form.clientIpResolutionMode = $event as ClientIPResolutionMode"
                  :options="clientIPResolutionModeOptions" :searchable="false"/>
        </div>
        <div v-if="form.clientIpResolutionMode !== 'direct'">
          <label class="mb-1 block text-sm font-medium text-gray-900 dark:text-white">{{ t("admin.settings.apiKeyAcl.trustedProxies") }}</label>
          <textarea v-model="clientIPTrustedProxiesText" class="input min-h-24 font-mono text-sm"
                    :placeholder="t('admin.settings.apiKeyAcl.trustedProxiesPlaceholder')" spellcheck="false"></textarea>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ t("admin.settings.apiKeyAcl.trustedProxiesHint") }}</p>
        </div>
        <dl class="grid gap-3 border-t border-gray-100 pt-4 text-sm dark:border-dark-700 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt class="text-gray-500 dark:text-gray-400">{{ t("admin.settings.apiKeyAcl.activeMode") }}</dt>
            <dd class="mt-1 font-medium text-gray-900 dark:text-white">{{ t(`admin.settings.apiKeyAcl.modes.${form.clientIpResolutionStatus.mode || form.clientIpResolutionMode}`) }}</dd>
          </div>
          <div>
            <dt class="text-gray-500 dark:text-gray-400">{{ t("admin.settings.apiKeyAcl.customRules") }}</dt>
            <dd class="mt-1 font-medium text-gray-900 dark:text-white">{{ form.clientIpResolutionStatus.customPrefixCount }}</dd>
          </div>
          <div>
            <dt class="text-gray-500 dark:text-gray-400">{{ t("admin.settings.apiKeyAcl.cloudflareRules") }}</dt>
            <dd class="mt-1 font-medium text-gray-900 dark:text-white">{{ form.clientIpResolutionStatus.cloudflarePrefixCount }}</dd>
          </div>
          <div>
            <dt class="text-gray-500 dark:text-gray-400">{{ t("admin.settings.apiKeyAcl.cloudflareSource") }}</dt>
            <dd class="mt-1 font-medium text-gray-900 dark:text-white">{{ t(`admin.settings.apiKeyAcl.sources.${form.clientIpResolutionStatus.cloudflareRangesSource || 'embedded'}`) }}</dd>
          </div>
        </dl>
        <p v-if="form.clientIpResolutionStatus.cloudflareLastSuccessAt" class="text-xs text-gray-500 dark:text-gray-400">
          {{ t("admin.settings.apiKeyAcl.lastRefresh", {time: clientIPLastRefreshText}) }}
        </p>
      </div>
    </div>

    <!-- Authentication bot protection settings -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t("admin.settings.turnstile.title") }}</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ t("admin.settings.turnstile.description") }}</p>
      </div>
      <div class="space-y-5 p-6">
        <div v-for="provider in humanVerificationProviders" :key="provider.key"
             class="flex items-center justify-between gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0 dark:border-dark-700">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">{{ t(provider.label) }}</label>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t(provider.hint) }}</p>
          </div>
          <Toggle :model-value="form[provider.key]" @update:model-value="setHumanVerificationProvider(provider.key, $event)"/>
        </div>
        <!-- Turnstile Keys -->
        <div v-if="form.turnstileEnabled" class="border-t border-gray-100 pt-4 dark:border-dark-700">
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{{ t("admin.settings.turnstile.siteKey") }}</label>
              <input v-model="form.turnstileSiteKey" type="text" class="input font-mono text-sm" placeholder="0x4AAAAAAA..."/>
              <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                {{ t("admin.settings.turnstile.siteKeyHint") }}
                <a href="https://dash.cloudflare.com/" target="_blank" class="text-primary-600 hover:text-primary-500">{{ t("admin.settings.turnstile.cloudflareDashboard") }}</a>
              </p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{{ t("admin.settings.turnstile.secretKey") }}</label>
              <input v-model="form.turnstile_secret_key" type="password" class="input font-mono text-sm" placeholder="0x4AAAAAAA..."/>
              <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                {{ form.turnstileSecretKeyConfigured ? t("admin.settings.turnstile.secretKeyConfiguredHint") : t("admin.settings.turnstile.secretKeyHint") }}
              </p>
            </div>
          </div>
        </div>
        <!-- reCAPTCHA Keys -->
        <div v-if="form.recaptchaEnabled" class="border-t border-gray-100 pt-4 dark:border-dark-700">
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{{ t("admin.settings.turnstile.siteKey") }}</label>
              <input v-model="form.recaptchaSiteKey" type="text" class="input font-mono text-sm" placeholder="6Lc..."/>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{{ t("admin.settings.turnstile.secretKey") }}</label>
              <input v-model="form.recaptcha_secret_key" type="password" class="input font-mono text-sm" placeholder="6Lc..."/>
              <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                {{ form.recaptchaSecretKeyConfigured ? t("admin.settings.turnstile.secretKeyConfiguredHint") : t("admin.settings.turnstile.secretKeyHint") }}
              </p>
            </div>
          </div>
        </div>
        <!-- CAP Keys -->
        <div v-if="form.capEnabled" class="border-t border-gray-100 pt-4 dark:border-dark-700">
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{{ t("admin.settings.turnstile.capEndpoint") }}</label>
              <input v-model="form.capApiEndpoint" type="url" class="input font-mono text-sm" placeholder="https://cap.example.com/site-key"/>
              <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{{ t("admin.settings.turnstile.capEndpointHint") }}</p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{{ t("admin.settings.turnstile.secretKey") }}</label>
              <input v-model="form.cap_secret_key" type="password" class="input font-mono text-sm"/>
              <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                {{ form.capSecretKeyConfigured ? t("admin.settings.turnstile.secretKeyConfiguredHint") : t("admin.settings.turnstile.secretKeyHint") }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Icon from '@/common/widgets/icons/Icon.vue'
import Toggle from '@/common/widgets/forms/Toggle.vue'
import Select from '@/common/widgets/forms/Select.vue'
import { useAdminSettings } from '@/features/admin-settings/presentation/composables/useAdminSettings'
import { useAppStore } from '@/core/stores/appStore'
import { extractApiErrorMessage } from '@/core/utils/apiError'
import type { AdminApiKey } from '@/features/admin-settings/domain/models/adminApiKey'
import type { AdminApiKeyScope } from '@/features/admin-settings/enums/adminApiKeyScope'
import type { ClientIpResolutionMode as ClientIPResolutionMode } from '@/features/admin-settings/enums/clientIpResolutionMode'
import {
  isRegistrationEmailSuffixDomainValid,
  normalizeRegistrationEmailSuffixDomain,
  parseRegistrationEmailSuffixWhitelistInput,
} from '@/core/utils/registrationEmailPolicy'

const props = defineProps<{ form: Record<string, any>; saving: boolean; loadFailed: boolean }>()

const { t } = useI18n()
const $settings = useAdminSettings()
const appStore = useAppStore()

type HumanVerificationEnabledKey = 'turnstileEnabled' | 'recaptchaEnabled' | 'capEnabled' | 'localCaptchaEnabled'
const humanVerificationProviders: Array<{ key: HumanVerificationEnabledKey; label: string; hint: string }> = [
  { key: 'turnstileEnabled', label: 'admin.settings.turnstile.enableTurnstile', hint: 'admin.settings.turnstile.enableTurnstileHint' },
  { key: 'recaptchaEnabled', label: 'admin.settings.turnstile.enableRecaptcha', hint: 'admin.settings.turnstile.enableRecaptchaHint' },
  { key: 'capEnabled', label: 'admin.settings.turnstile.enableCap', hint: 'admin.settings.turnstile.enableCapHint' },
  { key: 'localCaptchaEnabled', label: 'admin.settings.turnstile.enableLocalCaptcha', hint: 'admin.settings.turnstile.enableLocalCaptchaHint' },
]
function setHumanVerificationProvider(provider: HumanVerificationEnabledKey, enabled: boolean) {
  for (const option of humanVerificationProviders) {
    (props.form as Record<string, unknown>)[option.key] = enabled && option.key === provider
  }
}
const clientIPResolutionModeOptions = computed(() => [
  { value: 'auto_compat', label: t('admin.settings.apiKeyAcl.modes.auto_compat') },
  { value: 'trusted_proxy', label: t('admin.settings.apiKeyAcl.modes.trusted_proxy') },
  { value: 'direct', label: t('admin.settings.apiKeyAcl.modes.direct') },
])
const clientIPLastRefreshText = computed(() => {
  const raw = (props.form as any).clientIpResolutionStatus?.cloudflareLastSuccessAt
  if (!raw) return ''
  const value = new Date(raw)
  return Number.isNaN(value.getTime()) ? raw : value.toLocaleString()
})
const clientIPTrustedProxiesText = ref('')
const registrationEmailSuffixWhitelistTags = ref<string[]>([])
const registrationEmailSuffixWhitelistDraft = ref('')
const registrationEmailSuffixWhitelistSeparatorKeys = new Set([' ', '，', 'Enter', 'Tab'])
function removeRegistrationEmailSuffixWhitelistTag(suffix: string) {
  registrationEmailSuffixWhitelistTags.value = registrationEmailSuffixWhitelistTags.value.filter(item => item !== suffix)
}
function addRegistrationEmailSuffixWhitelistTag(suffix: string) {
  const normalized = normalizeRegistrationEmailSuffixDomain(suffix)
  if (!normalized || !isRegistrationEmailSuffixDomainValid(normalized)) return
  if (!registrationEmailSuffixWhitelistTags.value.includes(normalized))
    registrationEmailSuffixWhitelistTags.value = [...registrationEmailSuffixWhitelistTags.value, normalized]
}
function commitRegistrationEmailSuffixWhitelistDraft() {
  if (!registrationEmailSuffixWhitelistDraft.value) return
  addRegistrationEmailSuffixWhitelistTag(registrationEmailSuffixWhitelistDraft.value)
  registrationEmailSuffixWhitelistDraft.value = ''
}
function handleRegistrationEmailSuffixWhitelistDraftInput() {
  const v = registrationEmailSuffixWhitelistDraft.value
  if (v.endsWith(' ') || v.endsWith('，')) {
    registrationEmailSuffixWhitelistDraft.value = v.slice(0, -1)
    commitRegistrationEmailSuffixWhitelistDraft()
  }
}
function handleRegistrationEmailSuffixWhitelistDraftKeydown(event: KeyboardEvent) {
  if (event.isComposing) return
  if (registrationEmailSuffixWhitelistSeparatorKeys.has(event.key)) {
    event.preventDefault()
    commitRegistrationEmailSuffixWhitelistDraft()
    return
  }
  if (event.key === 'Backspace' && !registrationEmailSuffixWhitelistDraft.value && registrationEmailSuffixWhitelistTags.value.length > 0)
    registrationEmailSuffixWhitelistTags.value.pop()
}
function handleRegistrationEmailSuffixWhitelistPaste(event: ClipboardEvent) {
  event.preventDefault()
  const text = event.clipboardData?.getData('text') ?? ''
  for (const domain of parseRegistrationEmailSuffixWhitelistInput(text)) addRegistrationEmailSuffixWhitelistTag(domain)
}

const adminApiKeyLoading = ref(true)
const adminApiKeyExists = ref(false)
const adminApiKeyMasked = ref('')
const adminApiKeyOperating = ref(false)
const newAdminApiKey = ref('')
const scopedAdminApiKeys = ref<AdminApiKey[]>([])
const adminApiKeyPanelLoading = ref(true)
const adminApiKeyPanelOperating = ref(false)
const adminApiKeyPanelSecret = ref('')
const editingAdminApiKeyId = ref<string | null>(null)
const adminApiKeyMinExpiry = new Date(Date.now() + 60_000).toISOString().slice(0, 16)
const adminApiKeyForm = reactive<{ name: string; scopes: AdminApiKeyScope[]; expires_at: string }>({
  name: '',
  scopes: ['admin.read'],
  expires_at: '',
})
const adminApiKeyScopeOptions: Array<{ value: AdminApiKeyScope; label: string }> = [
  { value: 'admin.read', label: '全部只读' },
  { value: 'admin.write', label: '全部写入' },
  { value: 'admin.users.read', label: '用户读取' },
  { value: 'admin.users.write', label: '用户修改' },
  { value: 'admin.accounts.read', label: '账号读取' },
  { value: 'admin.accounts.write', label: '账号修改' },
  { value: 'admin.settings.read', label: '设置读取' },
  { value: 'admin.settings.write', label: '设置修改' },
  { value: 'admin.backups.read', label: '备份读取' },
  { value: 'admin.backups.write', label: '备份操作' },
  { value: 'admin.system.read', label: '系统读取' },
  { value: 'admin.system.write', label: '系统操作' },
  { value: 'admin.audit.read', label: '审计读取' },
  { value: 'admin.audit.write', label: '审计操作' },
  { value: 'admin.ops.read', label: '运维读取' },
  { value: 'admin.ops.write', label: '运维操作' },
]

async function loadScopedAdminApiKeys() {
  adminApiKeyPanelLoading.value = true
  try {
    scopedAdminApiKeys.value = (await $settings.listAdminApiKeys()).items
  } catch (_error: unknown) {
    // silent
  } finally {
    adminApiKeyPanelLoading.value = false
  }
}

function formatAdminApiKeyDate(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

function adminApiKeyExpiryPayload(): string | null {
  if (!adminApiKeyForm.expires_at) return null
  const date = new Date(adminApiKeyForm.expires_at)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

async function createScopedAdminApiKey() {
  adminApiKeyPanelOperating.value = true
  try {
    const request = {
      name: adminApiKeyForm.name.trim(),
      scopes: adminApiKeyForm.scopes.length ? adminApiKeyForm.scopes : (['admin.read'] as AdminApiKeyScope[]),
      expires_at: adminApiKeyExpiryPayload(),
    }
    if (editingAdminApiKeyId.value) {
      await $settings.updateAdminApiKey(editingAdminApiKeyId.value, request)
      editingAdminApiKeyId.value = null
    } else {
      const result = await $settings.createAdminApiKey(request)
      adminApiKeyPanelSecret.value = result.key
    }
    adminApiKeyForm.name = ''
    adminApiKeyForm.scopes = ['admin.read']
    adminApiKeyForm.expires_at = ''
    await loadScopedAdminApiKeys()
    appStore.showSuccess(t('admin.settings.adminApiKey.keyGenerated'))
  } catch (error: unknown) {
    appStore.showError(extractApiErrorMessage(error, t('common.error')))
  } finally {
    adminApiKeyPanelOperating.value = false
  }
}

function editScopedAdminApiKey(key: AdminApiKey) {
  editingAdminApiKeyId.value = key.id
  adminApiKeyForm.name = key.name
  adminApiKeyForm.scopes = [...key.scopes]
  adminApiKeyForm.expires_at = key.expiresAt ? new Date(key.expiresAt).toISOString().slice(0, 16) : ''
  adminApiKeyPanelSecret.value = ''
}

function cancelEditScopedAdminApiKey() {
  editingAdminApiKeyId.value = null
  adminApiKeyForm.name = ''
  adminApiKeyForm.scopes = ['admin.read']
  adminApiKeyForm.expires_at = ''
}

async function rotateScopedAdminApiKey(id: string) {
  if (!confirm(t('admin.settings.adminApiKey.regenerateConfirm'))) return
  adminApiKeyPanelOperating.value = true
  try {
    const result = await $settings.rotateAdminApiKey(id)
    adminApiKeyPanelSecret.value = result.key
    await loadScopedAdminApiKeys()
  } catch (error: unknown) {
    appStore.showError(extractApiErrorMessage(error, t('common.error')))
  } finally {
    adminApiKeyPanelOperating.value = false
  }
}

async function revokeScopedAdminApiKey(id: string) {
  if (!confirm(t('admin.settings.adminApiKey.deleteConfirm'))) return
  adminApiKeyPanelOperating.value = true
  try {
    await $settings.revokeAdminApiKey(id)
    await loadScopedAdminApiKeys()
    appStore.showSuccess(t('admin.settings.adminApiKey.keyDeleted'))
  } catch (error: unknown) {
    appStore.showError(extractApiErrorMessage(error, t('common.error')))
  } finally {
    adminApiKeyPanelOperating.value = false
  }
}

function copyScopedAdminApiKey() {
  if (!adminApiKeyPanelSecret.value) return
  navigator.clipboard.writeText(adminApiKeyPanelSecret.value)
    .then(() => appStore.showSuccess(t('admin.settings.adminApiKey.keyCopied')))
    .catch(() => appStore.showError(t('common.copyFailed')))
}

async function loadAdminApiKey() {
  adminApiKeyLoading.value = true
  try {
    const status = await $settings.getAdminApiKey()
    adminApiKeyExists.value = status.exists
    adminApiKeyMasked.value = status.maskedKey
  } catch (_error: unknown) {
    // silent
  } finally {
    adminApiKeyLoading.value = false
  }
}

async function createAdminApiKey() {
  adminApiKeyOperating.value = true
  try {
    const result = await $settings.regenerateAdminApiKey()
    newAdminApiKey.value = result.key
    adminApiKeyExists.value = true
    adminApiKeyMasked.value = result.key.substring(0, 10) + '...' + result.key.slice(-4)
    appStore.showSuccess(t('admin.settings.adminApiKey.keyGenerated'))
  } catch (error: unknown) {
    appStore.showError(extractApiErrorMessage(error, t('common.error')))
  } finally {
    adminApiKeyOperating.value = false
  }
}

async function regenerateAdminApiKey() {
  if (!confirm(t('admin.settings.adminApiKey.regenerateConfirm'))) return
  await createAdminApiKey()
}

async function deleteAdminApiKey() {
  if (!confirm(t('admin.settings.adminApiKey.deleteConfirm'))) return
  adminApiKeyOperating.value = true
  try {
    await $settings.deleteAdminApiKey()
    adminApiKeyExists.value = false
    adminApiKeyMasked.value = ''
    newAdminApiKey.value = ''
    appStore.showSuccess(t('admin.settings.adminApiKey.keyDeleted'))
  } catch (error: unknown) {
    appStore.showError(extractApiErrorMessage(error, t('common.error')))
  } finally {
    adminApiKeyOperating.value = false
  }
}

function copyNewKey() {
  navigator.clipboard.writeText(newAdminApiKey.value)
    .then(() => appStore.showSuccess(t('admin.settings.adminApiKey.keyCopied')))
    .catch(() => appStore.showError(t('common.copyFailed')))
}

onMounted(() => {
  loadAdminApiKey()
  loadScopedAdminApiKeys()
})
</script>

    <!-- LinuxDo Connect OAuth -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t("admin.settings.linuxdo.title") }}</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ t("admin.settings.linuxdo.description") }}</p>
      </div>
      <div class="space-y-5 p-6">
        <div class="flex items-center justify-between">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">{{ t("admin.settings.linuxdo.enable") }}</label>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t("admin.settings.linuxdo.enableHint") }}</p>
          </div>
          <Toggle v-model="form.linuxdoConnectEnabled"/>
        </div>
        <div v-if="form.linuxdoConnectEnabled" class="border-t border-gray-100 pt-4 dark:border-dark-700">
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{{ t("admin.settings.linuxdo.clientId") }}</label>
              <input v-model="form.linuxdoConnectClientId" type="text" class="input font-mono text-sm"
                     :placeholder="t('admin.settings.linuxdo.clientIdPlaceholder')"/>
              <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{{ t("admin.settings.linuxdo.clientIdHint") }}</p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{{ t("admin.settings.linuxdo.clientSecret") }}</label>
              <input v-model="form.linuxdo_connect_client_secret" type="password" class="input font-mono text-sm"
                     :placeholder="form.linuxdoConnectClientSecretConfigured ? t('admin.settings.linuxdo.clientSecretConfiguredPlaceholder') : t('admin.settings.linuxdo.clientSecretPlaceholder')"/>
              <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                {{ form.linuxdoConnectClientSecretConfigured ? t("admin.settings.linuxdo.clientSecretConfiguredHint") : t("admin.settings.linuxdo.clientSecretHint") }}
              </p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{{ t("admin.settings.linuxdo.redirectUrl") }}</label>
              <input v-model="form.linuxdoConnectRedirectUrl" type="url" class="input font-mono text-sm"
                     :placeholder="t('admin.settings.linuxdo.redirectUrlPlaceholder')"/>
              <div class="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <button type="button" class="btn btn-secondary btn-sm w-fit" @click="setAndCopyLinuxdoRedirectUrl">
                  {{ t("admin.settings.linuxdo.quickSetCopy") }}
                </button>
                <code v-if="linuxdoRedirectUrlSuggestion"
                      class="select-all break-all rounded bg-gray-50 px-2 py-1 font-mono text-xs text-gray-600 dark:bg-dark-800 dark:text-gray-300">
                  {{ linuxdoRedirectUrlSuggestion }}
                </code>
              </div>
              <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{{ t("admin.settings.linuxdo.redirectUrlHint") }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- GitHub / Google Email OAuth -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ localText("邮箱快捷登录", "Email OAuth Sign-in") }}</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ localText("开启 GitHub 或 Google 邮箱授权登录后，系统会读取已验证邮箱，存在则直接登录，不存在则自动注册。", "After GitHub or Google email OAuth is enabled, the system reads a verified email, signs in matching users, and auto-registers missing users.") }}</p>
      </div>
      <div class="space-y-6 p-6">
        <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <!-- GitHub -->
          <div class="rounded-lg border border-gray-200 p-4 dark:border-dark-700">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">GitHub</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ localText("GitHub OAuth App 需要 read:user user:email 权限，回调地址填写下方后端地址。", "GitHub OAuth App needs read:user user:email scopes. Use the backend callback URL below.") }}</p>
              </div>
              <Toggle v-model="form.githubOauthEnabled"/>
            </div>
            <div v-if="form.githubOauthEnabled" class="mt-4 space-y-4">
              <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Client ID</label>
                  <input v-model="form.githubOauthClientId" type="text" class="input font-mono text-sm" placeholder="GitHub OAuth Client ID"/>
                </div>
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Client Secret</label>
                  <input v-model="form.github_oauth_client_secret" type="password" class="input font-mono text-sm"
                         :placeholder="form.githubOauthClientSecretConfigured ? localText('密钥已配置，留空以保留当前值。', 'Secret configured. Leave empty to keep the current value.') : 'GitHub OAuth Client Secret'"/>
                </div>
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{{ localText("后端回调地址", "Backend Callback URL") }}</label>
                <input v-model="form.githubOauthRedirectUrl" type="url" class="input font-mono text-sm" placeholder="https://your-domain.com/api/v1/auth/oauth/github/callback"/>
                <div class="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <button type="button" class="btn btn-secondary btn-sm w-fit" @click="setAndCopyEmailOAuthRedirectUrl('github')">
                    {{ localText("生成并复制", "Generate and copy") }}
                  </button>
                  <code v-if="githubOAuthRedirectUrlSuggestion" class="select-all break-all rounded bg-gray-50 px-2 py-1 font-mono text-xs text-gray-600 dark:bg-dark-800 dark:text-gray-300">{{ githubOAuthRedirectUrlSuggestion }}</code>
                </div>
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{{ localText("前端回跳地址", "Frontend Callback URL") }}</label>
                <input v-model="form.githubOauthFrontendRedirectUrl" type="text" class="input font-mono text-sm" placeholder="/auth/oauth/callback"/>
              </div>
            </div>
          </div>
          <!-- Google -->
          <div class="rounded-lg border border-gray-200 p-4 dark:border-dark-700">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">Google</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ localText("Google OAuth 客户端需要 openid email profile 范围，并在凭据里登记后端回调地址。", "Google OAuth client needs openid email profile scopes and the backend callback URL registered in credentials.") }}</p>
              </div>
              <Toggle v-model="form.googleOauthEnabled"/>
            </div>
            <div v-if="form.googleOauthEnabled" class="mt-4 space-y-4">
              <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Client ID</label>
                  <input v-model="form.googleOauthClientId" type="text" class="input font-mono text-sm" placeholder="Google OAuth Client ID"/>
                </div>
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Client Secret</label>
                  <input v-model="form.google_oauth_client_secret" type="password" class="input font-mono text-sm"
                         :placeholder="form.googleOauthClientSecretConfigured ? localText('密钥已配置，留空以保留当前值。', 'Secret configured. Leave empty to keep the current value.') : 'Google OAuth Client Secret'"/>
                </div>
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{{ localText("后端回调地址", "Backend Callback URL") }}</label>
                <input v-model="form.googleOauthRedirectUrl" type="url" class="input font-mono text-sm" placeholder="https://your-domain.com/api/v1/auth/oauth/google/callback"/>
                <div class="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <button type="button" class="btn btn-secondary btn-sm w-fit" @click="setAndCopyEmailOAuthRedirectUrl('google')">
                    {{ localText("生成并复制", "Generate and copy") }}
                  </button>
                  <code v-if="googleOAuthRedirectUrlSuggestion" class="select-all break-all rounded bg-gray-50 px-2 py-1 font-mono text-xs text-gray-600 dark:bg-dark-800 dark:text-gray-300">{{ googleOAuthRedirectUrlSuggestion }}</code>
                </div>
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{{ localText("前端回跳地址", "Frontend Callback URL") }}</label>
                <input v-model="form.googleOauthFrontendRedirectUrl" type="text" class="input font-mono text-sm" placeholder="/auth/oauth/callback"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>