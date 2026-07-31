<template>
  <div class="space-y-6">
    <!-- Site Settings -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t("admin.settings.site.title") }}
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t("admin.settings.site.description") }}
        </p>
      </div>
      <div class="space-y-6 p-6">
        <!-- Backend Mode -->
        <div
            class="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20"
        >
          <div>
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">
              {{ t("admin.settings.site.backendMode") }}
            </h3>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.site.backendModeDescription") }}
            </p>
          </div>
          <Toggle v-model="form.backendModeEnabled"/>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t("admin.settings.site.siteName") }}
            </label>
            <input
                v-model="form.siteName"
                type="text"
                class="input"
                :placeholder="t('admin.settings.site.siteNamePlaceholder')"
            />
            <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.site.siteNameHint") }}
            </p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t("admin.settings.site.siteSubtitle") }}
            </label>
            <input
                v-model="form.siteSubtitle"
                type="text"
                class="input"
                :placeholder="t('admin.settings.site.siteSubtitlePlaceholder')"
            />
            <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.site.siteSubtitleHint") }}
            </p>
          </div>
        </div>

        <!-- API Base URL -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t("admin.settings.site.apiBaseUrl") }}
          </label>
          <input
              v-model="form.apiBaseUrl"
              type="text"
              class="input font-mono text-sm"
              :placeholder="t('admin.settings.site.apiBaseUrlPlaceholder')"
          />
          <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            {{ t("admin.settings.site.apiBaseUrlHint") }}
          </p>
        </div>

        <!-- Global Table Preferences -->
        <div class="border-t border-gray-100 pt-4 dark:border-dark-700">
          <h3 class="text-sm font-medium text-gray-900 dark:text-white">
            {{ t("admin.settings.site.tablePreferencesTitle") }}
          </h3>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ t("admin.settings.site.tablePreferencesDescription") }}
          </p>
          <div class="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t("admin.settings.site.tableDefaultPageSize") }}
              </label>
              <input
                  v-model.number="form.tableDefaultPageSize"
                  type="number"
                  min="5"
                  max="1000"
                  step="1"
                  class="input w-40"
              />
              <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                {{ t("admin.settings.site.tableDefaultPageSizeHint") }}
              </p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t("admin.settings.site.tablePageSizeOptions") }}
              </label>
              <input
                  v-model="tablePageSizeOptionsInput"
                  type="text"
                  class="input font-mono text-sm"
                  :placeholder="t('admin.settings.site.tablePageSizeOptionsPlaceholder')"
              />
              <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                {{ t("admin.settings.site.tablePageSizeOptionsHint") }}
              </p>
            </div>
          </div>
        </div>

        <!-- Custom Endpoints -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t("admin.settings.site.customEndpoints.title") }}
          </label>
          <p class="mb-3 text-xs text-gray-500 dark:text-gray-400">
            {{ t("admin.settings.site.customEndpoints.description") }}
          </p>

          <div class="space-y-3">
            <div
                v-for="(ep, index) in form.customEndpoints"
                :key="index"
                class="rounded-lg border border-gray-200 p-4 dark:border-dark-600"
            >
              <div class="mb-3 flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ t("admin.settings.site.customEndpoints.itemLabel", {n: index + 1}) }}
                </span>
                <button
                    type="button"
                    class="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    @click="removeEndpoint(index)"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                    {{ t("admin.settings.site.customEndpoints.name") }}
                  </label>
                  <input
                      v-model="ep.name"
                      type="text"
                      class="input text-sm"
                      :placeholder="t('admin.settings.site.customEndpoints.namePlaceholder')"
                  />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                    {{ t("admin.settings.site.customEndpoints.endpointUrl") }}
                  </label>
                  <input
                      v-model="ep.endpoint"
                      type="url"
                      class="input font-mono text-sm"
                      :placeholder="t('admin.settings.site.customEndpoints.endpointUrlPlaceholder')"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                    {{ t("admin.settings.site.customEndpoints.descriptionLabel") }}
                  </label>
                  <input
                      v-model="ep.description"
                      type="text"
                      class="input text-sm"
                      :placeholder="t('admin.settings.site.customEndpoints.descriptionPlaceholder')"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
              type="button"
              class="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-2.5 text-sm text-gray-500 transition-colors hover:border-primary-400 hover:text-primary-600 dark:border-dark-600 dark:text-gray-400 dark:hover:border-primary-500 dark:hover:text-primary-400"
              @click="addEndpoint"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            {{ t("admin.settings.site.customEndpoints.add") }}
          </button>
        </div>

        <!-- Contact Info -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t("admin.settings.site.contactInfo") }}
          </label>
          <input
              v-model="form.contactInfo"
              type="text"
              class="input"
              :placeholder="t('admin.settings.site.contactInfoPlaceholder')"
          />
          <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            {{ t("admin.settings.site.contactInfoHint") }}
          </p>
        </div>

        <!-- Doc URL -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t("admin.settings.site.docUrl") }}
          </label>
          <input
              v-model="form.docUrl"
              type="url"
              class="input font-mono text-sm"
              :placeholder="t('admin.settings.site.docUrlPlaceholder')"
          />
          <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            {{ t("admin.settings.site.docUrlHint") }}
          </p>
        </div>

        <!-- Site Logo Upload -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t("admin.settings.site.siteLogo") }}
          </label>
          <ImageUpload
              v-model="form.siteLogo"
              mode="image"
              :upload-label="t('admin.settings.site.uploadImage')"
              :remove-label="t('admin.settings.site.remove')"
              :hint="t('admin.settings.site.logoHint')"
              :max-size="300 * 1024"
          />
        </div>

        <!-- Home Content -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t("admin.settings.site.homeContent") }}
          </label>
          <textarea
              v-model="form.homeContent"
              rows="6"
              class="input font-mono text-sm"
              :placeholder="t('admin.settings.site.homeContentPlaceholder')"
          ></textarea>
          <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            {{ t("admin.settings.site.homeContentHint") }}
          </p>
          <!-- iframe CSP Warning -->
          <p class="mt-2 text-xs text-amber-600 dark:text-amber-400">
            {{ t("admin.settings.site.homeContentIframeWarning") }}
          </p>
        </div>

        <!-- Hide CCS Import Button -->
        <div class="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-dark-700">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">{{
                t("admin.settings.site.hideCcsImportButton")
              }}</label>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.site.hideCcsImportButtonHint") }}
            </p>
          </div>
          <Toggle v-model="form.hideCcsImportButton"/>
        </div>
      </div>
    </div>

    <!-- Custom Menu Items -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t("admin.settings.customMenu.title") }}
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t("admin.settings.customMenu.description") }}
        </p>
      </div>
      <div class="space-y-4 p-6">
        <div
            v-for="(item, index) in form.customMenuItems"
            :key="item.id || index"
            class="rounded-lg border border-gray-200 p-4 dark:border-dark-600"
        >
          <div class="mb-3 flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t("admin.settings.customMenu.itemLabel", {n: index + 1}) }}
            </span>
            <div class="flex items-center gap-2">
              <button
                  v-if="index > 0"
                  type="button"
                  class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-dark-700"
                  :title="t('admin.settings.customMenu.moveUp')"
                  @click="moveMenuItem(index, -1)"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/>
                </svg>
              </button>
              <button
                  v-if="index < form.customMenuItems.length - 1"
                  type="button"
                  class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-dark-700"
                  :title="t('admin.settings.customMenu.moveDown')"
                  @click="moveMenuItem(index, 1)"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <button
                  type="button"
                  class="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                  :title="t('admin.settings.customMenu.remove')"
                  @click="removeMenuItem(index)"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                {{ t("admin.settings.customMenu.name") }}
              </label>
              <input
                  v-model="item.label"
                  type="text"
                  class="input text-sm"
                  :placeholder="t('admin.settings.customMenu.namePlaceholder')"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                {{ t("admin.settings.customMenu.visibility") }}
              </label>
              <select v-model="item.visibility" class="input text-sm">
                <option value="user">{{ t("admin.settings.customMenu.visibilityUser") }}</option>
                <option value="admin">{{ t("admin.settings.customMenu.visibilityAdmin") }}</option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                {{ t("admin.settings.customMenu.url") }}
              </label>
              <input
                  v-model="item.url"
                  type="url"
                  class="input font-mono text-sm"
                  :placeholder="t('admin.settings.customMenu.urlPlaceholder')"
              />
            </div>
            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                {{ t("admin.settings.customMenu.iconSvg") }}
              </label>
              <ImageUpload
                  :model-value="item.iconSvg"
                  mode="svg"
                  size="sm"
                  :upload-label="t('admin.settings.customMenu.uploadSvg')"
                  :remove-label="t('admin.settings.customMenu.removeSvg')"
                  @update:model-value="(v: string) => (item.iconSvg = v)"
              />
            </div>
          </div>
        </div>

        <button
            type="button"
            class="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm text-gray-500 transition-colors hover:border-primary-400 hover:text-primary-600 dark:border-dark-600 dark:text-gray-400 dark:hover:border-primary-500 dark:hover:text-primary-400"
            @click="addMenuItem"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          {{ t("admin.settings.customMenu.add") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue"
import {useI18n} from "vue-i18n"
import Toggle from "@/common/widgets/forms/Toggle.vue"
import ImageUpload from "@/common/widgets/data/ImageUpload.vue"
import type {WeChatConnectMode} from "@/features/admin-settings/presentation/utils/adminSettingsUtils"
import type {LoginAgreementDocument} from "@/core/models/domain/loginAgreementDocument"
import {
  defaultWeChatConnectScopesForMode,
  deriveWeChatConnectStoredMode,
  resolveWeChatConnectModeCapabilities,
} from "@/features/admin-settings/presentation/utils/adminSettingsUtils"
import {
  type FingerprintSignalRow,
} from "@/features/admin-accounts/presentation/utils/codexFingerprintSignals"

const props = defineProps<{ form: Record<string, any>; saving: boolean; loadFailed: boolean }>()

const {t} = useI18n()

// ── tablePageSizeOptions ──────────────────────────────────────────────────────
const tablePageSizeMin = 5
const tablePageSizeMax = 1000
const tablePageSizeDefault = 20

const tablePageSizeOptionsInput = ref("10, 20, 50, 100")

function formatTablePageSizeOptions(options: number[]): string {
  return options.join(", ")
}

function parseTablePageSizeOptionsInput(raw: string): number[] | null {
  const tokens = raw
      .split(",")
      .map((token) => token.trim())
      .filter((token) => token.length > 0)

  if (tokens.length === 0) return null

  const parsed = tokens.map((token) => Number(token))
  if (parsed.some((value) => !Number.isInteger(value))) return null

  const deduped = Array.from(new Set(parsed)).sort((a, b) => a - b)
  if (deduped.some((value) => value < tablePageSizeMin || value > tablePageSizeMax)) return null

  return deduped
}

// ── registrationEmailSuffixWhitelist ─────────────────────────────────────────
const registrationEmailSuffixWhitelistTags = ref<string[]>([])
const registrationEmailSuffixWhitelistDraft = ref("")

// ── clientIP ──────────────────────────────────────────────────────────────────
const clientIPTrustedProxiesText = ref("")

type HumanVerificationEnabledKey =
    | "turnstileEnabled"
    | "recaptchaEnabled"
    | "capEnabled"
    | "localCaptchaEnabled"

const humanVerificationProviders: Array<{ key: HumanVerificationEnabledKey; label: string; hint: string }> = [
  {
    key: "turnstileEnabled",
    label: "admin.settings.turnstile.enableTurnstile",
    hint: "admin.settings.turnstile.enableTurnstileHint"
  },
  {
    key: "recaptchaEnabled",
    label: "admin.settings.turnstile.enableRecaptcha",
    hint: "admin.settings.turnstile.enableRecaptchaHint"
  },
  {key: "capEnabled", label: "admin.settings.turnstile.enableCap", hint: "admin.settings.turnstile.enableCapHint"},
  {
    key: "localCaptchaEnabled",
    label: "admin.settings.turnstile.enableLocalCaptcha",
    hint: "admin.settings.turnstile.enableLocalCaptchaHint"
  },
]

function parseClientIPTrustedProxies(value: string): string[] {
  return Array.from(
      new Set(
          value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean),
      ),
  )
}

function setHumanVerificationProvider(provider: HumanVerificationEnabledKey, enabled: boolean): void {
  for (const option of humanVerificationProviders) {
    (props.form as Record<string, unknown>)[option.key] = enabled && option.key === provider
  }
}

function normalizeHumanVerificationProvider(): void {
  const selected = humanVerificationProviders.find(option => props.form[option.key])
  if (selected) setHumanVerificationProvider(selected.key, true)
}

// ── WeChat ────────────────────────────────────────────────────────────────────

function normalizeLoginAgreementDocumentId(raw: string): string {
  return raw.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/[-_]{2,}/g, "-").replace(/^[-_]+|[-_]+$/g, "")
}

