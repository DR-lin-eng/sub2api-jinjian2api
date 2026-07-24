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
