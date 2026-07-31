import { useAdminChannelsQueryStore } from '@/features/admin-channels/presentation/stores/adminChannelsQueryStore'
import { useAdminChannelsActionStore } from '@/features/admin-channels/presentation/stores/adminChannelsActionStore'

export function useAdminChannels() {
  const query = useAdminChannelsQueryStore()
  const action = useAdminChannelsActionStore()
  return {
    ...query,
    ...action,
  }
}
