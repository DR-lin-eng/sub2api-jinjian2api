import type { UserSupportedModelPricing } from '@/features/channels-user/domain/models/userSupportedModelPricing'

export interface UserSupportedModelPricingDto {
  billing_mode: string
  input_price: number | null
  output_price: number | null
  cache_write_price: number | null
  cache_read_price: number | null
}

export function toEntity(dto: UserSupportedModelPricingDto): UserSupportedModelPricing {
  return {
    billingMode: dto.billing_mode ?? '',
    inputPrice: dto.input_price ?? null,
    outputPrice: dto.output_price ?? null,
    cacheWritePrice: dto.cache_write_price ?? null,
    cacheReadPrice: dto.cache_read_price ?? null,
  }
}
