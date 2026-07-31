<template>
  <div class="space-y-6">
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t('admin.settings.features.channelMonitor.title') }}
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t('admin.settings.features.channelMonitor.description') }}
        </p>
        <p class="mt-1.5 text-xs">
          <router-link
              to="/admin/channels/monitor"
              class="inline-flex items-center gap-1 text-primary-600 hover:underline dark:text-primary-400"
          >
            {{ t('admin.settings.features.channelMonitor.configureLink') }}
            <span aria-hidden="true">→</span>
          </router-link>
        </p>
      </div>
      <div class="space-y-5 p-6">
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t('admin.settings.features.channelMonitor.enabled') }}
            </label>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t('admin.settings.features.channelMonitor.enabledHint') }}
            </p>
          </div>
          <Toggle v-model="form.channelMonitorEnabled"/>
        </div>
        <div v-if="form.channelMonitorEnabled">
          <label class="input-label">
            {{ t('admin.settings.features.channelMonitor.defaultInterval') }}
            <span class="text-red-500">*</span>
          </label>
          <input
              v-model.number="form.channelMonitorDefaultIntervalSeconds"
              type="number"
              min="15"
              max="3600"
              class="input"
          />
          <p class="mt-1 text-xs text-gray-400">
            {{ t('admin.settings.features.channelMonitor.defaultIntervalHint') }}
          </p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t('admin.settings.features.availableChannels.title') }}
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t('admin.settings.features.availableChannels.description') }}
        </p>
        <p class="mt-1.5 text-xs">
          <router-link
              to="/admin/channels/pricing"
              class="inline-flex items-center gap-1 text-primary-600 hover:underline dark:text-primary-400"
          >
            {{ t('admin.settings.features.availableChannels.configureLink') }}
            <span aria-hidden="true">→</span>
          </router-link>
        </p>
      </div>
      <div class="space-y-5 p-6">
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t('admin.settings.features.availableChannels.enabled') }}
            </label>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t('admin.settings.features.availableChannels.enabledHint') }}
            </p>
          </div>
          <Toggle v-model="form.availableChannelsEnabled"/>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t('admin.settings.features.riskControl.title') }}
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t('admin.settings.features.riskControl.description') }}
        </p>
        <p class="mt-1.5 text-xs">
          <router-link
              to="/admin/risk-control"
              class="inline-flex items-center gap-1 text-primary-600 hover:underline dark:text-primary-400"
          >
            {{ t('admin.settings.features.riskControl.configureLink') }}
            <span aria-hidden="true">→</span>
          </router-link>
        </p>
      </div>
      <div class="space-y-5 p-6">
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t('admin.settings.features.riskControl.enabled') }}
            </label>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t('admin.settings.features.riskControl.enabledHint') }}
            </p>
          </div>
          <Toggle v-model="form.riskControlEnabled"/>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t('admin.settings.features.riskControl.cyberSessionBlock') }}
            </label>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t('admin.settings.features.riskControl.cyberSessionBlockHint') }}
            </p>
          </div>
          <Toggle v-model="form.cyberSessionBlockEnabled"/>
        </div>
        <div v-if="form.cyberSessionBlockEnabled">
          <label class="input-label">
            {{ t('admin.settings.features.riskControl.cyberSessionBlockTTL') }}
            <span class="text-red-500">*</span>
          </label>
          <input
              v-model.number="form.cyberSessionBlockTtlSeconds"
              type="number"
              min="1"
              class="input"
          />
        </div>
      </div>
    </div>

    <!-- Affiliate (邀请返利) feature card -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t('admin.settings.features.affiliate.title') }}
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t('admin.settings.features.affiliate.description') }}
        </p>
      </div>
      <div class="space-y-5 p-6">
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t('admin.settings.features.affiliate.enabled') }}
            </label>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t('admin.settings.features.affiliate.enabledHint') }}
            </p>
          </div>
          <Toggle v-model="form.affiliateEnabled"/>
        </div>

        <div v-if="form.affiliateEnabled" class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('admin.settings.features.affiliate.adminRechargeRebate') }}
              </label>
              <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {{ t('admin.settings.features.affiliate.adminRechargeRebateHint') }}
              </p>
            </div>
            <Toggle v-model="form.affiliateAdminRechargeEnabled"/>
          </div>

          <div>
            <label class="input-label">
              {{ t('admin.settings.features.affiliate.rebateRate') }}
            </label>
            <div class="relative">
              <input
                  v-model.number="form.affiliateRebateRate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  class="input pr-8"
                  placeholder="20"
              />
              <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
            </div>
            <p class="mt-1 text-xs text-gray-400">
              {{ t('admin.settings.features.affiliate.rebateRateHint') }}
            </p>
          </div>

          <div>
            <label class="input-label">
              {{ t('admin.settings.features.affiliate.freezeHours') }}
            </label>
            <input
                v-model.number="form.affiliateRebateFreezeHours"
                type="number"
                step="1"
                min="0"
                max="720"
                class="input"
            />
            <p class="mt-1 text-xs text-gray-400">
              {{ t('admin.settings.features.affiliate.freezeHoursDesc') }}
            </p>
          </div>

          <div>
            <label class="input-label">
              {{ t('admin.settings.features.affiliate.durationDays') }}
            </label>
            <input
                v-model.number="form.affiliateRebateDurationDays"
                type="number"
                step="1"
                min="0"
                max="3650"
                class="input"
            />
            <p class="mt-1 text-xs text-gray-400">
              {{ t('admin.settings.features.affiliate.durationDaysDesc') }}
            </p>
          </div>

          <div>
            <label class="input-label">
              {{ t('admin.settings.features.affiliate.perInviteeCap') }}
            </label>
            <input
                v-model.number="form.affiliateRebatePerInviteeCap"
                type="number"
                step="0.01"
                min="0"
                class="input"
            />
            <p class="mt-1 text-xs text-gray-400">
              {{ t('admin.settings.features.affiliate.perInviteeCapDesc') }}
            </p>
          </div>

          <!-- 专属用户管理 -->
          <div class="border-t border-gray-100 pt-6 dark:border-dark-700">
            <div class="mb-3 flex items-center justify-between">
              <div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ t('admin.settings.features.affiliate.customUsers.title') }}
                </h3>
                <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {{ t('admin.settings.features.affiliate.customUsers.description') }}
                </p>
              </div>
              <button
                  type="button"
                  class="btn btn-primary btn-sm"
                  @click="openAffiliateModal(null)"
              >
                + {{ t('admin.settings.features.affiliate.customUsers.addButton') }}
              </button>
            </div>

            <div class="mb-3 flex items-center gap-2">
              <input
                  v-model="affiliateState.search"
                  type="text"
                  class="input flex-1"
                  :placeholder="t('admin.settings.features.affiliate.customUsers.searchPlaceholder')"
                  @input="onAffiliateSearchInput"
              />
              <button
                  v-if="affiliateState.selected.length > 0"
                  type="button"
                  class="btn btn-secondary btn-sm"
                  @click="openAffiliateBatchModal"
              >
                {{
                  t('admin.settings.features.affiliate.customUsers.batchButton', {count: affiliateState.selected.length})
                }}
              </button>
            </div>

            <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-dark-700">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
                <thead class="bg-gray-50 dark:bg-dark-800">
                <tr>
                  <th class="px-3 py-2 text-left">
                    <input
                        type="checkbox"
                        :checked="affiliateState.entries.length > 0 && affiliateState.selected.length === affiliateState.entries.length"
                        @change="toggleAffiliateSelectAll"
                    />
                  </th>
                  <th class="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">
                    {{ t('admin.settings.features.affiliate.customUsers.col.email') }}
                  </th>
                  <th class="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">
                    {{ t('admin.settings.features.affiliate.customUsers.col.username') }}
                  </th>
                  <th class="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">
                    {{ t('admin.settings.features.affiliate.customUsers.col.code') }}
                  </th>
                  <th class="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">
                    {{ t('admin.settings.features.affiliate.customUsers.col.rate') }}
                  </th>
                  <th class="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">
                    {{ t('admin.settings.features.affiliate.customUsers.col.actions') }}
                  </th>
                </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-dark-700 dark:bg-dark-900">
                <tr v-if="affiliateState.loading">
                  <td colspan="6" class="px-3 py-6 text-center text-sm text-gray-500">
                    {{ t('common.loading') }}
                  </td>
                </tr>
                <tr v-else-if="affiliateState.entries.length === 0">
                  <td colspan="6" class="px-3 py-6 text-center text-sm text-gray-500">
                    {{ t('admin.settings.features.affiliate.customUsers.empty') }}
                  </td>
                </tr>
                <tr v-for="entry in affiliateState.entries" :key="entry.userId">
                  <td class="px-3 py-2">
                    <input
                        type="checkbox"
                        :checked="affiliateState.selected.includes(entry.userId)"
                        @change="toggleAffiliateSelect(entry.userId)"
                    />
                  </td>
                  <td class="px-3 py-2 text-sm text-gray-900 dark:text-white">{{ entry.email }}</td>
                  <td class="px-3 py-2 text-sm text-gray-600 dark:text-gray-300">{{ entry.username }}</td>
                  <td class="px-3 py-2 text-sm font-mono">
                    {{ entry.affCode }}
                    <span
                        v-if="entry.affCodeCustom"
                        class="ml-1 inline-block rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                    >{{ t('admin.settings.features.affiliate.customUsers.customBadge') }}</span>
                  </td>
                  <td class="px-3 py-2 text-sm">
                    <span v-if="entry.affRebateRatePercent != null">{{ entry.affRebateRatePercent }}%</span>
                    <span v-else class="text-gray-400">{{
                        t('admin.settings.features.affiliate.customUsers.useGlobal')
                      }}</span>
                  </td>
                  <td class="px-3 py-2 text-sm">
                    <div class="flex items-center gap-2">
                      <button type="button" class="text-primary-600 hover:underline"
                              @click="openAffiliateModal(entry)">
                        {{ t('common.edit') }}
                      </button>
                      <button
                          type="button"
                          class="text-red-600 hover:underline"
                          @click="askResetAffiliateUser(entry)"
                      >
                        {{ t('common.delete') }}
                      </button>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

            <div v-if="affiliateState.total > affiliateState.pageSize"
                 class="mt-3 flex items-center justify-between text-sm">
                  <span class="text-gray-500">
                    {{ t('admin.settings.features.affiliate.customUsers.totalLabel', {total: affiliateState.total}) }}
                  </span>
              <div class="flex items-center gap-2">
                <button
                    type="button"
                    class="btn btn-secondary btn-sm"
                    :disabled="affiliateState.page <= 1"
                    @click="changeAffiliatePage(affiliateState.page - 1)"
                >
                  {{ t('pagination.previous') }}
                </button>
                <span class="text-gray-500">{{
                    affiliateState.page
                  }} / {{ Math.max(1, Math.ceil(affiliateState.total / affiliateState.pageSize)) }}</span>
                <button
                    type="button"
                    class="btn btn-secondary btn-sm"
                    :disabled="affiliateState.page >= Math.ceil(affiliateState.total / affiliateState.pageSize)"
                    @click="changeAffiliatePage(affiliateState.page + 1)"
                >
                  {{ t('pagination.next') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Affiliate add/edit modal -->
    <div
        v-if="affiliateModal.open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="closeAffiliateModal"
    >
      <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-dark-900">
        <h3 class="mb-4 text-lg font-semibold">
          {{
            affiliateModal.mode === 'add' ? t('admin.settings.features.affiliate.modal.addTitle') : t('admin.settings.features.affiliate.modal.editTitle')
          }}
        </h3>
        <div class="space-y-4">
          <div v-if="affiliateModal.mode === 'add'">
            <label class="input-label">{{ t('admin.settings.features.affiliate.modal.userLabel') }}</label>
            <!-- Chip showing the picked user; clicking it re-opens the search -->
            <div
                v-if="affiliateModal.selectedUser"
                class="flex items-center justify-between rounded-md border border-primary-200 bg-primary-50 px-3 py-2 dark:border-primary-700/50 dark:bg-primary-900/20"
            >
              <div class="text-sm">
                      <span class="font-medium text-gray-900 dark:text-white">{{
                          affiliateModal.selectedUser.email
                        }}</span>
                <span class="ml-1 text-xs text-gray-500">({{ affiliateModal.selectedUser.username }})</span>
              </div>
              <button
                  type="button"
                  class="text-lg leading-none text-gray-400 hover:text-red-600"
                  :title="t('admin.settings.features.affiliate.modal.changeUser')"
                  @click="clearSelectedAffiliateUser"
              >
                ×
              </button>
            </div>
            <!-- Search input + result dropdown — hidden once a selection is made -->
            <template v-else>
              <input
                  v-model="affiliateModal.userQuery"
                  type="text"
                  class="input"
                  :placeholder="t('admin.settings.features.affiliate.modal.userPlaceholder')"
                  @input="onAffiliateUserSearchInput"
              />
              <div
                  v-if="affiliateModal.userResults.length > 0"
                  class="mt-1 max-h-40 overflow-y-auto rounded border border-gray-200 dark:border-dark-700"
              >
                <button
                    v-for="u in affiliateModal.userResults"
                    :key="u.id"
                    type="button"
                    class="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-dark-800"
                    @click="selectAffiliateUser(u)"
                >
                  {{ u.email }} <span class="text-xs text-gray-500">({{ u.username }})</span>
                </button>
              </div>
            </template>
          </div>
          <div v-else>
            <label class="input-label">{{ t('admin.settings.features.affiliate.modal.userLabel') }}</label>
            <input
                type="text"
                class="input"
                :value="affiliateModal.editingEntry ? affiliateModal.editingEntry.email : ''"
                disabled
            />
          </div>

          <div>
            <label class="input-label">{{ t('admin.settings.features.affiliate.modal.codeLabel') }}</label>
            <input
                v-model="affiliateModal.code"
                type="text"
                class="input font-mono"
                :placeholder="t('admin.settings.features.affiliate.modal.codePlaceholder')"
                maxlength="32"
            />
            <p class="mt-1 text-xs text-gray-400">
              {{ t('admin.settings.features.affiliate.modal.codeHint') }}
            </p>
          </div>

          <div>
            <label class="input-label">{{ t('admin.settings.features.affiliate.modal.rateLabel') }}</label>
            <div class="relative">
              <input
                  v-model="affiliateModal.rate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  class="input pr-8"
                  :placeholder="t('admin.settings.features.affiliate.modal.ratePlaceholder')"
              />
              <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
            </div>
            <p class="mt-1 text-xs text-gray-400">
              {{ t('admin.settings.features.affiliate.modal.rateHint') }}
            </p>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-between gap-3">
          <p
              v-if="!affiliateModalCanSubmit"
              class="text-xs text-gray-500 dark:text-gray-400"
          >
            {{ t('admin.settings.features.affiliate.modal.errorEmpty') }}
          </p>
          <span v-else></span>
          <div class="flex gap-2">
            <button type="button" class="btn btn-secondary" @click="closeAffiliateModal">
              {{ t('common.cancel') }}
            </button>
            <button
                type="button"
                class="btn btn-primary"
                :disabled="affiliateModal.saving || !affiliateModalCanSubmit"
                @click="submitAffiliateModal"
            >
              {{ affiliateModal.saving ? t('common.saving') : t('common.save') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Affiliate batch rate modal -->
    <div
        v-if="affiliateBatchModal.open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="affiliateBatchModal.open = false"
    >
      <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-dark-900">
        <h3 class="mb-4 text-lg font-semibold">
          {{ t('admin.settings.features.affiliate.batchModal.title', {count: affiliateState.selected.length}) }}
        </h3>
        <p class="mb-4 text-sm text-gray-500">
          {{ t('admin.settings.features.affiliate.batchModal.hint') }}
        </p>
        <div class="relative">
          <input
              v-model="affiliateBatchModal.rate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              class="input pr-8"
              :placeholder="t('admin.settings.features.affiliate.batchModal.placeholder')"
          />
          <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
        </div>
        <p class="mt-2 text-xs text-gray-400">
          {{ t('admin.settings.features.affiliate.batchModal.clearHint') }}
        </p>
        <div class="mt-6 flex justify-end gap-2">
          <button type="button" class="btn btn-secondary" @click="affiliateBatchModal.open = false">
            {{ t('common.cancel') }}
          </button>
          <button
              type="button"
              class="btn btn-primary"
              :disabled="affiliateBatchModal.saving"
              @click="submitAffiliateBatchModal"
          >
            {{ affiliateBatchModal.saving ? t('common.saving') : t('common.save') }}
          </button>
        </div>
      </div>
    </div>

  </div><!-- /Tab: Features -->


</template>

<script setup lang="ts">
import {reactive, computed, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import Toggle from '@/common/widgets/forms/Toggle.vue'
import {useAppStore} from '@/core/stores/appStore'
import {useAffiliateQueryStore} from '@/features/affiliate/presentation/stores/affiliateQueryStore'
import {useAffiliateActionStore} from '@/features/affiliate/presentation/stores/affiliateActionStore'
import {extractApiErrorMessage} from '@/core/utils/apiError'
import type {AffiliateAdminEntry} from '@/features/affiliate/domain/models/affiliateAdminEntry'
import type {SimpleUser as AffiliateSimpleUser} from '@/features/affiliate/domain/models/simpleUser'
import type {UpdateAffiliateUserRequest} from '@/features/affiliate/data/requests_models/updateAffiliateUserRequest'
import type {BatchSetRateRequest} from '@/features/affiliate/data/requests_models/batchSetRateRequest'

const props = defineProps<{ form: Record<string, any>; saving: boolean; loadFailed: boolean }>()
const {t} = useI18n()
const appStore = useAppStore()
const affiliateQueryStore = useAffiliateQueryStore()
const affiliateActionStore = useAffiliateActionStore()

interface AffiliateState {
  loading: boolean;
  entries: AffiliateAdminEntry[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  selected: number[];
  searchTimer: number | null
}

const affiliateState = reactive<AffiliateState>({
  loading: false,
  entries: [],
  total: 0,
  page: 1,
  pageSize: 20,
  search: '',
  selected: [],
  searchTimer: null
})

interface AffiliateModalState {
  open: boolean;
  mode: 'add' | 'edit';
  saving: boolean;
  userQuery: string;
  userResults: AffiliateSimpleUser[];
  selectedUser: AffiliateSimpleUser | null;
  editingEntry: AffiliateAdminEntry | null;
  code: string;
  rate: string | number;
  searchTimer: number | null
}

const affiliateModal = reactive<AffiliateModalState>({
  open: false,
  mode: 'add',
  saving: false,
  userQuery: '',
  userResults: [],
  selectedUser: null,
  editingEntry: null,
  code: '',
  rate: '',
  searchTimer: null
})
const affiliateBatchModal = reactive<{ open: boolean; saving: boolean; rate: string | number }>({
  open: false,
  saving: false,
  rate: ''
})
const affiliateConfirmDialog = reactive<{
  show: boolean;
  title: string;
  message: string;
  confirmText: string;
  pending: (() => Promise<unknown>) | null
}>({show: false, title: '', message: '', confirmText: '', pending: null})

function openAffiliateConfirm(title: string, message: string, confirmText: string, fn: () => Promise<unknown>) {
  Object.assign(affiliateConfirmDialog, {title, message, confirmText, pending: fn, show: true})
}

function debounceTimer(slot: { searchTimer: number | null }, delayMs: number, run: () => void) {
  if (slot.searchTimer != null) window.clearTimeout(slot.searchTimer)
  slot.searchTimer = window.setTimeout(run, delayMs)
}

function parseRebateRate(raw: unknown): number | null | undefined {
  const s = String(raw ?? '').trim()
  if (s === '') return null
  const parsed = Number(s)
  if (Number.isNaN(parsed) || parsed < 0 || parsed > 100) {
    appStore.showError(t('admin.settings.features.affiliate.modal.errorBadRate'))
    return undefined
  }
  return parsed
}

async function loadAffiliateUsers() {
  affiliateState.loading = true
  try {
    const res = await affiliateQueryStore.listUsers({
      page: affiliateState.page,
      page_size: affiliateState.pageSize,
      search: affiliateState.search
    })
    affiliateState.entries = res.items ?? []
    affiliateState.total = res.total ?? 0
    const visibleIds = new Set(affiliateState.entries.map(e => e.userId))
    affiliateState.selected = affiliateState.selected.filter(id => visibleIds.has(id))
  } catch (err) {
    appStore.showError(extractApiErrorMessage(err, t('common.error')))
  } finally {
    affiliateState.loading = false
  }
}

function onAffiliateSearchInput() {
  debounceTimer(affiliateState, 300, () => {
    affiliateState.page = 1;
    loadAffiliateUsers()
  })
}

function changeAffiliatePage(page: number) {
  if (page < 1) return;
  affiliateState.page = page;
  loadAffiliateUsers()
}

function toggleAffiliateSelectAll(e: Event) {
  affiliateState.selected = (e.target as HTMLInputElement).checked ? affiliateState.entries.map(entry => entry.userId) : []
}

function toggleAffiliateSelect(userId: number) {
  const idx = affiliateState.selected.indexOf(userId)
  if (idx >= 0) affiliateState.selected.splice(idx, 1)
  else affiliateState.selected.push(userId)
}

function openAffiliateModal(entry: AffiliateAdminEntry | null) {
  affiliateModal.open = true
  affiliateModal.mode = entry ? 'edit' : 'add'
  affiliateModal.userQuery = ''
  affiliateModal.userResults = []
  affiliateModal.selectedUser = null
  affiliateModal.editingEntry = entry
  affiliateModal.code = entry?.affCodeCustom ? entry.affCode : ''
  affiliateModal.rate = entry?.affRebateRatePercent != null ? String(entry.affRebateRatePercent) : ''
}

function closeAffiliateModal() {
  affiliateModal.open = false
  if (affiliateModal.searchTimer != null) {
    window.clearTimeout(affiliateModal.searchTimer);
    affiliateModal.searchTimer = null
  }
}

function onAffiliateUserSearchInput() {
  const q = affiliateModal.userQuery.trim()
  if (!q) {
    affiliateModal.userResults = [];
    return
  }
  debounceTimer(affiliateModal, 300, async () => {
    try {
      affiliateModal.userResults = await affiliateActionStore.lookupUsers(q)
    } catch (err) {
      appStore.showError(extractApiErrorMessage(err, t('common.error')))
    }
  })
}

function selectAffiliateUser(user: AffiliateSimpleUser) {
  affiliateModal.selectedUser = user
  affiliateModal.userQuery = ''
  affiliateModal.userResults = []
}

function clearSelectedAffiliateUser() {
  affiliateModal.selectedUser = null
}

const affiliateModalCanSubmit = computed(() => {
  if (affiliateModal.mode === 'add') {
    if (!affiliateModal.selectedUser) return false
  } else if (!affiliateModal.editingEntry) return false
  const codeFilled = affiliateModal.code.trim() !== ''
  const rateFilled = String(affiliateModal.rate ?? '').trim() !== ''
  if (codeFilled || rateFilled) return true
  return affiliateModal.mode === 'edit' && affiliateModal.editingEntry?.affRebateRatePercent != null
})

async function submitAffiliateModal() {
  if (!affiliateModalCanSubmit.value) {
    appStore.showError(t('admin.settings.features.affiliate.modal.errorEmpty'));
    return
  }
  const userId = affiliateModal.mode === 'add' ? affiliateModal.selectedUser!.id : affiliateModal.editingEntry!.userId
  const payload: UpdateAffiliateUserRequest = {}
  const codeRaw = affiliateModal.code.trim()
  if (codeRaw) payload.aff_code = codeRaw.toUpperCase()
  const rateInput = parseRebateRate(affiliateModal.rate)
  if (rateInput === undefined) return
  if (rateInput === null) {
    if (affiliateModal.mode === 'edit' && affiliateModal.editingEntry?.affRebateRatePercent != null) payload.clear_rebate_rate = true
  } else {
    payload.aff_rebate_rate_percent = rateInput
  }
  affiliateModal.saving = true
  try {
    await affiliateActionStore.updateUserSettings(userId, payload)
    appStore.showSuccess(t('common.saved'))
    closeAffiliateModal()
    affiliateState.page = 1
    await loadAffiliateUsers()
  } catch (err) {
    appStore.showError(extractApiErrorMessage(err, t('common.error')))
  } finally {
    affiliateModal.saving = false
  }
}

function askResetAffiliateUser(entry: AffiliateAdminEntry) {
  openAffiliateConfirm(
      t('admin.settings.features.affiliate.customUsers.resetTitle'),
      t('admin.settings.features.affiliate.customUsers.resetMessage', {email: entry.email || '#' + entry.userId}),
      t('common.delete'),
      () => affiliateActionStore.clearUserSettings(entry.userId)
  )
}

function openAffiliateBatchModal() {
  if (affiliateState.selected.length === 0) return
  affiliateBatchModal.open = true
  affiliateBatchModal.rate = ''
}

async function submitAffiliateBatchModal() {
  const rateInput = parseRebateRate(affiliateBatchModal.rate)
  if (rateInput === undefined) return
  const userIDs = [...affiliateState.selected]
  const payload: BatchSetRateRequest = rateInput === null
      ? {user_ids: userIDs, clear: true}
      : {user_ids: userIDs, aff_rebate_rate_percent: rateInput}
  affiliateBatchModal.saving = true
  try {
    await affiliateActionStore.batchSetRate(payload)
    appStore.showSuccess(t('common.saved'))
    affiliateBatchModal.open = false
    affiliateState.selected = []
    await loadAffiliateUsers()
  } catch (err) {
    appStore.showError(extractApiErrorMessage(err, t('common.error')))
  } finally {
    affiliateBatchModal.saving = false
  }
}

watch(() => props.form.affiliateEnabled, (enabled, prev) => {
  if (enabled && !prev) loadAffiliateUsers()
})
</script>
