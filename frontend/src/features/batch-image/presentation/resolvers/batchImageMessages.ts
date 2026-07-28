export type BatchImageTextKey =
  | 'loadKeysFailed'
  | 'loadModelsFailed'
  | 'loadJobsFailed'
  | 'selectApiKey'
  | 'noModelsForKey'
  | 'selectModel'
  | 'promptRequired'
  | 'submitted'
  | 'submitFailed'
  | 'refreshFailed'
  | 'cancelConfirm'
  | 'cancelled'
  | 'cancelFailed'
  | 'batchDownloadStarted'
  | 'downloadFailed'
  | 'retrySubmitted'
  | 'retryFailed'
  | 'retryMissingPrompts'
  | 'deleteConfirm'
  | 'deleteSelectedConfirm'
  | 'deleted'
  | 'deleteFailed'
  | 'loadItemsFailed'
  | 'loadPreviewFailed'
  | 'copiedInstruction'
  | 'loadingModels'
  | 'noModels'
  | 'noModelsHint'
  | 'noCompatibleAccount'
  | 'unsupportedProvider'
  | 'providerSubmitFailed'
  | 'vertexGcsBucketMissing'
  | 'queueFailed'
  | 'billingHoldFailed'
  | 'groupDisabled'
  | 'pricingMissing'
  | 'insufficientBalance'
  | 'invalidModel'
  | 'invalidItems'
  | 'duplicateCustomId'
  | 'promptTooLong'
  | 'invalidReferenceImage'
  | 'tooManyReferenceImages'
  | 'referenceImagesTooLarge'
  | 'tooManyOutputImages'
  | 'idempotencyConflict'
  | 'notReady'
  | 'outputDeleted'
  | 'resultMissing'
  | 'itemFailed'
  | 'itemImageIndexOutOfRange'
  | 'downloadLimited'
  | 'downloadTooLarge'
  | 'deleteNotReady'
  | 'disabled'
  | 'authRequired'
  | 'adminReference'
  | 'errorReference'

interface BatchImageMessageOptions {
  text: (key: string) => string
  interpolate: (key: string, params: Record<string, unknown>) => string
  locale: () => string
}

