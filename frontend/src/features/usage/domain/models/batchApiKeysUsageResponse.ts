import type { BatchApiKeyUsageStats } from './batchApiKeyUsageStats'

export class BatchApiKeysUsageResponse {
  stats!: Record<string, BatchApiKeyUsageStats>
}
