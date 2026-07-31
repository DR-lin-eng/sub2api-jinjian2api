/**
 * Backend error code → i18n key mapping.
 * Per spec §8.5: all known error codes MUST have an entry here.
 * UI falls back to HttpError.message when code is absent or key not found.
 *
 * Key format: `errors.<CODE_lowercase_with_dots>`
 * Add new codes here first, then add the translation in locales/*.
 */

export const errorCodeToKey: Readonly<Record<string, string>> = {
  // ── Auth / session ────────────────────────────────────────────────────────
  TOKEN_EXPIRED: 'errors.tokenExpired',
  INVALID_TOKEN: 'errors.invalidToken',
  TOKEN_REVOKED: 'errors.tokenRevoked',
  TOKEN_REFRESH_FAILED: 'errors.tokenRefreshFailed',
  UNAUTHORIZED: 'errors.unauthorized',
  FORBIDDEN: 'errors.forbidden',

  // ── Auth — 2FA / TOTP ─────────────────────────────────────────────────────
  TOTP_REQUIRED: 'errors.totpRequired',
  TOTP_INVALID: 'errors.totpInvalid',
  TOTP_ALREADY_ENABLED: 'errors.totpAlreadyEnabled',

  // ── Auth — OAuth ──────────────────────────────────────────────────────────
  OAUTH_TOKEN_INVALID: 'errors.oauthTokenInvalid',
  OAUTH_PROVIDER_ERROR: 'errors.oauthProviderError',
  PENDING_OAUTH_TOKEN_EXPIRED: 'errors.pendingOAuthTokenExpired',

  // ── Admin compliance ──────────────────────────────────────────────────────
  ADMIN_COMPLIANCE_ACK_REQUIRED: 'errors.adminComplianceAckRequired',

  // ── Feature flags ─────────────────────────────────────────────────────────
  OPS_DISABLED: 'errors.opsDisabled',

  // ── Concurrency / rate limits ─────────────────────────────────────────────
  RATE_LIMITED: 'errors.rateLimited',
  QUOTA_EXCEEDED: 'errors.quotaExceeded',
  CONCURRENT_LIMIT_EXCEEDED: 'errors.concurrentLimitExceeded',

  // ── Resource lifecycle ────────────────────────────────────────────────────
  NOT_FOUND: 'errors.notFound',
  ALREADY_EXISTS: 'errors.alreadyExists',
  CONFLICT: 'errors.conflict',
  GONE: 'errors.gone',

  // ── Validation ────────────────────────────────────────────────────────────
  VALIDATION_ERROR: 'errors.validationError',
  INVALID_PARAMETER: 'errors.invalidParameter',
  MISSING_REQUIRED_FIELD: 'errors.missingRequiredField',

  // ── Prompt audit ──────────────────────────────────────────────────────────
  prompt_audit_config_conflict: 'errors.promptAuditConfigConflict',

  // ── Accounts / channels ───────────────────────────────────────────────────
  ACCOUNT_NOT_FOUND: 'errors.accountNotFound',
  ACCOUNT_DISABLED: 'errors.accountDisabled',
  CHANNEL_NOT_FOUND: 'errors.channelNotFound',
  CHANNEL_DISABLED: 'errors.channelDisabled',

  // ── Billing ───────────────────────────────────────────────────────────────
  PAYMENT_FAILED: 'errors.paymentFailed',
  PAYMENT_PROVIDER_ERROR: 'errors.paymentProviderError',
  SUBSCRIPTION_NOT_FOUND: 'errors.subscriptionNotFound',
  INSUFFICIENT_BALANCE: 'errors.insufficientBalance',

  // ── Network ───────────────────────────────────────────────────────────────
  NETWORK_ERROR: 'errors.networkError',
  TIMEOUT: 'errors.timeout',
  SERVICE_UNAVAILABLE: 'errors.serviceUnavailable',
  INTERNAL_SERVER_ERROR: 'errors.internalServerError',
}

/**
 * Resolve an error code to its i18n key.
 * Returns undefined when code is unknown (caller should fallback to HttpError.message).
 */
export function resolveErrorKey(code: string | undefined): string | undefined {
  if (!code) return undefined
  return errorCodeToKey[code]
}
