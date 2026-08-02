import type { SubscriptionPlan } from '@/features/admin-orders/domain/models/subscriptionPlan'

type TranslateFn = (key: string) => string

/**
 * 用户侧套餐有效期后缀（"$9.9 / 月"、"$9.9 / 30天"）。
 *
 * 管理端表单保存的单位是复数（days/weeks/months），历史数据里也可能有
 * 单数（day/month/week）。这里先归一化，再按后端计费语义展示，避免
 * 「1 个月」被显示成「1 天」（#4607）。
 */
export function planValiditySuffix(
  plan: Pick<SubscriptionPlan, 'validityDays' | 'validityUnit'>,
  t: TranslateFn,
): string {
  const unit = String(plan.validityUnit || 'day').trim().toLowerCase()
  const base = unit.endsWith('s') ? unit.slice(0, -1) : unit
  const days = plan.validityDays

  if (base === 'month') {
    return days === 1 ? t('payment.perMonth') : `${days}${t('payment.months')}`
  }
  if (base === 'week') {
    return `${days}${t('payment.weeks')}`
  }
  return `${days}${t('payment.days')}`
}
