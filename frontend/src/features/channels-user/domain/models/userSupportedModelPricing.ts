export interface UserSupportedModelPricing {
  billingMode: string
  inputPrice: number | null
  outputPrice: number | null
  cacheWritePrice: number | null
  cacheReadPrice: number | null
}
