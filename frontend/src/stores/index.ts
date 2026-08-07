/**
 * Transitional store compatibility barrel.
 * New code should import from the owning core or feature module directly.
 */

export { useAuthStore } from '@/features/auth/presentation/stores/authStore'
export { useAppStore } from '@/core/stores/appStore'
export { useAdminSettingsStore } from '@/features/admin-settings/presentation/stores/adminSettingsStore'
export { useAdminComplianceStore } from '@/features/admin-settings/presentation/stores/adminComplianceStore'

// Re-export types for convenience
export type { User, LoginRequest, AuthResponse } from '@/types'
export type { Toast, ToastType, AppState } from '@/types'
