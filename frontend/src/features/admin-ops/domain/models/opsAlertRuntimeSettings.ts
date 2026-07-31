import { OpsDistributedLockSettings } from './opsDistributedLockSettings'
import { OpsAlertSilencingSettings } from './opsAlertSilencingSettings'
import { OpsMetricThresholds } from './opsMetricThresholds'

export class OpsAlertRuntimeSettings {
  evaluationIntervalSeconds!: number
  distributedLock!: OpsDistributedLockSettings
  silencing!: OpsAlertSilencingSettings
  thresholds!: OpsMetricThresholds
}
