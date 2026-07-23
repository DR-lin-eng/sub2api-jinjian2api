export interface BatchImageItemError {
  code: string
  message: string
  source?: 'provider' | 'system' | string
}

export interface BatchImageItemEntity {
  batchId?: string
  sourceTaskName?: string
  customId: string
  status: string
  promptPreview?: string | null
  mimeType: string | null
  fileExtension: string | null
  imageCount: number
  error?: BatchImageItemError | null
}
