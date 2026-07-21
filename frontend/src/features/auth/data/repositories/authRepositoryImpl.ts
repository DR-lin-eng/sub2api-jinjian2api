/**
 * AuthRepositoryImpl. Auto-generated from authDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/auth/data/datasources/authDatasource'
import type { AuthRepository } from '@/features/auth/domain/repositories/authRepository'

export class AuthRepositoryImpl implements AuthRepository {
  isTotp2FARequired = ds.isTotp2FARequired
  setAuthToken = ds.setAuthToken
  setRefreshToken = ds.setRefreshToken
  setTokenExpiresAt = ds.setTokenExpiresAt
  getAuthToken = ds.getAuthToken
  getRefreshToken = ds.getRefreshToken
  getTokenExpiresAt = ds.getTokenExpiresAt
  clearAuthToken = ds.clearAuthToken
  login = ds.login
  login2FA = ds.login2FA
  register = ds.register
  getCurrentUser = ds.getCurrentUser
  logout = ds.logout
  isOAuthLoginCompletion = ds.isOAuthLoginCompletion
  getOAuthCompletionKind = ds.getOAuthCompletionKind
  getPendingOAuthBindLoginKind = ds.getPendingOAuthBindLoginKind
  isPendingOAuthCreateAccountRequired = ds.isPendingOAuthCreateAccountRequired
  hasPendingOAuthSuggestedProfile = ds.hasPendingOAuthSuggestedProfile
  persistOAuthTokenContext = ds.persistOAuthTokenContext
  prepareOAuthBindAccessTokenCookie = ds.prepareOAuthBindAccessTokenCookie
  refreshToken = ds.refreshToken
  revokeAllSessions = ds.revokeAllSessions
  isAuthenticated = ds.isAuthenticated
  getPublicSettings = ds.getPublicSettings
  getLocalCaptcha = ds.getLocalCaptcha
  isWeChatWebOAuthEnabled = ds.isWeChatWebOAuthEnabled
  hasExplicitWeChatOAuthCapabilities = ds.hasExplicitWeChatOAuthCapabilities
  resolveWeChatOAuthStart = ds.resolveWeChatOAuthStart
  resolveWeChatOAuthStartStrict = ds.resolveWeChatOAuthStartStrict
  sendVerifyCode = ds.sendVerifyCode
  sendPendingOAuthVerifyCode = ds.sendPendingOAuthVerifyCode
  validatePromoCode = ds.validatePromoCode
  validateInvitationCode = ds.validateInvitationCode
  forgotPassword = ds.forgotPassword
  resetPassword = ds.resetPassword
  completeLinuxDoOAuthRegistration = ds.completeLinuxDoOAuthRegistration
  completeOIDCOAuthRegistration = ds.completeOIDCOAuthRegistration
  completeWeChatOAuthRegistration = ds.completeWeChatOAuthRegistration
  createPendingLinuxDoOAuthAccount = ds.createPendingLinuxDoOAuthAccount
  createPendingOIDCOAuthAccount = ds.createPendingOIDCOAuthAccount
  createPendingWeChatOAuthAccount = ds.createPendingWeChatOAuthAccount
  createPendingDingTalkOAuthAccount = ds.createPendingDingTalkOAuthAccount
  completePendingOAuthBindLogin = ds.completePendingOAuthBindLogin
  exchangePendingOAuthCompletion = ds.exchangePendingOAuthCompletion
}

export const authRepository: AuthRepository = new AuthRepositoryImpl()
