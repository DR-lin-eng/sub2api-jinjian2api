import { defineStore } from 'pinia'
import { ref } from 'vue'
import { billingQueryRepository } from '@/features/billing/data/repositories/billingQueryRepositoryImpl'
import { billingActionRepository } from '@/features/billing/data/repositories/billingActionRepositoryImpl'
import { PaymentOrder } from '@/features/admin-orders/domain/models/paymentOrder'
import { SubscriptionPlan } from '@/features/admin-orders/domain/models/subscriptionPlan'
import type { CreateOrderRequest } from '@/features/billing/data/requests_models/createOrderRequest'
import type { PaymentConfig } from '@/features/billing/domain/models/paymentConfig'
export const usePaymentStore = defineStore('payment', () => {
  const config = ref<PaymentConfig | null>(null)
  const currentOrder = ref<PaymentOrder | null>(null)
  const plans = ref<SubscriptionPlan[]>([])
  const configLoading = ref(false)
  const configLoaded = ref(false)

  async function fetchConfig(force = false): Promise<PaymentConfig | null> {
    if (configLoaded.value && !force) return config.value
    if (configLoading.value) return config.value
    configLoading.value = true
    try {
      const response = await billingQueryRepository.getConfig()
      config.value = response.data
      configLoaded.value = true
      return config.value
    } catch (error: unknown) {
      console.error('[payment] Failed to fetch config:', error)
      return null
    } finally {
      configLoading.value = false
    }
  }

  async function fetchPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await billingQueryRepository.getPlans()
      plans.value = (response.data || []).map((p: Omit<SubscriptionPlan, 'features'> & { features: string | string[] }) => ({
        ...p,
        features: typeof p.features === 'string'
          ? p.features.split('\n').map((f: string) => f.trim()).filter(Boolean)
          : (p.features || []),
      }))
      return plans.value
    } catch (error: unknown) {
      console.error('[payment] Failed to fetch plans:', error)
      return []
    }
  }

  async function createOrder(params: CreateOrderRequest) {
    const response = await billingActionRepository.createOrder(params)
    return response.data
  }

  async function pollOrderStatus(orderId: number): Promise<PaymentOrder | null> {
    try {
      const response = await billingQueryRepository.getOrder(orderId)
      const order = response.data
      if (currentOrder.value?.id === orderId) {
        currentOrder.value = order
      }
      return order
    } catch (error: unknown) {
      console.error('[payment] Failed to poll order status:', error)
      return null
    }
  }

  function clearCurrentOrder() {
    currentOrder.value = null
  }

  return {
    config,
    currentOrder,
    plans,
    configLoading,
    configLoaded,
    fetchConfig,
    fetchPlans,
    createOrder,
    pollOrderStatus,
    clearCurrentOrder,
  }
})
