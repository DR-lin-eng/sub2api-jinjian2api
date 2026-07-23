import type { PromoCode } from '@/features/admin-promo/domain/models/promoCode'
import type { CreatePromoCodeRequest } from '@/features/admin-promo/data/requests_models/createPromoCodeRequest'
import type { UpdatePromoCodeRequest } from '@/features/admin-promo/data/requests_models/updatePromoCodeRequest'

export interface AdminPromoActionRepository {
  create(req: CreatePromoCodeRequest): Promise<PromoCode>
  update(id: number, req: UpdatePromoCodeRequest): Promise<PromoCode>
  deleteCode(id: number): Promise<{ message: string }>
}
