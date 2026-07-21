/**
 * AdminChannelMonitorTemplateRepositoryImpl. Auto-generated from adminChannelMonitorTemplateDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-channel-monitor/data/datasources/adminChannelMonitorTemplateDatasource'
import type { AdminChannelMonitorTemplateRepository } from '@/features/admin-channel-monitor/domain/repositories/adminChannelMonitorTemplateRepository'

export class AdminChannelMonitorTemplateRepositoryImpl implements AdminChannelMonitorTemplateRepository {
  list = ds.list
  get = ds.get
  create = ds.create
  update = ds.update
  del = ds.del
  apply = ds.apply
  listAssociatedMonitors = ds.listAssociatedMonitors
}

export const adminChannelMonitorTemplateRepository: AdminChannelMonitorTemplateRepository = new AdminChannelMonitorTemplateRepositoryImpl()
