import type { OpenAIResponsesMode } from '@/features/admin-accounts/enums/openAIResponsesMode'

export type OpenAIResponsesState = {
  openaiResponsesMode?: OpenAIResponsesMode
  openaiResponsesSupported?: boolean
}
