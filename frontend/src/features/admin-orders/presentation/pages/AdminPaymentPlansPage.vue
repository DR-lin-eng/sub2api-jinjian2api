<template>
  <AppLayout>
    <div class="space-y-4">
      <!-- Actions -->
      <div class="flex items-center justify-end gap-2">
        <button @click="loadPlans" :disabled="plansLoading" class="btn btn-secondary" :title="t('common.refresh')">
          <Icon name="refresh" size="md" :class="plansLoading ? 'animate-spin' : ''" />
        </button>
        <button @click="openPlanEdit(null)" class="btn btn-primary">{{ t('payment.admin.createPlan') }}</button>
      </div>

      <!-- Plans Table -->
      <DataTable :columns="planColumns" :data="plans" :loading="plansLoading">
        <template #cell-name="{ value, row }">
          <span class="text-sm font-medium" :class="getPlanNameClass(row.groupId)">{{ value }}</span>
        </template>
        <template #cell-groupId="{ value }">
          <span v-if="isGroupMissing(value)" class="text-sm">
            <span class="text-gray-400">#{{ value }}</span>
            <span class="ml-1 badge badge-danger">{{ t('payment.admin.groupMissing') }}</span>
          </span>
          <GroupBadge
            v-else-if="getGroup(value)"
            :name="getGroup(value)!.name"
            :platform="getGroup(value)!.platform"
            :rate-multiplier="getGroup(value)!.rateMultiplier"
          />
          <span v-else class="text-sm text-gray-400">-</span>
        </template>
        <template #cell-price="{ value, row }">
          <div class="text-sm">
            <span class="font-medium text-gray-900 dark:text-white">{{ planCurrencySymbol(row.currency) }}{{ (value ?? 0).toFixed(2) }}</span>
            <span v-if="row.currency" class="ml-1 text-xs text-gray-400">{{ row.currency }}</span>
            <span v-if="row.originalPrice" class="ml-1 text-xs text-gray-400 line-through">{{ planCurrencySymbol(row.currency) }}{{ row.originalPrice.toFixed(2) }}</span>
          </div>
        </template>
        <template #cell-validityDays="{ value, row }">
          <span class="text-sm">{{ value }} {{ t('payment.admin.' + (row.validityUnit || 'days')) }}</span>
        </template>
        <template #cell-forSale="{ value, row }">
          <button
            type="button"
            :class="[
              'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              value ? 'bg-primary-500' : 'bg-gray-300 dark:bg-dark-600'
            ]"
            @click="toggleForSale(row)"
          >
            <span :class="[
              'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              value ? 'translate-x-4' : 'translate-x-0'
            ]" />
          </button>
        </template>
        <template #cell-actions="{ row }">
          <div class="flex items-center gap-2">
            <button @click="openPlanEdit(row)" class="flex flex-col items-center gap-0.5 rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400">
              <Icon name="edit" size="sm" />
              <span class="text-xs">{{ t('common.edit') }}</span>
            </button>
            <button @click="confirmDeletePlan(row)" class="flex flex-col items-center gap-0.5 rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400">
              <Icon name="trash" size="sm" />
              <span class="text-xs">{{ t('common.delete') }}</span>
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Plan Edit Dialog -->
    <PlanEditDialog :show="showPlanDialog" :plan="editingPlan" :groups="groups" :payment-config="paymentConfig" @close="showPlanDialog = false" @saved="loadPlans" />

    <ConfirmDialog :show="showDeletePlanDialog" :title="t('payment.admin.deletePlan')" :message="t('payment.admin.deletePlanConfirm')" :confirm-text="t('common.delete')" danger @confirm="handleDeletePlan" @cancel="showDeletePlanDialog = false" />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/core/stores/appStore'
