import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UpdateApiKeyGroupResult } from '@/features/admin-usage/domain/models/updateApiKeyGroupResult'

export class UpdateApiKeyGroupResultDto {
  @Expose({ name: 'api_key' }) apiKey!: { id: number }
  @Expose({ name: 'auto_granted_group_access' }) @Transform(({ value }) => value ?? false) autoGrantedGroupAccess!: boolean
  @Expose({ name: 'granted_group_id' }) @Transform(({ value }) => value ?? 0) grantedGroupId!: number
  @Expose({ name: 'granted_group_name' }) @Transform(({ value }) => value ?? '') grantedGroupName!: string

  static fromJson(json: unknown): UpdateApiKeyGroupResultDto {
    return plainToInstance(UpdateApiKeyGroupResultDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UpdateApiKeyGroupResult {
    const e = new UpdateApiKeyGroupResult()
    e.apiKeyId = this.apiKey?.id ?? 0
    e.autoGrantedGroupAccess = this.autoGrantedGroupAccess
    e.grantedGroupId = this.grantedGroupId
    e.grantedGroupName = this.grantedGroupName
    return e
  }
}
