import type { OpsErrorOwner, OpsErrorSource } from '@/features/admin-ops/enums/opsErrorEnums'

export class OpsErrorLog {
  id!: number
  createdAt!: string
  phase!: string
  type!: string
  errorOwner!: OpsErrorOwner
  errorSource!: OpsErrorSource
  severity!: string
  statusCode!: number
  platform!: string
  model!: string
  resolved!: boolean
  resolvedAt!: string
  resolvedByUserId!: number
  clientRequestId!: string
  requestId!: string
  message!: string
  userId!: number
  userEmail!: string
  apiKeyId!: number
  apiKeyName!: string
  apiKeyDeleted!: boolean
  accountId!: number
  accountName!: string
  groupId!: number
  groupName!: string
  clientIp!: string
  requestPath!: string
  stream!: boolean
  inboundEndpoint!: string
  upstreamEndpoint!: string
  requestedModel!: string
  upstreamModel!: string
  requestType!: number
  userAgent!: string
}