export function createBatchImageMessages(options: BatchImageMessageOptions) {
  const isZhLocale = () => options.locale().toLowerCase().startsWith('zh')
  const batchImageText = (key: BatchImageTextKey) =>
    options.text(`batchImage.messages.${key}`)

  const batchImageErrorReference = (error: any) => {
    const parts: string[] = []
    const code = String(error?.code || '').trim()
    const requestId = String(error?.requestId || '').trim()
    const status = String(error?.status || '').trim()
    if (code) {
      parts.push(options.interpolate('batchImage.messages.errorCodeRef', { code }))
    }
    if (requestId) {
      parts.push(options.interpolate('batchImage.messages.requestIdRef', { id: requestId }))
    }
    if (!code && status) {
      parts.push(options.interpolate('batchImage.messages.httpStatusRef', { status }))
    }
    return parts.length ? `（${parts.join(isZhLocale() ? '，' : ', ')}）` : ''
  }

  const batchImageAdminError = (base: string, error: any) => {
    const reference = batchImageErrorReference(error)
    return `${base}${reference ? ` ${reference}` : ''} ${batchImageText('adminReference')}`
  }

  const batchImageErrorMessage = (error: any, fallback: string) => {
    const code = String(error?.code || '').trim()
    const message = String(error?.message || '').trim()
    if (code === 'API_KEY_REQUIRED' || code === '401') {
      return batchImageText('authRequired')
    }
    if (
      code === 'BATCH_IMAGE_NO_ACCOUNT_AVAILABLE'
      || /no compatible batch image account/i.test(message)
    ) {
      return batchImageAdminError(batchImageText('noCompatibleAccount'), error)
    }
    if (
      code === 'BATCH_IMAGE_UNSUPPORTED_PROVIDER'
      || /unsupported batch image provider/i.test(message)
    ) {
      return batchImageAdminError(batchImageText('unsupportedProvider'), error)
    }
    if (
      code === 'BATCH_IMAGE_VERTEX_GCS_BUCKET_MISSING'
      || code === 'VERTEX_MANAGED_GCS_BUCKET_MISSING'
    ) {
      return batchImageAdminError(batchImageText('vertexGcsBucketMissing'), error)
    }
    if (
      code === 'BATCH_IMAGE_PROVIDER_SUBMIT_FAILED'
      || code === 'BATCH_IMAGE_PROVIDER_MISSING_API_KEY'
      || code === 'BATCH_IMAGE_PROVIDER_MISSING_SERVICE_ACCOUNT'
      || code === 'BATCH_IMAGE_PROVIDER_UNSUPPORTED_ACCOUNT'
    ) {
      return batchImageAdminError(batchImageText('providerSubmitFailed'), error)
    }
    if (code === 'BATCH_IMAGE_QUEUE_FAILED' || code === 'BATCH_IMAGE_QUEUE_NOT_CONFIGURED') {
      return batchImageAdminError(batchImageText('queueFailed'), error)
    }
    if (code === 'BATCH_IMAGE_BILLING_HOLD_FAILED') {
      return batchImageAdminError(batchImageText('billingHoldFailed'), error)
    }
    if (code === 'BATCH_IMAGE_GROUP_DISABLED') return batchImageText('groupDisabled')
    if (code === 'BATCH_IMAGE_SETTLEMENT_PRICING_MISSING') {
      return batchImageAdminError(batchImageText('pricingMissing'), error)
    }
    if (code === 'BATCH_IMAGE_INSUFFICIENT_BALANCE') {
      return batchImageText('insufficientBalance')
    }
    if (code === 'BATCH_IMAGE_INVALID_MODEL') return batchImageText('invalidModel')
    if (code === 'BATCH_IMAGE_INVALID_ITEMS') return batchImageText('invalidItems')
    if (code === 'BATCH_IMAGE_DUPLICATE_CUSTOM_ID') return batchImageText('duplicateCustomId')
    if (code === 'BATCH_IMAGE_PROMPT_TOO_LONG') return batchImageText('promptTooLong')
    if (code === 'BATCH_IMAGE_INVALID_REFERENCE_IMAGE') {
      return batchImageText('invalidReferenceImage')
    }
    if (code === 'BATCH_IMAGE_TOO_MANY_REFERENCE_IMAGES') {
      return batchImageText('tooManyReferenceImages')
    }
    if (code === 'BATCH_IMAGE_REFERENCE_IMAGES_TOO_LARGE') {
      return batchImageText('referenceImagesTooLarge')
    }
    if (code === 'BATCH_IMAGE_TOO_MANY_OUTPUT_IMAGES') {
      return batchImageText('tooManyOutputImages')
    }
    if (code === 'BATCH_IMAGE_IDEMPOTENCY_CONFLICT') {
      return batchImageText('idempotencyConflict')
    }
    if (code === 'BATCH_IMAGE_NOT_READY') return batchImageText('notReady')
    if (code === 'BATCH_IMAGE_OUTPUT_DELETED') return batchImageText('outputDeleted')
    if (code === 'BATCH_IMAGE_RESULT_MISSING') {
      return batchImageAdminError(batchImageText('resultMissing'), error)
    }
    if (code === 'BATCH_IMAGE_ITEM_FAILED') return batchImageText('itemFailed')
    if (code === 'BATCH_IMAGE_ITEM_IMAGE_INDEX_OUT_OF_RANGE') {
      return batchImageText('itemImageIndexOutOfRange')
    }
    if (code === 'BATCH_IMAGE_DOWNLOAD_LIMITED') return batchImageText('downloadLimited')
    if (code === 'BATCH_IMAGE_DOWNLOAD_TOO_LARGE') return batchImageText('downloadTooLarge')
    if (code === 'BATCH_IMAGE_RECORD_DELETE_NOT_READY') {
      return batchImageText('deleteNotReady')
    }
    if (code === 'BATCH_IMAGE_DISABLED') {
      return batchImageAdminError(batchImageText('disabled'), error)
    }
    if (code === 'INTERNAL_ERROR' || code === '500') {
      return batchImageAdminError(fallback, error)
    }
    if (isZhLocale()) {
      const detail = message
        ? `${batchImageText('errorReference')}：${message}`
        : batchImageText('adminReference')
      return `${fallback}。${detail} ${batchImageErrorReference(error)}`
    }
    return message || fallback
  }

  return { batchImageText, batchImageErrorMessage }
}
