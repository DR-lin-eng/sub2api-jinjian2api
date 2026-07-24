import type { PromptAuditMode } from '@/features/prompt-audit/enums/promptAuditMode'
import type { PromptAuditEndpointDraft } from './promptAuditEndpointDraft'

export class PromptAuditDraft {
  enabled!: boolean
  blockingEnabled!: boolean
  storePassEvents!: boolean
  effectiveMode!: PromptAuditMode
  strategy!: 'priority'
  workerCount!: number
  queueCapacity!: number
  scanners!: string[]
  allGroups!: boolean
  groupIds!: number[]
  endpoints!: PromptAuditEndpointDraft[]
  configVersion!: number
  updatedAt!: string
  updatedBy!: number
  changeSummary!: string
}
