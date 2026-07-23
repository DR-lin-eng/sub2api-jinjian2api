import type { ErrorPassthroughRule } from '@/features/admin-settings/domain/models/errorPassthrough'

export interface ErrorPassthroughRuleDto {
  id: number
  name: string
  enabled: boolean
  priority: number
  error_codes: number[]
  keywords: string[]
  match_mode: 'any' | 'all'
  platforms: string[]
  passthrough_code: boolean
  response_code: number | null
  passthrough_body: boolean
  custom_message: string | null
  skip_monitoring: boolean
  description: string | null
  created_at: string
  updated_at: string
}

export function toEntity(dto: ErrorPassthroughRuleDto): ErrorPassthroughRule {
  return {
    id: dto.id,
    name: dto.name ?? '',
    enabled: dto.enabled ?? false,
    priority: dto.priority ?? 0,
    errorCodes: dto.error_codes ?? [],
    keywords: dto.keywords ?? [],
    matchMode: dto.match_mode ?? 'any',
    platforms: dto.platforms ?? [],
    passthroughCode: dto.passthrough_code ?? false,
    responseCode: dto.response_code ?? null,
    passthroughBody: dto.passthrough_body ?? false,
    customMessage: dto.custom_message ?? null,
    skipMonitoring: dto.skip_monitoring ?? false,
    description: dto.description ?? null,
    createdAt: dto.created_at ?? '',
    updatedAt: dto.updated_at ?? '',
  }
}
