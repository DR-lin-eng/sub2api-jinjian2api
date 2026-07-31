import type { AdminComplianceAcknowledgement } from './adminComplianceAcknowledgement'

export class AdminComplianceStatus {
  required!: boolean
  version!: string
  documentPathZh!: string
  documentPathEn!: string
  documentUrlZh!: string
  documentUrlEn!: string
  ackPhraseZh!: string
  ackPhraseEn!: string
  acknowledgement?: AdminComplianceAcknowledgement
}
