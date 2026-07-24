import { useDashboardUserQueryStore } from '@/features/dashboard-user/presentation/stores/dashboardUserQueryStore'

export function useDashboard() {
  const store = useDashboardUserQueryStore()
  return { ...store }
}
