<template>
  <AppLayout>
    <div class="mx-auto max-w-6xl space-y-6">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div
            class="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-600"
        ></div>
      </div>

      <!-- Settings Form -->
      <form v-else @submit.prevent="saveSettings" class="space-y-6" novalidate>
        <!-- Tab Navigation -->
        <div class="settings-tabs-shell">
          <nav
              class="settings-tabs-scroll"
              role="tablist"
              :aria-label="t('admin.settings.title')"
          >
            <div class="settings-tabs">
              <button
                  v-for="tab in settingsTabs"
                  :key="tab.key"
                  :id="`settings-tab-${tab.key}`"
                  type="button"
                  role="tab"
                  :aria-selected="activeTab === tab.key"
                  :tabindex="activeTab === tab.key ? 0 : -1"
                  :class="[
                  'settings-tab',
                  activeTab === tab.key && 'settings-tab-active',
                ]"
                  @click="selectSettingsTab(tab.key)"
                  @keydown="handleSettingsTabKeydown($event, tab.key)"
              >
                <span class="settings-tab-icon">
                  <Icon :name="tab.icon" size="sm"/>
                </span>
                <span class="settings-tab-label">{{
                    t(`admin.settings.tabs.${tab.key}`)
                  }}</span>
              </button>
            </div>
          </nav>
        </div>

        <SettingsSecurityTab v-show="activeTab === 'security'" ref="securityTabRef" :form="form" :saving="saving" :load-failed="loadFailed" />



        <SettingsUsersTab v-show="activeTab === 'users'" ref="usersTabRef" :form="form" :saving="saving" :load-failed="loadFailed" />

        <SettingsGatewayTab v-show="activeTab === 'gateway'" ref="gatewayTabRef" :form="form" :saving="saving" :load-failed="loadFailed" />

        <SettingsPerformanceTab v-show="activeTab === 'performance'" :form="form" :saving="saving" :load-failed="loadFailed" />

        <SettingsGeneralTab v-show="activeTab === 'general'" ref="generalTabRef" :form="form" :saving="saving" :load-failed="loadFailed" />

        <SettingsAgreementTab v-show="activeTab === 'agreement'" :form="form" :saving="saving" :load-failed="loadFailed" />

        <SettingsFeaturesTab v-show="activeTab === 'features'" :form="form" :saving="saving" :load-failed="loadFailed" />

        <!-- Tab: Email -->
        <SettingsPaymentTab v-show="activeTab === 'payment'" :form="form" :saving="saving" :load-failed="loadFailed" />
        <SettingsEmailTab v-show="activeTab === 'email'" ref="emailTabRef" :form="form" :saving="saving" :load-failed="loadFailed" />

        <SettingsBackupTab v-show="activeTab === 'backup'" :form="form" :saving="saving" @reload="loadSettings" />

        <!-- Save Button -->
        <div v-show="activeTab !== 'backup'" class="flex justify-end">
          <button
              type="submit"
              :disabled="saving || loadFailed"
              class="btn btn-primary"
          >
            <svg
                v-if="saving"
                class="h-4 w-4 animate-spin"
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
              saving
                  ? t("admin.settings.saving")
                  : t("admin.settings.saveSettings")
            }}
          </button>
        </div>
      </form>

      <!-- 关闭 step-up 开关等敏感保存操作触发的 TOTP 二次验证 -->
      <TotpStepUpDialog :controller="settingsStepUp"/>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import {ref, reactive, computed, onMounted, watch} from "vue";
import SettingsSecurityTab from './tabs/SettingsSecurityTab.vue'
import SettingsGatewayTab from './tabs/SettingsGatewayTab.vue'
import SettingsUsersTab from './tabs/SettingsUsersTab.vue'
import SettingsPerformanceTab from './tabs/SettingsPerformanceTab.vue'
import SettingsGeneralTab from './tabs/SettingsGeneralTab.vue'
import SettingsAgreementTab from './tabs/SettingsAgreementTab.vue'
import SettingsFeaturesTab from './tabs/SettingsFeaturesTab.vue'
import SettingsPaymentTab from './tabs/SettingsPaymentTab.vue'
import SettingsEmailTab from './tabs/SettingsEmailTab.vue'
import SettingsBackupTab from './tabs/SettingsBackupTab.vue'
import {useI18n} from "vue-i18n";
import {
  appendAuthSourceDefaultsToUpdateRequest,
  buildAuthSourceDefaultsState,
  normalizePlatformQuotasMap,
  sanitizePlatformQuotasMap,
  defaultWeChatConnectScopesForMode,
  deriveWeChatConnectStoredMode,
  normalizeDefaultSubscriptionSettings,
  resolveWeChatConnectModeCapabilities,
} from "@/features/admin-settings/presentation/utils/adminSettingsUtils";
import {
  SystemSettings,
} from "@/features/admin-settings/domain/models/adminSettings";
import AppLayout from "@/common/widgets/layout/AppLayout.vue";
import Icon from "@/common/widgets/icons/Icon.vue";
import {
  useStepUp,
  isStepUpCancelled,
  isStepUpBlocked,
  stepUpBlockReason,
} from "@/common/composables/useStepUp";
import TotpStepUpDialog from "@/features/auth/presentation/widgets/TotpStepUpDialog.vue";
import {extractApiErrorMessage} from "@/core/utils/apiError";
import {useAppStore} from "@/core/stores/appStore";
import {useAdminSettingsStore} from "@/features/admin-settings/presentation/stores/adminSettingsStore";
import {
  normalizeRegistrationEmailSuffixDomains,
} from "@/core/utils/registrationEmailPolicy";
import {
  parseFingerprintSignalsToRows,
  serializeFingerprintRowsToJSON,
  defaultFingerprintSignalRows,
} from "@/features/admin-accounts/presentation/utils/codexFingerprintSignals";
import {useAdminSettings} from '@/features/admin-settings/presentation/composables/useAdminSettings'
import type {DefaultSubscriptionSetting} from "@/features/admin-settings/domain/models/defaultSubscriptionSetting";
import type {UpdateSettingsRequest} from "@/features/admin-settings/data/requests_models/updateSettingsRequest";
import type {OpenAIFastPolicyRule} from "@/features/admin-settings/domain/models/openAIFastPolicyRule";
import type {LoginAgreementDocument} from "@/core/models/domain/loginAgreementDocument";
import type {NotifyEmailEntry} from "@/core/models/domain/notifyEmailEntry";
import type {
  DefaultPlatformQuotasMap,
} from "@/features/admin-settings/domain/models/adminSettings";

const $settings = useAdminSettings()

// SystemSettings 是强类型 class；某些 util 期望 Record<string, unknown> 以做动态键索引。
// 通过 Object.entries 转换绕开 TS 对 class 到 index-signature 的兼容性检查（不使用 as 断言）。
function toRecord(obj: object): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj))
}

// normalizeDefaultSubscriptionSettings 期望 snake_case 数组（后端载荷格式）；
// 前端 domain Entity 使用 camelCase，此处显式做键名转换。
function toSubscriptionRequestList(
    list: DefaultSubscriptionSetting[] | null | undefined,
): Array<{ group_id: number; validity_days: number }> {
  if (!Array.isArray(list)) return []
  return list.map((item) => ({group_id: item.groupId, validity_days: item.validityDays}))
}

const {t, locale} = useI18n();
const appStore = useAppStore();
// 关闭 step-up 开关是敏感操作：后端返回 STEP_UP_REQUIRED 时弹 TOTP 码重试
const settingsStepUp = useStepUp();
const adminSettingsStore = useAdminSettingsStore();
const isZhLocale = computed(() => locale.value.startsWith("zh"));

function localText(zh: string, en: string): string {
  return isZhLocale.value ? zh : en;
}



type SettingsTab =
    | "general"
    | "agreement"
    | "features"
    | "security"
    | "users"
    | "gateway"
    | "performance"
    | "payment"
    | "email"
    | "backup";
const activeTab = ref<SettingsTab>("general");
const settingsTabs = [
  {key: "general" as SettingsTab, icon: "home" as const},
  {key: "agreement" as SettingsTab, icon: "document" as const},
  {key: "features" as SettingsTab, icon: "bolt" as const},
  {key: "security" as SettingsTab, icon: "shield" as const},
  {key: "users" as SettingsTab, icon: "user" as const},
  {key: "gateway" as SettingsTab, icon: "server" as const},
  {key: "performance" as SettingsTab, icon: "bolt" as const},
  {key: "payment" as SettingsTab, icon: "creditCard" as const},
  {key: "email" as SettingsTab, icon: "mail" as const},
  {key: "backup" as SettingsTab, icon: "database" as const},
];

const settingsTabKeyboardActions = {
  ArrowLeft: -1,
  ArrowUp: -1,
  ArrowRight: 1,
  ArrowDown: 1,
  Home: "first",
  End: "last",
} as const;

function selectSettingsTab(tab: SettingsTab): void {
  activeTab.value = tab;
}

function focusSettingsTab(tab: SettingsTab): void {
  window.requestAnimationFrame(() => {
    document.getElementById(`settings-tab-${tab}`)?.focus();
  });
}

