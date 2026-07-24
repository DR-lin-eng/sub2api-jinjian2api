import type { Provider, MonitorMode } from '@/core/constants/channelMonitor'
import type { UserMonitorModelDetail } from './userMonitorModelDetail'

export class UserMonitorDetail {
  id!: number
  name!: string
  provider!: Provider
  monitorMode!: MonitorMode | ''
  groupName!: string
  models!: UserMonitorModelDetail[]
}
