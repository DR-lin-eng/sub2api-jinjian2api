import { setRefreshTokenMemory, setTokenExpiresAtMemory } from '@/core/networks/tokenStore'

export type OAuthTokenResponse = {
  access_token: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
}

export type OAuthCompletionKind = 'login' | 'bind'

export type OAuthAdoptionDecision = {
  adoptDisplayName?: boolean
  adoptAvatar?: boolean
}

export type PendingOAuthBindLoginResponse = Partial<OAuthTokenResponse> & {
  auth_result?: string
  redirect?: string
  error?: string
  requires_2fa?: boolean
  temp_token?: string
  user_email_masked?: string
  adoption_required?: boolean
  suggested_display_name?: string
  suggested_avatar_url?: string
}

export type PendingOAuthExchangeResponse = PendingOAuthBindLoginResponse

export type PendingOAuthCreateAccountResponse = OAuthTokenResponse & { auth_result?: string }

export type PendingOAuthSendVerifyCodeResponse = {
  auth_result?: string
  provider?: string
  redirect?: string
  message: string
  countdown: number
}

export function isOAuthLoginCompletion(c: Partial<OAuthTokenResponse>): c is OAuthTokenResponse {
  return typeof c.access_token === 'string' && c.access_token.trim().length > 0
}

export function getOAuthCompletionKind(c: Partial<OAuthTokenResponse>): OAuthCompletionKind {
  return isOAuthLoginCompletion(c) ? 'login' : 'bind'
}

export function getPendingOAuthBindLoginKind(c: Partial<OAuthTokenResponse>): OAuthCompletionKind {
  return getOAuthCompletionKind(c)
}

export function isPendingOAuthCreateAccountRequired(c: { error?: string }): boolean {
  return c.error === 'invitation_required'
}

export function hasPendingOAuthSuggestedProfile(c: { suggested_display_name?: string; suggested_avatar_url?: string }): boolean {
  return Boolean(c.suggested_display_name || c.suggested_avatar_url)
}

export function persistOAuthTokenContext(tokens: Partial<OAuthTokenResponse>): void {
  if (tokens.refresh_token) setRefreshTokenMemory(tokens.refresh_token)
  if (tokens.expires_in) setTokenExpiresAtMemory(Date.now() + tokens.expires_in * 1000)
}

export function serializeOAuthAdoptionDecision(decision?: OAuthAdoptionDecision): Record<string, boolean> {
  const payload: Record<string, boolean> = {}
  if (typeof decision?.adoptDisplayName === 'boolean') payload.adopt_display_name = decision.adoptDisplayName
  if (typeof decision?.adoptAvatar === 'boolean') payload.adopt_avatar = decision.adoptAvatar
  return payload
}
