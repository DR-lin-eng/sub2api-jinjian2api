import { promptAuditQueryDatasource as ds } from '@/features/prompt-audit/data/datasources/promptAuditQueryDatasource'
import type { PromptAuditQueryRepository } from '@/features/prompt-audit/domain/repositories/promptAuditQueryRepository'
import type { PromptAuditConfig } from '@/features/prompt-audit/domain/models/promptAuditConfig'
import type { PromptAuditRuntime } from '@/features/prompt-audit/domain/models/promptAuditRuntime'
import type { PromptAuditEvent } from '@/features/prompt-audit/domain/models/promptAuditEvent'
import type { PromptEventPage } from '@/features/prompt-audit/domain/models/promptEventPage'
import type { PromptDeletePreview } from '@/features/prompt-audit/domain/models/promptDeletePreview'
import type { PromptAuditGroup } from '@/features/prompt-audit/domain/models/promptAuditGroup'
import type { PromptEventFilters } from '@/features/prompt-audit/domain/models/promptEventFilters'

export class PromptAuditQueryRepositoryImpl implements PromptAuditQueryRepository {
  getConfig = async () : Promise<PromptAuditConfig>  => {
    return (await ds.getConfig()).toEntity()
  }

  getRuntime = async () : Promise<PromptAuditRuntime>  => {
    return (await ds.getRuntime()).toEntity()
  }

  listEvents = async (filters: PromptEventFilters, page: number, pageSize: number) : Promise<PromptEventPage>  => {
    return (await ds.listEvents(filters, page, pageSize)).toEntity()
  }

  getEvent = async (id: number) : Promise<PromptAuditEvent>  => {
    return (await ds.getEvent(id)).toEntity()
  }

  previewDelete = async (filters: PromptEventFilters) : Promise<PromptDeletePreview>  => {
    return (await ds.previewDelete(filters)).toEntity()
  }

  listGroups = async () : Promise<PromptAuditGroup[]>  => {
    return (await ds.listGroups()).map((dto) => dto.toEntity())
  }
}

export const promptAuditQueryRepository: PromptAuditQueryRepository = new PromptAuditQueryRepositoryImpl()
