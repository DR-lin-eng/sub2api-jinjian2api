import 'reflect-metadata'
import { Expose, plainToInstance } from 'class-transformer'
import { UserErrorListParams } from '@/features/admin-ops/domain/models/adminOps'

export class UserErrorListParamsDto {
  @Expose()
  page?: number

  @Expose({ name: 'page_size' })
  pageSize?: number

  @Expose({ name: 'start_date' })
  startDate?: string

  @Expose({ name: 'end_date' })
  endDate?: string

  @Expose()
  timezone?: string

  @Expose()
  model?: string

  @Expose({ name: 'status_code' })
  statusCode?: number

  @Expose()
  category?: string

  @Expose({ name: 'api_key_id' })
  apiKeyId?: number

  @Expose({ name: 'sort_by' })
  sortBy?: string

  @Expose({ name: 'sort_order' })
  sortOrder?: 'asc' | 'desc'

  static fromJson(json: unknown): UserErrorListParamsDto {
    return plainToInstance(UserErrorListParamsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserErrorListParams {
    const e = new UserErrorListParams()
    e.page = this.page
    e.pageSize = this.pageSize
    e.startDate = this.startDate
    e.endDate = this.endDate
    e.timezone = this.timezone
    e.model = this.model
    e.statusCode = this.statusCode
    e.category = this.category
    e.apiKeyId = this.apiKeyId
    e.sortBy = this.sortBy
    e.sortOrder = this.sortOrder
    return e
  }
}

