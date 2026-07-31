import { useSetupQueryStore } from '@/features/setup/presentation/stores/setupQueryStore'
import { useSetupActionStore } from '@/features/setup/presentation/stores/setupActionStore'

export function useSetup() {
  const query = useSetupQueryStore()
  const action = useSetupActionStore()
  return { query, action }
}
