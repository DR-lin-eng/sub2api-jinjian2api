import type { Proxy } from '@/features/admin-proxies/domain/models/proxy'
import type { CreateProxyRequest } from '@/features/admin-proxies/data/requests_models/createProxyRequest'
import type { UpdateProxyRequest } from '@/features/admin-proxies/data/requests_models/updateProxyRequest'
import type { BatchCreateProxyRequest } from '@/features/admin-proxies/data/requests_models/batchCreateProxyRequest'
import type { BatchDeleteProxyRequest } from '@/features/admin-proxies/data/requests_models/batchDeleteProxyRequest'
import type { AdminDataPayload } from '@/features/admin-accounts/domain/models/adminDataPayload'
import type { AdminDataImportResult } from '@/features/admin-accounts/domain/models/adminDataImportResult'

export interface AdminProxiesActionRepository {
  create(req: CreateProxyRequest): Promise<Proxy>
  update(id: number, req: UpdateProxyRequest): Promise<Proxy>
  deleteProxy(id: number): Promise<{ message: string }>
  toggleStatus(id: number, status: 'active' | 'inactive'): Promise<Proxy>
  testProxy(id: number): Promise<{
    success: boolean
    message: string
    latency_ms?: number
    ip_address?: string
    city?: string
    region?: string
    country?: string
    country_code?: string
  }>
  batchCreate(req: BatchCreateProxyRequest): Promise<{ created: number; skipped: number }>
  batchDelete(req: BatchDeleteProxyRequest): Promise<{
    deleted_ids: number[]
    skipped: Array<{ id: number; reason: string }>
  }>
  importData(payload: { data: AdminDataPayload }): Promise<AdminDataImportResult>
}
