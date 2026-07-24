export interface LoginRequest {
  email: string
  password: string
  turnstile_token?: string
  captcha_token?: string
  captcha_id?: string
  captcha_code?: string
}
