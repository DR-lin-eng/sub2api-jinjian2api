<template>
  <AppLayout>
    <TablePageLayout>
      <template #filters>
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
            <div class="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[260px_160px_144px_152px] 2xl:w-auto">
              <div class="min-w-0">
                <SearchInput
                  v-model="filters.taskName"
                  :placeholder="t('batchImage.filters.searchTaskName')"
                  class="w-full"
                  @search="applyFilters"
                />
              </div>
              <FormSelect v-model="filters.apiKeyId" :options="apiKeyFilterOptions" class="w-full" @change="applyFilters" />
              <FormSelect v-model="filters.status" :options="statusFilterOptions" class="w-full" @change="applyFilters" />
              <FormSelect v-model="filters.downloaded" :options="downloadFilterOptions" class="w-full" @change="applyFilters" />
            </div>
            <div class="flex flex-wrap items-center justify-start gap-2 sm:justify-end 2xl:flex-shrink-0">
              <button type="button" class="btn btn-secondary" :disabled="loadingJobs" @click="resetFilters">
                {{ t('common.reset') }}
              </button>
              <button type="button" class="btn btn-secondary" :disabled="loadingKeys || loadingJobs" :title="t('common.refresh')" @click="refreshPage">
                <Icon name="refresh" size="md" :class="loadingKeys || loadingJobs ? 'animate-spin' : ''" />
              </button>
              <button type="button" class="btn btn-secondary" @click="showGuideModal = true">
                <Icon name="book" size="md" class="mr-2" />
                {{ t('batchImage.actions.usageGuide') }}
              </button>
              <button type="button" class="btn btn-primary" @click="openCreateModal">
                <Icon name="plus" size="md" class="mr-2" />
                {{ t('batchImage.actions.createJob') }}
              </button>
            </div>
          </div>

          <div
            v-if="selectedJobIds.size"
            class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-dark-700 dark:bg-dark-800"
          >
            <i18n-t
              keypath="batchImage.list.selectedJobs"
              tag="span"
              scope="global"
              :plural="selectedJobIds.size"
              class="text-sm text-gray-600 dark:text-gray-300"
            >
              <template #count>
                <span class="font-medium text-gray-900 dark:text-white">{{ selectedJobIds.size }}</span>
              </template>
            </i18n-t>
            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                :disabled="bulkDownloading || selectedDownloadableRows.length === 0"
                @click="downloadSelectedJobs"
              >
                <Icon :name="bulkDownloading ? 'refresh' : 'download'" size="sm" class="mr-1.5" :class="bulkDownloading ? 'animate-spin' : ''" />
                {{ t('batchImage.actions.downloadSelected') }}
              </button>
              <button
                type="button"
                class="btn btn-secondary btn-sm text-red-600 hover:text-red-700 dark:text-red-400"
                :disabled="bulkDeleting"
                @click="deleteSelectedJobs"
              >
                <Icon :name="bulkDeleting ? 'refresh' : 'trash'" size="sm" class="mr-1.5" :class="bulkDeleting ? 'animate-spin' : ''" />
                {{ t('batchImage.actions.deleteRecords') }}
              </button>
            </div>
          </div>
        </div>
      </template>

      <template #table>
        <DataTable
          :columns="columns"
          :data="visibleBatchJobs"
          :loading="loadingKeys || loadingJobs"
          :expandable-actions="false"
          row-key="id"
        >
          <template #header-select>
            <input
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              :checked="allVisibleSelected"
              :indeterminate="someVisibleSelected"
              @change="toggleAllVisible(($event.target as HTMLInputElement).checked)"
            />
          </template>

          <template #cell-select="{ row }">
            <input
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              :checked="selectedJobIds.has(row.id)"
              @change="toggleJobSelection(row.id, ($event.target as HTMLInputElement).checked)"
              @click.stop
            />
          </template>

          <template #cell-id="{ row }">
	            <div class="flex w-[220px] items-start gap-1" :class="row.is_child ? 'pl-6' : ''">
	              <button
	                v-if="row.child_count > 0 && !row.is_child"
	                type="button"
	                class="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 dark:text-gray-400 dark:hover:bg-dark-700 dark:hover:text-white"
	                :title="expandedParentIds.has(row.id) ? t('batchImage.list.collapseChildren') : t('batchImage.list.expandChildren', { n: row.child_count }, row.child_count)"
	                @click.stop="toggleChildRows(row.id)"
	              >
	                <Icon :name="expandedParentIds.has(row.id) ? 'chevronDown' : 'chevronRight'" size="xs" />
	              </button>
	              <span v-else class="w-6 flex-shrink-0" />
	              <button type="button" class="min-w-0 flex-1 rounded-lg py-1 text-left transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 dark:hover:bg-dark-700" @click="selectJob(row.id)">
	                <span
	                  class="flex min-w-0 items-center gap-2 text-sm font-medium"
	                  :class="row.task_name ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'"
                >
                  <span class="min-w-0 truncate">{{ row.task_name || defaultTaskName(row.created_at) }}</span>
                  <span v-if="row.child_count > 0 && !row.is_child" class="flex-shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-normal text-gray-600 dark:bg-dark-700 dark:text-gray-300">
                    {{ t('batchImage.list.childCount', { n: row.child_count }, row.child_count) }}
                  </span>
                  <span v-if="row.is_child" class="flex-shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-normal text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                    {{ t('batchImage.list.childBadge') }}
                  </span>
	                </span>
	                <span class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
	                  <span>{{ formatDate(row.created_at) }}</span>
	                </span>
	              </button>
	            </div>
	          </template>

          <template #cell-model="{ row }">
	            <div class="mx-auto max-w-[180px] text-center">
	              <p class="truncate text-sm text-gray-700 dark:text-gray-300" :title="row.model">{{ row.model }}</p>
	            </div>
	          </template>

          <template #cell-api_key_name="{ value }">
            <span class="block truncate text-center text-sm text-gray-700 dark:text-gray-300">
              {{ value || t('batchImage.list.keyNotRecorded') }}
            </span>
          </template>

          <template #cell-status="{ row }">
            <div class="flex justify-center">
              <span :class="statusBadgeClass(displayJob(row))" class="badge">
                {{ statusLabel(displayJob(row)) }}
              </span>
            </div>
          </template>

          <template #cell-counts="{ row }">
            <div class="flex items-center justify-center gap-2 text-sm tabular-nums">
              <span class="text-emerald-600 dark:text-emerald-300">{{ displayJob(row).success_count }}</span>
              <span class="text-gray-300 dark:text-dark-500">/</span>
              <span :class="displayJob(row).fail_count > 0 ? 'text-red-600 dark:text-red-300' : 'text-gray-400 dark:text-gray-500'">{{ displayJob(row).fail_count }}</span>
              <span class="text-xs text-gray-400 dark:text-gray-500">{{ t('batchImage.list.totalCount', { n: displayJob(row).item_count }) }}</span>
            </div>
          </template>

          <template #cell-cost="{ row }">
            <span class="block text-center text-sm text-gray-700 dark:text-gray-300">
              {{ costLabel(displayJob(row)) }}
            </span>
          </template>

          <template #cell-downloaded="{ row }">
            <span class="block text-center text-sm" :class="row.downloaded_at ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-500 dark:text-gray-400'">
              {{ row.downloaded_at ? formatDate(row.downloaded_at) : t('batchImage.list.notDownloaded') }}
            </span>
          </template>

	          <template #cell-actions="{ row }">
	            <div class="flex items-center justify-center gap-1">
              <button
                type="button"
                class="batch-row-action flex flex-col items-center gap-0.5 rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 dark:hover:bg-dark-700 dark:hover:text-primary-400"
                :title="t('batchImage.actions.viewDetail')"
                @click="selectJob(row.id)"
              >
                <Icon name="eye" size="sm" />
                <span class="text-xs">{{ t('common.view') }}</span>
              </button>
              <button
                type="button"
                class="batch-row-action flex flex-col items-center gap-0.5 rounded-lg p-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30"
                :class="canDownload(row) ? 'text-gray-500 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400' : 'text-gray-300 dark:text-dark-500'"
                :disabled="!canDownload(row) || downloading"
                :title="t('batchImage.actions.downloadZip')"
                @click="downloadJob(row)"
              >
                <Icon
                  :name="isDownloadingJob(row.id) ? 'refresh' : 'download'"
	                  size="sm"
	                  :class="isDownloadingJob(row.id) ? 'animate-spin' : ''"
	                />
                <span class="text-xs">{{ t('batchImage.actions.download') }}</span>
	              </button>
              <div v-if="canRetry(row) || canDeleteRecord(row)">
                <button
                  type="button"
                  class="batch-row-action flex flex-col items-center gap-0.5 rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 dark:hover:bg-dark-700 dark:hover:text-white"
                  :class="{ 'bg-gray-100 text-gray-900 dark:bg-dark-700 dark:text-white': openMoreJobId === row.id }"
                  :title="t('batchImage.actions.moreActions')"
                  @click.stop="toggleMoreMenu(row, $event)"
                >
                  <Icon name="more" size="sm" />
                  <span class="text-xs">{{ t('common.more') }}</span>
                </button>
              </div>
	            </div>
	          </template>

          <template #empty>
            <div class="flex min-h-[260px] flex-col items-center justify-center py-6 md:min-h-[300px]">
              <Icon name="sparkles" size="xl" class="mb-4 h-12 w-12 text-gray-400 dark:text-dark-500" />
              <p class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('batchImage.list.empty') }}</p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ t('batchImage.list.emptyHint') }}
              </p>
            </div>
          </template>
        </DataTable>
      </template>

      <template #pagination>
        <div
          v-if="visibleBatchJobs.length > 0 || pagination.page > 1"
          class="flex flex-col gap-3 border-t border-gray-200 bg-white px-4 py-3 dark:border-dark-700 dark:bg-dark-800 sm:flex-row sm:items-center sm:justify-between sm:px-6"
        >
          <div class="flex flex-wrap items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
            <i18n-t keypath="batchImage.pagination.pageNumber" tag="span" scope="global">
              <template #page>
                <span class="font-medium">{{ pagination.page }}</span>
              </template>
            </i18n-t>
            <i18n-t keypath="batchImage.pagination.pageItems" tag="span" scope="global">
              <template #count>
                <span class="font-medium">{{ visibleBatchJobs.length }}</span>
              </template>
            </i18n-t>
            <div class="flex items-center gap-2">
              <span>{{ t('pagination.perPage') }}</span>
              <FormSelect
                v-model="pagination.page_size"
                :options="batchPageSizeOptions"
                class="w-24"
                @change="handlePageSizeChange"
              />
            </div>
          </div>
          <div class="flex items-center justify-end gap-2">
            <button
              type="button"
              class="btn btn-secondary btn-sm"
              :disabled="pagination.page <= 1 || loadingJobs"
              @click="handlePageChange(pagination.page - 1)"
            >
              <Icon name="chevronLeft" size="sm" class="mr-1" />
              {{ t('pagination.previous') }}
            </button>
            <button
              type="button"
              class="btn btn-secondary btn-sm"
              :disabled="!pagination.has_more || loadingJobs"
              @click="handlePageChange(pagination.page + 1)"
            >
              {{ t('pagination.next') }}
              <Icon name="chevronRight" size="sm" class="ml-1" />
            </button>
          </div>
        </div>
      </template>
    </TablePageLayout>

    <Teleport to="body">
      <div
        v-if="openMoreJobId"
        class="fixed z-[9999] w-44 overflow-hidden rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 dark:bg-dark-800 dark:ring-white/10"
        :style="moreMenuStyle"
        @click.stop
      >
        <template v-for="job in batchJobs" :key="job.id">
          <template v-if="job.id === openMoreJobId">
            <button
              v-if="canRetry(job)"
              type="button"
              class="flex w-full items-center gap-2 px-3 py-2 text-left text-gray-700 transition-colors hover:bg-amber-50 hover:text-amber-700 disabled:opacity-60 dark:text-gray-200 dark:hover:bg-amber-900/20 dark:hover:text-amber-300"
              :disabled="retryingBatchId === job.id"
              @click="retryFailedJob(job)"
            >
              <Icon name="refresh" size="sm" :class="retryingBatchId === job.id ? 'animate-spin' : ''" />
              {{ t('batchImage.actions.retryFailedItems') }}
            </button>
            <button
              v-if="canDeleteRecord(job)"
              type="button"
              class="flex w-full items-center gap-2 px-3 py-2 text-left text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-900/20"
              :disabled="deletingBatchId === job.id"
              @click="deleteJob(job)"
            >
              <Icon :name="deletingBatchId === job.id ? 'refresh' : 'trash'" size="sm" :class="deletingBatchId === job.id ? 'animate-spin' : ''" />
              {{ t('batchImage.actions.deleteRecords') }}
            </button>
          </template>
        </template>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="promptPopover.visible"
        class="batch-prompt-popover fixed z-[9999] rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-800 shadow-xl ring-1 ring-black/5 dark:border-dark-700 dark:bg-dark-900 dark:text-gray-100 dark:ring-white/10"
        :style="promptPopover.style"
        @mouseenter="cancelPromptPopoverClose"
        @mouseleave="schedulePromptPopoverClose"
      >
        <div class="mb-2 flex items-center justify-between gap-3">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ t('batchImage.promptPopover.title') }}</span>
          <button
            type="button"
            class="rounded-md px-2 py-1 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 dark:text-primary-300 dark:hover:bg-primary-900/20"
            @click="copyPromptPopover"
          >
            {{ t('common.copy') }}
          </button>
        </div>
        <p class="max-h-48 overflow-y-auto whitespace-pre-wrap break-words leading-6 selection:bg-primary-100 selection:text-primary-900 dark:selection:bg-primary-900/60 dark:selection:text-primary-100">
          {{ promptPopover.text }}
        </p>
      </div>
    </Teleport>

    <BaseDialog :show="!!currentJob" :title="t('batchImage.detail.title')" width="extra-wide" @close="closeDetail">
      <div v-if="currentJob" class="space-y-4">
        <div class="rounded-lg border border-gray-200 bg-gray-50/70 px-4 py-3 dark:border-dark-700 dark:bg-dark-900/40">
          <div class="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            <div class="min-w-0 text-center">
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('common.status') }}</p>
              <div class="mt-1 flex justify-center">
                <span :class="statusBadgeClass(currentDisplayJob || currentJob)" class="badge whitespace-nowrap">
                  {{ statusLabel(currentDisplayJob || currentJob) }}
                </span>
              </div>
            </div>
            <div class="min-w-0 text-center">
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ hasChildJobs(currentJob.id) ? t('batchImage.detail.aggregatedResult') : t('batchImage.detail.result') }}</p>
              <p class="mt-1 flex items-center justify-center gap-2 font-medium tabular-nums">
              <span class="text-emerald-600 dark:text-emerald-300">{{ (currentDisplayJob || currentJob).success_count }}</span>
              <span class="text-gray-300 dark:text-dark-500">/</span>
              <span :class="(currentDisplayJob || currentJob).fail_count > 0 ? 'text-red-600 dark:text-red-300' : 'text-gray-400 dark:text-gray-500'">{{ (currentDisplayJob || currentJob).fail_count }}</span>
            </p>
            </div>
            <div class="min-w-0 text-center">
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('batchImage.detail.cost') }}</p>
              <p class="mt-1 truncate font-medium text-gray-900 dark:text-white">{{ costLabel(currentDisplayJob || currentJob) }}</p>
            </div>
            <div class="min-w-0 text-center">
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('batchImage.detail.downloadStatus') }}</p>
              <p class="mt-1 truncate font-medium text-gray-900 dark:text-white">
              {{ currentJob.downloaded_at ? formatDate(currentJob.downloaded_at) : t('batchImage.list.notDownloaded') }}
            </p>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('batchImage.detail.items') }}</h3>
          <button type="button" class="btn btn-secondary btn-sm" :disabled="refreshing || loadingItems" @click="refreshDetail">
            <Icon name="refresh" size="sm" class="mr-1.5" :class="refreshing || loadingItems ? 'animate-spin' : ''" />
            {{ t('common.refresh') }}
          </button>
        </div>

        <div v-if="items.length" class="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-dark-700 dark:bg-dark-900">
          <table class="w-full min-w-[860px] table-fixed divide-y divide-gray-200 text-sm dark:divide-dark-700">
            <colgroup>
              <col class="w-[18%]" />
              <col class="w-[34%]" />
              <col class="w-[12%]" />
              <col class="w-[10%]" />
              <col class="w-[26%]" />
            </colgroup>
            <thead class="bg-gray-50 dark:bg-dark-800/80">
              <tr>
                <th class="px-3 py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">Custom ID</th>
                <th class="px-3 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Prompt</th>
                <th class="px-3 py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('common.status') }}</th>
                <th class="px-3 py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('batchImage.detail.preview') }}</th>
                <th class="px-3 py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('batchImage.detail.result') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-dark-700">
              <tr
                v-for="item in items"
                :key="itemPreviewKey(item)"
                class="align-middle"
                :class="detailItemRowClass(item)"
              >
                <td class="px-3 py-2.5 text-center">
                  <span
                    class="block min-w-0 truncate font-mono text-sm"
                    :class="isRecoveredOriginalFailure(item) ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'"
                    :title="item.custom_id"
                  >
                    {{ item.custom_id }}
                  </span>
                </td>
                <td class="px-3 py-2.5 text-left" :class="isRecoveredOriginalFailure(item) ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'">
                  <div
                    class="batch-prompt-trigger cursor-default truncate rounded px-1 text-sm leading-6 focus:outline-none"
                    tabindex="0"
                    @pointerenter="schedulePromptPopoverOpen($event, item.prompt_preview || '-')"
                    @pointerleave="schedulePromptPopoverClose"
                    @mouseenter="schedulePromptPopoverOpen($event, item.prompt_preview || '-')"
                    @mouseleave="schedulePromptPopoverClose"
                    @click="showPromptPopover($event, item.prompt_preview || '-')"
                    @focus="showPromptPopover($event, item.prompt_preview || '-')"
                    @focusin="showPromptPopover($event, item.prompt_preview || '-')"
                    @blur="schedulePromptPopoverClose"
                  >
                    {{ item.prompt_preview || '-' }}
                  </div>
                </td>
                <td class="px-3 py-2.5 text-center">
                  <span :class="itemDisplayStatusBadgeClass(item)" class="badge max-w-full truncate whitespace-nowrap" :title="itemDisplayStatusLabel(item)">
                    {{ itemDisplayStatusLabel(item) }}
                  </span>
                </td>
                <td class="px-3 py-2.5 text-center">
                  <div class="mx-auto h-12 w-12 overflow-hidden rounded-md border border-gray-200 bg-gray-50 dark:border-dark-700 dark:bg-dark-800">
                    <button
                      v-if="itemPreviewUrls[itemPreviewKey(item)] && !previewErrorIds.has(itemPreviewKey(item))"
                      type="button"
                      class="block h-full w-full overflow-hidden"
                      :title="t('batchImage.detail.previewZoom', { id: item.custom_id })"
                      @click="openImagePreview(item)"
                    >
                      <img
                        :src="itemPreviewUrls[itemPreviewKey(item)]"
                        class="h-full w-full object-cover"
                        alt=""
                        @error="handlePreviewError(itemPreviewKey(item))"
                      />
                    </button>
                    <button
                      v-else-if="canLoadItemPreview(item)"
                      type="button"
                      class="flex h-full w-full items-center justify-center text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary-600 disabled:cursor-wait disabled:opacity-70 dark:text-gray-400 dark:hover:bg-dark-700"
                      :disabled="previewLoadingIds.has(itemPreviewKey(item))"
                      :title="previewErrorIds.has(itemPreviewKey(item)) ? t('batchImage.detail.previewReload') : t('batchImage.detail.previewLoad')"
                      @click="loadItemPreview(item)"
                    >
                      <Icon :name="previewLoadingIds.has(itemPreviewKey(item)) ? 'refresh' : 'eye'" size="sm" :class="previewLoadingIds.has(itemPreviewKey(item)) ? 'animate-spin' : ''" />
                    </button>
                    <div v-else class="flex h-full w-full items-center justify-center text-gray-400" :title="item.image_count > 0 ? t('batchImage.detail.previewUnavailable') : t('batchImage.detail.noImage')">
                      <Icon name="document" size="sm" />
                    </div>
                  </div>
                </td>
                <td class="px-3 py-2.5 text-center">
                  <span
                    class="inline-flex max-w-full items-center justify-center truncate rounded-md px-2.5 py-1 text-xs font-medium leading-5 ring-1 ring-inset"
                    :class="itemResultClass(item)"
                    :title="itemResultLabel(item)"
                  >
                    {{ itemResultLabel(item) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="rounded-lg border border-dashed border-gray-200 py-10 text-center dark:border-dark-700">
          <Icon name="refresh" size="lg" class="mx-auto mb-3 text-gray-400" :class="loadingItems ? 'animate-spin' : ''" />
          <p class="text-sm font-medium text-gray-700 dark:text-gray-200">
            {{ loadingItems ? t('batchImage.detail.loadingItems') : t('batchImage.detail.noItems') }}
          </p>
          <p v-if="!loadingItems" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ t('batchImage.detail.noItemsHint') }}
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
	          <button type="button" class="btn btn-secondary" :disabled="!currentJob || !canCancel(currentJob) || cancelling" @click="cancelSelected">
	            <Icon v-if="cancelling" name="refresh" size="sm" class="mr-2 animate-spin" />
	            {{ t('batchImage.actions.cancelJob') }}
	          </button>
	          <button
	            v-if="currentJob && currentDisplayJob && canRetry(currentDisplayJob)"
	            type="button"
	            class="btn btn-secondary inline-flex min-w-[116px] items-center justify-center"
	            :disabled="retryingBatchId === currentJob.id"
	            @click="retrySelected"
	          >
	            <Icon name="refresh" size="sm" class="mr-2" :class="currentJob && retryingBatchId === currentJob.id ? 'animate-spin' : ''" />
	            {{ t('batchImage.actions.retryFailedItems') }}
	          </button>
	          <button
            type="button"
            class="btn btn-primary inline-flex min-w-[112px] items-center justify-center"
            :disabled="!currentJob || !canDownload(currentJob) || downloading"
            @click="downloadSelected"
          >
            <Icon
              :name="currentJob && isDownloadingJob(currentJob.id) ? 'refresh' : 'download'"
              size="sm"
              class="mr-2"
              :class="currentJob && isDownloadingJob(currentJob.id) ? 'animate-spin' : ''"
            />
            {{ t('batchImage.actions.downloadZip') }}
          </button>
        </div>
      </template>
    </BaseDialog>

    <BaseDialog :show="!!previewImageItem" :title="previewImageItem?.custom_id || t('batchImage.imagePreview.title')" width="extra-wide" :z-index="60" @close="closeImagePreview">
      <div class="space-y-3">
        <div class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
          {{ t('batchImage.imagePreview.notice') }}
        </div>
        <div class="flex min-h-[420px] items-center justify-center rounded-lg bg-gray-50 p-4 dark:bg-dark-900">
          <img
            v-if="previewImageUrl"
            :src="previewImageUrl"
            class="max-h-[70vh] max-w-full rounded-md object-contain"
            :alt="previewImageItem?.custom_id || ''"
          />
        </div>
      </div>
    </BaseDialog>

    <BaseDialog :show="showCreateModal" :title="t('batchImage.create.title')" width="wide" @close="closeCreateModal">
      <form class="space-y-5" @submit.prevent="submitJob">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="md:col-span-2">
            <label class="input-label">{{ t('batchImage.create.taskName') }}</label>
            <input
              v-model="form.taskName"
              type="text"
              maxlength="255"
              class="input"
              :placeholder="t('batchImage.create.taskNamePlaceholder')"
            />
          </div>

          <div class="md:col-span-2">
            <label class="input-label">API Key</label>
            <select v-model.number="form.apiKeyId" class="input" :disabled="loadingKeys">
              <option :value="0">{{ loadingKeys ? t('batchImage.create.loadingKeys') : t('batchImage.create.selectKeyPlaceholder') }}</option>
              <option v-for="key in geminiApiKeys" :key="key.id" :value="key.id">
                {{ key.name }} · {{ key.group?.name || 'Gemini' }}
              </option>
            </select>
            <p v-if="!loadingKeys && geminiApiKeys.length === 0" class="input-hint text-amber-600 dark:text-amber-400">
              {{ t('batchImage.create.noKeysHint') }}
            </p>
          </div>

          <div>
            <label class="input-label">{{ t('batchImage.create.model') }}</label>
            <select v-model="form.model" class="input" :disabled="loadingModels || availableBatchImageModels.length === 0">
              <option v-if="loadingModels" value="">{{ batchImageText('loadingModels') }}</option>
              <option v-else-if="availableBatchImageModels.length === 0" value="">{{ batchImageText('noModels') }}</option>
              <option v-for="model in availableBatchImageModels" :key="model.value" :value="model.value">
                {{ model.label }}
              </option>
            </select>
            <p v-if="modelLoadError" class="input-hint text-amber-600 dark:text-amber-400">
              {{ modelLoadError }}
            </p>
            <p v-else-if="selectedApiKey && !loadingModels && availableBatchImageModels.length === 0" class="input-hint text-amber-600 dark:text-amber-400">
              {{ batchImageText('noModelsHint') }}
            </p>
          </div>

          <div>
            <label class="input-label">{{ t('batchImage.create.imageSize') }}</label>
            <div class="input flex items-center bg-gray-50 text-gray-600 dark:bg-dark-900 dark:text-gray-300">
              1K
            </div>
            <p class="input-hint">{{ t('batchImage.create.imageSizeHint') }}</p>
          </div>

          <div>
            <label class="input-label">{{ t('batchImage.create.outputFormat') }}</label>
            <select v-model="form.responseMimeType" class="input">
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/webp">WebP</option>
            </select>
          </div>

          <div>
            <label class="input-label">{{ t('batchImage.create.estimatedOutput') }}</label>
            <div class="input flex items-center bg-gray-50 text-gray-600 dark:bg-dark-900 dark:text-gray-300">
              {{ t('batchImage.create.estimatedOutputValue', { images: estimatedOutputCount, prompts: promptRows.length }) }}
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between gap-3">
            <label class="input-label mb-0">Prompt</label>
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ t('batchImage.create.promptAdded', { count: promptRows.length }) }}</span>
          </div>
          <div class="rounded-lg border border-gray-200 p-3 dark:border-dark-700">
            <textarea
              v-model="promptDraft"
              rows="3"
              class="h-[76px] w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm leading-5 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-dark-600 dark:bg-dark-900 dark:text-gray-100 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
              :placeholder="t('batchImage.create.promptPlaceholder')"
            />
            <div class="mt-2 grid gap-2 md:grid-cols-[minmax(0,1fr)_112px_132px_112px] md:items-center">
              <input
                v-model="customIdDraft"
                type="text"
                maxlength="255"
                class="input h-9 text-sm"
                :placeholder="t('batchImage.create.customIdPlaceholder')"
              />
              <select
                v-model.number="outputCountDraft"
                class="batch-output-count-select input h-9 text-sm"
                :title="t('batchImage.create.outputCountPerPrompt')"
                :aria-label="t('batchImage.create.outputCountPerPrompt')"
              >
                <option v-for="count in outputCountOptions" :key="count" :value="count">
                  {{ t('batchImage.create.outputCountOption', { n: count }, count) }}
                </option>
              </select>
              <label
                class="btn btn-secondary h-9 cursor-pointer justify-center text-sm"
                :class="referenceImageDrafts.length >= selectedModelReferenceLimit ? 'pointer-events-none opacity-60' : ''"
              >
                <Icon name="upload" size="sm" class="mr-1.5" />
                {{ t('batchImage.create.referenceImage') }}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  class="hidden"
                  :disabled="referenceImageDrafts.length >= selectedModelReferenceLimit"
                  @change="handleReferenceImageFiles"
                />
              </label>
              <button type="button" class="btn btn-secondary h-9 justify-center whitespace-nowrap px-4 text-sm" :disabled="!promptDraft.trim()" @click="addPromptRow">
                <Icon name="plus" size="sm" class="mr-1.5" />
                {{ t('common.add') }}
              </button>
            </div>
            <div v-if="referenceImageDrafts.length" class="mt-3 flex flex-wrap gap-2">
              <span
                v-for="(ref, refIndex) in referenceImageDrafts"
                :key="`${ref.name}-${refIndex}`"
                class="inline-flex max-w-full items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700 dark:border-dark-700 dark:bg-dark-900 dark:text-gray-200"
              >
                <span class="max-w-[180px] truncate">{{ ref.name }}</span>
                <button type="button" class="text-gray-400 hover:text-red-600" :title="t('batchImage.create.removeReferenceImage')" @click="removeReferenceImageDraft(refIndex)">
                  <Icon name="x" size="xs" />
                </button>
              </span>
            </div>
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {{ t('batchImage.create.limitsHint', { maxPerItem: BATCH_IMAGE_MAX_OUTPUTS_PER_ITEM, maxPerJob: BATCH_IMAGE_MAX_OUTPUTS_PER_JOB, refLimit: selectedModelReferenceLimit }) }}
            </p>
          </div>
          <div v-if="promptRows.length" class="overflow-hidden rounded-lg border border-gray-200 dark:border-dark-700">
            <div
              v-for="(row, index) in promptRows"
              :key="row.localId"
              class="flex items-center gap-3 border-b border-gray-100 px-3 py-2 last:border-b-0 dark:border-dark-700"
            >
              <span class="w-20 flex-shrink-0 font-mono text-xs text-gray-500 dark:text-gray-400">{{ row.custom_id }}</span>
              <p class="min-w-0 flex-1 truncate text-sm text-gray-800 dark:text-gray-100">{{ row.prompt }}</p>
              <span v-if="row.output_count > 1" class="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                x{{ row.output_count }}
              </span>
              <span v-if="row.reference_images.length" class="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                {{ t('batchImage.create.referenceCount', { n: row.reference_images.length }, row.reference_images.length) }}
              </span>
              <button type="button" class="btn-ghost btn-icon flex-shrink-0 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20" :title="t('common.delete')" @click="removePromptRow(index)">
                <Icon name="trash" size="sm" />
              </button>
            </div>
          </div>
          <div v-else class="rounded-lg border border-dashed border-gray-200 px-3 py-6 text-center text-sm text-gray-500 dark:border-dark-700 dark:text-gray-400">
            {{ t('batchImage.create.noPrompts') }}
          </div>
        </div>

	        <div class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
	          {{ t('batchImage.create.cancelNotice') }}
	        </div>
	        <div v-if="submitting" class="rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm leading-6 text-sky-800 dark:border-sky-800 dark:bg-sky-950/30 dark:text-sky-100">
	          {{ t('batchImage.create.submittingNotice') }}
	        </div>
	      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button type="button" class="btn btn-secondary" :disabled="submitting" @click="closeCreateModal">{{ t('common.cancel') }}</button>
	          <button type="button" class="btn btn-primary inline-flex min-w-[120px] justify-center" :disabled="submitting || loadingModels || (parsedItems.length === 0 && !promptDraft.trim()) || !selectedApiKey || !form.model" @click="submitJob">
            <Icon v-if="submitting" name="refresh" size="sm" class="mr-2 animate-spin" />
            {{ submitting ? t('common.submitting') : t('batchImage.actions.submitJob') }}
          </button>
        </div>
      </template>
    </BaseDialog>

    <BaseDialog :show="showGuideModal" :title="t('batchImage.guide.title')" width="wide" @close="showGuideModal = false">
	      <div class="space-y-5">
	        <section class="space-y-3">
	          <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('batchImage.guide.uiTitle') }}</h3>
	          <div class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm leading-6 text-gray-700 dark:border-dark-700 dark:bg-dark-900/50 dark:text-gray-200">
	            <p>{{ t('batchImage.guide.step1') }}</p>
	            <p>{{ t('batchImage.guide.step2') }}</p>
	            <p>{{ t('batchImage.guide.step3') }}</p>
	            <p>{{ t('batchImage.guide.step4') }}</p>
	          </div>
	        </section>
	        <section class="space-y-3">
	          <div class="flex flex-wrap items-center justify-between gap-3">
	            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('batchImage.guide.skillTitle') }}</h3>
	            <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('batchImage.guide.skillDesc') }}</p>
	          </div>
	        <textarea
	          :value="agentInstruction"
	          readonly
	          class="min-h-[420px] w-full resize-y rounded-md border border-gray-200 bg-gray-50 p-4 font-mono text-sm leading-6 text-gray-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-dark-600 dark:bg-dark-900 dark:text-gray-100 dark:focus:border-primary-500 dark:focus:ring-primary-900/40"
	        />
	        </section>
	      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button type="button" class="btn btn-secondary" @click="showGuideModal = false">{{ t('common.close') }}</button>
          <button type="button" class="btn btn-primary" @click="copyInstruction">
            <Icon name="copy" size="sm" class="mr-2" />
            {{ t('batchImage.actions.copyInstruction') }}
          </button>
        </div>
      </template>
    </BaseDialog>
  </AppLayout>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppLayout from '@/common/widgets/layout/AppLayout.vue'
