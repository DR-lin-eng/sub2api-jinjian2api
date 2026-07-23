import type { DatabaseConfig } from '@/features/setup/domain/models/databaseConfig'

export interface DatabaseConfigDto {
  host: string
  port: number
  user: string
  password: string
  dbname: string
  sslmode: string
}

export function toEntity(dto: DatabaseConfigDto): DatabaseConfig {
  return {
    host: dto.host ?? '',
    port: dto.port ?? 5432,
    user: dto.user ?? '',
    password: dto.password ?? '',
    dbname: dto.dbname ?? '',
    sslmode: dto.sslmode ?? 'disable',
  }
}
