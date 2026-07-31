import type { ModelSquareItem } from '@/features/model-square/domain/models/modelSquareItem'

export interface ModelSquareQueryRepository {
  list(options?: { signal?: AbortSignal }): Promise<ModelSquareItem[]>
}
