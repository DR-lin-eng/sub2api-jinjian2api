<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BaseDialog from '@/common/widgets/feedback/BaseDialog.vue'
import ConfirmDialog from '@/common/widgets/feedback/ConfirmDialog.vue'
import Icon from '@/common/widgets/icons/Icon.vue'
import PlatformTypeBadge from '@/common/widgets/icons/PlatformTypeBadge.vue'
import ImportDataModal from './ImportDataDialog.vue'
import type { ProxyPageDialogsContext } from '../proxyPageContext'

const props = defineProps<{
  context: ProxyPageDialogsContext
}>()

const { t } = useI18n()
const {
  accountsLoading,
  accountsProxy,
  closeAccountsModal,
  closeQualityReportDialog,
  confirmBatchDelete,
  confirmDelete,
  deletingProxy,
  handleDataImported,
  handleExportData,
  proxyAccounts,
  qualityReport,
  qualityReportProxy,
  qualityStatusClass,
  qualityStatusLabel,
  qualityTargetLabel,
  selectedCount,
  showAccountsModal,
  showBatchDeleteDialog,
  showDeleteDialog,
  showExportDataDialog,
  showImportData,
  showQualityReportDialog
} = props.context
</script>

<template>
  <ConfirmDialog
    :show="showDeleteDialog"
    :title="t('admin.proxies.deleteProxy')"
    :message="t('admin.proxies.deleteConfirm', { name: deletingProxy?.name })"
    :confirm-text="t('common.delete')"
    :cancel-text="t('common.cancel')"
    :danger="true"
    @confirm="confirmDelete"
    @cancel="showDeleteDialog = false"
  />

  <ConfirmDialog
    :show="showBatchDeleteDialog"
    :title="t('admin.proxies.batchDelete')"
    :message="t('admin.proxies.batchDeleteConfirm', { count: selectedCount })"
    :confirm-text="t('common.delete')"
    :cancel-text="t('common.cancel')"
    :danger="true"
    @confirm="confirmBatchDelete"
    @cancel="showBatchDeleteDialog = false"
  />
  <ConfirmDialog
    :show="showExportDataDialog"
    :title="t('admin.proxies.dataExport')"
    :message="t('admin.proxies.dataExportConfirmMessage')"
    :confirm-text="t('admin.proxies.dataExportConfirm')"
    :cancel-text="t('common.cancel')"
    @confirm="handleExportData"
    @cancel="showExportDataDialog = false"
  />

  <ImportDataModal
    :show="showImportData"
    @close="showImportData = false"
    @imported="handleDataImported"
  />

  <BaseDialog
    :show="showQualityReportDialog"
    :title="t('admin.proxies.qualityReportTitle')"
    width="normal"
    @close="closeQualityReportDialog"
  >
    <div v-if="qualityReport" class="space-y-4">
      <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-dark-600 dark:bg-dark-700">
        <div class="flex items-center justify-between gap-4">
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ qualityReportProxy?.name || '-' }}
            </div>
            <div class="mt-1 text-sm text-gray-700 dark:text-gray-200">
              {{ qualityReport.summary }}
            </div>
          </div>
          <div class="text-right">
            <div class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ qualityReport.score }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ t('admin.proxies.qualityGrade', { grade: qualityReport.grade }) }}
            </div>
          </div>
        </div>
        <div class="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
          <div>{{ t('admin.proxies.qualityExitIP') }}: {{ qualityReport.exit_ip || '-' }}</div>
          <div>{{ t('admin.proxies.qualityCountry') }}: {{ qualityReport.country || '-' }}</div>
          <div>
            {{ t('admin.proxies.qualityBaseLatency') }}:
            {{ typeof qualityReport.base_latency_ms === 'number' ? `${qualityReport.base_latency_ms}ms` : '-' }}
          </div>
          <div>{{ t('admin.proxies.qualityCheckedAt') }}: {{ new Date(qualityReport.checked_at * 1000).toLocaleString() }}</div>
        </div>
      </div>

      <div class="max-h-80 overflow-auto rounded-lg border border-gray-200 dark:border-dark-600">
        <table class="min-w-full divide-y divide-gray-200 text-sm dark:divide-dark-700">
          <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-dark-800 dark:text-dark-400">
            <tr>
              <th class="whitespace-nowrap px-3 py-2 text-left">{{ t('admin.proxies.qualityTableTarget') }}</th>
              <th class="whitespace-nowrap px-3 py-2 text-left">{{ t('admin.proxies.qualityTableStatus') }}</th>
              <th class="whitespace-nowrap px-3 py-2 text-left">HTTP</th>
              <th class="whitespace-nowrap px-3 py-2 text-left">{{ t('admin.proxies.qualityTableLatency') }}</th>
              <th class="px-3 py-2 text-left">{{ t('admin.proxies.qualityTableMessage') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white dark:divide-dark-700 dark:bg-dark-900">
            <tr v-for="item in qualityReport.items" :key="item.target">
              <td class="whitespace-nowrap px-3 py-2 text-gray-900 dark:text-white">{{ qualityTargetLabel(item.target) }}</td>
              <td class="whitespace-nowrap px-3 py-2">
                <span class="badge whitespace-nowrap" :class="qualityStatusClass(item.status)">{{ qualityStatusLabel(item.status) }}</span>
              </td>
              <td class="whitespace-nowrap px-3 py-2 text-gray-600 dark:text-gray-300">{{ item.http_status ?? '-' }}</td>
              <td class="whitespace-nowrap px-3 py-2 text-gray-600 dark:text-gray-300">
                {{ typeof item.latency_ms === 'number' ? `${item.latency_ms}ms` : '-' }}
              </td>
              <td class="px-3 py-2 text-gray-600 dark:text-gray-300">
                <span>{{ item.message || '-' }}</span>
                <span v-if="item.cf_ray" class="ml-1 text-xs text-gray-400">(cf-ray: {{ item.cf_ray }})</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end">
        <button @click="closeQualityReportDialog" class="btn btn-secondary">
          {{ t('common.close') }}
        </button>
      </div>
    </template>
  </BaseDialog>

  <BaseDialog
    :show="showAccountsModal"
    :title="t('admin.proxies.accountsTitle', { name: accountsProxy?.name || '' })"
    width="normal"
    @close="closeAccountsModal"
  >
    <div v-if="accountsLoading" class="flex items-center justify-center py-8 text-sm text-gray-500">
      <Icon name="refresh" size="md" class="mr-2 animate-spin" />
      {{ t('common.loading') }}
    </div>
    <div v-else-if="proxyAccounts.length === 0" class="py-6 text-center text-sm text-gray-500">
      {{ t('admin.proxies.accountsEmpty') }}
    </div>
    <div v-else class="max-h-80 overflow-auto">
      <table class="min-w-full divide-y divide-gray-200 text-sm dark:divide-dark-700">
        <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-dark-800 dark:text-dark-400">
          <tr>
            <th class="px-4 py-2 text-left">{{ t('admin.proxies.accountName') }}</th>
            <th class="px-4 py-2 text-left">{{ t('admin.accounts.columns.platformType') }}</th>
            <th class="px-4 py-2 text-left">{{ t('admin.proxies.accountNotes') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white dark:divide-dark-700 dark:bg-dark-900">
          <tr v-for="account in proxyAccounts" :key="account.id">
            <td class="px-4 py-2 font-medium text-gray-900 dark:text-white">{{ account.name }}</td>
            <td class="px-4 py-2">
              <PlatformTypeBadge :platform="account.platform" :type="account.type" />
            </td>
            <td class="px-4 py-2 text-gray-600 dark:text-gray-300">
              {{ account.notes || '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <template #footer>
      <div class="flex justify-end">
        <button @click="closeAccountsModal" class="btn btn-secondary">
          {{ t('common.close') }}
        </button>
      </div>
    </template>
  </BaseDialog>
</template>
