import { errorPassthroughActionDatasource } from '@/features/admin-settings/data/datasources/errorPassthroughActionDatasource'
import type { ErrorPassthroughActionRepository } from '@/features/admin-settings/domain/repositories/errorPassthroughActionRepository'
import type { ErrorPassthroughRule } from '@/features/admin-settings/domain/models/errorPassthrough'
import type { CreateErrorPassthroughRuleRequest } from '@/features/admin-settings/data/requests_models/createErrorPassthroughRuleRequest'
import type { UpdateErrorPassthroughRuleRequest } from '@/features/admin-settings/data/requests_models/updateErrorPassthroughRuleRequest'

class ErrorPassthroughActionRepositoryImpl implements ErrorPassthroughActionRepository {
  private readonly ds = errorPassthroughActionDatasource

  create = async (req: CreateErrorPassthroughRuleRequest) : Promise<ErrorPassthroughRule>  => {
    return (await this.ds.create(req)).toEntity()
  }

  update = async (id: number, req: UpdateErrorPassthroughRuleRequest) : Promise<ErrorPassthroughRule>  => {
    return (await this.ds.update(id, req)).toEntity()
  }

  deleteRule = async (id: number) : Promise<{ message: string }>  => {
    return this.ds.deleteRule(id)
  }

  toggleEnabled = async (id: number, enabled: boolean) : Promise<ErrorPassthroughRule>  => {
    return (await this.ds.toggleEnabled(id, enabled)).toEntity()
  }
}

export const errorPassthroughActionRepository: ErrorPassthroughActionRepository = new ErrorPassthroughActionRepositoryImpl()
