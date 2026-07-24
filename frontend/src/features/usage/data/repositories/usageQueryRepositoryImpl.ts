import { usageQueryDatasource } from '@/features/usage/data/datasources/usageQueryDatasource'
import type { UsageQueryRepository } from '@/features/usage/domain/repositories/usageQueryRepository'

class UsageQueryRepositoryImpl implements UsageQueryRepository {
  private readonly ds = usageQueryDatasource

  list: UsageQueryRepository['list'] = (...args) => this.ds.list(...args)
  query: UsageQueryRepository['query'] = (...args) => this.ds.query(...args)
  getStats: UsageQueryRepository['getStats'] = (...args) => this.ds.getStats(...args)
  getStatsByDateRange: UsageQueryRepository['getStatsByDateRange'] = (...args) => this.ds.getStatsByDateRange(...args)
  getByDateRange: UsageQueryRepository['getByDateRange'] = (...args) => this.ds.getByDateRange(...args)
  getById: UsageQueryRepository['getById'] = (...args) => this.ds.getById(...args)

  async getDashboardStats() {
    return (await this.ds.getDashboardStats()).toEntity()
  }

  async getDashboardTrend(params?: Parameters<UsageQueryRepository['getDashboardTrend']>[0]) {
    return (await this.ds.getDashboardTrend(params)).toEntity()
  }

  async getDashboardModels(params?: Parameters<UsageQueryRepository['getDashboardModels']>[0]) {
    return (await this.ds.getDashboardModels(params)).toEntity()
  }

  async getMyApiKeyDailyUsage(apiKeyId: number, days?: number) {
    return (await this.ds.getMyApiKeyDailyUsage(apiKeyId, days)).toEntity()
  }

  async getDashboardSnapshotV2(params?: Parameters<UsageQueryRepository['getDashboardSnapshotV2']>[0]) {
    return (await this.ds.getDashboardSnapshotV2(params)).toEntity()
  }

  async getDashboardApiKeysUsage(
    req: Parameters<UsageQueryRepository['getDashboardApiKeysUsage']>[0],
    options?: Parameters<UsageQueryRepository['getDashboardApiKeysUsage']>[1],
  ) {
    return (await this.ds.getDashboardApiKeysUsage(req, options)).toEntity()
  }

  listMyErrorRequests: UsageQueryRepository['listMyErrorRequests'] = (...args) => this.ds.listMyErrorRequests(...args)
  getMyErrorDetail: UsageQueryRepository['getMyErrorDetail'] = (...args) => this.ds.getMyErrorDetail(...args)
}

export const usageQueryRepository: UsageQueryRepository = new UsageQueryRepositoryImpl()