import { useAdminOrdersQueryStore } from '@/features/admin-orders/presentation/stores/adminOrdersQueryStore'
import { useAdminOrdersActionStore } from '@/features/admin-orders/presentation/stores/adminOrdersActionStore'
import { extractI18nErrorMessage } from '@/core/utils/apiError'
import type { SubscriptionPlan } from '@/features/admin-orders/domain/models/subscriptionPlan'
import type { AdminPaymentConfig } from '@/features/admin-orders/domain/models/adminPaymentConfig'
import type { UpdateSubscriptionPlanRequest } from '@/features/admin-orders/data/requests_models/updateSubscriptionPlanRequest'
import type { Column } from '@/common/types/uiTypes'
import AppLayout from '@/common/widgets/layout/AppLayout.vue'
import DataTable from '@/common/widgets/data/DataTable.vue'
import ConfirmDialog from '@/common/widgets/feedback/ConfirmDialog.vue'
import Icon from '@/common/widgets/icons/Icon.vue'
import GroupBadge from '@/common/widgets/data/GroupBadge.vue'
import PlanEditDialog from '@/features/admin-orders/presentation/widgets/PlanEditDialog.vue'
import { currencySymbol } from '@/features/billing/presentation/utils/currencyFormatter'
import { platformTextClass } from '@/core/utils/platformColors'
import { useAdminGroups } from '@/features/admin-groups/presentation/composables/useAdminGroups'
import type { AdminGroup } from '@/features/admin-groups/domain/models/adminGroups'

const $groups = useAdminGroups()
const { t } = useI18n()
const appStore = useAppStore()
const queryStore = useAdminOrdersQueryStore()
const actionStore = useAdminOrdersActionStore()

function planCurrencySymbol(currency?: string): string {
  return currencySymbol(currency || 'USD')
}

// ==================== Groups ====================

const groups = ref<AdminGroup[]>([])
const paymentConfig = ref<AdminPaymentConfig | null>(null)

async function loadGroups() {
  try {
    groups.value = await $groups.getAll()
  } catch { /* ignore */ }
}

async function loadPaymentConfig() {
  try {
    paymentConfig.value = await queryStore.fetchConfig()
  } catch { /* preview only */ }
}

function getGroup(id: number): AdminGroup | undefined {
  return groups.value.find(g => g.id === id)
}

function isGroupMissing(id: number): boolean {
  return id > 0 && !groups.value.find(g => g.id === id)
}

function getPlanNameClass(groupId: number): string {
  const group = getGroup(groupId)
  return group ? platformTextClass(group.platform) : 'text-gray-900 dark:text-white'
}

// ==================== Plans ====================

const plansLoading = ref(false)
const plans = ref<SubscriptionPlan[]>([])
const showPlanDialog = ref(false)
const showDeletePlanDialog = ref(false)
const editingPlan = ref<SubscriptionPlan | null>(null)
const deletingPlanId = ref<number | null>(null)

const planColumns = computed((): Column[] => [
  { key: 'id', label: 'ID' },
  { key: 'name', label: t('payment.admin.planName') },
  { key: 'groupId', label: t('payment.admin.group') },
  { key: 'price', label: t('payment.admin.price') },
  { key: 'validityDays', label: t('payment.admin.validity') },
  { key: 'forSale', label: t('payment.admin.forSale') },
  { key: 'sortOrder', label: t('payment.admin.sortOrder') },
  { key: 'actions', label: t('common.actions') },
])

async function loadPlans() {
  plansLoading.value = true
  try {
    plans.value = await queryStore.fetchPlans()
  } catch (err: unknown) {
    appStore.showError(extractI18nErrorMessage(err, t, 'payment.errors', t('common.error')))
  } finally {
    plansLoading.value = false }
}

function openPlanEdit(plan: SubscriptionPlan | null) {
  editingPlan.value = plan
  showPlanDialog.value = true
}

async function toggleForSale(plan: SubscriptionPlan) {
  try {
    const req: UpdateSubscriptionPlanRequest = { for_sale: !plan.forSale }
    await actionStore.updatePlan(plan.id, req)
    plan.forSale = !plan.forSale
  } catch (err: unknown) {
    appStore.showError(extractI18nErrorMessage(err, t, 'payment.errors', t('common.error')))
  }
}

function confirmDeletePlan(plan: SubscriptionPlan) { deletingPlanId.value = plan.id; showDeletePlanDialog.value = true }

async function handleDeletePlan() {
  if (!deletingPlanId.value) return
  try {
    await actionStore.deletePlan(deletingPlanId.value)
    appStore.showSuccess(t('common.deleted'))
    showDeletePlanDialog.value = false
    loadPlans()
  } catch (err: unknown) {
    appStore.showError(extractI18nErrorMessage(err, t, 'payment.errors', t('common.error')))
  }
}

// ==================== Lifecycle ====================

onMounted(() => {
  loadGroups()
  loadPaymentConfig()
  loadPlans()
})
</script>
