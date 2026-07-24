import type { ErrorPassthroughRule } from '@/features/admin-settings/domain/models/errorPassthrough'
import type { CreateErrorPassthroughRuleRequest } from '@/features/admin-settings/data/requests_models/createErrorPassthroughRuleRequest'
import type { UpdateErrorPassthroughRuleRequest } from '@/features/admin-settings/data/requests_models/updateErrorPassthroughRuleRequest'

export interface ErrorPassthroughActionRepository {
  create(req: CreateErrorPassthroughRuleRequest): Promise<ErrorPassthroughRule>
  update(id: number, req: UpdateErrorPassthroughRuleRequest): Promise<ErrorPassthroughRule>
  deleteRule(id: number): Promise<{ message: string }>
  toggleEnabled(id: number, enabled: boolean): Promise<ErrorPassthroughRule>
}
