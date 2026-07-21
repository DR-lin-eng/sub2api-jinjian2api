<template>
  <AppLayout>
    <div class="mx-auto max-w-[1600px]" :class="activeTab === 'config' && actionStore.draft ? 'pb-28' : 'pb-8'">
      <header class="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600 dark:text-primary-400">{{ t('nav.securityAudit') }}</p>
          <h1 class="mt-1 text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">{{ t('admin.promptAudit.title') }}</h1>
          <p class="mt-2 max-w-3xl text-sm text-gray-500 dark:text-dark-300">{{ t('admin.promptAudit.description') }}</p>
        </div>
        <div v-if="actionStore.draft" class="text-right text-xs text-gray-500 dark:text-dark-400">
          <p>{{ t('admin.promptAudit.configVersion', { version: actionStore.draft.config_version }) }}</p>
          <p v-if="actionStore.draft.updated_at" class="mt-1">{{ formatDate(actionStore.draft.updated_at) }}</p>
        </div>
      </header>

      <div v-if="loadErrors.config && !actionStore.draft" role="alert" class="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
        <p class="text-sm text-red-700 dark:text-red-300">{{ loadErrors.config }}</p>
        <button type="button" class="btn btn-secondary btn-sm mt-3" @click="loadConfig">{{ t('admin.promptAudit.actions.retry') }}</button>
      </div>

      <template v-else>
        <div class="mb-4" role="tablist" :aria-label="t('admin.promptAudit.title')">
          <div class="tabs inline-flex">
            <button
              v-for="tab in pageTabs"
              :key="tab.id"
              type="button"
              role="tab"
              class="tab"
              :class="{ 'tab-active': activeTab === tab.id }"
              :aria-selected="activeTab === tab.id"
              :data-test="`tab-${tab.id}`"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <main class="card px-4 sm:px-6 lg:px-8">
          <div v-show="activeTab === 'config'" data-test="tab-panel-config">
            <RuntimeOverview :runtime="queryStore.runtime" :loading="queryStore.loading.runtime" :error="loadErrors.runtime" @refresh="loadRuntime" />

            <template v-if="actionStore.draft">
              <EndpointPool
                :endpoints="actionStore.draft.endpoints"
                :probe-results="actionStore.probeResults"
                :probing-ids="actionStore.probingIds"
                @update:endpoints="updateEndpoints"
                @probe="runProbe"
              />
              <div v-if="loadErrors.groups" role="alert" class="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">{{ loadErrors.groups }}</div>
              <PolicyPanel :draft="actionStore.draft" :groups="queryStore.groups" @update:draft="replaceDraft" />
            </template>
          </div>

          <div v-show="activeTab === 'events'" data-test="tab-panel-events">
            <div
              v-if="actionStore.draft?.enabled && !actionStore.draft.store_pass_events"
              data-test="pass-events-disabled-notice"
              role="status"
              class="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200"
            >
              <span>{{ t('admin.promptAudit.events.passEventsDisabled') }}</span>
              <button type="button" class="btn btn-secondary btn-sm" @click="activeTab = 'config'">
                {{ t('admin.promptAudit.events.openConfiguration') }}
              </button>
            </div>
            <EventWorkspace
              :events="queryStore.events.items"
              :total="queryStore.events.total"
              :page="queryStore.events.page"
              :page-size="queryStore.events.page_size"
              :filters="filters"
              :selected-ids="selectedEventIds"
              :loading="queryStore.loading.events"
              :error="loadErrors.events"
              @filters-change="handleFiltersChanged"
              @search="applyEventFilters"
              @selection="selectedEventIds = $event"
              @page="changePage"
              @page-size="changePageSize"
              @view="openEvent"
              @delete="requestSingleDelete"
              @batch-delete="requestBatchDelete"
              @preview-delete="requestFilterDeletePreview"
            />
          </div>
        </main>
      </template>
    </div>

    <div v-if="actionStore.draft && activeTab === 'config'" class="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-12px_35px_rgba(15,23,42,0.08)] backdrop-blur dark:border-dark-700/80 dark:bg-dark-900/95 dark:shadow-[0_-12px_35px_rgba(0,0,0,0.35)] lg:left-64">
      <div class="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
          <SaveToggle :label="t('admin.promptAudit.saveBar.enabled')" :model-value="actionStore.draft.enabled" data-test="enabled-toggle" @update:model-value="setEnabled" />
          <SaveToggle :label="t('admin.promptAudit.saveBar.blocking')" :model-value="actionStore.draft.blocking_enabled" :disabled="!actionStore.draft.enabled" data-test="blocking-toggle" @update:model-value="setBlocking" />
          <SaveToggle :label="t('admin.promptAudit.saveBar.storePass')" :model-value="actionStore.draft.store_pass_events" data-test="store-pass-toggle" @update:model-value="replaceDraft({ ...actionStore.draft!, store_pass_events: $event })" />
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm" :class="dirty ? 'text-amber-700 dark:text-amber-300' : 'text-gray-500 dark:text-dark-400'">
            {{ dirty ? t('admin.promptAudit.saveBar.dirty') : t('admin.promptAudit.saveBar.synced') }}
          </span>
          <button type="button" class="btn btn-secondary" :disabled="!dirty || actionStore.loading.saving" @click="resetDraft">{{ t('common.reset') }}</button>
          <button type="button" class="btn btn-primary" :disabled="!dirty || actionStore.loading.saving" data-test="save-config" @click="saveConfig">
            {{ actionStore.loading.saving ? t('common.saving') : t('common.save') }}
          </button>
        </div>
      </div>
    </div>

    <ConfirmDialog
      :show="showBlockingConfirmation"
      :title="t('admin.promptAudit.blockingConfirm.title')"
      :message="t('admin.promptAudit.blockingConfirm.message')"
      :confirm-text="t('admin.promptAudit.blockingConfirm.confirm')"
      danger
      @confirm="confirmBlocking"
      @cancel="showBlockingConfirmation = false"
    />
    <ConfirmDialog
      :show="deleteRequest.mode !== ''"
      :title="t('admin.promptAudit.events.deleteConfirmTitle')"
      :message="t('admin.promptAudit.events.deleteConfirmMessage', { count: deleteRequest.ids.length })"
      :confirm-text="t('common.delete')"
      danger
      @confirm="confirmIDDelete"
      @cancel="clearDeleteRequest"
    />
    <FilterDeleteDialog
      :show="showFilterDelete"
      :initial-filters="filters"
      :preview="deletePreview"
      :previewing="queryStore.loading.previewing"
      :deleting="actionStore.loading.deleting"
      @close="closeFilterDelete"
      @preview="runFilterDeletePreview"
      @confirm="confirmFilterDelete"
      @criteria-change="clearDeletePreview"
    />
    <EventDetailDialog :show="showEventDetail" :event="queryStore.activeEvent" :loading="queryStore.loading.detail" @close="closeEventDetail" />
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/common/widgets/layout/AppLayout.vue'
import ConfirmDialog from '@/common/widgets/feedback/ConfirmDialog.vue'
import RuntimeOverview from '@/features/prompt-audit/presentation/widgets/RuntimeOverview.vue'
import EndpointPool from '@/features/prompt-audit/presentation/widgets/EndpointPool.vue'
import PolicyPanel from '@/features/prompt-audit/presentation/widgets/PolicyPanel.vue'
import EventWorkspace from '@/features/prompt-audit/presentation/widgets/EventWorkspace.vue'
import EventDetailDialog from '@/features/prompt-audit/presentation/widgets/EventDetailDialog.vue'
import FilterDeleteDialog from '@/features/prompt-audit/presentation/widgets/FilterDeleteDialog.vue'
import { usePromptAudit } from '@/features/prompt-audit/presentation/composables/usePromptAudit'

