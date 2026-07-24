import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { DefaultSubscriptionSetting } from '@/features/admin-settings/domain/models/defaultSubscriptionSetting'

export class DefaultSubscriptionSettingDto {
  @Expose({ name: 'group_id' }) @Transform(({ value }) => value ?? 0) groupId!: number
  @Expose({ name: 'validity_days' }) @Transform(({ value }) => value ?? 0) validityDays!: number

  static fromJson(json: unknown): DefaultSubscriptionSettingDto {
    return plainToInstance(DefaultSubscriptionSettingDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): DefaultSubscriptionSetting {
    const e = new DefaultSubscriptionSetting()
    e.groupId = this.groupId
    e.validityDays = this.validityDays
    return e
  }
}
