import { EmailAlertNotificationConfig } from './emailAlertNotificationConfig'
import { EmailReportNotificationConfig } from './emailReportNotificationConfig'

export class EmailNotificationConfig {
  alert!: EmailAlertNotificationConfig
  report!: EmailReportNotificationConfig
}
