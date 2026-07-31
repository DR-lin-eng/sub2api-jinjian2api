import type { CheckResult } from '@/features/admin-channel-monitor/domain/models/checkResult'

export class RunNowResponse {
  results!: CheckResult[]
}