const { t } = useI18n()
const {
  activeTab, filters, selectedEventIds, dirty, loadErrors,
  showEventDetail, showFilterDelete, showBlockingConfirmation, deleteRequest, deletePreview,
  queryStore, actionStore,
  loadConfig, loadRuntime, loadInitial,
  replaceDraft, updateEndpoints, setEnabled, setBlocking, confirmBlocking, resetDraft, saveConfig,
  runProbe,
  handleFiltersChanged, applyEventFilters, changePage, changePageSize,
  openEvent, closeEventDetail,
  requestSingleDelete, requestBatchDelete, clearDeleteRequest, confirmIDDelete,
  clearDeletePreview, requestFilterDeletePreview, closeFilterDelete, runFilterDeletePreview, confirmFilterDelete,
  formatDate,
} = usePromptAudit()

const pageTabs = computed(() => [
  { id: 'events' as const, label: t('admin.promptAudit.tabs.events') },
  { id: 'config' as const, label: t('admin.promptAudit.tabs.config') },
])

const SaveToggle = defineComponent({
  inheritAttrs: false,
  props: { label: { type: String, required: true }, modelValue: { type: Boolean, required: true }, disabled: { type: Boolean, default: false } },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    return () => h('label', { class: ['flex items-center gap-2.5 text-sm', props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'] }, [
      h('button', {
        ...attrs,
        type: 'button',
        role: 'switch',
        'aria-checked': props.modelValue,
        'aria-label': props.label,
        disabled: props.disabled,
        class: [
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          props.modelValue ? 'bg-primary-600' : 'bg-gray-300 dark:bg-dark-600',
          props.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        ],
        onClick: (event: MouseEvent) => {
          event.preventDefault()
          if (!props.disabled) emit('update:modelValue', !props.modelValue)
        },
      }, [
        h('span', {
          class: [
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ease-in-out',
            props.modelValue ? 'translate-x-5' : 'translate-x-0',
          ],
        }),
      ]),
      h('span', { class: 'select-none text-gray-700 dark:text-dark-200' }, props.label),
    ])
  },
})

onMounted(loadInitial)
</script>
