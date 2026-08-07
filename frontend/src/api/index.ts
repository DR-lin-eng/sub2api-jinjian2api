/**
 * Transitional API compatibility barrel.
 * New code should import the owning feature datasource directly.
 */

// Re-export the HTTP client
export { apiClient } from '@/core/networks/client'

// Auth API
export {
  authAPI,
  isTotp2FARequired,
  type LoginResponse,
  type RefreshTokenResponse
} from '@/features/auth/data/datasources/authDatasource'

// Administrator APIs
export { keysAPI } from '@/features/keys/data/datasources/keysDatasource'
export { usageAPI } from '@/features/usage/data/datasources/usageDatasource'
export { userAPI } from '@/features/profile/data/datasources/profileDatasource'
export { totpAPI } from '@/features/profile/data/datasources/totpDatasource'

// Admin APIs
export { adminAPI } from './admin'

// Default export
export { default } from '@/core/networks/client'
