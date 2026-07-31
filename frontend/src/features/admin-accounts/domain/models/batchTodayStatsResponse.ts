import { WindowStats } from '@/features/admin-accounts/domain/models/windowStats'

export class BatchTodayStatsResponse {
  stats!: Record<string, WindowStats>
}
