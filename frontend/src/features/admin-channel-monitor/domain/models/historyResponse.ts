import type { HistoryItem } from '@/features/admin-channel-monitor/domain/models/historyItem'

export class HistoryResponse {
  items!: HistoryItem[]
}
