export class ImageStorageConfig {
  enabled!: boolean
  reuseBackupS3!: boolean
  bucket!: string
  prefix!: string
  publicBaseUrl!: string
  presignExpiryHours!: number
  maxDownloadBytes!: number
  endpoint!: string
  region!: string
  accessKeyId!: string
  secretAccessKey!: string
  forcePathStyle!: boolean
}
