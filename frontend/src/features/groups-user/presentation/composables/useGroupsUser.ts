import { useGroupsUserQueryStore } from '@/features/groups-user/presentation/stores/groupsUserQueryStore'

export function useGroupsUser() {
  const query = useGroupsUserQueryStore()
  return { ...query }
}
