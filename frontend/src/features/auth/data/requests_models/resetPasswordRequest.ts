export interface ResetPasswordRequest {
  email: string
  token: string
  new_password: string
}
