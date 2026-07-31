import type { ErrorPassthroughRule } from '@/features/admin-settings/domain/models/errorPassthrough'

export interface ErrorPassthroughQueryRepository {
  list(): Promise<ErrorPassthroughRule[]>
  getById(id: number): Promise<ErrorPassthroughRule>
}
