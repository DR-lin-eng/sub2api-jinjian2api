import type { Group } from './group'
import type { ModelsListConfig } from './modelsListConfig'
import type { OpenAIMessagesDispatchModelConfig } from './openAIMessagesDispatchModelConfig'

export class AdminGroup implements Group {
  id!: number
  name!: string
  description!: string | null
  platform!: 'anthropic' | 'openai' | 'gemini' | 'antigravity' | 'grok' | 'composite'
  rateMultiplier!: number
  rpmLimit?: number
  isExclusive!: boolean
  status!: 'active' | 'inactive'
  subscriptionType!: 'standard' | 'subscription'
  dailyLimitUsd!: number | null
  weeklyLimitUsd!: number | null
  monthlyLimitUsd!: number | null
  allowImageGeneration!: boolean
  openaiForceImageTool!: boolean
  allowBatchImageGeneration!: boolean
  imageRateIndependent!: boolean
  imageRateMultiplier!: number
  batchImageDiscountMultiplier!: number
  batchImageHoldMultiplier!: number
  imagePrice1k!: number | null
  imagePrice2k!: number | null
  imagePrice4k!: number | null
  videoRateIndependent!: boolean
  videoRateMultiplier!: number
  videoPrice480p!: number | null
  videoPrice720p!: number | null
  videoPrice1080p!: number | null
  webSearchPricePerCall!: number | null
  peakRateEnabled!: boolean
  peakStart!: string
  peakEnd!: string
  peakRateMultiplier!: number
  claudeCodeOnly!: boolean
  fallbackGroupId!: number | null
  fallbackGroupIdOnInvalidRequest!: number | null
  allowMessagesDispatch?: boolean
  defaultMappedModel?: string
  messagesDispatchModelConfig?: OpenAIMessagesDispatchModelConfig
  requireOauthOnly!: boolean
  requirePrivacySet!: boolean
  createdAt!: string
  updatedAt!: string

  modelRouting!: Record<string, number[]> | null
  modelRoutingEnabled!: boolean
  mcpXmlInject!: boolean
  supportedModelScopes?: string[]
  accountCount?: number
  activeAccountCount?: number
  rateLimitedAccountCount?: number
  modelsListConfig?: ModelsListConfig
  sortOrder!: number
}
