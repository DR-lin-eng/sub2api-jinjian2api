/**
 * API Client for Sub2API Backend
 * Central export point for all API modules
 */

// Re-export the HTTP client
export { apiClient } from '@/core/networks/client'

// Auth API
import { authActionRepository } from '@/features/auth/data/repositories/authActionRepositoryImpl'
import { authQueryRepository } from '@/features/auth/data/repositories/authQueryRepositoryImpl'
import type { TotpLoginResult } from '@/features/auth/domain/models/totpLoginResult'
import type { LoginResponse } from '@/features/auth/domain/repositories/authActionRepository'
import { setTokenExpiresAtMemory } from '@/core/networks/tokenStore'

export const authAPI = {
  login: authActionRepository.login.bind(authActionRepository),
  login2FA: authActionRepository.login2FA.bind(authActionRepository),
  register: authActionRepository.register.bind(authActionRepository),
  logout: authActionRepository.logout.bind(authActionRepository),
  refreshToken: authActionRepository.refreshToken.bind(authActionRepository),
  getCurrentUser: authQueryRepository.getCurrentUser.bind(authQueryRepository),
}

export function isTotp2FARequired(r: LoginResponse): r is TotpLoginResult {
  return 'requires2fa' in r && (r as TotpLoginResult).requires2fa === true
}

export function getPublicSettings() {
  return authQueryRepository.getPublicSettings()
}

export type { LoginResponse } from '@/features/auth/domain/repositories/authActionRepository'
export type { SessionRefreshResult as RefreshTokenResponse } from '@/core/networks/sessionRefresh'
export {
  getAccessToken as getAuthToken,
  getRefreshTokenMemory as getRefreshToken,
  getTokenExpiresAtMemory as getTokenExpiresAt,
  setAccessToken as setAuthToken,
  setRefreshTokenMemory as setRefreshToken,
  clearTokenMemory as clearAuthToken,
} from '@/core/networks/tokenStore'
export function setTokenExpiresAt(expiresIn: number): void {
  setTokenExpiresAtMemory(Date.now() + expiresIn * 1000)
}

// System API (for update checks and public settings)
export { systemQueryRepository as checkUpdatesAPI } from '@/features/admin-settings/data/repositories/systemQueryRepositoryImpl'
export { systemActionRepository as systemActionAPI } from '@/features/admin-settings/data/repositories/systemActionRepositoryImpl'
export type { VersionInfo } from '@/features/admin-settings/domain/models/versionInfo'
export type { ReleaseInfo } from '@/features/admin-settings/domain/models/releaseInfo'
export type { RollbackVersionInfo } from '@/features/admin-settings/domain/models/rollbackVersionInfo'

// Admin compliance API (for core adminComplianceStore)
export { complianceQueryRepository as adminComplianceAPI } from '@/features/admin-settings/data/repositories/complianceQueryRepositoryImpl'
export type { AdminComplianceStatus } from '@/features/admin-settings/domain/models/adminComplianceStatus'

// Setup API (for core routes navigation guard)
export { getSetupStatus } from '@/features/setup/data/datasources/setupDatasource'

// User APIs
export { usageQueryRepository as usageAPI } from '@/features/usage/data/repositories/usageQueryRepositoryImpl'
export { redeemAPI, type RedeemHistoryItem } from '@/features/billing/data/datasources/redeemDatasource'
export { paymentAPI } from '@/features/billing/data/datasources/paymentDatasource'
export { userGroupsAPI } from '@/features/groups-user/data/datasources/groupsUserDatasource'
export { userChannelsAPI } from '@/features/channels-user/data/datasources/channelsUserDatasource'
export * as batchImageAPI from '@/features/batch-image/data/datasources/batchImageDatasource'
export { default as announcementsAPI } from '@/features/announcements/data/datasources/announcementsDatasource'
export { channelMonitorUserAPI } from '@/features/channel-monitor-user/data/datasources/channelMonitorUserDatasource'

import { profileQueryDatasource } from '@/features/profile/data/datasources/profileQueryDatasource'
import { profileActionDatasource } from '@/features/profile/data/datasources/profileActionDatasource'
import { totpQueryDatasource } from '@/features/profile/data/datasources/totpQueryDatasource'
import { totpActionDatasource } from '@/features/profile/data/datasources/totpActionDatasource'

export const userAPI = {
  getProfile: () => profileQueryDatasource.getProfile(),
  getAffiliateDetail: () => profileQueryDatasource.getAffiliateDetail(),
  getMyPlatformQuotas: () => profileQueryDatasource.getMyPlatformQuotas(),
  updateProfile: (req: Parameters<typeof profileActionDatasource.updateProfile>[0]) => profileActionDatasource.updateProfile(req),
  changePassword: (req: Parameters<typeof profileActionDatasource.changePassword>[0]) => profileActionDatasource.changePassword(req),
  sendNotifyEmailCode: (email: string) => profileActionDatasource.sendNotifyEmailCode(email),
  verifyNotifyEmail: (email: string, code: string) => profileActionDatasource.verifyNotifyEmail(email, code),
  removeNotifyEmail: (email: string) => profileActionDatasource.removeNotifyEmail(email),
  toggleNotifyEmail: (email: string, disabled: boolean) => profileActionDatasource.toggleNotifyEmail(email, disabled),
  sendEmailBindingCode: (email: string) => profileActionDatasource.sendEmailBindingCode(email),
  bindEmailIdentity: (req: Parameters<typeof profileActionDatasource.bindEmailIdentity>[0]) => profileActionDatasource.bindEmailIdentity(req),
  unbindAuthIdentity: (provider: Parameters<typeof profileActionDatasource.unbindAuthIdentity>[0]) => profileActionDatasource.unbindAuthIdentity(provider),
  startOAuthBinding: (...args: Parameters<typeof profileActionDatasource.startOAuthBinding>) => profileActionDatasource.startOAuthBinding(...args),
  transferAffiliateQuota: () => profileActionDatasource.transferAffiliateQuota(),
}

export const totpAPI = {
  getStatus: () => totpQueryDatasource.getStatus().then(dto => dto.toEntity()),
  getVerificationMethod: () => totpQueryDatasource.getVerificationMethod().then(dto => dto.toEntity()),
  sendVerifyCode: () => totpActionDatasource.sendVerifyCode(),
  initiateSetup: (req?: Parameters<typeof totpActionDatasource.initiateSetup>[0]) => totpActionDatasource.initiateSetup(req).then(dto => dto.toEntity()),
  enable: (req: Parameters<typeof totpActionDatasource.enable>[0]) => totpActionDatasource.enable(req).then(dto => dto.toEntity()),
  disable: (req: Parameters<typeof totpActionDatasource.disable>[0]) => totpActionDatasource.disable(req),
  stepUp: (code: string) => totpActionDatasource.stepUp(code).then(dto => dto.toEntity()),
}

// Admin APIs
export { adminAPI } from './admin'

// Default export
export { default } from '@/core/networks/client'