function handleSettingsTabKeydown(event: KeyboardEvent, tab: SettingsTab): void {
  const action =
      settingsTabKeyboardActions[
          event.key as keyof typeof settingsTabKeyboardActions
          ];
  if (action === undefined) {
    return;
  }

  event.preventDefault();
  const currentIndex = settingsTabs.findIndex((item) => item.key === tab);
  let nextIndex = currentIndex < 0 ? 0 : currentIndex;

  if (action === "first") {
    nextIndex = 0;
  } else if (action === "last") {
    nextIndex = settingsTabs.length - 1;
  } else {
    nextIndex =
        (nextIndex + action + settingsTabs.length) % settingsTabs.length;
  }

  const nextTab = settingsTabs[nextIndex]?.key;
  if (!nextTab) {
    return;
  }

  selectSettingsTab(nextTab);
  focusSettingsTab(nextTab);
}


// Tab component refs
const generalTabRef = ref<InstanceType<typeof SettingsGeneralTab> | null>(null)
const gatewayTabRef = ref<InstanceType<typeof SettingsGatewayTab> | null>(null)
const usersTabRef = ref<InstanceType<typeof SettingsUsersTab> | null>(null)
const emailTabRef = ref<InstanceType<typeof SettingsEmailTab> | null>(null)

const loading = ref(true);
const loadFailed = ref(false);
const saving = ref(false);
// SettingsForm 沿用旧结构，SystemSettings 主字段为 required；表单在 reactive() 初始化时
// 只预填 snake_case 兼容键（saveSettings 直接透传），camelCase 字段在 loadSettings 中通过
// Object.assign(form, settings) 补齐。为了跳过 reactive() 初始 literal 的 excess-property 与
// missing-required 检查，通过 buildInitialSettingsForm() 工厂函数以 Partial 层构造然后收窄。
type SettingsForm = Omit<
    SystemSettings,
    | "wechat_connect_open_enabled"
    | "wechat_connect_mp_enabled"
    | "wechat_connect_mobile_enabled"
> & {
  smtp_password: string;
  turnstile_secret_key: string;
  recaptcha_secret_key: string;
  cap_secret_key: string;
  linuxdo_connect_client_secret: string;
  dingtalk_connect_client_secret: string;
  wechat_connect_app_secret: string;
  wechat_connect_open_app_secret: string;
  wechat_connect_mp_app_secret: string;
  wechat_connect_mobile_app_secret: string;
  wechat_connect_open_enabled: boolean;
  wechat_connect_mp_enabled: boolean;
  wechat_connect_mobile_enabled: boolean;
  oidc_connect_client_secret: string;
  github_oauth_client_secret: string;
  google_oauth_client_secret: string;
  force_email_on_third_party_signup: boolean;
  openai_low_upstream_rate_priority_enabled: boolean;
  openai_oauth_scheduling_rate_multiplier: number;
  openai_advanced_scheduler_enabled: boolean;
  openai_advanced_scheduler_sticky_weighted_enabled: boolean;
  openai_advanced_scheduler_subscription_priority_enabled: boolean;
  openai_advanced_scheduler_lb_top_k: string;
  openai_advanced_scheduler_weight_priority: string;
  openai_advanced_scheduler_weight_load: string;
  openai_advanced_scheduler_weight_queue: string;
  openai_advanced_scheduler_weight_error_rate: string;
  openai_advanced_scheduler_weight_ttft: string;
  openai_advanced_scheduler_weight_reset: string;
  openai_advanced_scheduler_weight_quota_headroom: string;
  openai_advanced_scheduler_weight_upstream_cost: string;
  openai_advanced_scheduler_weight_previous_response: string;
  openai_advanced_scheduler_weight_session_sticky: string;
  scheduler_v2_enabled: boolean;
  scheduler_v2_status: string;
  scheduler_v2_error: string;
  scheduler_v2_candidate_limit: number;
  scheduler_v2_scan_limit: number;
  // 系统全局平台限额 map；form 内始终归一化为全 4 平台对象（模板非空绑定依赖此不变量）
  default_platform_quotas: DefaultPlatformQuotasMap;
  // 以下 snake_case 字段是历史后端载荷键，saveSettings 直接透传；表单同时携带 camelCase
  // （SystemSettings 主字段）与 snake_case 版本以覆盖模板与 saveSettings 两种消费方式。
  password_reset_enabled: boolean;
  totp_enabled: boolean;
  totp_encryption_key_configured: boolean;
  session_binding_enabled: boolean;
  step_up_enabled: boolean;
  audit_log_retention_days: number;
  login_agreement_enabled: boolean;
  login_agreement_mode: string;
  login_agreement_updated_at: string;
  login_agreement_documents: LoginAgreementDocument[];
  default_balance: number;
  affiliate_rebate_rate: number;
  affiliate_rebate_freeze_hours: number;
  affiliate_rebate_duration_days: number;
  affiliate_rebate_per_invitee_cap: number;
  affiliate_admin_recharge_enabled: boolean;
  default_concurrency: number;
  default_subscriptions: DefaultSubscriptionSetting[];
  default_user_rpm_limit: number;
  site_name: string;
  site_logo: string;
  site_subtitle: string;
  api_base_url: string;
  contact_info: string;
  doc_url: string;
  home_content: string;
  backend_mode_enabled: boolean;
  hide_ccs_import_button: boolean;
  payment_enabled: boolean;
  risk_control_enabled: boolean;
  cyber_session_block_enabled: boolean;
  cyber_session_block_ttl_seconds: number;
  payment_min_amount: number;
  payment_max_amount: number;
  payment_daily_limit: number;
  payment_max_pending_orders: number;
  payment_order_timeout_minutes: number;
  payment_balance_disabled: boolean;
  payment_balance_recharge_multiplier: number;
  payment_subscription_usd_to_cny_rate: number;
  payment_recharge_fee_rate: number;
  payment_enabled_types: string[];
  payment_help_image_url: string;
  payment_help_text: string;
  payment_product_name_prefix: string;
  payment_product_name_suffix: string;
  payment_load_balance_strategy: string;
  payment_cancel_rate_limit_enabled: boolean;
  payment_cancel_rate_limit_max: number;
  payment_cancel_rate_limit_window: number;
  payment_cancel_rate_limit_unit: string;
  payment_cancel_rate_limit_window_mode: string;
  payment_alipay_force_qrcode: boolean;
  table_default_page_size: number;
  table_page_size_options: number[];
  custom_menu_items: Array<{
    id: string;
    label: string;
    iconSvg: string;
    url: string;
    visibility: "user" | "admin";
    sortOrder: number
  }>;
  custom_endpoints: Array<{ name: string; endpoint: string; description: string }>;
  frontend_url: string;
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password_configured: boolean;
  smtp_from_email: string;
  smtp_from_name: string;
  smtp_use_tls: boolean;
  turnstile_enabled: boolean;
  turnstile_site_key: string;
  turnstile_secret_key_configured: boolean;
  recaptcha_enabled: boolean;
  recaptcha_site_key: string;
  recaptcha_secret_key_configured: boolean;
  cap_enabled: boolean;
  cap_api_endpoint: string;
  cap_secret_key_configured: boolean;
  local_captcha_enabled: boolean;
  api_key_acl_trust_forwarded_ip: boolean;
  client_ip_resolution_mode: string;
  client_ip_trusted_proxies: string[];
  client_ip_resolution_status: {
    mode: string;
    custom_prefix_count: number;
    static_prefix_count: number;
    cloudflare_prefix_count: number;
    cloudflare_ranges_source: string;
    cloudflare_last_success_at: string | null;
  };
  linuxdo_connect_enabled: boolean;
  linuxdo_connect_client_id: string;
  linuxdo_connect_client_secret_configured: boolean;
  linuxdo_connect_redirect_url: string;
  dingtalk_connect_enabled: boolean;
  dingtalk_connect_client_id: string;
  dingtalk_connect_client_secret_configured: boolean;
  dingtalk_connect_redirect_url: string;
  dingtalk_connect_corp_restriction_policy: string;
  dingtalk_connect_internal_corp_id: string;
  dingtalk_connect_bypass_registration: boolean;
  dingtalk_connect_sync_corp_email: boolean;
  dingtalk_connect_sync_display_name: boolean;
  dingtalk_connect_sync_dept: boolean;
  dingtalk_connect_sync_corp_email_attr_key: string;
  dingtalk_connect_sync_display_name_attr_key: string;
  dingtalk_connect_sync_dept_attr_key: string;
  dingtalk_connect_sync_corp_email_attr_name: string;
  dingtalk_connect_sync_display_name_attr_name: string;
  dingtalk_connect_sync_dept_attr_name: string;
  wechat_connect_enabled: boolean;
  wechat_connect_app_id: string;
  wechat_connect_app_secret_configured: boolean;
  wechat_connect_open_app_id: string;
  wechat_connect_open_app_secret_configured: boolean;
  wechat_connect_mp_app_id: string;
  wechat_connect_mp_app_secret_configured: boolean;
  wechat_connect_mobile_app_id: string;
  wechat_connect_mobile_app_secret_configured: boolean;
  wechat_connect_mode: string;
  wechat_connect_scopes: string;
  wechat_connect_redirect_url: string;
  wechat_connect_frontend_redirect_url: string;
  oidc_connect_enabled: boolean;
  oidc_connect_provider_name: string;
  oidc_connect_client_id: string;
  oidc_connect_client_secret_configured: boolean;
  oidc_connect_issuer_url: string;
  oidc_connect_discovery_url: string;
  oidc_connect_authorize_url: string;
  oidc_connect_token_url: string;
  oidc_connect_userinfo_url: string;
  oidc_connect_jwks_url: string;
  oidc_connect_scopes: string;
  oidc_connect_redirect_url: string;
  oidc_connect_frontend_redirect_url: string;
  oidc_connect_token_auth_method: string;
  oidc_connect_use_pkce: boolean;
  oidc_connect_validate_id_token: boolean;
  oidc_connect_allowed_signing_algs: string;
  oidc_connect_clock_skew_seconds: number;
  oidc_connect_require_email_verified: boolean;
  oidc_connect_userinfo_email_path: string;
  oidc_connect_userinfo_id_path: string;
  oidc_connect_userinfo_username_path: string;
  github_oauth_enabled: boolean;
  github_oauth_client_id: string;
  github_oauth_client_secret_configured: boolean;
  github_oauth_redirect_url: string;
  github_oauth_frontend_redirect_url: string;
  google_oauth_enabled: boolean;
  google_oauth_client_id: string;
  google_oauth_client_secret_configured: boolean;
  google_oauth_redirect_url: string;
  google_oauth_frontend_redirect_url: string;
  enable_model_fallback: boolean;
  fallback_model_anthropic: string;
  fallback_model_openai: string;
  fallback_model_gemini: string;
  fallback_model_antigravity: string;
  enable_identity_patch: boolean;
  identity_patch_prompt: string;
  ops_monitoring_enabled: boolean;
  ops_realtime_monitoring_enabled: boolean;
  ops_query_mode_default: string;
  ops_metrics_interval_seconds: number;
  min_claude_code_version: string;
  max_claude_code_version: string;
  allow_ungrouped_key_scheduling: boolean;
  stream_mode_performance_enabled: boolean;
  enable_fingerprint_unification: boolean;
  enable_metadata_passthrough: boolean;
  enable_cch_signing: boolean;
  enable_claude_oauth_system_prompt_injection: boolean;
  claude_oauth_system_prompt: string;
  claude_oauth_system_prompt_blocks: string;
  enable_anthropic_cache_ttl_1h_injection: boolean;
  rewrite_message_cache_control: boolean;
  enable_client_dateline_normalization: boolean;
  antigravity_user_agent_version: string;
  openai_codex_user_agent: string;
  min_codex_version: string;
  max_codex_version: string;
  codex_cli_only_blacklist: string;
  codex_cli_only_whitelist: string;
  codex_cli_only_allow_app_server_clients: boolean;
  codex_cli_only_engine_fingerprint_signals: string;
  balance_low_notify_enabled: boolean;
  balance_low_notify_threshold: number;
  balance_low_notify_recharge_url: string;
  subscription_expiry_notify_enabled: boolean;
  account_quota_notify_enabled: boolean;
  account_quota_notify_emails: NotifyEmailEntry[];
  channel_monitor_enabled: boolean;
  channel_monitor_default_interval_seconds: number;
  available_channels_enabled: boolean;
  affiliate_enabled: boolean;
  allow_user_view_error_requests: boolean;
  allow_user_view_usage_details: boolean;
};



