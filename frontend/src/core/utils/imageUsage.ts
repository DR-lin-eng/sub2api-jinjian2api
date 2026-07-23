import type { UsageLog } from '@/features/admin-usage/domain/models/adminUsage'

type Translate = (key: string) => string

// --- Image output token / cost helpers ---

type ImageOutputTokenRow = Pick<UsageLog, 'outputTokens' | 'imageOutputTokens'>
type ImageOutputCostRow = Pick<UsageLog, 'imageOutputCost'>

/** Whether the row contains any image-output tokens. */
export const hasImageOutputTokens = (row: ImageOutputTokenRow | null | undefined): boolean =>
  (row?.imageOutputTokens ?? 0) > 0

/**
 * Text-only output tokens (total output minus image-output).
 * Returns 0 when no text tokens exist.
 */
export const textOutputTokens = (row: ImageOutputTokenRow | null | undefined): number =>
  Math.max(0, (row?.outputTokens ?? 0) - (row?.imageOutputTokens ?? 0))

/** Whether the row has a non-zero image-output cost. */
export const hasImageOutputCost = (row: ImageOutputCostRow | null | undefined): boolean =>
  (row?.imageOutputCost ?? 0) > 0

// --- Image input token / cost helpers ---

type ImageInputTokenRow = Pick<UsageLog, 'inputTokens' | 'imageInputTokens'>
type ImageInputCostRow = Pick<UsageLog, 'imageInputCost'>

/** Whether the row contains any image-input tokens (e.g. gpt-image-2 image edits). */
export const hasImageInputTokens = (row: ImageInputTokenRow | null | undefined): boolean =>
  (row?.imageInputTokens ?? 0) > 0

/**
 * Text-only input tokens (total input minus image-input).
 * Returns 0 when no text tokens exist.
 */
export const textInputTokens = (row: ImageInputTokenRow | null | undefined): number =>
  Math.max(0, (row?.inputTokens ?? 0) - (row?.imageInputTokens ?? 0))

/** Whether the row has a non-zero image-input cost. */
export const hasImageInputCost = (row: ImageInputCostRow | null | undefined): boolean =>
  (row?.imageInputCost ?? 0) > 0

// --- Image size / billing helpers ---

const knownImageSizeSources = new Set(['output', 'input', 'default', 'legacy'])
const knownImageBillingSizes = new Set(['1K', '2K', '4K', 'mixed'])

type ImageUsageRow = Pick<
  UsageLog,
  'imageSize' | 'imageInputSize' | 'imageOutputSize' | 'imageSizeSource' | 'imageSizeBreakdown'
>

const trimmed = (value: string | null | undefined): string => value?.trim() ?? ''

export const formatImageBillingSize = (row: ImageUsageRow | null | undefined, t: Translate): string => {
  const size = trimmed(row?.imageSize)
  if (!size) {
    return t('usage.imageSizeNotRecorded')
  }
  if (knownImageBillingSizes.has(size)) {
    return size
  }
  return `${t('usage.imageSizeLegacyUnstandardized')}: ${size}`
}

export const formatImageInputSize = (row: ImageUsageRow | null | undefined, t: Translate): string => {
  const size = trimmed(row?.imageInputSize)
  return size || t('usage.imageSizeUnknown')
}

export const formatImageOutputSize = (row: ImageUsageRow | null | undefined, t: Translate): string => {
  const size = trimmed(row?.imageOutputSize)
  return size || t('usage.imageSizeUnknown')
}

export const formatImageSizeSource = (row: ImageUsageRow | null | undefined, t: Translate): string => {
  const source = trimmed(row?.imageSizeSource).toLowerCase()
  if (knownImageSizeSources.has(source)) {
    return t(`usage.imageSizeSource${source.charAt(0).toUpperCase()}${source.slice(1)}`)
  }
  if (trimmed(row?.imageSize)) {
    return t('usage.imageSizeSourceLegacy')
  }
  return t('usage.imageSizeSourceMissing')
}

export const formatImageSizeBreakdown = (row: ImageUsageRow | null | undefined): string => {
  const breakdown = row?.imageSizeBreakdown
  if (!breakdown || Object.keys(breakdown).length === 0) {
    return ''
  }
  return ['1K', '2K', '4K']
    .filter((tier) => (breakdown[tier] ?? 0) > 0)
    .map((tier) => `${tier} x ${breakdown[tier]}`)
    .join(', ')
}
