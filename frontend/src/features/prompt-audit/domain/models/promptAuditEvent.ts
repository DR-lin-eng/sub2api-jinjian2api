import type { PromptSnapshot } from './promptSnapshot'
import type { PromptIssueSummary } from './promptIssueSummary'

import type { PromptDecision, PromptRiskLevel } from '@/features/prompt-audit/enums/promptAuditEnums'

export class PromptAuditEvent {
  id!: number
  jobId!: number
  snapshot!: PromptSnapshot
  decision!: PromptDecision
  riskLevel!: PromptRiskLevel
  action!: string
  categories!: string[]
  matchedScanners!: string[]
  scannerScores!: Record<string, number>
  scannerEvidence!: Record<string, string>
  scannerBackend!: string
  scannerVersion!: string
  guardEndpointId!: string
  policyId!: string
  policyVersion!: number
  configVersion!: number
  chunkTotal!: number
  latencyMs!: number
  issueSummaries!: PromptIssueSummary[]
  createdAt!: string
}
