import { TempUnschedulableState } from '@/features/admin-accounts/domain/models/tempUnschedulableState'

export class TempUnschedulableStatus {
  active!: boolean
  state?: TempUnschedulableState
}
