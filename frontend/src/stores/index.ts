/**
 * Pinia Stores Export
 * Central export point for all application stores
 */

export { useAuthStore } from './auth'
export { useAppStore } from './app'
export { useAdminSettingsStore } from './adminSettings'
export { useSubscriptionStore } from '@/features/subscriptions/presentation/stores/subscriptionsStore'
export { useOnboardingStore } from './onboarding'
export { useAnnouncementStore } from '@/features/announcements/presentation/stores/announcementsStore'
export { usePaymentStore } from '@/features/billing/presentation/stores/paymentStore'
export { useAdminComplianceStore } from './adminCompliance'

// Re-export types for convenience
export type { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types'
export type { Toast, ToastType, AppState } from '@/types'
