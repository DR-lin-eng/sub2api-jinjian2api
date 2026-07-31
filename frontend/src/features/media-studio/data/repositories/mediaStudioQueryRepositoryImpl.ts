import { mediaStudioQueryDatasource } from '@/features/media-studio/data/datasources/mediaStudioQueryDatasource'
import type { MediaStudioItem } from '@/features/media-studio/domain/models/mediaStudioItem'
import type { MediaStudioQueryRepository } from '@/features/media-studio/domain/repositories/mediaStudioQueryRepository'

export class MediaStudioQueryRepositoryImpl implements MediaStudioQueryRepository {
  private readonly datasource = mediaStudioQueryDatasource

  async list(options?: { signal?: AbortSignal }): Promise<MediaStudioItem[]> {
    const items = await this.datasource.list(options)
    return items.map(item => item.toEntity())
  }
}

export const mediaStudioQueryRepository: MediaStudioQueryRepository = new MediaStudioQueryRepositoryImpl()
