import { OpsAlertRuntimeSettings } from './opsAlertRuntimeSettings'
import { EmailNotificationConfig } from './emailNotificationConfig'
import { OpsAdvancedSettings } from './opsAdvancedSettings'
import { OpsMetricThresholds } from './opsMetricThresholds'

export class OpsSettingsSnapshot {
  runtime!: OpsAlertRuntimeSettings
  email!: EmailNotificationConfig
  advanced!: OpsAdvancedSettings
  metricThresholds!: OpsMetricThresholds | null
}