function normalizeLoginAgreementDocumentsForSave(): LoginAgreementDocument[] {
  return (props.form.loginAgreementDocuments as any[])
      .map((doc: any, index: number) => ({
        id: normalizeLoginAgreementDocumentId(doc.id || doc.title) || `doc-${index + 1}`,
        title: doc.title.trim(),
        contentMd: doc.contentMd.trim(),
      }))
      .filter((doc: any) => doc.title || doc.contentMd)
}

function findDuplicateLoginAgreementDocumentId(documents: LoginAgreementDocument[]): string | null {
  const seen = new Set<string>()
  for (const doc of documents) {
    if (seen.has(doc.id)) return doc.id
    seen.add(doc.id)
  }
  return null
}

function syncWeChatConnectMode(preferredMode?: WeChatConnectMode) {
  const form = props.form as Record<string, unknown>
  if (form.wechat_connect_mp_enabled && form.wechat_connect_mobile_enabled) {
    if (preferredMode === "mobile") {
      form.wechat_connect_mp_enabled = false
    } else {
      form.wechat_connect_mobile_enabled = false
    }
  }

  const capabilities = resolveWeChatConnectModeCapabilities(
      form.wechat_connect_open_enabled as boolean,
      form.wechat_connect_mp_enabled as boolean,
      form.wechat_connect_mobile_enabled as boolean,
      form.wechatConnectMode as WeChatConnectMode,
  )
  form.wechat_connect_open_enabled = capabilities.openEnabled
  form.wechat_connect_mp_enabled = capabilities.mpEnabled
  form.wechat_connect_mobile_enabled = capabilities.mobileEnabled
  form.wechatConnectMode = deriveWeChatConnectStoredMode(
      capabilities.openEnabled,
      capabilities.mpEnabled,
      capabilities.mobileEnabled,
      form.wechatConnectMode as WeChatConnectMode,
  )
  form.wechatConnectScopes = defaultWeChatConnectScopesForMode(form.wechatConnectMode as WeChatConnectMode)
}

