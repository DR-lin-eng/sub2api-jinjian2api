import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UserAuthBindingStatus } from '@/core/models/domain/userAuthBindingStatus'

export class UserAuthBindingStatusDto {
  @Expose() @Transform(({ value }) => value ?? false) bound!: boolean
  @Expose({ name: 'bound_count' }) @Transform(({ value }) => value ?? 0) boundCount!: number
  @Expose() @Transform(({ value }) => value ?? '') provider!: string
  @Expose({ name: 'provider_key' }) @Transform(({ value }) => value ?? '') providerKey!: string
  @Expose({ name: 'provider_subject' }) @Transform(({ value }) => value ?? '') providerSubject!: string
  @Expose() @Transform(({ value }) => value ?? '') issuer!: string
  @Expose() @Transform(({ value }) => value ?? '') label!: string
  @Expose({ name: 'provider_label' }) @Transform(({ value }) => value ?? '') providerLabel!: string
  @Expose({ name: 'display_name' }) @Transform(({ value }) => value ?? '') displayName!: string
  @Expose({ name: 'subject_hint' }) @Transform(({ value }) => value ?? '') subjectHint!: string
  @Expose({ name: 'verified_at' }) @Transform(({ value }) => value ?? '') verifiedAt!: string
  @Expose({ name: 'bind_start_path' }) @Transform(({ value }) => value ?? '') bindStartPath!: string
  @Expose({ name: 'can_bind' }) @Transform(({ value }) => value ?? false) canBind!: boolean
  @Expose({ name: 'can_unbind' }) @Transform(({ value }) => value ?? false) canUnbind!: boolean
  @Expose({ name: 'note_key' }) @Transform(({ value }) => value ?? '') noteKey!: string
  @Expose() @Transform(({ value }) => value ?? '') note!: string
  @Expose() @Transform(({ value }) => value ?? {}) metadata!: Record<string, unknown>

  static fromJson(json: unknown): UserAuthBindingStatusDto {
    return plainToInstance(UserAuthBindingStatusDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserAuthBindingStatus {
    const e = new UserAuthBindingStatus()
    e.bound = this.bound
    e.boundCount = this.boundCount
    e.provider = this.provider
    e.providerKey = this.providerKey
    e.providerSubject = this.providerSubject
    e.issuer = this.issuer
    e.label = this.label
    e.providerLabel = this.providerLabel
    e.displayName = this.displayName
    e.subjectHint = this.subjectHint
    e.verifiedAt = this.verifiedAt
    e.bindStartPath = this.bindStartPath
    e.canBind = this.canBind
    e.canUnbind = this.canUnbind
    e.noteKey = this.noteKey
    e.note = this.note
    e.metadata = this.metadata
    return e
  }
}