// 表单初始值同时携带 camelCase（SystemSettings 主字段，用于模板 v-model 强类型）与
// snake_case（历史后端载荷键，saveSettings 直接透传）。基础 shape 用 new SystemSettings()
// 提供已声明字段的强类型（对应 !: 定义），并叠加显式 camelCase 默认与 snake_case 兼容键。
// loadSettings 中的 Object.assign(form, settings) 会用后端载荷覆盖运行时值。
// 不显式标注 initialFormOverrides 的类型，让 TS 从 literal 推断具体 shape（用于合并后满足
// SettingsForm 的 snake_case required 属性）。
const initialFormOverrides = ({
  registrationEnabled: true,
  emailVerifyEnabled: false,
  registrationEmailSuffixWhitelist: [],
  promoCodeEnabled: true,
  invitationCodeEnabled: false,
  password_reset_enabled: false,
  totp_enabled: false,
  totp_encryption_key_configured: false,
  session_binding_enabled: false,
  step_up_enabled: false,
  audit_log_retention_days: 180,
  login_agreement_enabled: false,
  login_agreement_mode: "modal",
  login_agreement_updated_at: "2026-03-31",
  login_agreement_documents: [{id:"",title:"",contentMd:""}],
  default_balance: 0,
  default_platform_quotas: normalizePlatformQuotasMap() as DefaultPlatformQuotasMap,
  affiliate_rebate_rate: 20,
  affiliate_rebate_freeze_hours: 0,
  affiliate_rebate_duration_days: 0,
  affiliate_rebate_per_invitee_cap: 0,
  affiliate_admin_recharge_enabled: false,
  default_concurrency: 1,
  default_subscriptions: [],
  force_email_on_third_party_signup: false,
  default_user_rpm_limit: 0,
  site_name: "Sub2API",
  site_logo: "",
  site_subtitle: "Subscription to API Conversion Platform",
  api_base_url: "",
  contact_info: "",
  doc_url: "",
  home_content: "",
  backend_mode_enabled: false,
  hide_ccs_import_button: false,
  payment_enabled: false,
  risk_control_enabled: false,
  cyber_session_block_enabled: false,
  cyber_session_block_ttl_seconds: 3600,
  payment_min_amount: 1,
  payment_max_amount: 10000,
  payment_daily_limit: 50000,
  payment_max_pending_orders: 3,
  payment_order_timeout_minutes: 30,
  payment_balance_disabled: false,
  payment_balance_recharge_multiplier: 1,
  payment_subscription_usd_to_cny_rate: 0,
  payment_recharge_fee_rate: 0,
  payment_enabled_types: [],
  payment_help_image_url: "",
  payment_help_text: "",
  payment_product_name_prefix: "",
  payment_product_name_suffix: "",
  payment_load_balance_strategy: "round-robin",
  payment_cancel_rate_limit_enabled: false,
  payment_cancel_rate_limit_max: 10,
  payment_cancel_rate_limit_window: 1,
  payment_cancel_rate_limit_unit: "day",
  payment_cancel_rate_limit_window_mode: "rolling",
  payment_alipay_force_qrcode: false,
  table_default_page_size: 20,
  table_page_size_options: [10, 20, 50, 100],
  custom_menu_items: [] as Array<{
    id: string;
    label: string;
    iconSvg: string;
    url: string;
    visibility: "user" | "admin";
    sortOrder: number;
  }>,
  custom_endpoints: [] as Array<{
    name: string;
    endpoint: string;
    description: string;
  }>,
  frontend_url: "",
  smtp_host: "",
  smtp_port: 587,
  smtp_username: "",
  smtp_password: "",
  smtp_password_configured: false,
  smtp_from_email: "",
  smtp_from_name: "",
  smtp_use_tls: true,
  // Human verification
  turnstile_enabled: false,
  turnstile_site_key: "",
  turnstile_secret_key: "",
  turnstile_secret_key_configured: false,
  recaptcha_enabled: false,
  recaptcha_site_key: "",
  recaptcha_secret_key: "",
  recaptcha_secret_key_configured: false,
  cap_enabled: false,
  cap_api_endpoint: "",
  cap_secret_key: "",
  cap_secret_key_configured: false,
  local_captcha_enabled: false,
  api_key_acl_trust_forwarded_ip: true,
  client_ip_resolution_mode: "auto_compat",
  client_ip_trusted_proxies: [],
  client_ip_resolution_status: {
    mode: "auto_compat",
    custom_prefix_count: 0,
    static_prefix_count: 0,
    cloudflare_prefix_count: 0,
    cloudflare_ranges_source: "embedded",
    cloudflare_last_success_at: null,
  },
  // LinuxDo Connect OAuth 登录
  linuxdo_connect_enabled: false,
  linuxdo_connect_client_id: "",
  linuxdo_connect_client_secret: "",
  linuxdo_connect_client_secret_configured: false,
  linuxdo_connect_redirect_url: "",
  // DingTalk Connect OAuth 登录
  dingtalk_connect_enabled: false,
  dingtalk_connect_client_id: "",
  dingtalk_connect_client_secret: "",
  dingtalk_connect_client_secret_configured: false,
  dingtalk_connect_redirect_url: "",
  dingtalk_connect_corp_restriction_policy: "none",
  dingtalk_connect_internal_corp_id: "",
  dingtalk_connect_bypass_registration: false,
  dingtalk_connect_sync_corp_email: false,
  dingtalk_connect_sync_display_name: false,
  dingtalk_connect_sync_dept: false,
  dingtalk_connect_sync_corp_email_attr_key: "dingtalk_email",
  dingtalk_connect_sync_display_name_attr_key: "dingtalk_name",
  dingtalk_connect_sync_dept_attr_key: "dingtalk_department",
  dingtalk_connect_sync_corp_email_attr_name: localText("钉钉企业邮箱", "DingTalk Corporate Email"),
  dingtalk_connect_sync_display_name_attr_name: localText("钉钉姓名", "DingTalk Name"),
  dingtalk_connect_sync_dept_attr_name: localText("钉钉部门", "DingTalk Department"),
  wechat_connect_enabled: false,
  wechat_connect_app_id: "",
  wechat_connect_app_secret: "",
  wechat_connect_app_secret_configured: false,
  wechat_connect_open_app_id: "",
  wechat_connect_open_app_secret: "",
  wechat_connect_open_app_secret_configured: false,
  wechat_connect_mp_app_id: "",
  wechat_connect_mp_app_secret: "",
  wechat_connect_mp_app_secret_configured: false,
  wechat_connect_mobile_app_id: "",
  wechat_connect_mobile_app_secret: "",
  wechat_connect_mobile_app_secret_configured: false,
  wechat_connect_open_enabled: false,
  wechat_connect_mp_enabled: false,
  wechat_connect_mobile_enabled: false,
  wechat_connect_mode: "open",
  wechat_connect_scopes: "snsapi_login",
  wechat_connect_redirect_url: "",
  wechat_connect_frontend_redirect_url: "/auth/wechat/callback",
  // Generic OIDC OAuth 登录
  oidc_connect_enabled: false,
  oidc_connect_provider_name: "OIDC",
  oidc_connect_client_id: "",
  oidc_connect_client_secret: "",
  oidc_connect_client_secret_configured: false,
  oidc_connect_issuer_url: "",
  oidc_connect_discovery_url: "",
  oidc_connect_authorize_url: "",
  oidc_connect_token_url: "",
  oidc_connect_userinfo_url: "",
  oidc_connect_jwks_url: "",
  oidc_connect_scopes: "openid email profile",
  oidc_connect_redirect_url: "",
  oidc_connect_frontend_redirect_url: "/auth/oidc/callback",
  oidc_connect_token_auth_method: "client_secret_post",
  oidc_connect_use_pkce: false,
  oidc_connect_validate_id_token: false,
  oidc_connect_allowed_signing_algs: "RS256,ES256,PS256",
  oidc_connect_clock_skew_seconds: 120,
  oidc_connect_require_email_verified: false,
  oidc_connect_userinfo_email_path: "",
  oidc_connect_userinfo_id_path: "",
  oidc_connect_userinfo_username_path: "",
  // GitHub / Google 邮箱快捷登录
  github_oauth_enabled: false,
  github_oauth_client_id: "",
  github_oauth_client_secret: "",
  github_oauth_client_secret_configured: false,
  github_oauth_redirect_url: "",
  github_oauth_frontend_redirect_url: "/auth/oauth/callback",
  google_oauth_enabled: false,
  google_oauth_client_id: "",
  google_oauth_client_secret: "",
  google_oauth_client_secret_configured: false,
  google_oauth_redirect_url: "",
  google_oauth_frontend_redirect_url: "/auth/oauth/callback",
  // Model fallback
  enable_model_fallback: false,
  fallback_model_anthropic: "claude-3-5-sonnet-20241022",
  fallback_model_openai: "gpt-4o",
  fallback_model_gemini: "gemini-2.5-pro",
  fallback_model_antigravity: "gemini-2.5-pro",
  // Identity patch (Claude -> Gemini)
  enable_identity_patch: true,
  identity_patch_prompt: "",
  // Ops monitoring (vNext)
  ops_monitoring_enabled: true,
  ops_realtime_monitoring_enabled: true,
  ops_query_mode_default: "auto",
  ops_metrics_interval_seconds: 60,
  // Claude Code version check
  min_claude_code_version: "",
  max_claude_code_version: "",
  // 分组隔离
  allow_ungrouped_key_scheduling: false,
  openai_low_upstream_rate_priority_enabled: false,
  openai_oauth_scheduling_rate_multiplier: 1,
  scheduler_v2_enabled: false,
  scheduler_v2_status: "disabled",
  scheduler_v2_error: "",
  scheduler_v2_candidate_limit: 64,
  scheduler_v2_scan_limit: 256,
  openai_advanced_scheduler_enabled: false,
  openai_advanced_scheduler_sticky_weighted_enabled: false,
  openai_advanced_scheduler_subscription_priority_enabled: false,
  openai_advanced_scheduler_lb_top_k: "",
  openai_advanced_scheduler_weight_priority: "",
  openai_advanced_scheduler_weight_load: "",
  openai_advanced_scheduler_weight_queue: "",
  openai_advanced_scheduler_weight_error_rate: "",
  openai_advanced_scheduler_weight_ttft: "",
  openai_advanced_scheduler_weight_reset: "",
  openai_advanced_scheduler_weight_quota_headroom: "",
  openai_advanced_scheduler_weight_upstream_cost: "",
  openai_advanced_scheduler_weight_previous_response: "",
  openai_advanced_scheduler_weight_session_sticky: "",
  stream_mode_performance_enabled: false,
  // Gateway forwarding behavior
  enable_fingerprint_unification: true,
  enable_metadata_passthrough: false,
  enable_cch_signing: false,
  enable_claude_oauth_system_prompt_injection: true,
  claude_oauth_system_prompt: "",
  claude_oauth_system_prompt_blocks: "",
  enable_anthropic_cache_ttl_1h_injection: false,
  rewrite_message_cache_control: false,
  enable_client_dateline_normalization: true,
  antigravity_user_agent_version: "",
  openai_codex_user_agent: "",
  // codex_cli_only 加固
  min_codex_version: "",
  max_codex_version: "",
  codex_cli_only_blacklist: "",
  codex_cli_only_whitelist: "",
  codex_cli_only_allow_app_server_clients: false,
  codex_cli_only_engine_fingerprint_signals: "",
  // 余额、订阅到期与账号限额通知
  balance_low_notify_enabled: false,
  balance_low_notify_threshold: 0,
  balance_low_notify_recharge_url: "",
  subscription_expiry_notify_enabled: true,
  account_quota_notify_enabled: false,
  account_quota_notify_emails: [] as NotifyEmailEntry[],
  // Channel Monitor feature switch
  channel_monitor_enabled: true,
  channel_monitor_default_interval_seconds: 60,
  // Available Channels feature switch
  available_channels_enabled: false,
  // Affiliate (邀请返利) feature switch
  affiliate_enabled: false,
  // Allow user view error requests
  allow_user_view_error_requests: false,
  // Allow user view usage details
  allow_user_view_usage_details: false,
});
// SystemSettings class 的 `!:` 声明使得 TS 认为字段已被初始化。运行时字段值由 loadSettings
// 通过 Object.assign(form, settings) 补齐；此处仅提供 shape 满足 TS 的 required 约束。
const form = reactive<SettingsForm>(Object.assign(new SystemSettings(), initialFormOverrides));



