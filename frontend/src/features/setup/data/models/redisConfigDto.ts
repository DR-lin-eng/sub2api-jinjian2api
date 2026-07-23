import type { RedisConfig } from '@/features/setup/domain/models/redisConfig'

export interface RedisConfigDto {
  host: string
  port: number
  password: string
  db: number
  enable_tls: boolean
}

export function toEntity(dto: RedisConfigDto): RedisConfig {
  return {
    host: dto.host ?? '',
    port: dto.port ?? 6379,
    password: dto.password ?? '',
    db: dto.db ?? 0,
    enableTls: dto.enable_tls ?? false,
  }
}