import TablePageLayout from '@/common/widgets/layout/TablePageLayout.vue'
import DataTable from '@/common/widgets/data/DataTable.vue'
import BaseDialog from '@/common/widgets/feedback/BaseDialog.vue'
import FormSelect from '@/common/widgets/forms/Select.vue'
import SearchInput from '@/common/widgets/forms/SearchInput.vue'
import Icon from '@/common/widgets/icons/Icon.vue'
import type { BatchImageGuideContext } from '@/features/batch-image/presentation/composables/useBatchImageGuideController'

export default defineComponent({
  name: 'BatchImageGuideWorkspace',
  components: {
    AppLayout,
    TablePageLayout,
    DataTable,
    BaseDialog,
    FormSelect,
    SearchInput,
    Icon,
  },
  props: {
    context: {
      type: Object as PropType<BatchImageGuideContext>,
      required: true,
    },
  },
  setup(props) {
    return props.context
  },
})
</script>

<style scoped>
.batch-row-action {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: 42px;
  line-height: 1;
  outline: none;
}

.batch-row-action:focus {
  outline: none;
}

.batch-row-action :deep(svg) {
  margin-right: 0 !important;
}

.batch-prompt-trigger:focus {
  outline: none;
  box-shadow: none;
}

.batch-prompt-popover {
  user-select: text;
}

.batch-prompt-popover p {
  scrollbar-width: thin;
}

.batch-output-count-select {
  height: 36px;
  min-height: 36px;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 14px;
  padding-right: 34px;
  line-height: 36px;
}
</style>
