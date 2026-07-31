import type { OpsRequestKind } from '@/features/admin-ops/enums/opsRequestKind'

export class OpsRequestDetail {
  kind!: OpsRequestKind
  createdAt!: string
  requestId!: string
  platform!: string
  model!: string
  durationMs!: number
  firstTokenMs!: number
  statusCode!: number
  errorId!: number
  phase!: string
  severity!: string
  message!: string
  userId!: number
  apiKeyId!: number
  accountId!: number
  groupId!: number
  stream!: boolean
}