// ── Custom menu items ─────────────────────────────────────────────────────────
function addMenuItem() {
  (props.form.customMenuItems as any[]).push({
    id: "",
    label: "",
    iconSvg: "",
    url: "",
    visibility: "user",
    sortOrder: (props.form.customMenuItems as any[]).length,
  })
}

function removeMenuItem(index: number) {
  (props.form.customMenuItems as any[]).splice(index, 1)
  ;(props.form.customMenuItems as any[]).forEach((item, i) => {
    item.sortOrder = i
  })
}

function moveMenuItem(index: number, direction: -1 | 1) {
  const targetIndex = index + direction
  const items = props.form.customMenuItems as any[]
  if (targetIndex < 0 || targetIndex >= items.length) return
  const temp = items[index]
  items[index] = items[targetIndex]
  items[targetIndex] = temp
  items.forEach((item, i) => {
    item.sortOrder = i
  })
}

// ── Custom endpoints ──────────────────────────────────────────────────────────
function addEndpoint() {
  (props.form.customEndpoints as any[]).push({name: "", endpoint: "", description: ""})
}

function removeEndpoint(index: number) {
  (props.form.customEndpoints as any[]).splice(index, 1)
}

// ── Codex ─────────────────────────────────────────────────────────────────────
interface CodexClientRow {
  originator: string
  uaContains: string
  skipEngineFingerprint?: boolean
}

