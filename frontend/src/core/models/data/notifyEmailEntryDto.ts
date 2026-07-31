import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { NotifyEmailEntry } from '@/core/models/domain/notifyEmailEntry'

export class NotifyEmailEntryDto {
  @Expose() @Transform(({ value }) => value ?? '') email!: string
  @Expose() @Transform(({ value }) => value ?? false) disabled!: boolean
  @Expose() @Transform(({ value }) => value ?? false) verified!: boolean

  static fromJson(json: unknown): NotifyEmailEntryDto {
    return plainToInstance(NotifyEmailEntryDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): NotifyEmailEntry {
    const e = new NotifyEmailEntry()
    e.email = this.email
    e.disabled = this.disabled
    e.verified = this.verified
    return e
  }
}
