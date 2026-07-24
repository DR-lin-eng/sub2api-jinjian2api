import { buildGatewayUrl } from '@/core/networks/client'
import { BatchImageJobDto } from '@/features/batch-image/data/models/batchImageJobDto'
import type { SubmitBatchImageJobRequest } from '@/features/batch-image/data/requests_models/submitBatchImageJobRequest'

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

export class BatchImageActionDatasource {
  async submit(apiKey: string, req: SubmitBatchImageJobRequest, idempotencyKey: string): Promise<BatchImageJobDto> {
    const response = await fetch(buildGatewayUrl('/v1/images/batches'), {
      method: 'POST',
      headers: authHeaders(apiKey, { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey }),
      body: JSON.stringify(req),
    })
    if (!response.ok) throw await parseBatchImageError(response)
    return BatchImageJobDto.fromJson(await response.json())
  }

  async cancel(apiKey: string, batchId: string): Promise<BatchImageJobDto> {
    const response = await fetch(buildGatewayUrl(`/v1/images/batches/${encodeURIComponent(batchId)}/cancel`), {
      method: 'POST',
      headers: authHeaders(apiKey),
    })
    if (!response.ok) throw await parseBatchImageError(response)
    return BatchImageJobDto.fromJson(await response.json())
  }

  async downloadZip(apiKey: string, batchId: string): Promise<Blob> {
    const response = await fetch(buildGatewayUrl(`/v1/images/batches/${encodeURIComponent(batchId)}/download`), {
      headers: authHeaders(apiKey),
    })
    if (!response.ok) throw await parseBatchImageError(response)
    return response.blob()
  }

  async deleteRecord(apiKey: string, batchId: string): Promise<void> {
    const response = await fetch(buildGatewayUrl(`/v1/images/batches/${encodeURIComponent(batchId)}`), {
      method: 'DELETE',
      headers: authHeaders(apiKey),
    })
    if (!response.ok) throw await parseBatchImageError(response)
  }
}

export const batchImageActionDatasource = new BatchImageActionDatasource()
