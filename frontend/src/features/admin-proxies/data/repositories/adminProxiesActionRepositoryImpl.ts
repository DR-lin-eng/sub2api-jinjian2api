import { adminProxiesActionDatasource } from '@/features/admin-proxies/data/datasources/adminProxiesActionDatasource'
import type { AdminProxiesActionRepository } from '@/features/admin-proxies/domain/repositories/adminProxiesActionRepository'
import type { Proxy } from '@/features/admin-proxies/domain/models/proxy'
import type { CreateProxyRequest } from '@/features/admin-proxies/data/requests_models/createProxyRequest'
import type { UpdateProxyRequest } from '@/features/admin-proxies/data/requests_models/updateProxyRequest'
import type { BatchCreateProxyRequest } from '@/features/admin-proxies/data/requests_models/batchCreateProxyRequest'
import type { BatchDeleteProxyRequest } from '@/features/admin-proxies/data/requests_models/batchDeleteProxyRequest'
import type { AdminDataPayload } from '@/features/admin-accounts/domain/models/adminDataPayload'
import type { AdminDataImportResult } from '@/features/admin-accounts/domain/models/adminDataImportResult'

class AdminProxiesActionRepositoryImpl implements AdminProxiesActionRepository {
  private readonly ds = adminProxiesActionDatasource

  async create(req: CreateProxyRequest): Promise<Proxy> {
    return (await this.ds.create(req)).toEntity()
  }

  async update(id: number, req: UpdateProxyRequest): Promise<Proxy> {
    return (await this.ds.update(id, req)).toEntity()
  }

  async deleteProxy(id: number): Promise<{ message: string }> {
    return this.ds.deleteProxy(id)
  }

  async toggleStatus(id: number, status: 'active' | 'inactive'): Promise<Proxy> {
    return (await this.ds.toggleStatus(id, status)).toEntity()
  }

  async testProxy(id: number) {
    return this.ds.testProxy(id)
  }

  async batchCreate(req: BatchCreateProxyRequest): Promise<{ created: number; skipped: number }> {
    return this.ds.batchCreate(req)
  }

  async batchDelete(req: BatchDeleteProxyRequest) {
    return this.ds.batchDelete(req)
  }

  async importData(payload: { data: AdminDataPayload }): Promise<AdminDataImportResult> {
    return this.ds.importData(payload)
  }
}

export const adminProxiesActionRepository: AdminProxiesActionRepository = new AdminProxiesActionRepositoryImpl()
