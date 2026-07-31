import { useModelSquareQueryStore } from '@/features/model-square/presentation/stores/modelSquareQueryStore'

export function useModelSquare() {
  const queryStore = useModelSquareQueryStore()
  return { ...queryStore }
}
