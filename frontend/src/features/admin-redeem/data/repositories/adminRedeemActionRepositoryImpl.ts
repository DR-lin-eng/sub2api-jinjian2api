import { adminRedeemActionDatasource } from '@/features/admin-redeem/data/datasources/adminRedeemActionDatasource'
import type { AdminRedeemActionRepository } from '@/features/admin-redeem/domain/repositories/adminRedeemActionRepository'
import type { RedeemCode } from '@/features/admin-redeem/domain/models/redeemCode'
import type { GenerateRedeemCodesRequest } from '@/features/admin-redeem/data/requests_models/generateRedeemCodesRequest'
import type { BatchUpdateRedeemCodesRequest } from '@/features/admin-redeem/data/requests_models/batchUpdateRedeemCodesRequest'
import type { BatchDeleteRedeemCodesRequest } from '@/features/admin-redeem/data/requests_models/batchDeleteRedeemCodesRequest'

class AdminRedeemActionRepositoryImpl implements AdminRedeemActionRepository {
  private readonly ds = adminRedeemActionDatasource

  generate = async (req: GenerateRedeemCodesRequest) : Promise<RedeemCode[]>  => {
    const dtos = await this.ds.generate(req)
    return dtos.map(dto => dto.toEntity())
  }

  deleteCode = async (id: number) : Promise<{ message: string }>  => {
    return this.ds.deleteCode(id)
  }

  batchDelete = async (req: BatchDeleteRedeemCodesRequest) : Promise<{ deleted: number; message: string }>  => {
    return this.ds.batchDelete(req)
  }

  batchUpdate = async (req: BatchUpdateRedeemCodesRequest) : Promise<{ updated: number; message: string }>  => {
    return this.ds.batchUpdate(req)
  }

  expire = async (id: number) : Promise<RedeemCode>  => {
    return (await this.ds.expire(id)).toEntity()
  }
}

export const adminRedeemActionRepository: AdminRedeemActionRepository = new AdminRedeemActionRepositoryImpl()
