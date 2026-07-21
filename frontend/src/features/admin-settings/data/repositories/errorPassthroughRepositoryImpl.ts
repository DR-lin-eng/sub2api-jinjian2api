/**
 * ErrorPassthroughRepositoryImpl. Auto-generated from errorPassthroughDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-settings/data/datasources/errorPassthroughDatasource'
import type { ErrorPassthroughRepository } from '@/features/admin-settings/domain/repositories/errorPassthroughRepository'

export class ErrorPassthroughRepositoryImpl implements ErrorPassthroughRepository {
  get list(): typeof ds.list { return ds.list }
  get getById(): typeof ds.getById { return ds.getById }
  get create(): typeof ds.create { return ds.create }
  get update(): typeof ds.update { return ds.update }
  get deleteRule(): typeof ds.deleteRule { return ds.deleteRule }
  get toggleEnabled(): typeof ds.toggleEnabled { return ds.toggleEnabled }
}

export const errorPassthroughRepository: ErrorPassthroughRepository = new ErrorPassthroughRepositoryImpl()
