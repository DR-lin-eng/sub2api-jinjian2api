import type { AdminComplianceAcknowledgement, AdminComplianceStatus } from '@/features/admin-settings/domain/models/compliance'

export interface AdminComplianceAcknowledgementDto {
  version: string
  document_zh: string
  document_en: string
  admin_user_id: number
  ip_address?: string
  user_agent?: string
  accepted_at: string
}

export interface AdminComplianceStatusDto {
  required: boolean
  version: string
  document_path_zh: string
  document_path_en: string
  document_url_zh: string
  document_url_en: string
  ack_phrase_zh: string
  ack_phrase_en: string
  acknowledgement?: AdminComplianceAcknowledgementDto
}

function toAcknowledgement(dto: AdminComplianceAcknowledgementDto): AdminComplianceAcknowledgement {
  return {
    version: dto.version ?? '',
    documentZh: dto.document_zh ?? '',
    documentEn: dto.document_en ?? '',
    adminUserId: dto.admin_user_id ?? 0,
    ipAddress: dto.ip_address,
    userAgent: dto.user_agent,
    acceptedAt: dto.accepted_at ?? '',
  }
}

export function toEntity(dto: AdminComplianceStatusDto): AdminComplianceStatus {
  return {
    required: dto.required ?? false,
    version: dto.version ?? '',
    documentPathZh: dto.document_path_zh ?? '',
    documentPathEn: dto.document_path_en ?? '',
    documentUrlZh: dto.document_url_zh ?? '',
    documentUrlEn: dto.document_url_en ?? '',
    ackPhraseZh: dto.ack_phrase_zh ?? '',
    ackPhraseEn: dto.ack_phrase_en ?? '',
    acknowledgement: dto.acknowledgement ? toAcknowledgement(dto.acknowledgement) : undefined,
  }
}
