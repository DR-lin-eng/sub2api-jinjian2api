import { useProfileQueryStore } from '@/features/profile/presentation/stores/profileQueryStore'
import { useProfileActionStore } from '@/features/profile/presentation/stores/profileActionStore'

export function useProfile() {
  const q = useProfileQueryStore()
  const a = useProfileActionStore()
  return { ...q, ...a }
}
