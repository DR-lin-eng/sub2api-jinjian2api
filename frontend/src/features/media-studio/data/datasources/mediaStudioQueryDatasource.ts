import { apiClient } from '@/core/networks/client'
import { MediaStudioItemDto } from '@/features/media-studio/data/models/mediaStudioItemDto'

export class MediaStudioQueryDatasource {
  async list(options?: { signal?: AbortSignal }): Promise<MediaStudioItemDto[]> {
    const { data } = await apiClient.get<unknown[]>('/media-studio/catalog', {
      signal: options?.signal,
    })
    return (data ?? []).map(item => MediaStudioItemDto.fromJson(item))
  }
}

export const mediaStudioQueryDatasource = new MediaStudioQueryDatasource()
