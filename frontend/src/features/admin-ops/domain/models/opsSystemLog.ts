export class OpsSystemLog {
  id!: number
  createdAt!: string
  host!: string
  level!: string
  component!: string
  message!: string
  requestId!: string
  clientRequestId!: string
  userId!: number
  apiKeyId!: number
  accountId!: number
  platform!: string
  model!: string
  extra!: Record<string, unknown>
}
