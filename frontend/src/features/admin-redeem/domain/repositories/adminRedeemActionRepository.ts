import type { RedeemCode } from '@/features/admin-redeem/domain/models/redeemCode'
import type { GenerateRedeemCodesRequest } from '@/features/admin-redeem/data/requests_models/generateRedeemCodesRequest'
import type { BatchUpdateRedeemCodesRequest } from '@/features/admin-redeem/data/requests_models/batchUpdateRedeemCodesRequest'
import type { BatchDeleteRedeemCodesRequest } from '@/features/admin-redeem/data/requests_models/batchDeleteRedeemCodesRequest'

export interface AdminRedeemActionRepository {
  generate(req: GenerateRedeemCodesRequest): Promise<RedeemCode[]>
  deleteCode(id: number): Promise<{ message: string }>
  batchDelete(req: BatchDeleteRedeemCodesRequest): Promise<{ deleted: number; message: string }>
  batchUpdate(req: BatchUpdateRedeemCodesRequest): Promise<{ updated: number; message: string }>
  expire(id: number): Promise<RedeemCode>
}
