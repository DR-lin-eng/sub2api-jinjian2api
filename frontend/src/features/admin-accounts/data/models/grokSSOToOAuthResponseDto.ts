import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { GrokSSOToOAuthResponse } from '@/features/admin-accounts/domain/models/grokSSOToOAuthResponse'
import { GrokSSOToOAuthItemResultDto } from '@/features/admin-accounts/data/models/grokSSOToOAuthItemResultDto'

export class GrokSSOToOAuthResponseDto {
  @Expose() @Type(() => GrokSSOToOAuthItemResultDto) @Transform(({ value }) => value ?? [], { toClassOnly: true }) created!: GrokSSOToOAuthItemResultDto[]
  @Expose() @Type(() => GrokSSOToOAuthItemResultDto) @Transform(({ value }) => value ?? [], { toClassOnly: true }) failed!: GrokSSOToOAuthItemResultDto[]

  static fromJson(json: unknown): GrokSSOToOAuthResponseDto {
    return plainToInstance(GrokSSOToOAuthResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): GrokSSOToOAuthResponse {
    const e = new GrokSSOToOAuthResponse()
    e.created = (this.created ?? []).map(dto => dto.toEntity())
    e.failed = (this.failed ?? []).map(dto => dto.toEntity())
    return e
  }
}
