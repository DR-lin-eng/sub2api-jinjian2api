import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UserErrorRequest } from '@/features/admin-ops/domain/models/adminOps'

export class UserErrorRequestDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  model!: string

  @Expose({ name: 'inbound_endpoint' })
  @Transform(({ value }) => value ?? '')
  inboundEndpoint!: string

  @Expose({ name: 'status_code' })
  @Transform(({ value }) => value ?? 0)
  statusCode!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  category!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  platform!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  message!: string

  @Expose({ name: 'key_name' })
  @Transform(({ value }) => value ?? '')
  keyName!: string

  @Expose({ name: 'key_deleted' })
  @Transform(({ value }) => value ?? false)
  keyDeleted!: boolean

  @Expose({ name: 'client_ip' })
  @Transform(({ value }) => value ?? '')
  clientIp!: string

  @Expose({ name: 'group_name' })
  @Transform(({ value }) => value ?? '')
  groupName!: string

  @Expose({ name: 'request_type' })
  @Transform(({ value }) => value ?? '')
  requestType!: string

  @Expose()
  @Transform(({ value }) => value ?? false)
  stream!: boolean

  @Expose({ name: 'user_agent' })
  @Transform(({ value }) => value ?? '')
  userAgent!: string

  static fromJson(json: unknown): UserErrorRequestDto {
    return plainToInstance(UserErrorRequestDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserErrorRequest {
    const e = new UserErrorRequest()
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
    return e
  }
}