async function loadSettings() {
  loading.value = true;
  loadFailed.value = false;
  try {
    const settings = await $settings.getSettings();
    settings.paymentLoadBalanceStrategy =
        settings.paymentLoadBalanceStrategy || "round-robin";
    // Only assign non-null values from backend (null means unconfigured, keep defaults)
    for (const [key, value] of Object.entries(settings)) {
      if (value !== null && value !== undefined) {
        (form as Record<string, unknown>)[key] = value;
      }
    }

    // Delegate to generalTabRef for local state sync
    if (generalTabRef.value) {
      generalTabRef.value.normalizeHumanVerificationProvider()
      generalTabRef.value.clientIPTrustedProxiesText = (settings.clientIpTrustedProxies || []).join('\n')
      generalTabRef.value.registrationEmailSuffixWhitelistTags =
          normalizeRegistrationEmailSuffixDomains(settings.registrationEmailSuffixWhitelist)
      generalTabRef.value.tablePageSizeOptionsInput = generalTabRef.value.formatTablePageSizeOptions(
          Array.isArray(settings.tablePageSizeOptions) ? settings.tablePageSizeOptions : [10, 20, 50, 100],
      )
      generalTabRef.value.registrationEmailSuffixWhitelistDraft = ''
      generalTabRef.value.codexBlacklistRows = generalTabRef.value.parseCodexEntriesToRows(form.codexCliOnlyBlacklist)
      generalTabRef.value.codexWhitelistRows = generalTabRef.value.parseCodexEntriesToRows(form.codexCliOnlyWhitelist)
      generalTabRef.value.codexFingerprintRows = form.codexCliOnlyEngineFingerprintSignals
          ? parseFingerprintSignalsToRows(form.codexCliOnlyEngineFingerprintSignals)
          : defaultFingerprintSignalRows()
    }
    if (gatewayTabRef.value) {
      if (!form.claudeOauthSystemPromptBlocks?.trim()) {
        gatewayTabRef.value.resetClaudeOAuthSystemPromptBlocks()
      } else {
        gatewayTabRef.value.claudeOAuthSystemPromptBlocks = gatewayTabRef.value.claudeOAuthSystemPromptBlocks
        gatewayTabRef.value.syncClaudeOAuthSystemPromptBlocksFormField()
      }
      if (settings.openaiAdvancedFastPolicySettings &&
          Array.isArray(settings.openaiAdvancedFastPolicySettings.rules)) {
        gatewayTabRef.value.openaiFastPolicyForm.rules =
            settings.openaiAdvancedFastPolicySettings.rules.map((rule: any) => ({
              ...rule,
              userIds: rule.userIds ? [...rule.userIds] : [],
              modelWhitelist: rule.modelWhitelist ? [...rule.modelWhitelist] : [],
            }))
        gatewayTabRef.value.openaiFastPolicyLoaded = true
      }
      await gatewayTabRef.value.loadWebSearchConfig()
    }
    if (usersTabRef.value) {
      Object.assign(usersTabRef.value.authSourceDefaults, buildAuthSourceDefaultsState(toRecord(settings)))
    }
    if (emailTabRef.value) {
      emailTabRef.value.smtpPasswordManuallyEdited = false
    }
    form.loginAgreementMode =
        settings.loginAgreementMode === "checkbox" ? "checkbox" : "modal";
    form.loginAgreementUpdatedAt =
        settings.loginAgreementUpdatedAt || "2026-03-31";
    form.loginAgreementDocuments =
        Array.isArray(settings.loginAgreementDocuments) &&
        settings.loginAgreementDocuments.length > 0
            ? settings.loginAgreementDocuments.map((doc: any) => ({
              id: doc.id || "",
              title: doc.title || "",
              contentMd: doc.contentMd || "",
            }))
            : [{id:"",title:"",contentMd:""}];
    form.default_platform_quotas = normalizePlatformQuotasMap(settings.defaultPlatformQuotas);
    form.backendModeEnabled = settings.backendModeEnabled;
    form.defaultSubscriptions = normalizeDefaultSubscriptionSettings(
        toSubscriptionRequestList(settings.defaultSubscriptions),
    );
    form.smtp_password = "";
    form.turnstile_secret_key = "";
    form.recaptcha_secret_key = "";
    form.cap_secret_key = "";
    form.linuxdo_connect_client_secret = "";
    form.dingtalk_connect_client_secret = "";
    form.github_oauth_client_secret = "";
    form.google_oauth_client_secret = "";
    form.wechat_connect_app_secret = "";
    form.wechat_connect_open_app_secret = "";
    form.wechat_connect_mp_app_secret = "";
    form.wechat_connect_mobile_app_secret = "";
    const wechatCapabilities = resolveWeChatConnectModeCapabilities(
        settings.wechatConnectOpenEnabled,
        settings.wechatConnectMpEnabled,
        settings.wechatConnectMobileEnabled,
        settings.wechatConnectMode,
    );
    form.wechat_connect_open_enabled = wechatCapabilities.openEnabled;
    form.wechat_connect_mp_enabled = wechatCapabilities.mpEnabled;
    form.wechat_connect_mobile_enabled = wechatCapabilities.mobileEnabled;
    form.wechatConnectMode = deriveWeChatConnectStoredMode(
        wechatCapabilities.openEnabled,
        wechatCapabilities.mpEnabled,
        wechatCapabilities.mobileEnabled,
        settings.wechatConnectMode,
    );
    const legacyWeChatAppID = String(settings.wechatConnectAppId || "").trim();
    const legacyWeChatSecretConfigured = Boolean(
        settings.wechatConnectAppSecretConfigured,
    );
    if (!form.wechatConnectOpenAppId && wechatCapabilities.openEnabled) {
      form.wechatConnectOpenAppId = legacyWeChatAppID;
    }
    if (!form.wechatConnectMpAppId && wechatCapabilities.mpEnabled) {
      form.wechatConnectMpAppId = legacyWeChatAppID;
    }
    if (!form.wechatConnectMobileAppId && wechatCapabilities.mobileEnabled) {
      form.wechatConnectMobileAppId = legacyWeChatAppID;
    }
    if (
        !form.wechatConnectOpenAppSecretConfigured &&
        wechatCapabilities.openEnabled
    ) {
      form.wechatConnectOpenAppSecretConfigured =
          legacyWeChatSecretConfigured;
    }
    if (
        !form.wechatConnectMpAppSecretConfigured &&
        wechatCapabilities.mpEnabled
    ) {
      form.wechatConnectMpAppSecretConfigured = legacyWeChatSecretConfigured;
    }
    if (
        !form.wechatConnectMobileAppSecretConfigured &&
        wechatCapabilities.mobileEnabled
    ) {
      form.wechatConnectMobileAppSecretConfigured =
          legacyWeChatSecretConfigured;
    }
    form.wechatConnectScopes = defaultWeChatConnectScopesForMode(
        form.wechatConnectMode,
    );
    form.oidc_connect_client_secret = "";
  } catch (error: unknown) {
    loadFailed.value = true;
    appStore.showError(
        extractApiErrorMessage(error, t("admin.settings.failedToLoad")),
    );
  } finally {
    loading.value = false;
  }
}


