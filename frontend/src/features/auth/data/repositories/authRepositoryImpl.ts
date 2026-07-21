/**
 * AuthRepositoryImpl. Auto-generated from authDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/auth/data/datasources/authDatasource'
import type { AuthRepository } from '@/features/auth/domain/repositories/authRepository'

export class AuthRepositoryImpl implements AuthRepository {
  get isTotp2FARequired(): typeof ds.isTotp2FARequired { return ds.isTotp2FARequired }
  get setAuthToken(): typeof ds.setAuthToken { return ds.setAuthToken }
  get setRefreshToken(): typeof ds.setRefreshToken { return ds.setRefreshToken }
  get setTokenExpiresAt(): typeof ds.setTokenExpiresAt { return ds.setTokenExpiresAt }
  get getAuthToken(): typeof ds.getAuthToken { return ds.getAuthToken }
  get getRefreshToken(): typeof ds.getRefreshToken { return ds.getRefreshToken }
  get getTokenExpiresAt(): typeof ds.getTokenExpiresAt { return ds.getTokenExpiresAt }
  get clearAuthToken(): typeof ds.clearAuthToken { return ds.clearAuthToken }
  get login(): typeof ds.login { return ds.login }
  get login2FA(): typeof ds.login2FA { return ds.login2FA }
  get register(): typeof ds.register { return ds.register }
  get getCurrentUser(): typeof ds.getCurrentUser { return ds.getCurrentUser }
  get logout(): typeof ds.logout { return ds.logout }
  get isOAuthLoginCompletion(): typeof ds.isOAuthLoginCompletion { return ds.isOAuthLoginCompletion }
  get getOAuthCompletionKind(): typeof ds.getOAuthCompletionKind { return ds.getOAuthCompletionKind }
  get getPendingOAuthBindLoginKind(): typeof ds.getPendingOAuthBindLoginKind { return ds.getPendingOAuthBindLoginKind }
  get isPendingOAuthCreateAccountRequired(): typeof ds.isPendingOAuthCreateAccountRequired { return ds.isPendingOAuthCreateAccountRequired }
  get hasPendingOAuthSuggestedProfile(): typeof ds.hasPendingOAuthSuggestedProfile { return ds.hasPendingOAuthSuggestedProfile }
  get persistOAuthTokenContext(): typeof ds.persistOAuthTokenContext { return ds.persistOAuthTokenContext }
  get prepareOAuthBindAccessTokenCookie(): typeof ds.prepareOAuthBindAccessTokenCookie { return ds.prepareOAuthBindAccessTokenCookie }
  get refreshToken(): typeof ds.refreshToken { return ds.refreshToken }
  get revokeAllSessions(): typeof ds.revokeAllSessions { return ds.revokeAllSessions }
  get isAuthenticated(): typeof ds.isAuthenticated { return ds.isAuthenticated }
  get getPublicSettings(): typeof ds.getPublicSettings { return ds.getPublicSettings }
  get getLocalCaptcha(): typeof ds.getLocalCaptcha { return ds.getLocalCaptcha }
  get isWeChatWebOAuthEnabled(): typeof ds.isWeChatWebOAuthEnabled { return ds.isWeChatWebOAuthEnabled }
  get hasExplicitWeChatOAuthCapabilities(): typeof ds.hasExplicitWeChatOAuthCapabilities { return ds.hasExplicitWeChatOAuthCapabilities }
  get resolveWeChatOAuthStart(): typeof ds.resolveWeChatOAuthStart { return ds.resolveWeChatOAuthStart }
  get resolveWeChatOAuthStartStrict(): typeof ds.resolveWeChatOAuthStartStrict { return ds.resolveWeChatOAuthStartStrict }
  get sendVerifyCode(): typeof ds.sendVerifyCode { return ds.sendVerifyCode }
  get sendPendingOAuthVerifyCode(): typeof ds.sendPendingOAuthVerifyCode { return ds.sendPendingOAuthVerifyCode }
  get validatePromoCode(): typeof ds.validatePromoCode { return ds.validatePromoCode }
  get validateInvitationCode(): typeof ds.validateInvitationCode { return ds.validateInvitationCode }
  get forgotPassword(): typeof ds.forgotPassword { return ds.forgotPassword }
  get resetPassword(): typeof ds.resetPassword { return ds.resetPassword }
  get completeLinuxDoOAuthRegistration(): typeof ds.completeLinuxDoOAuthRegistration { return ds.completeLinuxDoOAuthRegistration }
  get completeOIDCOAuthRegistration(): typeof ds.completeOIDCOAuthRegistration { return ds.completeOIDCOAuthRegistration }
  get completeWeChatOAuthRegistration(): typeof ds.completeWeChatOAuthRegistration { return ds.completeWeChatOAuthRegistration }
  get createPendingLinuxDoOAuthAccount(): typeof ds.createPendingLinuxDoOAuthAccount { return ds.createPendingLinuxDoOAuthAccount }
  get createPendingOIDCOAuthAccount(): typeof ds.createPendingOIDCOAuthAccount { return ds.createPendingOIDCOAuthAccount }
  get createPendingWeChatOAuthAccount(): typeof ds.createPendingWeChatOAuthAccount { return ds.createPendingWeChatOAuthAccount }
  get createPendingDingTalkOAuthAccount(): typeof ds.createPendingDingTalkOAuthAccount { return ds.createPendingDingTalkOAuthAccount }
  get completePendingOAuthBindLogin(): typeof ds.completePendingOAuthBindLogin { return ds.completePendingOAuthBindLogin }
  get exchangePendingOAuthCompletion(): typeof ds.exchangePendingOAuthCompletion { return ds.exchangePendingOAuthCompletion }
}

export const authRepository: AuthRepository = new AuthRepositoryImpl()
