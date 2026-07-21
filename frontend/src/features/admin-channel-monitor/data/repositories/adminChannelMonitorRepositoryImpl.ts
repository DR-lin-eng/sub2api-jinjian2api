/**
 * AdminChannelMonitorRepositoryImpl. Auto-generated from adminChannelMonitorDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-channel-monitor/data/datasources/adminChannelMonitorDatasource'
import type { AdminChannelMonitorRepository } from '@/features/admin-channel-monitor/domain/repositories/adminChannelMonitorRepository'

export class AdminChannelMonitorRepositoryImpl implements AdminChannelMonitorRepository {
  get list(): typeof ds.list { return ds.list }
  get get(): typeof ds.get { return ds.get }
  get create(): typeof ds.create { return ds.create }
  get duplicate(): typeof ds.duplicate { return ds.duplicate }
  get update(): typeof ds.update { return ds.update }
  get del(): typeof ds.del { return ds.del }
  get runNow(): typeof ds.runNow { return ds.runNow }
  get listHistory(): typeof ds.listHistory { return ds.listHistory }
}

export const adminChannelMonitorRepository: AdminChannelMonitorRepository = new AdminChannelMonitorRepositoryImpl()