async function saveSettings() {
  saving.value = true;
  const g = generalTabRef.value
  const u = usersTabRef.value
  try {
    const tableMin = g?.tablePageSizeMin ?? 5
    const tableMax = g?.tablePageSizeMax ?? 1000
    const normalizedTableDefaultPageSize = Math.floor(Number(form.tableDefaultPageSize))
    if (!Number.isInteger(normalizedTableDefaultPageSize) || normalizedTableDefaultPageSize < tableMin || normalizedTableDefaultPageSize > tableMax) {
      appStore.showError(t("admin.settings.site.tableDefaultPageSizeRangeError", { min: tableMin, max: tableMax }))
      return
    }
    const normalizedTablePageSizeOptions = g
      ? g.parseTablePageSizeOptionsInput(g.tablePageSizeOptionsInput)
      : null
    if (!normalizedTablePageSizeOptions) {
      appStore.showError(t("admin.settings.site.tablePageSizeOptionsFormatError", { min: tableMin, max: tableMax }))
      return
    }
    form.tableDefaultPageSize = normalizedTableDefaultPageSize
    form.tablePageSizeOptions = normalizedTablePageSizeOptions

    const normalizedLoginAgreementDocuments = g
      ? g.normalizeLoginAgreementDocumentsForSave()
      : (form.loginAgreementDocuments as any[])
    if (form.loginAgreementEnabled && normalizedLoginAgreementDocuments.length === 0) {
      appStore.showError(localText("启用登录条款确认时，至少需要保留一份文档。", "At least one document is required when login agreement is enabled."))
      return
    }
    const emptyTitleDocument = normalizedLoginAgreementDocuments.find((doc: any) => !doc.title)
    if (emptyTitleDocument) {
      appStore.showError(localText("登录条款文档名称不能为空。", "Login agreement document title cannot be empty."))
      return
    }
    const duplicateLoginAgreementDocumentId = g
      ? g.findDuplicateLoginAgreementDocumentId(normalizedLoginAgreementDocuments)
      : null
    if (duplicateLoginAgreementDocumentId) {
      appStore.showError(localText(`登录条款文档路由不能重复：/legal/${duplicateLoginAgreementDocumentId}`, `Login agreement document routes cannot be duplicated: /legal/${duplicateLoginAgreementDocumentId}`))
      return
    }
    form.loginAgreementMode = form.loginAgreementMode === "checkbox" ? "checkbox" : "modal"
    form.loginAgreementDocuments = normalizedLoginAgreementDocuments
    const normalizedDefaultSubscriptions = normalizeDefaultSubscriptionSettings(toSubscriptionRequestList(form.defaultSubscriptions))
    const findDupSub = u ? u.findDuplicateDefaultSubscription : (subs: any[]) => {
      const seen = new Set<number>()
      return subs.find(s => { if (seen.has(s.groupId)) return true; seen.add(s.groupId); return false })
    }
    const duplicateDefaultSubscription = findDupSub(normalizedDefaultSubscriptions)
    if (duplicateDefaultSubscription) {
      appStore.showError(
          t("admin.settings.defaults.defaultSubscriptionsDuplicate", {
            group_id: duplicateDefaultSubscription.groupId,
          }),
      );
      return;
    }

    for (const authSource of (u?.authSourceDefaultsMeta ?? [])) {
      u!.authSourceDefaults[authSource.source].subscriptions =
          normalizeDefaultSubscriptionSettings(
              toSubscriptionRequestList(u!.authSourceDefaults[authSource.source].subscriptions),
          );
      const duplicate = findDupSub(u!.authSourceDefaults[authSource.source].subscriptions);
      if (duplicate) {
        appStore.showError(
            `${authSource.title}: ${t("admin.settings.defaults.defaultSubscriptionsDuplicate", { group_id: duplicate.groupId })}`,
        );
        return;
      }
    }

    if (form.wechat_connect_mp_enabled && form.wechat_connect_mobile_enabled) {
      appStore.showError(localText("公众号和移动应用不能同时启用。", "Official Account and Mobile App cannot be enabled at the same time."));
      return;
    }
    const isValidHttpUrl = (url: string): boolean => {
      if (!url) return true;
      try { const parsed = new URL(url); return parsed.protocol === "http:" || parsed.protocol === "https:"; }
      catch { return false; }
    };
    if (!isValidHttpUrl(form.frontendUrl)) form.frontendUrl = "";
    if (!isValidHttpUrl(form.docUrl)) form.docUrl = "";
    g?.syncWeChatConnectMode();
    const wechatStoredMode = deriveWeChatConnectStoredMode(
        form.wechat_connect_open_enabled, form.wechat_connect_mp_enabled,
        form.wechat_connect_mobile_enabled, form.wechatConnectMode,
    );
    if (gatewayTabRef.value) {
      gatewayTabRef.value.syncClaudeOAuthSystemPromptBlocksFormField()
    }

    const payload: UpdateSettingsRequest = {
      registration_enabled: form.registrationEnabled,
      email_verify_enabled: form.emailVerifyEnabled,
      registration_email_suffix_whitelist:
          (g?.registrationEmailSuffixWhitelistTags ?? []).map((suffix: string) =>
              suffix.startsWith("*.") ? suffix : `@${suffix}`,
          ),
      promo_code_enabled: form.promoCodeEnabled,
      invitation_code_enabled: form.invitationCodeEnabled,
      password_reset_enabled: form.passwordResetEnabled,
      totp_enabled: form.totpEnabled,
      session_binding_enabled: form.sessionBindingEnabled,
      step_up_enabled: form.stepUpEnabled,
      // 清空数字框时 v-model.number 会得到空串，后端 int 字段解析空串会 400 拒绝整次保存；
      // 空/非法值回退默认 180（与后端 parseAuditLogRetentionDays("") 语义一致，0 仍表示永久保留）。
      audit_log_retention_days: Number.isFinite(form.auditLogRetentionDays)
          ? form.auditLogRetentionDays
          : 180,
      login_agreement_enabled: form.loginAgreementEnabled,
      login_agreement_mode: form.loginAgreementMode,
      login_agreement_updated_at: form.loginAgreementUpdatedAt,
      login_agreement_documents: form.loginAgreementDocuments,
      default_balance: form.defaultBalance,
      affiliate_rebate_rate: Math.min(
          100,
          Math.max(0, Number(form.affiliateRebateRate) || 0),
      ),
      affiliate_rebate_freeze_hours: Math.max(0, Math.min(720, Number(form.affiliateRebateFreezeHours) || 0)),
      affiliate_rebate_duration_days: Math.max(0, Math.min(3650, Math.floor(Number(form.affiliateRebateDurationDays) || 0))),
      affiliate_rebate_per_invitee_cap: Math.max(0, Number(form.affiliateRebatePerInviteeCap) || 0),
      affiliate_admin_recharge_enabled: form.affiliateAdminRechargeEnabled,
      default_concurrency: form.defaultConcurrency,
      default_subscriptions: normalizedDefaultSubscriptions,
      force_email_on_third_party_signup: form.force_email_on_third_party_signup,
      default_user_rpm_limit: form.defaultUserRpmLimit,
      site_name: form.siteName,
      site_logo: form.siteLogo,
      site_subtitle: form.siteSubtitle,
      api_base_url: form.apiBaseUrl,
      contact_info: form.contactInfo,
      doc_url: form.docUrl,
      home_content: form.homeContent,
      backend_mode_enabled: form.backendModeEnabled,
      hide_ccs_import_button: form.hideCcsImportButton,
      table_default_page_size: form.tableDefaultPageSize,
      table_page_size_options: form.tablePageSizeOptions,
      custom_menu_items: form.customMenuItems,
      custom_endpoints: form.customEndpoints,
      frontend_url: form.frontendUrl,
      smtp_host: form.smtpHost,
      smtp_port: form.smtpPort,
      smtp_username: form.smtpUsername,
      smtp_password: form.smtp_password || undefined,
      smtp_from_email: form.smtpFromEmail,
      smtp_from_name: form.smtpFromName,
      smtp_use_tls: form.smtpUseTls,
      turnstile_enabled: form.turnstileEnabled,
      turnstile_site_key: form.turnstileSiteKey,
      turnstile_secret_key: form.turnstile_secret_key || undefined,
      recaptcha_enabled: form.recaptchaEnabled,
      recaptcha_site_key: form.recaptchaSiteKey,
      recaptcha_secret_key: form.recaptcha_secret_key || undefined,
      cap_enabled: form.capEnabled,
      cap_api_endpoint: form.capApiEndpoint,
      cap_secret_key: form.cap_secret_key || undefined,
      local_captcha_enabled: form.localCaptchaEnabled,
      client_ip_resolution_mode: form.clientIpResolutionMode,
      client_ip_trusted_proxies: g ? g.parseClientIPTrustedProxies(g.clientIPTrustedProxiesText) : [],
      linuxdo_connect_enabled: form.linuxdoConnectEnabled,
      linuxdo_connect_client_id: form.linuxdoConnectClientId,
      linuxdo_connect_client_secret:
          form.linuxdo_connect_client_secret || undefined,
      linuxdo_connect_redirect_url: form.linuxdoConnectRedirectUrl,
      dingtalk_connect_enabled: form.dingtalkConnectEnabled,
      dingtalk_connect_client_id: form.dingtalkConnectClientId,
      dingtalk_connect_client_secret:
          form.dingtalk_connect_client_secret || undefined,
      dingtalk_connect_redirect_url: form.dingtalkConnectRedirectUrl,
      dingtalk_connect_corp_restriction_policy:
      form.dingtalkConnectCorpRestrictionPolicy,
      dingtalk_connect_internal_corp_id: form.dingtalkConnectInternalCorpId,
      dingtalk_connect_bypass_registration: form.dingtalkConnectBypassRegistration,
      dingtalk_connect_sync_corp_email: form.dingtalkConnectSyncCorpEmail,
      dingtalk_connect_sync_display_name: form.dingtalkConnectSyncDisplayName,
      dingtalk_connect_sync_dept: form.dingtalkConnectSyncDept,
      dingtalk_connect_sync_corp_email_attr_key: form.dingtalkConnectSyncCorpEmailAttrKey,
      dingtalk_connect_sync_display_name_attr_key: form.dingtalkConnectSyncDisplayNameAttrKey,
      dingtalk_connect_sync_dept_attr_key: form.dingtalkConnectSyncDeptAttrKey,
      dingtalk_connect_sync_corp_email_attr_name: form.dingtalkConnectSyncCorpEmailAttrName,
      dingtalk_connect_sync_display_name_attr_name: form.dingtalkConnectSyncDisplayNameAttrName,
      dingtalk_connect_sync_dept_attr_name: form.dingtalkConnectSyncDeptAttrName,
      wechat_connect_enabled: form.wechatConnectEnabled,
      wechat_connect_app_id:
          form.wechatConnectOpenAppId ||
          form.wechatConnectMpAppId ||
          form.wechatConnectMobileAppId ||
          form.wechatConnectAppId,
      wechat_connect_app_secret: form.wechat_connect_app_secret || undefined,
      wechat_connect_open_app_id: form.wechatConnectOpenAppId,
      wechat_connect_open_app_secret:
          form.wechat_connect_open_app_secret || undefined,
      wechat_connect_mp_app_id: form.wechatConnectMpAppId,
      wechat_connect_mp_app_secret:
          form.wechat_connect_mp_app_secret || undefined,
      wechat_connect_mobile_app_id: form.wechatConnectMobileAppId,
      wechat_connect_mobile_app_secret:
          form.wechat_connect_mobile_app_secret || undefined,
      wechat_connect_open_enabled: form.wechat_connect_open_enabled,
      wechat_connect_mp_enabled: form.wechat_connect_mp_enabled,
      wechat_connect_mobile_enabled: form.wechat_connect_mobile_enabled,
      wechat_connect_mode: wechatStoredMode,
      wechat_connect_scopes:
          defaultWeChatConnectScopesForMode(wechatStoredMode),
      wechat_connect_redirect_url: form.wechatConnectRedirectUrl,
      wechat_connect_frontend_redirect_url:
      form.wechatConnectFrontendRedirectUrl,
      oidc_connect_enabled: form.oidcConnectEnabled,
      oidc_connect_provider_name: form.oidcConnectProviderName,
      oidc_connect_client_id: form.oidcConnectClientId,
      oidc_connect_client_secret: form.oidc_connect_client_secret || undefined,
      oidc_connect_issuer_url: form.oidcConnectIssuerUrl,
      oidc_connect_discovery_url: form.oidcConnectDiscoveryUrl,
      oidc_connect_authorize_url: form.oidcConnectAuthorizeUrl,
      oidc_connect_token_url: form.oidcConnectTokenUrl,
      oidc_connect_userinfo_url: form.oidcConnectUserinfoUrl,
      oidc_connect_jwks_url: form.oidcConnectJwksUrl,
      oidc_connect_scopes: form.oidcConnectScopes,
      oidc_connect_redirect_url: form.oidcConnectRedirectUrl,
      oidc_connect_frontend_redirect_url:
      form.oidcConnectFrontendRedirectUrl,
      oidc_connect_token_auth_method: form.oidcConnectTokenAuthMethod,
      oidc_connect_use_pkce: form.oidcConnectUsePkce,
      oidc_connect_validate_id_token: form.oidcConnectValidateIdToken,
      oidc_connect_allowed_signing_algs: form.oidcConnectAllowedSigningAlgs,
      oidc_connect_clock_skew_seconds: form.oidcConnectClockSkewSeconds,
      oidc_connect_require_email_verified:
      form.oidcConnectRequireEmailVerified,
      oidc_connect_userinfo_email_path: form.oidcConnectUserinfoEmailPath,
      oidc_connect_userinfo_id_path: form.oidcConnectUserinfoIdPath,
      oidc_connect_userinfo_username_path:
      form.oidcConnectUserinfoUsernamePath,
      github_oauth_enabled: form.githubOauthEnabled,
      github_oauth_client_id: form.githubOauthClientId,
      github_oauth_client_secret:
          form.github_oauth_client_secret || undefined,
      github_oauth_redirect_url: form.githubOauthRedirectUrl,
      github_oauth_frontend_redirect_url:
      form.githubOauthFrontendRedirectUrl,
      google_oauth_enabled: form.googleOauthEnabled,
      google_oauth_client_id: form.googleOauthClientId,
      google_oauth_client_secret:
          form.google_oauth_client_secret || undefined,
      google_oauth_redirect_url: form.googleOauthRedirectUrl,
      google_oauth_frontend_redirect_url:
      form.googleOauthFrontendRedirectUrl,
      enable_model_fallback: form.enableModelFallback,
      fallback_model_anthropic: form.fallbackModelAnthropic,
      fallback_model_openai: form.fallbackModelOpenai,
      fallback_model_gemini: form.fallbackModelGemini,
      fallback_model_antigravity: form.fallbackModelAntigravity,
      enable_identity_patch: form.enableIdentityPatch,
      identity_patch_prompt: form.identityPatchPrompt,
      min_claude_code_version: form.minClaudeCodeVersion,
      max_claude_code_version: form.maxClaudeCodeVersion,
      allow_ungrouped_key_scheduling: form.allowUngroupedKeyScheduling,
      stream_mode_performance_enabled:
      form.streamModePerformanceEnabled,
      scheduler_v2_enabled: form.scheduler_v2_enabled,
      scheduler_v2_candidate_limit: Number(form.scheduler_v2_candidate_limit),
      scheduler_v2_scan_limit: Number(form.scheduler_v2_scan_limit),
      enable_fingerprint_unification: form.enableFingerprintUnification,
      enable_metadata_passthrough: form.enableMetadataPassthrough,
      enable_cch_signing: form.enableCchSigning,
      enable_claude_oauth_system_prompt_injection:
      form.enableClaudeOauthSystemPromptInjection,
      claude_oauth_system_prompt: form.claudeOauthSystemPrompt?.trim()
          ? form.claudeOauthSystemPrompt
          : "",
      claude_oauth_system_prompt_blocks: form.claudeOauthSystemPromptBlocks,
      enable_anthropic_cache_ttl_1h_injection:
      form.enableAnthropicCacheTtl1hInjection,
      rewrite_message_cache_control: form.rewriteMessageCacheControl,
      enable_client_dateline_normalization:
      form.enableClientDatelineNormalization,
      antigravity_user_agent_version:
          form.antigravityUserAgentVersion?.trim() || "",
      openai_codex_user_agent:
          form.openaiCodexUserAgent?.trim() || "",
      min_codex_version: form.minCodexVersion?.trim() || "",
      max_codex_version: form.maxCodexVersion?.trim() || "",
      codex_cli_only_allow_app_server_clients:
      form.codexCliOnlyAllowAppServerClients,
      codex_cli_only_engine_fingerprint_signals: serializeFingerprintRowsToJSON(
          g?.codexFingerprintRows ?? [],
      ),
      codex_cli_only_blacklist: g ? g.serializeCodexRowsToJSON(g.codexBlacklistRows) : '',
      codex_cli_only_whitelist: g ? g.serializeCodexRowsToJSON(g.codexWhitelistRows) : '',
      // Payment configuration
      payment_enabled: form.paymentEnabled,
      risk_control_enabled: form.riskControlEnabled,
      cyber_session_block_enabled: form.cyberSessionBlockEnabled,
      cyber_session_block_ttl_seconds:
          Number(form.cyberSessionBlockTtlSeconds) || 3600,
      payment_min_amount: Number(form.paymentMinAmount) || 0,
      payment_max_amount: Number(form.paymentMaxAmount) || 0,
      payment_daily_limit: Number(form.paymentDailyLimit) || 0,
      payment_max_pending_orders: Number(form.paymentMaxPendingOrders) || 0,
      payment_order_timeout_minutes:
          Number(form.paymentOrderTimeoutMinutes) || 0,
      payment_balance_disabled: form.paymentBalanceDisabled,
      payment_balance_recharge_multiplier:
          Number(form.paymentBalanceRechargeMultiplier) || 1,
      payment_subscription_usd_to_cny_rate:
          Number(form.paymentSubscriptionUsdToCnyRate) || 0,
      payment_recharge_fee_rate: Number(form.paymentRechargeFeeRate) || 0,
      payment_enabled_types: form.paymentEnabledTypes,
      payment_load_balance_strategy: form.paymentLoadBalanceStrategy,
      payment_product_name_prefix: form.paymentProductNamePrefix,
      payment_product_name_suffix: form.paymentProductNameSuffix,
      payment_help_image_url: form.paymentHelpImageUrl,
      payment_help_text: form.paymentHelpText,
      payment_cancel_rate_limit_enabled: form.paymentCancelRateLimitEnabled,
      payment_cancel_rate_limit_max:
          Number(form.paymentCancelRateLimitMax) || 10,
      payment_cancel_rate_limit_window:
          Number(form.paymentCancelRateLimitWindow) || 1,
      payment_cancel_rate_limit_unit: form.paymentCancelRateLimitUnit,
      payment_cancel_rate_limit_window_mode:
      form.paymentCancelRateLimitWindowMode,
      payment_alipay_force_qrcode: form.paymentAlipayForceQrcode,
      openai_low_upstream_rate_priority_enabled:
      form.openai_low_upstream_rate_priority_enabled,
      openai_oauth_scheduling_rate_multiplier:
      form.openai_oauth_scheduling_rate_multiplier,
      openai_advanced_scheduler_enabled: form.openai_advanced_scheduler_enabled,
      openai_advanced_scheduler_sticky_weighted_enabled:
      form.openai_advanced_scheduler_sticky_weighted_enabled,
      openai_advanced_scheduler_subscription_priority_enabled:
      form.openai_advanced_scheduler_subscription_priority_enabled,
      openai_advanced_scheduler_lb_top_k:
          form.openai_advanced_scheduler_lb_top_k.trim(),
      openai_advanced_scheduler_weight_priority:
          form.openai_advanced_scheduler_weight_priority.trim(),
      openai_advanced_scheduler_weight_load:
          form.openai_advanced_scheduler_weight_load.trim(),
      openai_advanced_scheduler_weight_queue:
          form.openai_advanced_scheduler_weight_queue.trim(),
      openai_advanced_scheduler_weight_error_rate:
          form.openai_advanced_scheduler_weight_error_rate.trim(),
      openai_advanced_scheduler_weight_ttft:
          form.openai_advanced_scheduler_weight_ttft.trim(),
      openai_advanced_scheduler_weight_reset:
          form.openai_advanced_scheduler_weight_reset.trim(),
      openai_advanced_scheduler_weight_quota_headroom:
          form.openai_advanced_scheduler_weight_quota_headroom.trim(),
      openai_advanced_scheduler_weight_upstream_cost:
          form.openai_advanced_scheduler_weight_upstream_cost.trim(),
      openai_advanced_scheduler_weight_previous_response:
          form.openai_advanced_scheduler_weight_previous_response.trim(),
      openai_advanced_scheduler_weight_session_sticky:
          form.openai_advanced_scheduler_weight_session_sticky.trim(),
      // 余额、订阅到期与账号限额通知
      balance_low_notify_enabled: form.balanceLowNotifyEnabled,
      balance_low_notify_threshold:
          Number(form.balanceLowNotifyThreshold) || 0,
      balance_low_notify_recharge_url: (form.balanceLowNotifyRechargeUrl =
          form.balanceLowNotifyRechargeUrl || (typeof window !== "undefined" ? window.location.origin : "")),
      subscription_expiry_notify_enabled:
      form.subscriptionExpiryNotifyEnabled,
      account_quota_notify_enabled: form.accountQuotaNotifyEnabled,
      account_quota_notify_emails: (
          form.accountQuotaNotifyEmails || []
      ).filter((e) => e.email.trim() !== ""),
      // Channel Monitor feature switch
      channel_monitor_enabled: form.channelMonitorEnabled,
      channel_monitor_default_interval_seconds:
          Number(form.channelMonitorDefaultIntervalSeconds) || 60,
      // Available Channels feature switch
      available_channels_enabled: form.availableChannelsEnabled,
      // Affiliate (邀请返利) feature switch
      affiliate_enabled: form.affiliateEnabled,
      allow_user_view_error_requests: form.allowUserViewErrorRequests,
      allow_user_view_usage_details: form.allowUserViewUsageDetails,
    };

    if (gatewayTabRef.value?.openaiFastPolicyLoaded) {
      payload.openai_fast_policy_settings = {
        rules: gatewayTabRef.value.openaiFastPolicyForm.rules.map((rule: OpenAIFastPolicyRule) => {
          const whitelist = (rule.modelWhitelist || []).map((p: string) => p.trim()).filter((p: string) => p !== '')
          const hasWhitelist = whitelist.length > 0
          return {
            service_tier: rule.serviceTier, action: rule.action, scope: rule.scope,
            user_ids: rule.userIds && rule.userIds.length > 0 ? [...rule.userIds] : undefined,
            error_message: rule.action === 'block' ? rule.errorMessage : undefined,
            model_whitelist: hasWhitelist ? whitelist : undefined,
            fallback_action: hasWhitelist ? rule.fallbackAction || 'pass' : undefined,
            fallback_error_message: hasWhitelist && rule.fallbackAction === 'block' ? rule.fallbackErrorMessage : undefined,
          }
        }),
      }
    }

    payload.default_platform_quotas = sanitizePlatformQuotasMap(form.default_platform_quotas);
    if (u) appendAuthSourceDefaultsToUpdateRequest(payload, u.authSourceDefaults);

    const updated = await settingsStepUp.run(() =>
        $settings.updateSettings(payload),
    ) as SystemSettings;
    for (const [key, value] of Object.entries(updated)) {
      if (key === "openai_fast_policy_settings") continue;
      if (value !== null && value !== undefined) {
        (form as Record<string, unknown>)[key] = value;
      }
    }
    g?.normalizeHumanVerificationProvider()
    if (g) {
      g.clientIPTrustedProxiesText = (updated.clientIpTrustedProxies || []).join('\n')
      g.registrationEmailSuffixWhitelistTags = normalizeRegistrationEmailSuffixDomains(updated.registrationEmailSuffixWhitelist)
      g.tablePageSizeOptionsInput = g.formatTablePageSizeOptions(Array.isArray(updated.tablePageSizeOptions) ? updated.tablePageSizeOptions : [10, 20, 50, 100])
      g.registrationEmailSuffixWhitelistDraft = ''
    }
    if (u) Object.assign(u.authSourceDefaults, buildAuthSourceDefaultsState(toRecord(updated)));
    form.default_platform_quotas = normalizePlatformQuotasMap(updated.defaultPlatformQuotas);
    form.smtp_password = "";
    if (emailTabRef.value) emailTabRef.value.smtpPasswordManuallyEdited = false;
    form.turnstile_secret_key = "";
    form.recaptcha_secret_key = "";
    form.cap_secret_key = "";
    form.linuxdo_connect_client_secret = "";
    form.dingtalk_connect_client_secret = "";
    form.github_oauth_client_secret = "";
    form.google_oauth_client_secret = "";
    form.wechat_connect_app_secret = "";
    form.wechat_connect_open_app_secret = "";
    form.wechat_connect_mp_app_secret = "";
    form.wechat_connect_mobile_app_secret = "";
    const updatedWechatCapabilities = resolveWeChatConnectModeCapabilities(
        updated.wechatConnectOpenEnabled,
        updated.wechatConnectMpEnabled,
        updated.wechatConnectMobileEnabled,
        updated.wechatConnectMode,
    );
    form.wechat_connect_open_enabled = updatedWechatCapabilities.openEnabled;
    form.wechat_connect_mp_enabled = updatedWechatCapabilities.mpEnabled;
    form.wechat_connect_mobile_enabled =
        updatedWechatCapabilities.mobileEnabled;
    form.wechatConnectMode = deriveWeChatConnectStoredMode(
        updatedWechatCapabilities.openEnabled,
        updatedWechatCapabilities.mpEnabled,
        updatedWechatCapabilities.mobileEnabled,
        updated.wechatConnectMode,
    );
    form.wechatConnectScopes = defaultWeChatConnectScopesForMode(
        form.wechatConnectMode,
    );
    form.oidc_connect_client_secret = "";
    if (gatewayTabRef.value && updated.openaiAdvancedFastPolicySettings &&
        Array.isArray(updated.openaiAdvancedFastPolicySettings.rules)) {
      gatewayTabRef.value.openaiFastPolicyForm.rules =
          updated.openaiAdvancedFastPolicySettings.rules.map((rule: any) => ({
            ...rule,
            userIds: rule.userIds ? [...rule.userIds] : [],
            modelWhitelist: rule.modelWhitelist ? [...rule.modelWhitelist] : [],
          }));
      gatewayTabRef.value.openaiFastPolicyLoaded = true;
    }
    // Save web search emulation config separately (errors handled internally)
    const wsOk = gatewayTabRef.value ? await gatewayTabRef.value.saveWebSearchConfig() : true;
    // Refresh cached settings so sidebar/header update immediately
    await appStore.fetchPublicSettings(true);
    await adminSettingsStore.fetch(true);
    if (wsOk) {
      appStore.showSuccess(t("admin.settings.settingsSaved"));
    }
  } catch (error: unknown) {
    // 用户取消 step-up 验证：静默返回，不弹错误
    if (isStepUpCancelled(error)) {
      return;
    }
    if (isStepUpBlocked(error)) {
      appStore.showError(
          stepUpBlockReason(error) === "STEP_UP_ADMIN_API_KEY_FORBIDDEN"
              ? t("stepUp.adminApiKeyForbidden")
              : t("stepUp.notEnabled"),
      );
      return;
    }
    // 开启 step-up 开关但本人未启用 2FA：给出可操作的专用提示
    if (
        (error as { reason?: string })?.reason === "STEP_UP_ENABLE_REQUIRES_TOTP"
    ) {
      appStore.showError(t("admin.settings.security.stepUpEnableRequiresTotp"));
      return;
    }
    appStore.showError(
        extractApiErrorMessage(error, t("admin.settings.failedToSave")),
    );
  } finally {
    saving.value = false;
  }
}
onMounted(() => {
  loadSettings();
});
watch(
    () => form.dingtalkConnectCorpRestrictionPolicy,
    (policy) => {
      if (policy !== "internal_only") {
        if (form.dingtalkConnectBypassRegistration) form.dingtalkConnectBypassRegistration = false;
        if (form.dingtalkConnectSyncCorpEmail) form.dingtalkConnectSyncCorpEmail = false;
        if (form.dingtalkConnectSyncDisplayName) form.dingtalkConnectSyncDisplayName = false;
        if (form.dingtalkConnectSyncDept) form.dingtalkConnectSyncDept = false;
      }
    },
);
</script>

