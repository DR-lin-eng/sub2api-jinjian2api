/**
 * AdminChannelMonitorRepositoryImpl. Auto-generated from adminChannelMonitorDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-channel-monitor/data/datasources/adminChannelMonitorDatasource'
import type { AdminChannelMonitorRepository } from '@/features/admin-channel-monitor/domain/repositories/adminChannelMonitorRepository'

export class AdminChannelMonitorRepositoryImpl implements AdminChannelMonitorRepository {
  list = ds.list
  get = ds.get
  create = ds.create
  duplicate = ds.duplicate
  update = ds.update
  del = ds.del
  runNow = ds.runNow
  listHistory = ds.listHistory
}

export const adminChannelMonitorRepository: AdminChannelMonitorRepository = new AdminChannelMonitorRepositoryImpl()
