export interface BatchImageReferenceImage {
  id?: string
  type?: string
  mime_type: string
  data?: string
  file_uri?: string
}

export interface BatchImageSubmitItem {
  custom_id: string
  prompt: string
  output_count?: number
  reference_images?: BatchImageReferenceImage[]
}

export interface SubmitBatchImageJobRequest {
  model: string
  task_name?: string
  parent_batch_id?: string
  provider?: '' | 'gemini_api' | 'vertex' | string
  image_size?: '1K' | '2K' | '4K' | string
  response_mime_type?: string
  aspect_ratio?: string
  items: BatchImageSubmitItem[]
  metadata?: Record<string, string>
}
