/**
 * API Client for Sub2API Backend
 * Central export point for all API modules
 */

// Re-export the HTTP client
export { apiClient } from '@/core/networks/client'

// Auth API
export {
  authAPI,
  isTotp2FARequired,
  type LoginResponse,
  type RefreshTokenResponse,
  clearAuthToken,
  getAuthToken,
  getRefreshToken,
  getTokenExpiresAt,
  setAuthToken,
  setRefreshToken,
  setTokenExpiresAt,
} from './auth'

// User APIs
export { keysAPI } from '@/features/keys/data/datasources/keysDatasource'
export { usageAPI } from '@/features/usage/data/datasources/usageDatasource'
export { userAPI } from '@/features/profile/data/datasources/profileDatasource'
export { redeemAPI, type RedeemHistoryItem } from '@/features/billing/data/datasources/redeemDatasource'
export { paymentAPI } from '@/features/billing/data/datasources/paymentDatasource'
export { userGroupsAPI } from '@/features/groups-user/data/datasources/groupsUserDatasource'
export { userChannelsAPI } from '@/features/channels-user/data/datasources/channelsUserDatasource'
export * as batchImageAPI from '@/features/batch-image/data/datasources/batchImageDatasource'
export { totpAPI } from '@/features/profile/data/datasources/totpDatasource'
export { default as announcementsAPI } from '@/features/announcements/data/datasources/announcementsDatasource'
export { channelMonitorUserAPI } from '@/features/channel-monitor-user/data/datasources/channelMonitorUserDatasource'

// Admin APIs
export { adminAPI } from './admin'

// Default export
export { default } from '@/core/networks/client'
