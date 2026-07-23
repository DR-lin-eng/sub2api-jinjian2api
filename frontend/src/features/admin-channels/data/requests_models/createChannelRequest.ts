import type { BillingModelSource } from '@/core/constants/channel'

export interface CreateChannelRequest {
  name: string
  description?: string
  group_ids?: number[]
  model_pricing?: {
    id?: number
    platform: string
    models: string[]
    billing_mode: string
    input_price: number | null
    output_price: number | null
    cache_write_price: number | null
    cache_read_price: number | null
    image_input_price: number | null
    image_output_price: number | null
    per_request_price: number | null
    intervals: {
      id?: number
      min_tokens: number
      max_tokens: number | null
      tier_label: string
      input_price: number | null
      output_price: number | null
      cache_write_price: number | null
      cache_read_price: number | null
      per_request_price: number | null
      sort_order: number
    }[]
  }[]
  model_mapping?: Record<string, Record<string, string>>
  billing_model_source?: BillingModelSource
  restrict_models?: boolean
  features_config?: Record<string, unknown>
  apply_pricing_to_account_stats?: boolean
  account_stats_pricing_rules?: {
    id?: number
    name: string
    group_ids: number[]
    account_ids: number[]
    pricing: {
      id?: number
      platform: string
      models: string[]
      billing_mode: string
      input_price: number | null
      output_price: number | null
      cache_write_price: number | null
      cache_read_price: number | null
      image_input_price: number | null
      image_output_price: number | null
      per_request_price: number | null
      intervals: {
        id?: number
        min_tokens: number
        max_tokens: number | null
        tier_label: string
        input_price: number | null
        output_price: number | null
        cache_write_price: number | null
        cache_read_price: number | null
        per_request_price: number | null
        sort_order: number
      }[]
    }[]
  }[]
}
