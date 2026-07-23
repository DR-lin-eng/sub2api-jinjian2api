import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UserErrorRequestDetail } from '@/features/admin-ops/domain/models/adminOps'
import { UserErrorRequestDto } from '@/features/admin-ops/data/models/userErrorRequestDto'

export class UserErrorRequestDetailDto extends UserErrorRequestDto {
  @Expose({ name: 'error_body' })
  @Transform(({ value }) => value ?? '')
  errorBody!: string

  @Expose({ name: 'upstream_status_code' })
  @Transform(({ value }) => value ?? null)
  upstreamStatusCode!: number | null

  static fromJson(json: unknown): UserErrorRequestDetailDto {
    return plainToInstance(UserErrorRequestDetailDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserErrorRequestDetail {
    const e = new UserErrorRequestDetail()
    e.id = this.id
    e.createdAt = this.createdAt
    e.model = this.model
    e.inboundEndpoint = this.inboundEndpoint
    e.statusCode = this.statusCode
    e.category = this.category
    e.platform = this.platform
    e.message = this.message
    e.keyName = this.keyName
    e.keyDeleted = this.keyDeleted
    e.clientIp = this.clientIp
    e.groupName = this.groupName
    e.requestType = this.requestType
    e.stream = this.stream
    e.userAgent = this.userAgent
    e.errorBody = this.errorBody
    e.upstreamStatusCode = this.upstreamStatusCode
    return e
  }
}

