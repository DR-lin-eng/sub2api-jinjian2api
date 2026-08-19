import type { SystemSettings } from "@/features/admin-settings/data/dtos/adminSystemSettingsDtos";
import { defaultClaudeOAuthSystemPromptBlocks } from "./settingsClaudePromptResolver";

export const tablePageSizeMin = 5;
export const tablePageSizeMax = 1000;
export const tablePageSizeDefault = 20;

export type SettingsForm = SystemSettings & {
  smtp_password: string;
};

export function createSettingsForm(): SettingsForm {
  return {
    frontend_url: "",
    totp_enabled: false,
    totp_encryption_key_configured: false,
    passkey_enabled: false,
    passkey_configured: false,
    passkey_rp_id: "",
    passkey_rp_origins: [],
    session_binding_enabled: false,
    step_up_enabled: false,

    smtp_host: "",
    smtp_port: 587,
    smtp_username: "",
    smtp_password: "",
    smtp_password_configured: false,
    smtp_from_email: "",
    smtp_from_name: "",
    smtp_use_tls: true,

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

    site_name: "Sub2API",
    site_logo: "",
    api_base_url: "",
    doc_url: "",
    hide_ccs_import_button: false,
    table_default_page_size: tablePageSizeDefault,
    table_page_size_options: [10, 20, 50, 100],
    custom_endpoints: [],

    enable_model_fallback: false,
    fallback_model_anthropic: "claude-3-5-sonnet-20241022",
    fallback_model_openai: "gpt-4o",
    fallback_model_gemini: "gemini-2.5-pro",
    fallback_model_antigravity: "gemini-2.5-pro",
    enable_identity_patch: true,
    identity_patch_prompt: "",

    ops_monitoring_enabled: true,
    ops_realtime_monitoring_enabled: true,
    ops_query_mode_default: "auto",
    ops_metrics_interval_seconds: 60,

    min_claude_code_version: "",
    max_claude_code_version: "",
    allow_ungrouped_key_scheduling: false,
    scheduler_v2_enabled: false,
    scheduler_v2_status: "disabled",
    scheduler_v2_error: "",
    scheduler_v2_candidate_limit: 64,
    scheduler_v2_scan_limit: 256,
    request_priority_admission_enabled: false,
    request_priority_pending_limit_per_instance: 256,
    request_priority_pending_mib_per_instance: 256,

    stream_mode_performance_enabled: false,
    openai_ws_mode_router_v2_enabled: false,

    enable_fingerprint_unification: true,
    enable_metadata_passthrough: false,
    enable_cch_signing: false,
    enable_claude_oauth_system_prompt_injection: true,
    claude_oauth_system_prompt: "",
    claude_oauth_system_prompt_blocks: defaultClaudeOAuthSystemPromptBlocks,
    enable_anthropic_cache_ttl_1h_injection: false,
    rewrite_message_cache_control: false,
    enable_client_dateline_normalization: true,
    antigravity_user_agent_version: "",
    openai_codex_user_agent: "",
    openai_codex_client_version: "",
    openai_codex_client_version_synced: "",
    openai_codex_version_auto_sync_enabled: true,

    min_codex_version: "",
    max_codex_version: "",
    codex_cli_only_blacklist: "",
    codex_cli_only_whitelist: "",
    codex_cli_only_allow_app_server_clients: false,
    codex_cli_only_engine_fingerprint_signals: "",
    web_search_emulation_enabled: false,

    openai_low_upstream_rate_priority_enabled: false,
    openai_oauth_scheduling_rate_multiplier: 1,
    openai_content_session_burst_balance_enabled: false,
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
    openai_advanced_scheduler_effective_lb_top_k: "",
    openai_advanced_scheduler_effective_weight_priority: "",
    openai_advanced_scheduler_effective_weight_load: "",
    openai_advanced_scheduler_effective_weight_queue: "",
    openai_advanced_scheduler_effective_weight_error_rate: "",
    openai_advanced_scheduler_effective_weight_ttft: "",
    openai_advanced_scheduler_effective_weight_reset: "",
    openai_advanced_scheduler_effective_weight_quota_headroom: "",
    openai_advanced_scheduler_effective_weight_upstream_cost: "",
    openai_advanced_scheduler_effective_weight_previous_response: "",
    openai_advanced_scheduler_effective_weight_session_sticky: "",

    account_quota_notify_enabled: false,
    account_quota_notify_emails: [],
    channel_monitor_enabled: true,
    channel_monitor_default_interval_seconds: 60,
  };
}
