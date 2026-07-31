import type { MediaStudioItem } from '@/features/media-studio/domain/models/mediaStudioItem'

export interface MediaStudioQueryRepository {
  list(options?: { signal?: AbortSignal }): Promise<MediaStudioItem[]>
}