const codexBlacklistRows = ref<CodexClientRow[]>([])
const codexWhitelistRows = ref<CodexClientRow[]>([])
const codexFingerprintRows = ref<FingerprintSignalRow[]>([])


function parseCodexEntriesToRows(raw: string): CodexClientRow[] {
  if (!raw || !raw.trim()) return []
  try {
    const arr = JSON.parse(raw)
    if (!Array.isArray(arr)) return []
    return arr.map((e) => ({
      originator: typeof e?.originator === "string" ? e.originator : "",
      uaContains: Array.isArray(e?.ua_contains)
          ? e.ua_contains.filter((x: unknown) => typeof x === "string").join(", ")
          : "",
      skipEngineFingerprint: e?.skip_engine_fingerprint === true,
    }))
  } catch {
    return []
  }
}

function serializeCodexRowsToJSON(rows: CodexClientRow[]): string {
  const entries = rows
      .map((r: any) => {
        const entry: { originator: string; ua_contains: string[]; skip_engine_fingerprint?: boolean } = {
          originator: r.originator.trim(),
          ua_contains: r.uaContains
              .split(",")
              .map((s: string) => s.trim())
              .filter((s: string) => s.length > 0),
        }
        if (r.skipEngineFingerprint) entry.skip_engine_fingerprint = true
        return entry
      })
      .filter((e) => e.originator !== "" || e.ua_contains.length > 0)
  return entries.length > 0 ? JSON.stringify(entries) : ""
}


// ── Quota notify email ────────────────────────────────────────────────────────

defineExpose({
  tablePageSizeOptionsInput,
  registrationEmailSuffixWhitelistTags,
  registrationEmailSuffixWhitelistDraft,
  clientIPTrustedProxiesText,
  normalizeHumanVerificationProvider,
  formatTablePageSizeOptions,
  parseTablePageSizeOptionsInput,
  parseClientIPTrustedProxies,
  codexBlacklistRows,
  codexWhitelistRows,
  codexFingerprintRows,
  parseCodexEntriesToRows,
  serializeCodexRowsToJSON,
  tablePageSizeMin,
  tablePageSizeMax,
  tablePageSizeDefault,
  normalizeLoginAgreementDocumentsForSave,
  findDuplicateLoginAgreementDocumentId,
  syncWeChatConnectMode,
})
</script>

