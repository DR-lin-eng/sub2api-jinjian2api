/**
 * AuthRepository (interface). Auto-generated from authDatasource.ts.
 */
import type * as ds from '@/features/auth/data/datasources/authDatasource'

export type AuthRepository = {
  readonly isTotp2FARequired: typeof ds.isTotp2FARequired
  readonly setAuthToken: typeof ds.setAuthToken
  readonly setRefreshToken: typeof ds.setRefreshToken
  readonly setTokenExpiresAt: typeof ds.setTokenExpiresAt
  readonly getAuthToken: typeof ds.getAuthToken
  readonly getRefreshToken: typeof ds.getRefreshToken
  readonly getTokenExpiresAt: typeof ds.getTokenExpiresAt
  readonly clearAuthToken: typeof ds.clearAuthToken
  readonly login: typeof ds.login
  readonly login2FA: typeof ds.login2FA
  readonly register: typeof ds.register
  readonly getCurrentUser: typeof ds.getCurrentUser
  readonly logout: typeof ds.logout
  readonly isOAuthLoginCompletion: typeof ds.isOAuthLoginCompletion
  readonly getOAuthCompletionKind: typeof ds.getOAuthCompletionKind
  readonly getPendingOAuthBindLoginKind: typeof ds.getPendingOAuthBindLoginKind
  readonly isPendingOAuthCreateAccountRequired: typeof ds.isPendingOAuthCreateAccountRequired
  readonly hasPendingOAuthSuggestedProfile: typeof ds.hasPendingOAuthSuggestedProfile
  readonly persistOAuthTokenContext: typeof ds.persistOAuthTokenContext
  readonly prepareOAuthBindAccessTokenCookie: typeof ds.prepareOAuthBindAccessTokenCookie
  readonly refreshToken: typeof ds.refreshToken
  readonly revokeAllSessions: typeof ds.revokeAllSessions
  readonly isAuthenticated: typeof ds.isAuthenticated
  readonly getPublicSettings: typeof ds.getPublicSettings
  readonly getLocalCaptcha: typeof ds.getLocalCaptcha
  readonly isWeChatWebOAuthEnabled: typeof ds.isWeChatWebOAuthEnabled
  readonly hasExplicitWeChatOAuthCapabilities: typeof ds.hasExplicitWeChatOAuthCapabilities
  readonly resolveWeChatOAuthStart: typeof ds.resolveWeChatOAuthStart
  readonly resolveWeChatOAuthStartStrict: typeof ds.resolveWeChatOAuthStartStrict
  readonly sendVerifyCode: typeof ds.sendVerifyCode
  readonly sendPendingOAuthVerifyCode: typeof ds.sendPendingOAuthVerifyCode
  readonly validatePromoCode: typeof ds.validatePromoCode
  readonly validateInvitationCode: typeof ds.validateInvitationCode
  readonly forgotPassword: typeof ds.forgotPassword
  readonly resetPassword: typeof ds.resetPassword
  readonly completeLinuxDoOAuthRegistration: typeof ds.completeLinuxDoOAuthRegistration
  readonly completeOIDCOAuthRegistration: typeof ds.completeOIDCOAuthRegistration
  readonly completeWeChatOAuthRegistration: typeof ds.completeWeChatOAuthRegistration
  readonly createPendingLinuxDoOAuthAccount: typeof ds.createPendingLinuxDoOAuthAccount
  readonly createPendingOIDCOAuthAccount: typeof ds.createPendingOIDCOAuthAccount
  readonly createPendingWeChatOAuthAccount: typeof ds.createPendingWeChatOAuthAccount
  readonly createPendingDingTalkOAuthAccount: typeof ds.createPendingDingTalkOAuthAccount
  readonly completePendingOAuthBindLogin: typeof ds.completePendingOAuthBindLogin
  readonly exchangePendingOAuthCompletion: typeof ds.exchangePendingOAuthCompletion
}
