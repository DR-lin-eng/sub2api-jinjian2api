import { OpsAlertSilencingEntry } from './opsAlertSilencingEntry'

export class OpsAlertSilencingSettings {
  enabled!: boolean
  globalUntilRfc3339!: string
  globalReason!: string
  entries!: OpsAlertSilencingEntry[]
}
