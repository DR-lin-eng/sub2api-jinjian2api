import { buildGatewayUrl } from '@/core/networks/client'
import { BatchImageJobDto } from '@/features/batch-image/data/models/batchImageJobDto'
import type { SubmitBatchImageJobRequest } from '@/features/batch-image/data/requests_models/submitBatchImageJobRequest'
import { BatchImageError } from '@/features/batch-image/data/errors/batchImageError'

async function parseBatchImageError(response: Response): Promise<BatchImageError> {
  const requestId = response.headers.get('X-Request-Id') || ''
  try {
    const body = await response.json()
    const message = body?.error?.message || body?.message || response.statusText
    return new BatchImageError(message, {
      code: body?.error?.code || response.status,
      status: response.status,
      requestId,
    })
  } catch {
    return new BatchImageError(response.statusText || `HTTP ${response.status}`, {
      code: response.status,
      status: response.status,
      requestId,
    })
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
