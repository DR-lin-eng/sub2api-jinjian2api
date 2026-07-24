export class BatchImageItemError {
  code!: string
  message!: string
  source!: string
}

export class BatchImageItem {
  batchId!: string
  sourceTaskName!: string
  customId!: string
  status!: string
  promptPreview!: string
  mimeType!: string
  fileExtension!: string
  imageCount!: number
  error?: BatchImageItemError
}
