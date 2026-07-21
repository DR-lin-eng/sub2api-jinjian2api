/**
 * AdminChannelMonitorTemplateRepositoryImpl. Auto-generated from adminChannelMonitorTemplateDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-channel-monitor/data/datasources/adminChannelMonitorTemplateDatasource'
import type { AdminChannelMonitorTemplateRepository } from '@/features/admin-channel-monitor/domain/repositories/adminChannelMonitorTemplateRepository'

export class AdminChannelMonitorTemplateRepositoryImpl implements AdminChannelMonitorTemplateRepository {
  get list(): typeof ds.list { return ds.list }
  get get(): typeof ds.get { return ds.get }
  get create(): typeof ds.create { return ds.create }
  get update(): typeof ds.update { return ds.update }
  get del(): typeof ds.del { return ds.del }
  get apply(): typeof ds.apply { return ds.apply }
  get listAssociatedMonitors(): typeof ds.listAssociatedMonitors { return ds.listAssociatedMonitors }
}

export const adminChannelMonitorTemplateRepository: AdminChannelMonitorTemplateRepository = new AdminChannelMonitorTemplateRepositoryImpl()
