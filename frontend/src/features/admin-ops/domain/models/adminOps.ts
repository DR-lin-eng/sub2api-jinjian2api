export class UserErrorRequest {
  id!: number
  createdAt!: string
  model!: string
  inboundEndpoint!: string
  statusCode!: number
  category!: string
  platform!: string
  message!: string
  keyName!: string
  keyDeleted!: boolean
  clientIp!: string
  groupName!: string
  requestType!: string
  stream!: boolean
  userAgent!: string
}

export class UserErrorRequestDetail extends UserErrorRequest {
  errorBody!: string
  upstreamStatusCode!: number | null
}

export class UserErrorListParams {
  page?: number
  pageSize?: number
  startDate?: string
  endDate?: string
  timezone?: string
  model?: string
  statusCode?: number
  category?: string
  apiKeyId?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
