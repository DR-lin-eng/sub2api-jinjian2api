export interface SendVerifyCodeRequest {
  email: string
  turnstile_token?: string
  captcha_token?: string
  captcha_id?: string
  captcha_code?: string
  pending_auth_token?: string
  pending_oauth_token?: string
}
