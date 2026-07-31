import type { ImageStorageConfig } from '@/features/admin-backup/domain/models/imageStorageConfig'

export class ImageStorageConfigResponse {
  config!: ImageStorageConfig
  secretConfigured!: boolean
}
