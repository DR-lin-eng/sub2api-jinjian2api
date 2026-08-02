import type { ModelPlazaResponse } from '@/features/model-plaza/domain/models/modelPlazaResponse'

export interface ModelPlazaQueryRepository {
  get(options?: { signal?: AbortSignal }): Promise<ModelPlazaResponse>
}
