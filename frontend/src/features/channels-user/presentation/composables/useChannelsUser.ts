import { useChannelsUserQueryStore } from '@/features/channels-user/presentation/stores/channelsUserQueryStore'

export function useChannelsUser() {
  const q = useChannelsUserQueryStore()
  return { ...q }
}
