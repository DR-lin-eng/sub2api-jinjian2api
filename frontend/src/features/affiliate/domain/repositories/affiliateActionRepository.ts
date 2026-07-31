import type { SimpleUser } from '@/features/affiliate/domain/models/simpleUser'
import type { UpdateAffiliateUserRequest } from '@/features/affiliate/data/requests_models/updateAffiliateUserRequest'
import type { BatchSetRateRequest } from '@/features/affiliate/data/requests_models/batchSetRateRequest'

export interface AffiliateActionRepository {
  lookupUsers(q: string): Promise<SimpleUser[]>
  updateUserSettings(userId: number, req: UpdateAffiliateUserRequest): Promise<{ userId: number }>
  clearUserSettings(userId: number): Promise<{ userId: number }>
  batchSetRate(req: BatchSetRateRequest): Promise<{ affected: number }>
}
