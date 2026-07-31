import type { User } from '@/core/models/domain/user'

export class AuthResponse {
  accessToken!: string
  tokenType!: string
  refreshToken?: string
  expiresIn?: number
  user!: User & { run_mode?: 'standard' | 'simple' }
}
