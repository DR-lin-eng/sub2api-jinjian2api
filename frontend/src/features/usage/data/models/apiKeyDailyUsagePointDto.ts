import type { ApiKeyDailyUsagePoint } from '@/features/usage/domain/models/apiKeyDailyUsagePoint'

export interface ApiKeyDailyUsagePointDto {
  date: string
  requests: number
  input_tokens: number
  output_tokens: number
  cache_read_tokens: number
  cache_write_tokens: number
  total_tokens: number
}

export function toEntity(dto: ApiKeyDailyUsagePointDto): ApiKeyDailyUsagePoint {
  return {
    date: dto.date ?? '',
    requests: dto.requests ?? 0,
    inputTokens: dto.input_tokens ?? 0,
    outputTokens: dto.output_tokens ?? 0,
    cacheReadTokens: dto.cache_read_tokens ?? 0,
    cacheWriteTokens: dto.cache_write_tokens ?? 0,
    totalTokens: dto.total_tokens ?? 0,
  }
}
