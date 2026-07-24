import { buildGatewayUrl } from '@/core/networks/client'
import { BatchImageJobDto } from '@/features/batch-image/data/models/batchImageJobDto'
import { BatchImageItemDto } from '@/features/batch-image/data/models/batchImageItemDto'
import { BatchImageModelDto } from '@/features/batch-image/data/models/batchImageModelDto'
import type { ListBatchImageJobsRequest } from '@/features/batch-image/data/requests_models/listBatchImageJobsRequest'

async function parseBatchImageError(response: Response): Promise<Error> {
  try {
    const body = await response.json()
    const message = body?.error?.message || body?.message || response.statusText
    const error = new Error(message)
    ;(error as any).code = body?.error?.code || response.status
    ;(error as any).status = response.status
    ;(error as any).requestId = response.headers.get('X-Request-Id') || ''
    return error
  } catch {
    const error = new Error(response.statusText || `HTTP ${response.status}`)
    ;(error as any).code = response.status
    ;(error as any).status = response.status
    ;(error as any).requestId = response.headers.get('X-Request-Id') || ''
    return error
  }
}

function authHeaders(apiKey: string, extra?: HeadersInit): HeadersInit {
  return { Authorization: `Bearer ${apiKey}`, ...extra }
}

export interface BatchImageJobsListDto {
  object: string
  data: BatchImageJobDto[]
  has_more: boolean
}

export interface BatchImageItemsListDto {
  object: string
  data: BatchImageItemDto[]
  has_more: boolean
}

export interface BatchImageModelsListDto {
  object: string
  data: BatchImageModelDto[]
}

export class BatchImageQueryDatasource {
  async getById(apiKey: string, batchId: string): Promise<BatchImageJobDto> {
    const response = await fetch(buildGatewayUrl(`/v1/images/batches/${encodeURIComponent(batchId)}`), {
      headers: authHeaders(apiKey),
    })
    if (!response.ok) throw await parseBatchImageError(response)
    return BatchImageJobDto.fromJson(await response.json())
  }

  async list(apiKey: string, options: ListBatchImageJobsRequest = {}): Promise<BatchImageJobsListDto> {
    const params = new URLSearchParams()
    params.set('limit', String(options.limit || 20))
    if (options.cursor) params.set('cursor', options.cursor)
    if (options.status) params.set('status', options.status)
    if (options.taskName) params.set('task_name', options.taskName)
    if (options.downloaded) params.set('downloaded', options.downloaded)
    if (options.from) params.set('from', options.from)
    if (options.to) params.set('to', options.to)
    const response = await fetch(buildGatewayUrl(`/v1/images/batches?${params.toString()}`), {
      headers: authHeaders(apiKey),
    })
    if (!response.ok) throw await parseBatchImageError(response)
    const body = await response.json()
    return {
      object: body.object ?? '',
      has_more: Boolean(body.has_more),
      data: (body.data ?? []).map((item: unknown) => BatchImageJobDto.fromJson(item)),
    }
  }

  async listModels(apiKey: string): Promise<BatchImageModelsListDto> {
    const response = await fetch(buildGatewayUrl('/v1/images/batches/models'), {
      headers: authHeaders(apiKey),
    })
    if (!response.ok) throw await parseBatchImageError(response)
    const body = await response.json()
    return {
      object: body.object ?? '',
      data: (body.data ?? []).map((item: unknown) => BatchImageModelDto.fromJson(item)),
    }
  }

  async listItems(apiKey: string, batchId: string, status = ''): Promise<BatchImageItemsListDto> {
    const query = status ? `?status=${encodeURIComponent(status)}` : ''
    const response = await fetch(buildGatewayUrl(`/v1/images/batches/${encodeURIComponent(batchId)}/items${query}`), {
      headers: authHeaders(apiKey),
    })
    if (!response.ok) throw await parseBatchImageError(response)
    const body = await response.json()
    return {
      object: body.object ?? '',
      has_more: Boolean(body.has_more),
      data: (body.data ?? []).map((item: unknown) => BatchImageItemDto.fromJson(item)),
    }
  }

  async getItemContent(apiKey: string, batchId: string, customId: string, imageIndex = 0): Promise<Blob> {
    const response = await fetch(
      buildGatewayUrl(`/v1/images/batches/${encodeURIComponent(batchId)}/items/${encodeURIComponent(customId)}/content?image_index=${encodeURIComponent(String(imageIndex))}`),
      { headers: authHeaders(apiKey) },
    )
    if (!response.ok) throw await parseBatchImageError(response)
    return response.blob()
  }
}

export const batchImageQueryDatasource = new BatchImageQueryDatasource()
