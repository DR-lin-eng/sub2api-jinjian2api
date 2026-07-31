import { useAdminSubscriptionsQueryStore } from '@/features/admin-subscriptions/presentation/stores/adminSubscriptionsQueryStore'
import { useAdminSubscriptionsActionStore } from '@/features/admin-subscriptions/presentation/stores/adminSubscriptionsActionStore'

export function useAdminSubscriptions() {
  const q = useAdminSubscriptionsQueryStore()
  const a = useAdminSubscriptionsActionStore()
  return { ...q, ...a }
}
