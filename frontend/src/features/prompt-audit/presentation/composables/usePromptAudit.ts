/**
 * usePromptAudit — orchestrator composable for PromptAuditPage.
 * Wraps Query + Action stores with UI-side concerns:
 *   - i18n-driven error messaging (via core apiError util + admin.promptAudit.errors.*)
 *   - toast notifications (via appStore)
 *   - draft synchronization between Query.serverConfig and Action.draft
 *   - local UI-only state (activeTab, delete request, dialog visibility)
 * Per spec §5.5 R6: composables MUST NOT touch datasource / apiClient directly;
 * they compose stores + core utilities.
 */

import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/core/stores/appStore'
import { extractApiErrorCode, extractApiErrorMessage } from '@/core/utils/apiError'
import { usePromptAuditQueryStore } from '@/features/prompt-audit/presentation/stores/promptAuditQueryStore'
import { usePromptAuditActionStore } from '@/features/prompt-audit/presentation/stores/promptAuditActionStore'
import {
  cloneData,
  configToDraft,
  draftFingerprint,
  emptyEventFilters,
} from '@/features/prompt-audit/presentation/utils/promptAuditViewModel'
import type { PromptAuditDraft } from '@/features/prompt-audit/domain/models/promptAuditDraft'
import type { PromptAuditEndpointDraft } from '@/features/prompt-audit/domain/models/promptAuditEndpointDraft'
import type { PromptDeletePreview } from '@/features/prompt-audit/domain/models/promptDeletePreview'
import type { PromptEventFilters } from '@/features/prompt-audit/domain/models/promptEventFilters'

export type PromptAuditPageTab = 'config' | 'events'

