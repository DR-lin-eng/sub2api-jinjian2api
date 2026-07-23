export interface CreateGroupRequest {
  name: string
  description?: string | null
  platform?: 'anthropic' | 'openai' | 'gemini' | 'antigravity' | 'grok' | 'composite'
  rate_multiplier?: number
  is_exclusive?: boolean
  subscription_type?: 'standard' | 'subscription'
  daily_limit_usd?: number | null
  weekly_limit_usd?: number | null
  monthly_limit_usd?: number | null
  allow_image_generation?: boolean
  openai_force_image_tool?: boolean
  allow_batch_image_generation?: boolean
  image_rate_independent?: boolean
  image_rate_multiplier?: number
  batch_image_discount_multiplier?: number
  batch_image_hold_multiplier?: number
  image_price_1k?: number | null
  image_price_2k?: number | null
  image_price_4k?: number | null
  video_rate_independent?: boolean
  video_rate_multiplier?: number
  video_price_480p?: number | null
  video_price_720p?: number | null
  video_price_1080p?: number | null
  web_search_price_per_call?: number | null
  peak_rate_enabled?: boolean
  peak_start?: string
  peak_end?: string
  peak_rate_multiplier?: number
  claude_code_only?: boolean
  fallback_group_id?: number | null
  fallback_group_id_on_invalid_request?: number | null
  mcp_xml_inject?: boolean
  supported_model_scopes?: string[]
  models_list_config?: {
    enabled: boolean
    models: string[]
  }
  allow_messages_dispatch?: boolean
  default_mapped_model?: string
  messages_dispatch_model_config?: {
    opus_mapped_model?: string
    sonnet_mapped_model?: string
    haiku_mapped_model?: string
    exact_model_mappings?: Record<string, string>
  }
  model_routing?: Record<string, number[]> | null
  model_routing_enabled?: boolean
  rpm_limit?: number
  require_oauth_only?: boolean
  require_privacy_set?: boolean
  copy_accounts_from_group_ids?: number[]
}
