import type { PromptAuditEndpoint } from './promptAuditEndpoint'

import type { PromptAuditMode } from '@/features/prompt-audit/enums/promptAuditMode'

export class PromptAuditConfig {
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
  endpoints!: PromptAuditEndpoint[]
  configVersion!: number
  updatedAt!: string
  updatedBy!: number
  changeSummary!: string
}
