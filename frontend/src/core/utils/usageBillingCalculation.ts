import {
  BILLING_MODE_IMAGE,
  BILLING_MODE_TOKEN,
  BILLING_MODE_VIDEO,
  getDisplayBillingMode,
} from './billingMode'
import { textInputTokens, textOutputTokens } from './imageUsage'
import type { UsageLog } from '@/features/admin-usage/domain/models/adminUsage'

export type UsageBillingFormulaKind = 'direct' | 'split' | 'effective' | 'zero'

export interface UsageBillingCostLine {
  key: 'input' | 'image_input' | 'output' | 'image_output' | 'cache_creation' | 'cache_read' | 'request' | 'image' | 'video'
  quantity: number
  quantityUnit: 'tokens' | 'requests' | 'images' | 'video_seconds'
  unitPrice: number | null
  cost: number
}

export interface UsageBillingCalculation {
  mode: string
  lines: UsageBillingCostLine[]
  componentSubtotal: number
  recordedTotal: number
  componentDelta: number
  nonImageSubtotal: number
  imageSubtotal: number
  rateMultiplier: number
  textRateMultiplier: number | null
  imageRateMultiplier: number | null
  effectiveRateMultiplier: number | null
  textActualCost: number | null
  imageActualCost: number | null
  calculatedActual: number
  recordedActual: number
  actualDelta: number
  formulaKind: UsageBillingFormulaKind
  reconciled: boolean
}

const finite = (value: number | null | undefined): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0

const nearlyEqual = (left: number, right: number): boolean => {
  const scale = Math.max(1, Math.abs(left), Math.abs(right))
  return Math.abs(left - right) <= Math.max(1e-10, scale * 1e-8)
}

const unitPrice = (cost: number, quantity: number): number | null =>
  quantity > 0 ? cost / quantity : null

function tokenCostLines(usage: UsageLog): UsageBillingCostLine[] {
  const candidates: UsageBillingCostLine[] = [
    {
      key: 'input',
      quantity: textInputTokens(usage),
      quantityUnit: 'tokens',
      unitPrice: unitPrice(finite(usage.inputCost), textInputTokens(usage)),
      cost: finite(usage.inputCost),
    },
    {
      key: 'image_input',
      quantity: finite(usage.imageInputTokens),
      quantityUnit: 'tokens',
      unitPrice: unitPrice(finite(usage.imageInputCost), finite(usage.imageInputTokens)),
      cost: finite(usage.imageInputCost),
    },
    {
      key: 'output',
      quantity: textOutputTokens(usage),
      quantityUnit: 'tokens',
      unitPrice: unitPrice(finite(usage.outputCost), textOutputTokens(usage)),
      cost: finite(usage.outputCost),
    },
    {
      key: 'image_output',
      quantity: finite(usage.imageOutputTokens),
      quantityUnit: 'tokens',
      unitPrice: unitPrice(finite(usage.imageOutputCost), finite(usage.imageOutputTokens)),
      cost: finite(usage.imageOutputCost),
    },
    {
      key: 'cache_creation',
      quantity: finite(usage.cacheCreationTokens),
      quantityUnit: 'tokens',
      unitPrice: unitPrice(finite(usage.cacheCreationCost), finite(usage.cacheCreationTokens)),
      cost: finite(usage.cacheCreationCost),
    },
    {
      key: 'cache_read',
      quantity: finite(usage.cacheReadTokens),
      quantityUnit: 'tokens',
      unitPrice: unitPrice(finite(usage.cacheReadCost), finite(usage.cacheReadTokens)),
      cost: finite(usage.cacheReadCost),
    },
  ]

  return candidates.filter((line) => line.quantity > 0 || line.cost !== 0)
}

function fixedPriceCostLine(usage: UsageLog, mode: string, total: number): UsageBillingCostLine {
  if (mode === BILLING_MODE_IMAGE) {
    const quantity = Math.max(0, finite(usage.imageCount))
    return { key: 'image', quantity, quantityUnit: 'images', unitPrice: unitPrice(total, quantity), cost: total }
  }
  if (mode === BILLING_MODE_VIDEO) {
    const quantity = Math.max(0, finite(usage.videoCount) * finite(usage.videoDurationSeconds))
    return { key: 'video', quantity, quantityUnit: 'video_seconds', unitPrice: unitPrice(total, quantity), cost: total }
  }
  return { key: 'request', quantity: 1, quantityUnit: 'requests', unitPrice: total, cost: total }
}

export function buildUsageBillingCalculation(usage: UsageLog): UsageBillingCalculation {
  const mode = getDisplayBillingMode(usage) || BILLING_MODE_TOKEN
  const recordedTotal = finite(usage.totalCost)
  const recordedActual = finite(usage.actualCost)
  const rateMultiplier = finite(usage.rateMultiplier)
  const lines = mode === BILLING_MODE_TOKEN
    ? tokenCostLines(usage)
    : [fixedPriceCostLine(usage, mode, recordedTotal)]
  const componentSubtotal = lines.reduce((sum, line) => sum + line.cost, 0)
  const imageSubtotal = mode === BILLING_MODE_TOKEN
    ? finite(usage.imageInputCost) + finite(usage.imageOutputCost)
    : 0
  const nonImageSubtotal = mode === BILLING_MODE_TOKEN
    ? componentSubtotal - imageSubtotal
    : componentSubtotal

  let formulaKind: UsageBillingFormulaKind = 'direct'
  let textRateMultiplier: number | null = rateMultiplier
  let imageRateMultiplier: number | null = null
  let effectiveRateMultiplier: number | null = recordedTotal !== 0 ? recordedActual / recordedTotal : null
  let textActualCost: number | null = null
  let imageActualCost: number | null = null
  let calculatedActual = recordedTotal * rateMultiplier
  const reconstructedTextActual = recordedActual - imageSubtotal * rateMultiplier
  const reconstructedTextRate = nonImageSubtotal > 0 ? reconstructedTextActual / nonImageSubtotal : null

  if (recordedTotal === 0 && recordedActual === 0) {
    formulaKind = 'zero'
    calculatedActual = 0
    effectiveRateMultiplier = null
  } else if (
    mode === BILLING_MODE_TOKEN
    && imageSubtotal > 0
    && nonImageSubtotal > 0
    && !nearlyEqual(calculatedActual, recordedActual)
    && reconstructedTextRate != null
    && Number.isFinite(reconstructedTextRate)
    && reconstructedTextRate >= 0
  ) {
    formulaKind = 'split'
    imageRateMultiplier = rateMultiplier
    imageActualCost = imageSubtotal * imageRateMultiplier
    textActualCost = reconstructedTextActual
    textRateMultiplier = reconstructedTextRate
    calculatedActual = textActualCost + imageActualCost
  } else if (!nearlyEqual(calculatedActual, recordedActual)) {
    formulaKind = 'effective'
    textRateMultiplier = null
    calculatedActual = recordedActual
  } else {
    textActualCost = recordedTotal * rateMultiplier
  }

  const componentDelta = componentSubtotal - recordedTotal
  const actualDelta = calculatedActual - recordedActual
  return {
    mode,
    lines,
    componentSubtotal,
    recordedTotal,
    componentDelta,
    nonImageSubtotal,
    imageSubtotal,
    rateMultiplier,
    textRateMultiplier,
    imageRateMultiplier,
    effectiveRateMultiplier,
    textActualCost,
    imageActualCost,
    calculatedActual,
    recordedActual,
    actualDelta,
    formulaKind,
    reconciled: nearlyEqual(componentSubtotal, recordedTotal) && nearlyEqual(calculatedActual, recordedActual),
  }
}
