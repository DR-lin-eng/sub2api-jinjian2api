import { apiClient } from '@/core/networks/client'
import { RedeemCodeDto } from '@/features/admin-redeem/data/models/redeemCodeDto'
import type { GenerateRedeemCodesRequest } from '@/features/admin-redeem/data/requests_models/generateRedeemCodesRequest'
import type { BatchUpdateRedeemCodesRequest } from '@/features/admin-redeem/data/requests_models/batchUpdateRedeemCodesRequest'
import type { BatchDeleteRedeemCodesRequest } from '@/features/admin-redeem/data/requests_models/batchDeleteRedeemCodesRequest'

export class AdminRedeemActionDatasource {
  async generate(req: GenerateRedeemCodesRequest): Promise<RedeemCodeDto[]> {
    const { data } = await apiClient.post<unknown[]>('/admin/redeem-codes/generate', req)
    return data.map(item => RedeemCodeDto.fromJson(item))
  }

  async deleteCode(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/redeem-codes/${id}`)
    return data
  }

  async batchDelete(req: BatchDeleteRedeemCodesRequest): Promise<{ deleted: number; message: string }> {
    const { data } = await apiClient.post<{ deleted: number; message: string }>('/admin/redeem-codes/batch-delete', req)
    return data
  }

  async batchUpdate(req: BatchUpdateRedeemCodesRequest): Promise<{ updated: number; message: string }> {
    const { data } = await apiClient.post<{ updated: number; message: string }>('/admin/redeem-codes/batch-update', req)
    return data
  }

  async expire(id: number): Promise<RedeemCodeDto> {
    const { data } = await apiClient.post<unknown>(`/admin/redeem-codes/${id}/expire`)
    return RedeemCodeDto.fromJson(data)
  }
}

export const adminRedeemActionDatasource = new AdminRedeemActionDatasource()
