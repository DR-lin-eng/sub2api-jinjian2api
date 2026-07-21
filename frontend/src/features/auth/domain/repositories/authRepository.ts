/**
 * AuthRepository (interface). Auto-generated from authDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/authRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/auth/data/datasources/authDatasource'

export type AuthRepository = {
  isTotp2FARequired: typeof ds.isTotp2FARequired
  setAuthToken: typeof ds.setAuthToken
  setRefreshToken: typeof ds.setRefreshToken
  setTokenExpiresAt: typeof ds.setTokenExpiresAt
  getAuthToken: typeof ds.getAuthToken
  getRefreshToken: typeof ds.getRefreshToken
  getTokenExpiresAt: typeof ds.getTokenExpiresAt
  clearAuthToken: typeof ds.clearAuthToken
  login: typeof ds.login
  login2FA: typeof ds.login2FA
  register: typeof ds.register
  getCurrentUser: typeof ds.getCurrentUser
  logout: typeof ds.logout
  isOAuthLoginCompletion: typeof ds.isOAuthLoginCompletion
  getOAuthCompletionKind: typeof ds.getOAuthCompletionKind
  getPendingOAuthBindLoginKind: typeof ds.getPendingOAuthBindLoginKind
  isPendingOAuthCreateAccountRequired: typeof ds.isPendingOAuthCreateAccountRequired
  hasPendingOAuthSuggestedProfile: typeof ds.hasPendingOAuthSuggestedProfile
  persistOAuthTokenContext: typeof ds.persistOAuthTokenContext
  prepareOAuthBindAccessTokenCookie: typeof ds.prepareOAuthBindAccessTokenCookie
  refreshToken: typeof ds.refreshToken
  revokeAllSessions: typeof ds.revokeAllSessions
  isAuthenticated: typeof ds.isAuthenticated
  getPublicSettings: typeof ds.getPublicSettings
  getLocalCaptcha: typeof ds.getLocalCaptcha
  isWeChatWebOAuthEnabled: typeof ds.isWeChatWebOAuthEnabled
  hasExplicitWeChatOAuthCapabilities: typeof ds.hasExplicitWeChatOAuthCapabilities
  resolveWeChatOAuthStart: typeof ds.resolveWeChatOAuthStart
  resolveWeChatOAuthStartStrict: typeof ds.resolveWeChatOAuthStartStrict
  sendVerifyCode: typeof ds.sendVerifyCode
  sendPendingOAuthVerifyCode: typeof ds.sendPendingOAuthVerifyCode
  validatePromoCode: typeof ds.validatePromoCode
  validateInvitationCode: typeof ds.validateInvitationCode
  forgotPassword: typeof ds.forgotPassword
  resetPassword: typeof ds.resetPassword
  completeLinuxDoOAuthRegistration: typeof ds.completeLinuxDoOAuthRegistration
  completeOIDCOAuthRegistration: typeof ds.completeOIDCOAuthRegistration
  completeWeChatOAuthRegistration: typeof ds.completeWeChatOAuthRegistration
  createPendingLinuxDoOAuthAccount: typeof ds.createPendingLinuxDoOAuthAccount
  createPendingOIDCOAuthAccount: typeof ds.createPendingOIDCOAuthAccount
  createPendingWeChatOAuthAccount: typeof ds.createPendingWeChatOAuthAccount
  createPendingDingTalkOAuthAccount: typeof ds.createPendingDingTalkOAuthAccount
  completePendingOAuthBindLogin: typeof ds.completePendingOAuthBindLogin
  exchangePendingOAuthCompletion: typeof ds.exchangePendingOAuthCompletion
}
