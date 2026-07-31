import { useAdminRedeemQueryStore } from '@/features/admin-redeem/presentation/stores/adminRedeemQueryStore'
import { useAdminRedeemActionStore } from '@/features/admin-redeem/presentation/stores/adminRedeemActionStore'

export function useAdminRedeem() {
  const q = useAdminRedeemQueryStore()
  const a = useAdminRedeemActionStore()
  return { ...q, ...a }
}
