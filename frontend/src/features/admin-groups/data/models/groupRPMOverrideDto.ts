import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { GroupRPMOverride } from '@/features/admin-groups/domain/models/groupRPMOverride'

export class GroupRPMOverrideDto {
  @Expose({ name: 'user_id' }) @Transform(({ value }) => value ?? 0) userId!: number
  @Expose({ name: 'user_name' }) @Transform(({ value }) => value ?? '') userName!: string
  @Expose({ name: 'user_email' }) @Transform(({ value }) => value ?? '') userEmail!: string
  @Expose({ name: 'user_notes' }) @Transform(({ value }) => value ?? '') userNotes!: string
  @Expose({ name: 'user_status' }) @Transform(({ value }) => value ?? '') userStatus!: string
  @Expose({ name: 'rpm_override' }) @Transform(({ value }) => value ?? 0) rpmOverride!: number

  static fromJson(json: unknown): GroupRPMOverrideDto {
    return plainToInstance(GroupRPMOverrideDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): GroupRPMOverride {
    const e = new GroupRPMOverride()
    e.userId = this.userId
    e.userName = this.userName
    e.userEmail = this.userEmail
    e.userNotes = this.userNotes
    e.userStatus = this.userStatus
    e.rpmOverride = this.rpmOverride
    return e
  }
}
