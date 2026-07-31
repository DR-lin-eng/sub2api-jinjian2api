<template>
  <AppLayout>
    <div class="space-y-6">
      <div v-if="loading.stats" class="flex items-center justify-center py-12"><LoadingSpinner /></div>
      <template v-else-if="stats">
        <UserDashboardStats :stats="stats" :balance="user?.balance || 0" :is-simple="authStore.isSimpleMode" :platform-quotas="platformQuotas" />
        <UserDashboardCharts
          v-model:startDate="startDate"
          v-model:endDate="endDate"
          v-model:granularity="granularity"
          :loading="loading.charts"
          :trend="trendData"
          :models="modelStats"
          @dateRangeChange="loadRangeData"
          @granularityChange="loadCharts"
          @refresh="refreshAll"
        />
        <UserDashboardApiKeyUsage
          :rows="apiKeyUsageRows"
          :loading="loading.apiKeyUsage"
          :error="apiKeyUsageError"
          @retry="loadApiKeyUsage"
        />
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div class="lg:col-span-2"><UserDashboardRecentUsage :data="recentUsage" :loading="loading.recent" /></div>
          <div class="lg:col-span-1"><UserDashboardQuickActions /></div>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/features/auth/presentation/stores/authStore'
import AppLayout from '@/common/widgets/layout/AppLayout.vue'
import LoadingSpinner from '@/common/widgets/feedback/LoadingSpinner.vue'
import UserDashboardStats from '@/features/dashboard-user/presentation/widgets/UserDashboardStats.vue'
import UserDashboardCharts from '@/features/dashboard-user/presentation/widgets/UserDashboardCharts.vue'
import UserDashboardRecentUsage from '@/features/dashboard-user/presentation/widgets/UserDashboardRecentUsage.vue'
import UserDashboardQuickActions from '@/features/dashboard-user/presentation/widgets/UserDashboardQuickActions.vue'
import UserDashboardApiKeyUsage from '@/features/dashboard-user/presentation/widgets/UserDashboardApiKeyUsage.vue'
import { useDashboard } from '@/features/dashboard-user/presentation/composables/useDashboard'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const {
  loading,
  stats,
  trendData,
  modelStats,
  recentUsage,
  platformQuotas,
  apiKeyUsageRows,
  apiKeyUsageError,
  startDate,
  endDate,
  granularity,
  loadCharts,
  loadRangeData,
  loadApiKeyUsage,
  refreshAll,
} = useDashboard()

onMounted(() => { refreshAll() })
</script>
