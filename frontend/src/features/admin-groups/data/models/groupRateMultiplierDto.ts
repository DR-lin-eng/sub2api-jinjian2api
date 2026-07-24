import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { GroupRateMultiplier } from '@/features/admin-groups/domain/models/groupRateMultiplier'

export class GroupRateMultiplierDto {
  @Expose({ name: 'user_id' }) @Transform(({ value }) => value ?? 0) userId!: number
  @Expose({ name: 'user_name' }) @Transform(({ value }) => value ?? '') userName!: string
  @Expose({ name: 'user_email' }) @Transform(({ value }) => value ?? '') userEmail!: string
  @Expose({ name: 'user_notes' }) @Transform(({ value }) => value ?? '') userNotes!: string
  @Expose({ name: 'user_status' }) @Transform(({ value }) => value ?? '') userStatus!: string
  @Expose({ name: 'rate_multiplier' }) @Transform(({ value }) => value ?? 1) rateMultiplier!: number

  static fromJson(json: unknown): GroupRateMultiplierDto {
    return plainToInstance(GroupRateMultiplierDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): GroupRateMultiplier {
    const e = new GroupRateMultiplier()
    e.userId = this.userId
    e.userName = this.userName
    e.userEmail = this.userEmail
    e.userNotes = this.userNotes
    e.userStatus = this.userStatus
    e.rateMultiplier = this.rateMultiplier
    return e
  }
}
