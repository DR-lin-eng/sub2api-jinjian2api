import type { CredentialEnvelope } from '@/types'

export interface EncryptedRegisterRequest {
  credential_envelope: CredentialEnvelope
  verify_code?: string
  turnstile_token?: string
  captcha_token?: string
  captcha_id?: string
  captcha_code?: string
  promo_code?: string
  invitation_code?: string
  aff_code?: string
}
