import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { AdminDataPayload } from '@/features/admin-accounts/domain/models/adminDataPayload'
import { AdminDataProxyDto } from '@/features/admin-accounts/data/models/adminDataProxyDto'
import { AdminDataAccountDto } from '@/features/admin-accounts/data/models/adminDataAccountDto'

export class AdminDataPayloadDto {
  @Expose() @Transform(({ value }) => value ?? '') type!: string
  @Expose() @Transform(({ value }) => value ?? 0) version!: number
  @Expose({ name: 'exported_at' }) @Transform(({ value }) => value ?? '') exportedAt!: string
  @Expose() @Type(() => AdminDataProxyDto) @Transform(({ value }) => value ?? [], { toClassOnly: true }) proxies!: AdminDataProxyDto[]
  @Expose() @Type(() => AdminDataAccountDto) @Transform(({ value }) => value ?? [], { toClassOnly: true }) accounts!: AdminDataAccountDto[]
  @Expose({ name: 'skipped_shadows' }) @Transform(({ value }) => value ?? 0) skippedShadows!: number

  static fromJson(json: unknown): AdminDataPayloadDto {
    return plainToInstance(AdminDataPayloadDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AdminDataPayload {
    const e = new AdminDataPayload()
    e.type = this.type
    e.version = this.version
    e.exportedAt = this.exportedAt
    e.proxies = (this.proxies ?? []).map(dto => dto.toEntity())
    e.accounts = (this.accounts ?? []).map(dto => dto.toEntity())
    e.skippedShadows = this.skippedShadows
    return e
  }
}
