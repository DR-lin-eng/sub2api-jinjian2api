import type { CustomEndpoint, NotifyEmailEntry } from "@/types";

export type ClientIPResolutionMode =
  | "auto_compat"
  | "trusted_proxy"
  | "direct";

export interface ClientIPResolutionStatus {
  mode: ClientIPResolutionMode;
  custom_prefix_count: number;
  static_prefix_count: number;
  cloudflare_prefix_count: number;
  cloudflare_ranges_source: "embedded" | "refreshed";
  cloudflare_last_success_at: string | null;
}

export interface OpenAIFastPolicyRule {
  service_tier: "all" | "priority" | "flex";
  action: "pass" | "filter" | "block" | "force_priority";
  scope: "all" | "oauth" | "apikey" | "bedrock";
  error_message?: string;
  model_whitelist?: string[];
  fallback_action?: "pass" | "filter" | "block" | "force_priority";
  fallback_error_message?: string;
}

export interface OpenAIFastPolicySettings {
  rules: OpenAIFastPolicyRule[];
}

export interface SystemSettings {
  frontend_url: string;
  totp_enabled: boolean;
  totp_encryption_key_configured: boolean;
  passkey_enabled: boolean;
  passkey_configured: boolean;
  passkey_rp_id: string;
  passkey_rp_origins: string[];
  session_binding_enabled: boolean;
  step_up_enabled: boolean;

  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password_configured: boolean;
  smtp_from_email: string;
  smtp_from_name: string;
  smtp_use_tls: boolean;

  api_key_acl_trust_forwarded_ip: boolean;
  client_ip_resolution_mode: ClientIPResolutionMode;
  client_ip_trusted_proxies: string[];
  client_ip_resolution_status: ClientIPResolutionStatus;

  site_name: string;
  site_logo: string;
  api_base_url: string;
  doc_url: string;
  hide_ccs_import_button: boolean;
  table_default_page_size: number;
  table_page_size_options: number[];
  custom_endpoints: CustomEndpoint[];

  enable_model_fallback: boolean;
  fallback_model_anthropic: string;
  fallback_model_openai: string;
  fallback_model_gemini: string;
  fallback_model_antigravity: string;
  enable_identity_patch: boolean;
  identity_patch_prompt: string;

  ops_monitoring_enabled: boolean;
  ops_realtime_monitoring_enabled: boolean;
  ops_query_mode_default: "auto" | "raw" | "preagg" | string;
  ops_metrics_interval_seconds: number;

  min_claude_code_version: string;
  max_claude_code_version: string;
  allow_ungrouped_key_scheduling: boolean;
  scheduler_v2_enabled: boolean;
  scheduler_v2_status: string;
  scheduler_v2_error: string;
  scheduler_v2_candidate_limit: number;
  scheduler_v2_scan_limit: number;
  request_priority_admission_enabled: boolean;
  request_priority_pending_limit_per_instance: number;
  request_priority_pending_mib_per_instance: number;

  stream_mode_performance_enabled: boolean;
  openai_ws_mode_router_v2_enabled: boolean;

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
  openai_codex_client_version: string;
  openai_codex_client_version_synced: string;
  openai_codex_version_auto_sync_enabled: boolean;

  min_codex_version: string;
  max_codex_version: string;
  codex_cli_only_blacklist: string;
  codex_cli_only_whitelist: string;
  codex_cli_only_allow_app_server_clients: boolean;
  codex_cli_only_engine_fingerprint_signals: string;
  web_search_emulation_enabled: boolean;

  openai_low_upstream_rate_priority_enabled: boolean;
  openai_oauth_scheduling_rate_multiplier: number;
  openai_content_session_burst_balance_enabled: boolean;
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
  openai_advanced_scheduler_effective_lb_top_k: string;
  openai_advanced_scheduler_effective_weight_priority: string;
  openai_advanced_scheduler_effective_weight_load: string;
  openai_advanced_scheduler_effective_weight_queue: string;
  openai_advanced_scheduler_effective_weight_error_rate: string;
  openai_advanced_scheduler_effective_weight_ttft: string;
  openai_advanced_scheduler_effective_weight_reset: string;
  openai_advanced_scheduler_effective_weight_quota_headroom: string;
  openai_advanced_scheduler_effective_weight_upstream_cost: string;
  openai_advanced_scheduler_effective_weight_previous_response: string;
  openai_advanced_scheduler_effective_weight_session_sticky: string;

  account_quota_notify_enabled: boolean;
  account_quota_notify_emails: NotifyEmailEntry[];
  channel_monitor_enabled: boolean;
  channel_monitor_default_interval_seconds: number;
  openai_fast_policy_settings?: OpenAIFastPolicySettings;
}

type ReadOnlySettings =
  | "totp_encryption_key_configured"
  | "passkey_configured"
  | "passkey_rp_id"
  | "passkey_rp_origins"
  | "smtp_password_configured"
  | "client_ip_resolution_status"
  | "scheduler_v2_status"
  | "scheduler_v2_error"
  | "openai_codex_client_version_synced"
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

export type UpdateSettingsRequest = Partial<
  Omit<SystemSettings, ReadOnlySettings>
> & {
  smtp_password?: string;
};
