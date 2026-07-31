export const BILLING_MODE_TOKEN = 'token'
export const BILLING_MODE_PER_REQUEST = 'per_request'
export const BILLING_MODE_IMAGE = 'image'
export const BILLING_MODE_VIDEO = 'video'

export function getBillingModeLabel(mode: string | null | undefined, t: (key: string) => string): string {
  switch (mode) {
    case BILLING_MODE_PER_REQUEST: return t('admin.usage.billingModePerRequest')
    case BILLING_MODE_IMAGE: return t('admin.usage.billingModeImage')
    case BILLING_MODE_VIDEO: return t('admin.usage.billingModeVideo')
    default: return t('admin.usage.billingModeToken')
  }
}

export function getBillingModeBadgeClass(mode: string | null | undefined): string {
  switch (mode) {
    case BILLING_MODE_PER_REQUEST: return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
    case BILLING_MODE_IMAGE: return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300'
    case BILLING_MODE_VIDEO: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
    default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
  }
}

interface ImageBillingRow {
  imageCount: number
  billingMode?: string | null
  totalCost: number
}

export function isImageUsage(row: Pick<ImageBillingRow, 'imageCount' | 'billingMode'> | null | undefined): boolean {
  return (row?.imageCount ?? 0) > 0 && row?.billingMode !== BILLING_MODE_TOKEN && row?.billingMode !== BILLING_MODE_VIDEO
}

export function getDisplayBillingMode(row: Pick<ImageBillingRow, 'billingMode' | 'imageCount'> | null | undefined): string | null | undefined {
  if ((row?.imageCount ?? 0) > 0 && !row?.billingMode) {
    return BILLING_MODE_IMAGE
  }
  return row?.billingMode
}

export function imageUnitPrice(row: Pick<ImageBillingRow, 'imageCount' | 'totalCost'> | null): number {
  if (!row || row.imageCount <= 0) return 0
  const total = row.totalCost ?? 0
  const price = total / row.imageCount
  return Number.isFinite(price) ? price : 0
}
