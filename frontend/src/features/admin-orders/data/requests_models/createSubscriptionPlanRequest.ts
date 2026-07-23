export interface CreateSubscriptionPlanRequest {
  name: string
  group_id: number
  description: string
  price: number
  original_price?: number
  currency?: string
  validity_days: number
  validity_unit: string
  sort_order?: number
  for_sale?: boolean
  features?: string
}
