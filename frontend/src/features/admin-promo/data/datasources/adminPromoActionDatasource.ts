import { apiClient } from '@/core/networks/client'
import { PromoCodeDto } from '@/features/admin-promo/data/models/promoCodeDto'
import type { CreatePromoCodeRequest } from '@/features/admin-promo/data/requests_models/createPromoCodeRequest'
import type { UpdatePromoCodeRequest } from '@/features/admin-promo/data/requests_models/updatePromoCodeRequest'

export class AdminPromoActionDatasource {
  async create(req: CreatePromoCodeRequest): Promise<PromoCodeDto> {
    const { data } = await apiClient.post<unknown>('/admin/promo-codes', req)
    return PromoCodeDto.fromJson(data)
  }

  async update(id: number, req: UpdatePromoCodeRequest): Promise<PromoCodeDto> {
    const { data } = await apiClient.put<unknown>(`/admin/promo-codes/${id}`, req)
    return PromoCodeDto.fromJson(data)
  }

  async deleteCode(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/promo-codes/${id}`)
    return data
  }
}

export const adminPromoActionDatasource = new AdminPromoActionDatasource()
