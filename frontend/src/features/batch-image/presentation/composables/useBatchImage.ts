import { useBatchImageQueryStore } from '@/features/batch-image/presentation/stores/batchImageQueryStore'
import { useBatchImageActionStore } from '@/features/batch-image/presentation/stores/batchImageActionStore'

export function useBatchImage() {
  const query = useBatchImageQueryStore()
  const action = useBatchImageActionStore()
  return { ...query, ...action }
}
