/**
 * Error thrown by batch-image datasources when the gateway returns a non-2xx response.
 *
 * Carries structured metadata the UI uses to render diagnostic references
 * (see `batchImageErrorReference` in BatchImageGuidePage.vue): `code`, `status`,
 * and `requestId` (from the `X-Request-Id` response header).
 */
export class BatchImageError extends Error {
  readonly code: string | number
  readonly status: number
  readonly requestId: string

  constructor(message: string, options: { code: string | number; status: number; requestId: string }) {
    super(message)
    this.name = 'BatchImageError'
    this.code = options.code
    this.status = options.status
    this.requestId = options.requestId
  }
}
