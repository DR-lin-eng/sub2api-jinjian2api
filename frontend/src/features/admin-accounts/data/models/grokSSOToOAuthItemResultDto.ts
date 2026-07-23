import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { GrokSSOToOAuthItemResult } from '@/features/admin-accounts/domain/models/grokSSOToOAuthItemResult'

export class GrokSSOToOAuthItemResultDto {
  @Expose() @Transform(({ value }) => value ?? 0) index!: number
  @Expose() @Transform(({ value }) => value ?? '') name!: string
  @Expose() @Transform(({ value }) => value ?? '') email!: string
  @Expose() account!: unknown
  @Expose() @Transform(({ value }) => value ?? '') error!: string

  static fromJson(json: unknown): GrokSSOToOAuthItemResultDto {
    return plainToInstance(GrokSSOToOAuthItemResultDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): GrokSSOToOAuthItemResult {
    const e = new GrokSSOToOAuthItemResult()
    e.index = this.index
    e.name = this.name
    e.email = this.email
    e.account = this.account
    e.error = this.error
    return e
  }
}
