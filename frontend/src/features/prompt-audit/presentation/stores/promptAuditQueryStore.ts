/**
 * Prompt Audit Query Store (spec §5.4).
 * Owns read-side state (config draft, runtime, events page, groups) and the
 * async loaders that mutate that state via the Query Repository.
 *
 * Uses the factory + default-instance double-export pattern (§5.4 R5.1) so
 * tests can inject a mock repository via `createPromptAuditQueryStore(mock)`.
 */

import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { promptAuditQueryRepository as defaultRepo } from '@/features/prompt-audit/data/repositories/promptAuditQueryRepositoryImpl'
import type { PromptAuditQueryRepository } from '@/features/prompt-audit/domain/repositories/promptAuditQueryRepository'
import type { PromptAuditDraft } from '@/features/prompt-audit/domain/models/promptAuditDraft'
import type { PromptAuditEvent } from '@/features/prompt-audit/domain/models/promptAuditEvent'
import type { PromptAuditGroup } from '@/features/prompt-audit/domain/models/promptAuditGroup'
import type { PromptAuditRuntime } from '@/features/prompt-audit/domain/models/promptAuditRuntime'
import type { PromptDeletePreview } from '@/features/prompt-audit/domain/models/promptDeletePreview'
import type { PromptEventFilters } from '@/features/prompt-audit/domain/models/promptEventFilters'
import type { PromptEventPage } from '@/features/prompt-audit/domain/models/promptEventPage'
import { configToDraft, emptyEventFilters } from '@/features/prompt-audit/presentation/utils/promptAuditViewModel'

export function createPromptAuditQueryStore(repo: PromptAuditQueryRepository) {
  return defineStore('promptAudit/query', () => {
    const serverConfig = ref<PromptAuditDraft | null>(null)
    const runtime = ref<PromptAuditRuntime | null>(null)
    const groups = ref<PromptAuditGroup[]>([])
    const events = reactive<PromptEventPage>({ items: [], total: 0, page: 1, pageSize: 20, pages: 0 })
    const appliedFilters = ref<PromptEventFilters>(emptyEventFilters())
    const activeEvent = ref<PromptAuditEvent | null>(null)

    const loading = reactive({ config: false, runtime: false, groups: false, events: false, detail: false, previewing: false })
    const errors = reactive({ config: null as unknown, runtime: null as unknown, groups: null as unknown, events: null as unknown })

    async function loadConfig(): Promise<PromptAuditDraft | null> {
      loading.config = true
      errors.config = null
      try {
        const config = await repo.getConfig()
        serverConfig.value = configToDraft(config)
        return serverConfig.value
      } catch (error) {
        errors.config = error
        return null
      } finally {
        loading.config = false
      }
    }

    async function loadRuntime(): Promise<PromptAuditRuntime | null> {
      loading.runtime = true
      errors.runtime = null
      try {
        runtime.value = await repo.getRuntime()
        return runtime.value
      } catch (error) {
        errors.runtime = error
        return null
      } finally {
        loading.runtime = false
      }
    }

    async function loadGroups(): Promise<PromptAuditGroup[]> {
      loading.groups = true
      errors.groups = null
      try {
        groups.value = await repo.listGroups()
      } catch (error) {
        errors.groups = error
      } finally {
        loading.groups = false
      }
      return groups.value
    }

    async function loadEvents(): Promise<PromptEventPage | null> {
      loading.events = true
      errors.events = null
      try {
        const result = await repo.listEvents(appliedFilters.value, events.page, events.pageSize)
        Object.assign(events, result)
        return result
      } catch (error) {
        errors.events = error
        return null
      } finally {
        loading.events = false
      }
    }

    async function loadEvent(id: number): Promise<PromptAuditEvent | null> {
      loading.detail = true
      activeEvent.value = null
      try {
        activeEvent.value = await repo.getEvent(id)
        return activeEvent.value
      } finally {
        loading.detail = false
      }
    }

    async function previewDelete(filters: PromptEventFilters): Promise<PromptDeletePreview> {
      loading.previewing = true
      try {
        return await repo.previewDelete(filters)
      } finally {
        loading.previewing = false
      }
    }

    function setAppliedFilters(next: PromptEventFilters): void {
      appliedFilters.value = { ...next }
    }
    function setPage(page: number): void { events.page = page }
    function setPageSize(pageSize: number): void { events.pageSize = pageSize; events.page = 1 }
    function clearActiveEvent(): void { activeEvent.value = null }

    return {
      serverConfig, runtime, groups, events, appliedFilters, activeEvent,
      loading, errors,
      loadConfig, loadRuntime, loadGroups, loadEvents, loadEvent, previewDelete,
      setAppliedFilters, setPage, setPageSize, clearActiveEvent,
    }
  })
}

export const usePromptAuditQueryStore = createPromptAuditQueryStore(defaultRepo)