export function usePromptAudit() {
  const { t, locale } = useI18n()
  const appStore = useAppStore()
  const queryStore = usePromptAuditQueryStore()
  const actionStore = usePromptAuditActionStore()

  // --- UI-only state (dialogs, tab, delete requests) ---
  const activeTab = ref<PromptAuditPageTab>('events')
  const filters = ref<PromptEventFilters>(emptyEventFilters())
  const selectedEventIds = ref<number[]>([])
  const showEventDetail = ref(false)
  const showFilterDelete = ref(false)
  const showBlockingConfirmation = ref(false)
  const deleteRequest = reactive<{ mode: '' | 'single' | 'batch'; ids: number[] }>({ mode: '', ids: [] })
  const deletePreview = ref<PromptDeletePreview | null>(null)
  const deletePreviewFilters = ref<PromptEventFilters | null>(null)

  const dirty = computed(() =>
    draftFingerprint(actionStore.draft) !== draftFingerprint(queryStore.serverConfig),
  )

  const loadErrors = computed(() => ({
    config: queryStore.errors.config ? errorMessageOf(queryStore.errors.config, 'admin.promptAudit.errors.loadConfig') : '',
    runtime: queryStore.errors.runtime ? errorMessageOf(queryStore.errors.runtime, 'admin.promptAudit.errors.loadRuntime') : '',
    groups: queryStore.errors.groups ? errorMessageOf(queryStore.errors.groups, 'admin.promptAudit.errors.loadGroups') : '',
    events: queryStore.errors.events ? errorMessageOf(queryStore.errors.events, 'admin.promptAudit.errors.loadEvents') : '',
  }))

  function errorMessageOf(error: unknown, fallbackKey: string): string {
    const code = extractApiErrorCode(error)
    if (code) {
      const key = `admin.promptAudit.errors.${code}`
      const translated = t(key)
      if (translated !== key) return translated
    }
    return extractApiErrorMessage(error, t(fallbackKey))
  }

  // --- Loaders (delegate to Query store; also seed Action.draft) ---
  async function loadConfig(): Promise<void> {
    const draft = await queryStore.loadConfig()
    if (draft) actionStore.setDraft(draft)
  }
  const loadRuntime = () => queryStore.loadRuntime()
  const loadGroups = () => queryStore.loadGroups()
  const loadEvents = () => queryStore.loadEvents()
  async function loadInitial(): Promise<void> {
    await Promise.allSettled([loadConfig(), loadRuntime(), loadGroups(), loadEvents()])
  }

  // --- Draft mutations ---
  function replaceDraft(next: PromptAuditDraft): void { actionStore.setDraft(next) }
  function updateEndpoints(endpoints: PromptAuditEndpointDraft[]): void {
    if (!actionStore.draft) return
    replaceDraft({ ...actionStore.draft, endpoints })
  }
  function setEnabled(value: boolean): void {
    if (!actionStore.draft) return
    replaceDraft({
      ...actionStore.draft,
      enabled: value,
      blockingEnabled: value ? actionStore.draft.blockingEnabled : false,
    })
  }
  function setBlocking(value: boolean): void {
    if (!actionStore.draft || !actionStore.draft.enabled) return
    if (value && !actionStore.draft.blockingEnabled) {
      showBlockingConfirmation.value = true
      return
    }
    replaceDraft({ ...actionStore.draft, blockingEnabled: value })  }
  function confirmBlocking(): void {
    showBlockingConfirmation.value = false
    if (actionStore.draft) replaceDraft({ ...actionStore.draft, blockingEnabled: true })
  }
  function resetDraft(): void {
    if (queryStore.serverConfig) actionStore.setDraft(queryStore.serverConfig)
  }

  async function saveConfig(): Promise<void> {
    if (!actionStore.draft || !dirty.value) return
    try {
      const saved = await actionStore.saveDraft()
      if (!saved) return
      const nextDraft = configToDraft(saved)
      queryStore.serverConfig = nextDraft
      actionStore.setDraft(nextDraft)
      appStore.showSuccess(t('admin.promptAudit.messages.saved'))
      await loadRuntime()
    } catch (error) {
      const code = extractApiErrorCode(error)
      appStore.showError(errorMessageOf(
        error,
        code === 'prompt_audit_config_conflict'
          ? 'admin.promptAudit.errors.prompt_audit_config_conflict'
          : 'admin.promptAudit.errors.saveConfig',
      ))
    }
  }

  async function runProbe(endpoint: PromptAuditEndpointDraft): Promise<void> {
    try {
      const result = await actionStore.probeEndpoint(endpoint)
      if (!result) return
      if (result.ok) appStore.showSuccess(t('admin.promptAudit.messages.probeSucceeded'))
      else appStore.showError(`${result.errorCode || result.status}: ${result.message}`)
    } catch (error) {
      appStore.showError(errorMessageOf(error, 'admin.promptAudit.errors.probe'))
    }
  }

  // --- Event workspace / filters ---
  function handleFiltersChanged(next: PromptEventFilters): void {
    filters.value = cloneData(next)
    clearDeletePreview()
  }
  function applyEventFilters(next: PromptEventFilters): void {
    filters.value = cloneData(next)
    queryStore.setAppliedFilters(cloneData(next))
    queryStore.setPage(1)
    clearDeletePreview()
    void loadEvents()
  }
  function changePage(page: number): void { queryStore.setPage(page); void loadEvents() }
  function changePageSize(size: number): void { queryStore.setPageSize(size); void loadEvents() }

  async function openEvent(id: number): Promise<void> {
    showEventDetail.value = true
    try {
      await queryStore.loadEvent(id)
    } catch (error) {
      appStore.showError(errorMessageOf(error, 'admin.promptAudit.errors.loadDetail'))
      showEventDetail.value = false
    }
  }
  function closeEventDetail(): void {
    showEventDetail.value = false
    queryStore.clearActiveEvent()
  }

  // --- ID-based deletion (single / batch) ---
  function requestSingleDelete(id: number): void { deleteRequest.mode = 'single'; deleteRequest.ids = [id] }
  function requestBatchDelete(): void {
    if (selectedEventIds.value.length) {
      deleteRequest.mode = 'batch'
      deleteRequest.ids = [...selectedEventIds.value]
    }
  }
  function clearDeleteRequest(): void { deleteRequest.mode = ''; deleteRequest.ids = [] }
  async function confirmIDDelete(): Promise<void> {
    const mode = deleteRequest.mode
    const ids = [...deleteRequest.ids]
    clearDeleteRequest()
    if (!mode || ids.length === 0) return
    try {
      const result = mode === 'single'
        ? await actionStore.deleteEvent(ids[0])
        : await actionStore.batchDeleteEvents(ids)
      appStore.showSuccess(t('admin.promptAudit.messages.deleted', { count: result.deletedEvents }))
      await Promise.allSettled([loadEvents(), loadRuntime()])
    } catch (error) {
      appStore.showError(errorMessageOf(error, 'admin.promptAudit.errors.delete'))
    }
  }

  // --- Filter-based deletion ---
  function clearDeletePreview(): void {
    deletePreview.value = null
    deletePreviewFilters.value = null
  }
  function requestFilterDeletePreview(): void {
    clearDeletePreview()
    showFilterDelete.value = true
  }
  function closeFilterDelete(): void {
    showFilterDelete.value = false
    clearDeletePreview()
  }
  async function runFilterDeletePreview(next: PromptEventFilters): Promise<void> {
    try {
      deletePreview.value = await queryStore.previewDelete(next)
      deletePreviewFilters.value = cloneData(next)
    } catch (error) {
      clearDeletePreview()
      appStore.showError(errorMessageOf(error, 'admin.promptAudit.errors.previewDelete'))
    }
  }
  async function confirmFilterDelete(next?: PromptEventFilters): Promise<void> {
    if (actionStore.loading.deleting) return
    try {
      let preview = deletePreview.value
      let previewFilters = deletePreviewFilters.value ? cloneData(deletePreviewFilters.value) : null
      // One-click path: no fresh preview (never requested, or cleared by a
      // criteria change) — mint the confirmation token on the fly from the
      // criteria the dialog just emitted, then delete in the same action.
      if ((!preview || !previewFilters) && next) {
        preview = await queryStore.previewDelete(next)
        previewFilters = cloneData(next)
      }
      if (!preview || !previewFilters) return
      const result = await actionStore.deleteByFilter(previewFilters, preview)
      closeFilterDelete()
      appStore.showSuccess(t('admin.promptAudit.messages.deleted', { count: result.deletedEvents }))
      await Promise.allSettled([loadEvents(), loadRuntime()])
    } catch (error) {
      clearDeletePreview()
      appStore.showError(errorMessageOf(error, 'admin.promptAudit.errors.deleteConfirmation'))
    }
  }

  function formatDate(value: string): string {
    return new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(value))
  }

  return {
    // exposed reactive state
    activeTab, filters, selectedEventIds, dirty, loadErrors,
    showEventDetail, showFilterDelete, showBlockingConfirmation, deleteRequest, deletePreview,
    queryStore, actionStore,
    // actions
    loadConfig, loadRuntime, loadGroups, loadEvents, loadInitial,
    replaceDraft, updateEndpoints, setEnabled, setBlocking, confirmBlocking, resetDraft, saveConfig,
    runProbe,
    handleFiltersChanged, applyEventFilters, changePage, changePageSize,
    openEvent, closeEventDetail,
    requestSingleDelete, requestBatchDelete, clearDeleteRequest, confirmIDDelete,
    clearDeletePreview, requestFilterDeletePreview, closeFilterDelete, runFilterDeletePreview, confirmFilterDelete,
    formatDate,
  }
}
