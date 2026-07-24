import { useAdminProxiesQueryStore } from '@/features/admin-proxies/presentation/stores/adminProxiesQueryStore'
import { useAdminProxiesActionStore } from '@/features/admin-proxies/presentation/stores/adminProxiesActionStore'

export function useAdminProxies() {
  const query = useAdminProxiesQueryStore()
  const action = useAdminProxiesActionStore()
  return { ...query, ...action }
}
