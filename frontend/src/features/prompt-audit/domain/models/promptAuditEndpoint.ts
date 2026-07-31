export class PromptAuditEndpoint {
  id!: string
  name!: string
  protocol!: 'openai_compatible'
  baseUrl!: string
  model!: string
  timeoutMs!: number
  inputLimit!: number
  enabled!: boolean
  hasToken!: boolean
  tokenStatus!: string
}
