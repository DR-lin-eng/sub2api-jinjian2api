import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { WebSearchEmulationConfig } from '@/features/admin-settings/domain/models/webSearchEmulationConfig'
import { WebSearchProviderConfigDto } from './webSearchProviderConfigDto'

export class WebSearchEmulationConfigDto {
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean

  @Expose()
  @Type(() => WebSearchProviderConfigDto)
  providers!: WebSearchProviderConfigDto[]

  static fromJson(json: unknown): WebSearchEmulationConfigDto {
    return plainToInstance(WebSearchEmulationConfigDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): WebSearchEmulationConfig {
    const e = new WebSearchEmulationConfig()
    e.enabled = this.enabled
    e.providers = (this.providers ?? []).map(p => p.toEntity())
    return e
  }
}
