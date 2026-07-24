/**
 * Prompt Audit Action Store (spec §5.4).
 * Owns write-side state (draft, probe results, submit status) and the async
 * actions that mutate the backend via the Action Repository.
 */

import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { promptAuditActionRepository as defaultRepo } from '@/features/prompt-audit/data/repositories/promptAuditActionRepositoryImpl'
import type { PromptAuditActionRepository } from '@/features/prompt-audit/domain/repositories/promptAuditActionRepository'
import type { PromptAuditConfig } from '@/features/prompt-audit/domain/models/promptAuditConfig'
import type { PromptAuditDraft } from '@/features/prompt-audit/domain/models/promptAuditDraft'
import type { PromptAuditEndpointDraft } from '@/features/prompt-audit/domain/models/promptAuditEndpointDraft'
import type { PromptDeletePreview } from '@/features/prompt-audit/domain/models/promptDeletePreview'
import type { PromptDeleteResult } from '@/features/prompt-audit/domain/models/promptDeleteResult'
import type { PromptEventFilters } from '@/features/prompt-audit/domain/models/promptEventFilters'
import type { PromptProbeResult } from '@/features/prompt-audit/domain/models/promptProbeResult'
import { buildUpdateRequest, cloneData } from '@/features/prompt-audit/presentation/utils/promptAuditViewModel'

export function createPromptAuditActionStore(repo: PromptAuditActionRepository) {
  return defineStore('promptAudit/action', () => {
    const draft = ref<PromptAuditDraft | null>(null)
    const probeResults = reactive<Record<string, PromptProbeResult>>({})
    const probingIds = ref<string[]>([])
    const loading = reactive({ saving: false, deleting: false })

    function setDraft(next: PromptAuditDraft): void { draft.value = cloneData(next) }
    function clearDraft(): void { draft.value = null }

    async function saveDraft(): Promise<PromptAuditConfig | null> {
      if (!draft.value) return null
      loading.saving = true
      try {
        return await repo.updateConfig(buildUpdateRequest(draft.value))
      } finally {
        loading.saving = false
      }
    }

    async function probeEndpoint(endpoint: PromptAuditEndpointDraft): Promise<PromptProbeResult | null> {
      if (probingIds.value.includes(endpoint.id)) return null
      probingIds.value = [...probingIds.value, endpoint.id]
      try {
        const result = await repo.probeEndpoint(endpoint)
        probeResults[endpoint.id] = result
        return result
      } finally {
        probingIds.value = probingIds.value.filter((id) => id !== endpoint.id)
      }
    }

    async function deleteEvent(id: number): Promise<PromptDeleteResult> {
      loading.deleting = true
      try {
        return await repo.deleteEvent(id)
      } finally {
        loading.deleting = false
      }
    }

    async function batchDeleteEvents(ids: number[]): Promise<PromptDeleteResult> {
      loading.deleting = true
      try {
        return await repo.batchDeleteEvents(ids)
      } finally {
        loading.deleting = false
      }
    }

    async function deleteByFilter(filters: PromptEventFilters, preview: PromptDeletePreview): Promise<PromptDeleteResult> {
      loading.deleting = true
      try {
        return await repo.deleteEventsByFilter(filters, preview)
      } finally {
        loading.deleting = false
      }
    }

    return {
      draft, probeResults, probingIds, loading,
      setDraft, clearDraft, saveDraft, probeEndpoint,
      deleteEvent, batchDeleteEvents, deleteByFilter,
    }
  })
}

export const usePromptAuditActionStore = createPromptAuditActionStore(defaultRepo)
