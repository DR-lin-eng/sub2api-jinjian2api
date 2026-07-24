import type { PromptAuditEndpoint } from './promptAuditEndpoint'

export class PromptAuditEndpointDraft implements PromptAuditEndpoint {
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
  token!: string
  clearToken!: boolean
}
