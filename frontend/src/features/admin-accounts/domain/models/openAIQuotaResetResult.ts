import { OpenAIQuotaResetCredit } from '@/features/admin-accounts/domain/models/openAIQuotaResetCredit'

export class OpenAIQuotaResetResult {
  code!: string
  credit?: OpenAIQuotaResetCredit
  windowsReset!: number
}
