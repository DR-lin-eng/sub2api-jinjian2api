export class DataManagementS3Config {
  enabled!: boolean
  endpoint!: string
  region!: string
  bucket!: string
  accessKeyId!: string
  secretAccessKey!: string
  secretAccessKeyConfigured!: boolean
  prefix!: string
  forcePathStyle!: boolean
  useSsl!: boolean
}
