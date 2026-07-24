import { PlatformAvailability } from './platformAvailability'
import { GroupAvailability } from './groupAvailability'
import { AccountAvailability } from './accountAvailability'

export class OpsAccountAvailabilityStats {
  enabled!: boolean
  platform!: Record<string, PlatformAvailability>
  group!: Record<string, GroupAvailability>
  account!: Record<string, AccountAvailability>
  timestamp!: string
}
