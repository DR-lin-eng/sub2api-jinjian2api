import { useAdminPromoQueryStore } from '@/features/admin-promo/presentation/stores/adminPromoQueryStore'
import { useAdminPromoActionStore } from '@/features/admin-promo/presentation/stores/adminPromoActionStore'

export function useAdminPromo() {
  const query = useAdminPromoQueryStore()
  const action = useAdminPromoActionStore()
  return { ...query, ...action }
}
