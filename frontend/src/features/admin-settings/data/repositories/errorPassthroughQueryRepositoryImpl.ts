import { errorPassthroughQueryDatasource } from '@/features/admin-settings/data/datasources/errorPassthroughQueryDatasource'
import type { ErrorPassthroughQueryRepository } from '@/features/admin-settings/domain/repositories/errorPassthroughQueryRepository'
import type { ErrorPassthroughRule } from '@/features/admin-settings/domain/models/errorPassthrough'

class ErrorPassthroughQueryRepositoryImpl implements ErrorPassthroughQueryRepository {
  private readonly ds = errorPassthroughQueryDatasource

  list = async () : Promise<ErrorPassthroughRule[]>  => {
    return (await this.ds.list()).map(dto => dto.toEntity())
  }

  getById = async (id: number) : Promise<ErrorPassthroughRule>  => {
    return (await this.ds.getById(id)).toEntity()
  }
}

export const errorPassthroughQueryRepository: ErrorPassthroughQueryRepository = new ErrorPassthroughQueryRepositoryImpl()
