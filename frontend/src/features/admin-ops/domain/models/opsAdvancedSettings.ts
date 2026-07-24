import { OpsDataRetentionSettings } from './opsDataRetentionSettings'
import { OpsAggregationSettings } from './opsAggregationSettings'
import { OpsOpenAIQuotaAutoPauseSettings } from './opsOpenAIQuotaAutoPauseSettings'

export class OpsAdvancedSettings {
  dataRetention!: OpsDataRetentionSettings
  aggregation!: OpsAggregationSettings
  openaiAccountQuotaAutoPause!: OpsOpenAIQuotaAutoPauseSettings
  ignoreCountTokensErrors!: boolean
  ignoreContextCanceled!: boolean
  ignoreNoAvailableAccounts!: boolean
  ignoreInvalidApiKeyErrors!: boolean
  ignoreInsufficientBalanceErrors!: boolean
  displayOpenaiTokenStats!: boolean
  displayUserUsageStats!: boolean
  displayAlertEvents!: boolean
  displaySystemLogs!: boolean
  displayConcurrency!: boolean
  displaySwitchRateTrend!: boolean
  displayThroughputTrend!: boolean
  displayLatencyHistogram!: boolean
  displayErrorDistribution!: boolean
  displayErrorTrend!: boolean
  displayImageGenerationStats!: boolean
  autoRefreshEnabled!: boolean
  autoRefreshIntervalSeconds!: number
}
