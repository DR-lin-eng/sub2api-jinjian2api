import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useClipboard } from "@/common/composables/useClipboard";
import {
  isStepUpBlocked,
  isStepUpCancelled,
  stepUpBlockReason,
  useStepUp,
} from "@/common/composables/useStepUp";
import { useAppStore } from "@/core/stores/appStore";
import { extractApiErrorMessage } from "@/core/utils/apiError";
import { settingsAPI } from "@/features/admin-settings/data/datasources/adminSettingsDatasource";
import { updateSettings } from "@/features/admin-settings/data/datasources/adminSystemSettingsActions";
import { getSettings } from "@/features/admin-settings/data/datasources/adminSystemSettingsQueries";
import { useAdminSettingsStore } from "@/features/admin-settings/presentation/stores/adminSettingsStore";
import {
  createSettingsForm,
  tablePageSizeMax,
  tablePageSizeMin,
} from "./settingsForm";
import { buildSettingsSavePayload } from "./settingsSavePayload";
import {
  prepareSettingsSave,
  type SettingsSaveValidationError,
} from "./settingsSavePreparation";
import { applySettingsSaveResponse } from "./settingsSaveResponse";
import { useSettingsAdminApiKeys } from "./useSettingsAdminApiKeys";
import { useSettingsClaudePromptBlocks } from "./useSettingsClaudePromptBlocks";
import { useSettingsClientIPAccess } from "./useSettingsClientIPAccess";
import { useSettingsGatewayPolicies } from "./useSettingsGatewayPolicies";
import { useSettingsStructuredEditors } from "./useSettingsStructuredEditors";
import { useSettingsWebSearch } from "./useSettingsWebSearch";
export function useSettingsPage() {
  const { t, locale } = useI18n();
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
    | "security"
    | "gateway"
    | "performance"
    | "email"
    | "backup";
  const activeTab = ref<SettingsTab>("general");
  const panelRateLimitSettingsMounted = ref(false);
  const settingsTabs = [
    { key: "general" as SettingsTab, icon: "home" as const },
    { key: "security" as SettingsTab, icon: "shield" as const },
    { key: "gateway" as SettingsTab, icon: "server" as const },
    { key: "performance" as SettingsTab, icon: "bolt" as const },
    { key: "email" as SettingsTab, icon: "mail" as const },
    { key: "backup" as SettingsTab, icon: "database" as const },
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
    if (tab === "security") {
      panelRateLimitSettingsMounted.value = true;
    }
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

  const { copyToClipboard } = useClipboard();

  const loading = ref(true);
  const loadFailed = ref(false);
  const saving = ref(false);
  const testingSmtp = ref(false);
  const sendingTestEmail = ref(false);
  const smtpPasswordManuallyEdited = ref(false);
  const testEmailAddress = ref("");
  const form = reactive(createSettingsForm());

  function addQuotaNotifyEmail(): void {
    form.account_quota_notify_emails.push({
      email: "",
      disabled: false,
      verified: true,
    });
  }

  const {
    addClaudeOAuthSystemPromptBlock,
    applyClaudeOAuthSystemPromptPreset,
    claudeOAuthSystemPromptBlocks,
    claudeOAuthSystemPromptBlockTypeOptions,
    claudeOAuthSystemPromptCacheTTLOptions,
    claudeOAuthSystemPromptPresetOptions,
    getClaudeOAuthPresetLabel,
    loadClaudeOAuthSystemPromptBlocks,
    markClaudeOAuthSystemPromptBlockCustom,
    moveClaudeOAuthSystemPromptBlock,
    removeClaudeOAuthSystemPromptBlock,
    resetClaudeOAuthSystemPromptBlocks,
    serializeClaudeOAuthSystemPromptBlocks,
    toggleClaudeOAuthSystemPromptBlock,
  } = useSettingsClaudePromptBlocks(form, t);

  const {
    clientIPLastRefreshText,
    clientIPResolutionModeOptions,
    clientIPTrustedProxiesText,
    parseClientIPTrustedProxies,
  } = useSettingsClientIPAccess(form, t);

  const {
    addCodexBlacklistRow,
    addCodexFingerprintRow,
    addCodexWhitelistRow,
    addEndpoint,
    codexBlacklistRows,
    codexFingerprintNoRequired,
    codexFingerprintRows,
    codexWhitelistRows,
    defaultFingerprintSignalRows,
    formatTablePageSizeOptions,
    parseCodexEntriesToRows,
    parseFingerprintSignalsToRows,
    parseTablePageSizeOptionsInput,
    removeCodexBlacklistRow,
    removeCodexFingerprintRow,
    removeCodexWhitelistRow,
    removeEndpoint,
    serializeCodexRowsToJSON,
    serializeFingerprintRowsToJSON,
    tablePageSizeOptionsInput,
  } = useSettingsStructuredEditors(form);
  type OpenAIAdvancedSchedulerOverrideKey =
    | "openai_advanced_scheduler_lb_top_k"
    | "openai_advanced_scheduler_weight_priority"
    | "openai_advanced_scheduler_weight_load"
    | "openai_advanced_scheduler_weight_queue"
    | "openai_advanced_scheduler_weight_error_rate"
    | "openai_advanced_scheduler_weight_ttft"
    | "openai_advanced_scheduler_weight_reset"
    | "openai_advanced_scheduler_weight_quota_headroom"
    | "openai_advanced_scheduler_weight_upstream_cost"
    | "openai_advanced_scheduler_weight_previous_response"
    | "openai_advanced_scheduler_weight_session_sticky";

  type OpenAIAdvancedSchedulerEffectiveKey =
    | "openai_advanced_scheduler_effective_lb_top_k"
    | "openai_advanced_scheduler_effective_weight_priority"
    | "openai_advanced_scheduler_effective_weight_load"
    | "openai_advanced_scheduler_effective_weight_queue"
    | "openai_advanced_scheduler_effective_weight_error_rate"
    | "openai_advanced_scheduler_effective_weight_ttft"
    | "openai_advanced_scheduler_effective_weight_reset"
    | "openai_advanced_scheduler_effective_weight_quota_headroom"
    | "openai_advanced_scheduler_effective_weight_upstream_cost"
    | "openai_advanced_scheduler_effective_weight_previous_response"
    | "openai_advanced_scheduler_effective_weight_session_sticky";

  const openAIAdvancedSchedulerWeightFields = computed<
    Array<{
      key: OpenAIAdvancedSchedulerOverrideKey;
      label: string;
      placeholder: string;
    }>
  >(() => {
    const placeholder = (
      effectiveKey: OpenAIAdvancedSchedulerEffectiveKey,
      fallbackValue: string,
    ) => {
      const effectiveValue = String(
        (form as Record<string, unknown>)[effectiveKey] ?? "",
      ).trim();
      return t("admin.settings.openaiExperimentalScheduler.defaultPlaceholder", {
        value: effectiveValue || fallbackValue,
      });
    };

    return [
      {
        key: "openai_advanced_scheduler_lb_top_k",
        label: t("admin.settings.openaiExperimentalScheduler.topKLabel"),
        placeholder: placeholder("openai_advanced_scheduler_effective_lb_top_k", "7"),
      },
      {
        key: "openai_advanced_scheduler_weight_priority",
        label: t("admin.settings.openaiExperimentalScheduler.priorityWeight"),
        placeholder: placeholder("openai_advanced_scheduler_effective_weight_priority", "1"),
      },
      {
        key: "openai_advanced_scheduler_weight_load",
        label: t("admin.settings.openaiExperimentalScheduler.loadWeight"),
        placeholder: placeholder("openai_advanced_scheduler_effective_weight_load", "1"),
      },
      {
        key: "openai_advanced_scheduler_weight_queue",
        label: t("admin.settings.openaiExperimentalScheduler.queueWeight"),
        placeholder: placeholder("openai_advanced_scheduler_effective_weight_queue", "0.7"),
      },
      {
        key: "openai_advanced_scheduler_weight_error_rate",
        label: t("admin.settings.openaiExperimentalScheduler.errorRateWeight"),
        placeholder: placeholder("openai_advanced_scheduler_effective_weight_error_rate", "0.8"),
      },
      {
        key: "openai_advanced_scheduler_weight_ttft",
        label: t("admin.settings.openaiExperimentalScheduler.ttftWeight"),
        placeholder: placeholder("openai_advanced_scheduler_effective_weight_ttft", "0.5"),
      },
      {
        key: "openai_advanced_scheduler_weight_reset",
        label: t("admin.settings.openaiExperimentalScheduler.resetWeight"),
        placeholder: placeholder("openai_advanced_scheduler_effective_weight_reset", "0"),
      },
      {
        key: "openai_advanced_scheduler_weight_quota_headroom",
        label: t("admin.settings.openaiExperimentalScheduler.quotaHeadroomWeight"),
        placeholder: placeholder("openai_advanced_scheduler_effective_weight_quota_headroom", "0"),
      },
      {
        key: "openai_advanced_scheduler_weight_upstream_cost",
        label: t("admin.settings.openaiExperimentalScheduler.upstreamCostWeight"),
        placeholder: placeholder("openai_advanced_scheduler_effective_weight_upstream_cost", "0"),
      },
      {
        key: "openai_advanced_scheduler_weight_previous_response",
        label: t("admin.settings.openaiExperimentalScheduler.previousResponseWeight"),
        placeholder: placeholder("openai_advanced_scheduler_effective_weight_previous_response", "5"),
      },
      {
        key: "openai_advanced_scheduler_weight_session_sticky",
        label: t("admin.settings.openaiExperimentalScheduler.sessionStickyWeight"),
        placeholder: placeholder("openai_advanced_scheduler_effective_weight_session_sticky", "3"),
      },
    ];
  });

  const schedulerV2StatusLabel = computed(() => {
    if (!form.scheduler_v2_enabled) {
      return t("admin.settings.schedulerV2.statusDisabled");
    }
    switch (form.scheduler_v2_status) {
      case "active":
        return t("admin.settings.schedulerV2.statusActive");
      case "failed":
        return t("admin.settings.schedulerV2.statusFailed");
      default:
        return t("admin.settings.schedulerV2.statusBuilding");
    }
  });

  const schedulerV2StatusClass = computed(() => {
    if (!form.scheduler_v2_enabled) {
      return "text-gray-500 dark:text-gray-400";
    }
    if (form.scheduler_v2_status === "active") {
      return "text-green-600 dark:text-green-400";
    }
    if (form.scheduler_v2_status === "failed") {
      return "text-red-600 dark:text-red-400";
    }
    return "text-amber-600 dark:text-amber-400";
  });


  const { adminApiKeyExists, adminApiKeyForm, adminApiKeyLoading, adminApiKeyMasked, adminApiKeyMinExpiry, adminApiKeyOperating, adminApiKeyPanelLoading, adminApiKeyPanelOperating, adminApiKeyPanelSecret, adminApiKeyScopeOptions, cancelEditScopedAdminApiKey, copyNewKey, copyScopedAdminApiKey, createAdminApiKey, createScopedAdminApiKey, deleteAdminApiKey, editScopedAdminApiKey, editingAdminApiKeyId, formatAdminApiKeyDate, loadAdminApiKey, loadScopedAdminApiKeys, newAdminApiKey, regenerateAdminApiKey, revokeScopedAdminApiKey, rotateScopedAdminApiKey, scopedAdminApiKeys } = useSettingsAdminApiKeys(copyToClipboard)
  const { addOpenAIFastPolicyModelPattern, addOpenAIFastPolicyRule, addQuickPattern, applyBetaPreset, betaPolicyActionOptions, betaPolicyForm, betaPolicyLoading, betaPolicySaving, betaPolicyScopeOptions, betaPresets, commonModelPatterns, getBetaDisplayName, globalTempUnschedulableForm, globalTempUnschedulableLoading, globalTempUnschedulableSaving, loadBetaPolicySettings, loadGlobalTempUnschedulableSettings, loadOllamaCloudUsageSettings, loadOverloadCooldownSettings, loadRateLimit429CooldownSettings, loadRectifierSettings, loadStreamTimeoutSettings, loadUpstreamBillingProbeSettings, ollamaCloudUsageForm, ollamaCloudUsageLoading, ollamaCloudUsageSaving, openaiFastPolicyActionOptions, openaiFastPolicyForm, openaiFastPolicyLoaded, openaiFastPolicyScopeOptions, openaiFastPolicyTierOptions, overloadCooldownForm, overloadCooldownLoading, overloadCooldownSaving, rateLimit429CooldownForm, rateLimit429CooldownLoading, rateLimit429CooldownSaving, rectifierForm, rectifierLoading, rectifierSaving, removeOpenAIFastPolicyModelPattern, removeOpenAIFastPolicyRule, saveBetaPolicySettings, saveGlobalTempUnschedulableSettings, saveOllamaCloudUsageSettings, saveOverloadCooldownSettings, saveRateLimit429CooldownSettings, saveRectifierSettings, saveStreamTimeoutSettings, saveUpstreamBillingProbeSettings, streamTimeoutForm, streamTimeoutLoading, streamTimeoutSaving, upstreamBillingProbeForm, upstreamBillingProbeLoading, upstreamBillingProbeSaving } = useSettingsGatewayPolicies()
  const { addWebSearchProvider, apiKeyVisible, copyApiKey, expandedProviders, formatSubscribedAt, loadWebSearchConfig, openTestDialog, parseSubscribedAt, quotaPercentage, removeWebSearchProvider, resetWebSearchUsage, saveWebSearchConfig, testWebSearchProvider, toggleProviderExpand, webSearchConfig, webSearchProxies, wsTestDialogOpen, wsTestLoading, wsTestQuery, wsTestResult } = useSettingsWebSearch()

  function refreshStructuredEditors(): void {
    clientIPTrustedProxiesText.value = form.client_ip_trusted_proxies.join("\n");
    loadClaudeOAuthSystemPromptBlocks();
    codexBlacklistRows.value = parseCodexEntriesToRows(
      form.codex_cli_only_blacklist,
    );
    codexWhitelistRows.value = parseCodexEntriesToRows(
      form.codex_cli_only_whitelist,
    );
    codexFingerprintRows.value = form.codex_cli_only_engine_fingerprint_signals
      ? parseFingerprintSignalsToRows(
          form.codex_cli_only_engine_fingerprint_signals,
        )
      : defaultFingerprintSignalRows();
    tablePageSizeOptionsInput.value = formatTablePageSizeOptions(
      form.table_page_size_options,
    );
  }

  async function loadSettings() {
    loading.value = true;
    loadFailed.value = false;
    try {
      const settings = await getSettings();
      // Only assign non-null values from backend (null means unconfigured, keep defaults)
      for (const [key, value] of Object.entries(settings)) {
        if (value !== null && value !== undefined) {
          (form as Record<string, unknown>)[key] = value;
        }
      }
      form.smtp_password = "";
      smtpPasswordManuallyEdited.value = false;
      refreshStructuredEditors();

      // Load OpenAI fast/flex policy rules from bulk settings.
      // 仅当 payload 真的包含该字段时填充并标记为已加载；否则保持表单空值，
      // 让 saveSettings 在未加载时跳过该字段，防止覆盖后端默认规则。
      if (
        settings.openai_fast_policy_settings &&
        Array.isArray(settings.openai_fast_policy_settings.rules)
      ) {
        openaiFastPolicyForm.rules =
          settings.openai_fast_policy_settings.rules.map((rule) => ({
            ...rule,
            model_whitelist: rule.model_whitelist
              ? [...rule.model_whitelist]
              : [],
          }));
        openaiFastPolicyLoaded.value = true;
      }

      // Load web search emulation config separately
      await loadWebSearchConfig();
    } catch (error: unknown) {
      loadFailed.value = true;
      appStore.showError(
        extractApiErrorMessage(error, t("admin.settings.failedToLoad")),
      );
    } finally {
      loading.value = false;
    }
  }


  function showSettingsSaveValidationError(
    error: SettingsSaveValidationError,
  ): void {
    switch (error.kind) {
      case "tableDefaultPageSize":
        appStore.showError(
          t("admin.settings.site.tableDefaultPageSizeRangeError", {
            min: tablePageSizeMin,
            max: tablePageSizeMax,
          }),
        );
        return;
      case "tablePageSizeOptions":
        appStore.showError(
          t("admin.settings.site.tablePageSizeOptionsFormatError", {
            min: tablePageSizeMin,
            max: tablePageSizeMax,
          }),
        );
        return;
    }
  }

  async function saveSettings() {
    saving.value = true;
    try {
      const preparation = prepareSettingsSave({
        form,
        tablePageSizeOptionsInput: tablePageSizeOptionsInput.value,
        parseTablePageSizeOptionsInput,
        serializeClaudeOAuthSystemPromptBlocks,
      });
      if (!preparation.ok) {
        showSettingsSaveValidationError(preparation.error);
        return;
      }

      const payload = buildSettingsSavePayload({
        form,
        clientIPTrustedProxies: parseClientIPTrustedProxies(
          clientIPTrustedProxiesText.value,
        ),
        claudeOAuthSystemPromptBlocksJSON:
          preparation.claudeOAuthSystemPromptBlocksJSON,
        codexFingerprintSignalsJSON: serializeFingerprintRowsToJSON(
          codexFingerprintRows.value,
        ),
        codexBlacklistJSON: serializeCodexRowsToJSON(codexBlacklistRows.value),
        codexWhitelistJSON: serializeCodexRowsToJSON(codexWhitelistRows.value),
        openaiFastPolicyLoaded: openaiFastPolicyLoaded.value,
        openaiFastPolicyRules: openaiFastPolicyForm.rules,
      });

      const updated = await settingsStepUp.run(() =>
        updateSettings(payload),
      );
      applySettingsSaveResponse({
        form,
        updated,
        smtpPasswordManuallyEdited,
        openaiFastPolicyForm,
        openaiFastPolicyLoaded,
        refreshStructuredEditors,
      });

      // Save web search emulation config separately (errors handled internally)
      const wsOk = await saveWebSearchConfig();
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

  async function testSmtpConnection() {
    testingSmtp.value = true;
    try {
      const smtpPasswordForTest = smtpPasswordManuallyEdited.value
        ? form.smtp_password
        : "";
      const result = await settingsAPI.testSmtpConnection({
        smtp_host: form.smtp_host,
        smtp_port: form.smtp_port,
        smtp_username: form.smtp_username,
        smtp_password: smtpPasswordForTest,
        smtp_use_tls: form.smtp_use_tls,
      });
      // API returns { message: "..." } on success, errors are thrown as exceptions
      appStore.showSuccess(
        result.message || t("admin.settings.smtpConnectionSuccess"),
      );
    } catch (error: unknown) {
      appStore.showError(
        extractApiErrorMessage(error, t("admin.settings.failedToTestSmtp")),
      );
    } finally {
      testingSmtp.value = false;
    }
  }

  async function sendTestEmail() {
    if (!testEmailAddress.value) {
      appStore.showError(t("admin.settings.testEmail.enterRecipientHint"));
      return;
    }

    sendingTestEmail.value = true;
    try {
      const smtpPasswordForSend = smtpPasswordManuallyEdited.value
        ? form.smtp_password
        : "";
      const result = await settingsAPI.sendTestEmail({
        email: testEmailAddress.value,
        smtp_host: form.smtp_host,
        smtp_port: form.smtp_port,
        smtp_username: form.smtp_username,
        smtp_password: smtpPasswordForSend,
        smtp_from_email: form.smtp_from_email,
        smtp_from_name: form.smtp_from_name,
        smtp_use_tls: form.smtp_use_tls,
      });
      // API returns { message: "..." } on success, errors are thrown as exceptions
      appStore.showSuccess(result.message || t("admin.settings.testEmailSent"));
    } catch (error: unknown) {
      appStore.showError(
        extractApiErrorMessage(error, t("admin.settings.failedToSendTestEmail")),
      );
    } finally {
      sendingTestEmail.value = false;
    }
  }

  onMounted(() => {
    loadSettings();
    loadAdminApiKey();
    loadScopedAdminApiKeys();
    loadUpstreamBillingProbeSettings();
    loadOllamaCloudUsageSettings();
    loadOverloadCooldownSettings();
    loadRateLimit429CooldownSettings();
    loadGlobalTempUnschedulableSettings();
    loadStreamTimeoutSettings();
    loadRectifierSettings();
    loadBetaPolicySettings();
  });


  return {
    activeTab,
    addClaudeOAuthSystemPromptBlock,
    addCodexBlacklistRow,
    addCodexFingerprintRow,
    addCodexWhitelistRow,
    addEndpoint,
    addOpenAIFastPolicyModelPattern,
    addOpenAIFastPolicyRule,
    addQuickPattern,
    addQuotaNotifyEmail,
    addWebSearchProvider,
    adminApiKeyExists,
    adminApiKeyForm,
    adminApiKeyLoading,
    adminApiKeyMasked,
    adminApiKeyMinExpiry,
    adminApiKeyOperating,
    adminApiKeyPanelLoading,
    adminApiKeyPanelOperating,
    adminApiKeyPanelSecret,
    adminApiKeyScopeOptions,
    apiKeyVisible,
    applyBetaPreset,
    applyClaudeOAuthSystemPromptPreset,
    betaPolicyActionOptions,
    betaPolicyForm,
    betaPolicyLoading,
    betaPolicySaving,
    betaPolicyScopeOptions,
    betaPresets,
    cancelEditScopedAdminApiKey,
    claudeOAuthSystemPromptBlockTypeOptions,
    claudeOAuthSystemPromptBlocks,
    claudeOAuthSystemPromptCacheTTLOptions,
    claudeOAuthSystemPromptPresetOptions,
    clientIPLastRefreshText,
    clientIPResolutionModeOptions,
    clientIPTrustedProxiesText,
    codexBlacklistRows,
    codexFingerprintNoRequired,
    codexFingerprintRows,
    codexWhitelistRows,
    commonModelPatterns,
    copyApiKey,
    copyNewKey,
    copyScopedAdminApiKey,
    createAdminApiKey,
    createScopedAdminApiKey,
    deleteAdminApiKey,
    editScopedAdminApiKey,
    editingAdminApiKeyId,
    expandedProviders,
    form,
    formatAdminApiKeyDate,
    formatSubscribedAt,
    getBetaDisplayName,
    getClaudeOAuthPresetLabel,
    globalTempUnschedulableForm,
    globalTempUnschedulableLoading,
    globalTempUnschedulableSaving,
    handleSettingsTabKeydown,
    isZhLocale,
    loadFailed,
    loading,
    localText,
    markClaudeOAuthSystemPromptBlockCustom,
    moveClaudeOAuthSystemPromptBlock,
    newAdminApiKey,
    ollamaCloudUsageForm,
    ollamaCloudUsageLoading,
    ollamaCloudUsageSaving,
    openAIAdvancedSchedulerWeightFields,
    openTestDialog,
    openaiFastPolicyActionOptions,
    openaiFastPolicyForm,
    openaiFastPolicyScopeOptions,
    openaiFastPolicyTierOptions,
    overloadCooldownForm,
    overloadCooldownLoading,
    overloadCooldownSaving,
    panelRateLimitSettingsMounted,
    parseSubscribedAt,
    quotaPercentage,
    rateLimit429CooldownForm,
    rateLimit429CooldownLoading,
    rateLimit429CooldownSaving,
    rectifierForm,
    rectifierLoading,
    rectifierSaving,
    regenerateAdminApiKey,
    removeClaudeOAuthSystemPromptBlock,
    removeCodexBlacklistRow,
    removeCodexFingerprintRow,
    removeCodexWhitelistRow,
    removeEndpoint,
    removeOpenAIFastPolicyModelPattern,
    removeOpenAIFastPolicyRule,
    removeWebSearchProvider,
    resetClaudeOAuthSystemPromptBlocks,
    resetWebSearchUsage,
    revokeScopedAdminApiKey,
    rotateScopedAdminApiKey,
    saveBetaPolicySettings,
    saveGlobalTempUnschedulableSettings,
    saveOllamaCloudUsageSettings,
    saveOverloadCooldownSettings,
    saveRateLimit429CooldownSettings,
    saveRectifierSettings,
    saveSettings,
    saveStreamTimeoutSettings,
    saveUpstreamBillingProbeSettings,
    saving,
    schedulerV2StatusClass,
    schedulerV2StatusLabel,
    scopedAdminApiKeys,
    selectSettingsTab,
    sendTestEmail,
    sendingTestEmail,
    settingsStepUp,
    settingsTabs,
    smtpPasswordManuallyEdited,
    streamTimeoutForm,
    streamTimeoutLoading,
    streamTimeoutSaving,
    t,
    tablePageSizeOptionsInput,
    testEmailAddress,
    testSmtpConnection,
    testWebSearchProvider,
    testingSmtp,
    toggleClaudeOAuthSystemPromptBlock,
    toggleProviderExpand,
    upstreamBillingProbeForm,
    upstreamBillingProbeLoading,
    upstreamBillingProbeSaving,
    webSearchConfig,
    webSearchProxies,
    wsTestDialogOpen,
    wsTestLoading,
    wsTestQuery,
    wsTestResult,
  }
}

export type SettingsPageContext = ReturnType<typeof useSettingsPage>
