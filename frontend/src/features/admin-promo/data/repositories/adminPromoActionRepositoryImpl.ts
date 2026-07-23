import { adminPromoActionDatasource } from '@/features/admin-promo/data/datasources/adminPromoActionDatasource'
import type { AdminPromoActionRepository } from '@/features/admin-promo/domain/repositories/adminPromoActionRepository'
import type { PromoCode } from '@/features/admin-promo/domain/models/promoCode'
import type { CreatePromoCodeRequest } from '@/features/admin-promo/data/requests_models/createPromoCodeRequest'
import type { UpdatePromoCodeRequest } from '@/features/admin-promo/data/requests_models/updatePromoCodeRequest'

class AdminPromoActionRepositoryImpl implements AdminPromoActionRepository {
  private readonly ds = adminPromoActionDatasource

  async create(req: CreatePromoCodeRequest): Promise<PromoCode> {
    return (await this.ds.create(req)).toEntity()
  }

  async update(id: number, req: UpdatePromoCodeRequest): Promise<PromoCode> {
    return (await this.ds.update(id, req)).toEntity()
  }

  async deleteCode(id: number): Promise<{ message: string }> {
    return this.ds.deleteCode(id)
  }
}

export const adminPromoActionRepository: AdminPromoActionRepository = new AdminPromoActionRepositoryImpl()
