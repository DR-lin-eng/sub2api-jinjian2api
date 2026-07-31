import { useAdminSettingsQueryStore } from '@/features/admin-settings/presentation/stores/adminSettingsQueryStore'
import { useAdminSettingsActionStore } from '@/features/admin-settings/presentation/stores/adminSettingsActionStore'

export function useAdminSettings() {
  const query = useAdminSettingsQueryStore()
  const action = useAdminSettingsActionStore()
  return { ...query, ...action }
}
