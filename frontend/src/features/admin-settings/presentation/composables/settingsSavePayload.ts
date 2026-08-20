import type {
  OpenAIFastPolicyRule,
  UpdateSettingsRequest,
} from "@/features/admin-settings/data/dtos/adminSystemSettingsDtos";
import type { SettingsForm } from "./settingsForm";

export interface SettingsSavePayloadContext {
  form: SettingsForm;
  clientIPTrustedProxies: string[];
  claudeOAuthSystemPromptBlocksJSON: string;
  codexFingerprintSignalsJSON: string;
  codexBlacklistJSON: string;
  codexWhitelistJSON: string;
  openaiFastPolicyLoaded: boolean;
  openaiFastPolicyRules: readonly OpenAIFastPolicyRule[];
}

function appendOpenAIFastPolicy(
  payload: UpdateSettingsRequest,
  rules: readonly OpenAIFastPolicyRule[],
): void {
  payload.openai_fast_policy_settings = {
    rules: rules.map((rule) => {
      const whitelist = (rule.model_whitelist || [])
        .map((pattern) => pattern.trim())
        .filter(Boolean);
      const hasWhitelist = whitelist.length > 0;

      return {
        service_tier: rule.service_tier,
        action: rule.action,
        scope: rule.scope,
        error_message: rule.action === "block" ? rule.error_message : undefined,
        model_whitelist: hasWhitelist ? whitelist : undefined,
        fallback_action: hasWhitelist
          ? rule.fallback_action || "pass"
          : undefined,
        fallback_error_message:
          hasWhitelist && rule.fallback_action === "block"
            ? rule.fallback_error_message
            : undefined,
      };
    }),
  };
}

export function buildSettingsSavePayload({
  form,
  clientIPTrustedProxies,
  claudeOAuthSystemPromptBlocksJSON,
  codexFingerprintSignalsJSON,
  codexBlacklistJSON,
  codexWhitelistJSON,
  openaiFastPolicyLoaded,
  openaiFastPolicyRules,
}: SettingsSavePayloadContext): UpdateSettingsRequest {
  const payload: UpdateSettingsRequest = {
    frontend_url: form.frontend_url,
    totp_enabled: form.totp_enabled,
    passkey_enabled: form.passkey_enabled,
    session_binding_enabled: form.session_binding_enabled,
    step_up_enabled: form.step_up_enabled,

    smtp_host: form.smtp_host,
    smtp_port: Number(form.smtp_port) || 587,
    smtp_username: form.smtp_username,
    smtp_password: form.smtp_password || undefined,
    smtp_from_email: form.smtp_from_email,
    smtp_from_name: form.smtp_from_name,
    smtp_use_tls: form.smtp_use_tls,

    api_key_acl_trust_forwarded_ip: form.api_key_acl_trust_forwarded_ip,
    client_ip_resolution_mode: form.client_ip_resolution_mode,
    client_ip_trusted_proxies: clientIPTrustedProxies,

    site_name: form.site_name,
    site_logo: form.site_logo,
    api_base_url: form.api_base_url,
    doc_url: form.doc_url,
    hide_ccs_import_button: form.hide_ccs_import_button,
    table_default_page_size: form.table_default_page_size,
    table_page_size_options: form.table_page_size_options,
    custom_endpoints: form.custom_endpoints,

    enable_model_fallback: form.enable_model_fallback,
    fallback_model_anthropic: form.fallback_model_anthropic,
    fallback_model_openai: form.fallback_model_openai,
    fallback_model_gemini: form.fallback_model_gemini,
    fallback_model_antigravity: form.fallback_model_antigravity,
    enable_identity_patch: form.enable_identity_patch,
    identity_patch_prompt: form.identity_patch_prompt,

    ops_monitoring_enabled: form.ops_monitoring_enabled,
    ops_realtime_monitoring_enabled: form.ops_realtime_monitoring_enabled,
    ops_query_mode_default: form.ops_query_mode_default,
    ops_metrics_interval_seconds: Number(form.ops_metrics_interval_seconds),

    min_claude_code_version: form.min_claude_code_version,
    max_claude_code_version: form.max_claude_code_version,
    allow_ungrouped_key_scheduling: form.allow_ungrouped_key_scheduling,
    scheduler_v2_enabled: form.scheduler_v2_enabled,
    scheduler_v2_candidate_limit: Number(form.scheduler_v2_candidate_limit),
    scheduler_v2_scan_limit: Number(form.scheduler_v2_scan_limit),
    request_priority_admission_enabled:
      form.request_priority_admission_enabled,
    request_priority_pending_limit_per_instance: Number(
      form.request_priority_pending_limit_per_instance,
    ),
    request_priority_pending_mib_per_instance: Number(
      form.request_priority_pending_mib_per_instance,
    ),

    stream_mode_performance_enabled: form.stream_mode_performance_enabled,
    openai_ws_mode_router_v2_enabled: form.openai_ws_mode_router_v2_enabled,

    enable_fingerprint_unification: form.enable_fingerprint_unification,
    enable_metadata_passthrough: form.enable_metadata_passthrough,
    enable_cch_signing: form.enable_cch_signing,
    enable_claude_oauth_system_prompt_injection:
      form.enable_claude_oauth_system_prompt_injection,
    claude_oauth_system_prompt: form.claude_oauth_system_prompt.trim(),
    claude_oauth_system_prompt_blocks: claudeOAuthSystemPromptBlocksJSON,
    enable_anthropic_cache_ttl_1h_injection:
      form.enable_anthropic_cache_ttl_1h_injection,
    rewrite_message_cache_control: form.rewrite_message_cache_control,
    enable_client_dateline_normalization:
      form.enable_client_dateline_normalization,
    antigravity_user_agent_version:
      form.antigravity_user_agent_version.trim(),
    openai_codex_user_agent: form.openai_codex_user_agent.trim(),
    openai_codex_client_version: form.openai_codex_client_version.trim(),
    openai_codex_version_auto_sync_enabled:
      form.openai_codex_version_auto_sync_enabled,

    min_codex_version: form.min_codex_version.trim(),
    max_codex_version: form.max_codex_version.trim(),
    codex_cli_only_blacklist: codexBlacklistJSON,
    codex_cli_only_whitelist: codexWhitelistJSON,
    codex_cli_only_allow_app_server_clients:
      form.codex_cli_only_allow_app_server_clients,
    codex_cli_only_engine_fingerprint_signals: codexFingerprintSignalsJSON,

    openai_low_upstream_rate_priority_enabled:
      form.openai_low_upstream_rate_priority_enabled,
    openai_oauth_scheduling_rate_multiplier:
      Number(form.openai_oauth_scheduling_rate_multiplier) || 1,
    openai_content_session_burst_balance_enabled:
      form.openai_content_session_burst_balance_enabled,
    openai_advanced_scheduler_enabled:
      form.openai_advanced_scheduler_enabled,
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

    account_quota_notify_enabled: form.account_quota_notify_enabled,
    account_quota_notify_emails: form.account_quota_notify_emails.filter(
      (entry) => entry.email.trim() !== "",
    ),
    channel_monitor_enabled: form.channel_monitor_enabled,
    channel_monitor_default_interval_seconds:
      Number(form.channel_monitor_default_interval_seconds) || 60,
  };

  if (openaiFastPolicyLoaded) {
    appendOpenAIFastPolicy(payload, openaiFastPolicyRules);
  }

  return payload;
}