<style scoped>
.default-sub-group-select :deep(.select-trigger) {
  @apply h-[42px];
}

.default-sub-delete-btn {
  @apply h-[42px];
}

/* ============ 系统设置 Tab 导航 ============ */
.settings-tabs-shell {
  @apply sticky z-20 -mx-1 rounded-2xl border border-white/80 bg-white/90 p-1.5 backdrop-blur-xl;
  top: 4.75rem;
  box-shadow: 0 12px 28px rgb(15 23 42 / 0.07),
  0 1px 0 rgb(255 255 255 / 0.9) inset;
}

.settings-tabs-scroll {
  @apply overflow-x-auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.settings-tabs-scroll::-webkit-scrollbar {
  display: none;
}

.settings-tabs {
  @apply flex w-max min-w-full items-center gap-1;
}

.settings-tab {
  @apply relative isolate flex h-10 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-transparent px-3 text-sm font-medium text-gray-600 outline-none transition-colors duration-200 ease-out dark:text-gray-300;
  flex: 1 0 auto;
  min-width: max-content;
}

@media (min-width: 768px) {
  .settings-tab {
    @apply px-1.5 text-[13px];
  }

  .settings-tab-icon {
    @apply h-6 w-6;
  }
}

.settings-tab::before {
  @apply absolute inset-0 -z-10 rounded-xl opacity-0 transition-opacity duration-200;
  content: "";
  background: linear-gradient(135deg, rgb(248 250 252 / 0.95), rgb(241 245 249 / 0.8));
}

.settings-tab:hover::before,
.settings-tab:focus-visible::before {
  opacity: 1;
}

.settings-tab:focus-visible {
  @apply ring-2 ring-primary-500/40 ring-offset-2 ring-offset-white dark:ring-offset-dark-900;
}

.settings-tab-active {
  @apply border-primary-200/80 bg-white text-primary-700 shadow-sm dark:border-primary-400/30 dark:bg-dark-700/95 dark:text-primary-200;
  box-shadow: 0 8px 18px rgb(15 23 42 / 0.08),
  0 1px 0 rgb(255 255 255 / 0.92) inset;
}

.settings-tab-active::before {
  opacity: 0;
}

.settings-tab-active::after {
  position: absolute;
  right: 0.75rem;
  bottom: 0.25rem;
  left: 0.75rem;
  height: 2px;
  border-radius: 9999px;
  content: "";
  background: linear-gradient(90deg, #14b8a6, #0ea5e9);
}

.settings-tab-icon {
  @apply flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors duration-200 dark:text-gray-400;
}

.settings-tab:hover .settings-tab-icon,
.settings-tab:focus-visible .settings-tab-icon {
  @apply text-gray-700 dark:text-gray-200;
}

.settings-tab-active .settings-tab-icon {
  @apply bg-primary-50 text-primary-600 dark:bg-primary-400/10 dark:text-primary-300;
}

.settings-tab-label {
  @apply whitespace-nowrap leading-none;
}
</style>

<style>
/* Dark-mode overrides for the settings tabs shell. Kept in an UNSCOPED block
   because Vue's scoped-CSS compiler was dropping the `:global(.dark) ...`
   rules in the production build, leaving inactive tabs unreadable on dark. */
.dark .settings-tabs-shell {
  border-color: rgb(51 65 85 / 0.65);
  background: rgb(15 23 42 / 0.86);
  box-shadow: 0 16px 36px rgb(0 0 0 / 0.28),
  0 1px 0 rgb(255 255 255 / 0.06) inset;
}

.dark .settings-tab::before {
  background: linear-gradient(135deg, rgb(30 41 59 / 0.9), rgb(51 65 85 / 0.62));
}

.dark .settings-tab-active {
  box-shadow: 0 12px 26px rgb(0 0 0 / 0.22),
  0 1px 0 rgb(255 255 255 / 0.08) inset;
}
</style>
