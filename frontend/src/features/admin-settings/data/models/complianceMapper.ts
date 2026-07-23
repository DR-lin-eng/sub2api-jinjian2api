/* Auto-generated identity Mapper. Replace when Dto/Entity diverge. */
import type {
  AdminComplianceAcknowledgement,
  AdminComplianceStatus,
  AcceptAdminComplianceRequest
} from '@/features/admin-settings/data/datasources/complianceDatasource'

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toAdminComplianceAcknowledgement = (dto: AdminComplianceAcknowledgement): AdminComplianceAcknowledgement => dto
export const adminComplianceAcknowledgementToDto = (entity: AdminComplianceAcknowledgement): AdminComplianceAcknowledgement => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toAdminComplianceStatus = (dto: AdminComplianceStatus): AdminComplianceStatus => dto
export const adminComplianceStatusToDto = (entity: AdminComplianceStatus): AdminComplianceStatus => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toAcceptAdminComplianceRequest = (dto: AcceptAdminComplianceRequest): AcceptAdminComplianceRequest => dto
export const acceptAdminComplianceRequestToDto = (entity: AcceptAdminComplianceRequest): AcceptAdminComplianceRequest => entity
