import 'reflect-metadata'
import { Expose, Type, plainToInstance } from 'class-transformer'
import { BetaPolicySettings } from '@/features/admin-settings/domain/models/betaPolicySettings'
import { BetaPolicyRuleDto } from './betaPolicyRuleDto'

export class BetaPolicySettingsDto {
  @Expose()
  @Type(() => BetaPolicyRuleDto)
  rules!: BetaPolicyRuleDto[]

  static fromJson(json: unknown): BetaPolicySettingsDto {
    return plainToInstance(BetaPolicySettingsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BetaPolicySettings {
    const e = new BetaPolicySettings()
    e.rules = (this.rules ?? []).map(r => r.toEntity())
    return e
  }
}
