export interface AdminComplianceAcknowledgement {
  version: string
  documentZh: string
  documentEn: string
  adminUserId: number
  ipAddress?: string
  userAgent?: string
  acceptedAt: string
}

export interface AdminComplianceStatus {
  required: boolean
  version: string
  documentPathZh: string
  documentPathEn: string
  documentUrlZh: string
  documentUrlEn: string
  ackPhraseZh: string
  ackPhraseEn: string
  acknowledgement?: AdminComplianceAcknowledgement
}
