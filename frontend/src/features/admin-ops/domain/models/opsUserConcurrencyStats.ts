import { UserConcurrencyInfo } from './userConcurrencyInfo'

export class OpsUserConcurrencyStats {
  enabled!: boolean
  user!: Record<string, UserConcurrencyInfo>
  timestamp!: string
}
