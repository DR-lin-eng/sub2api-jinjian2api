import type { User } from '@/core/models/domain/user'

export class AuthResult {
  accessToken!: string
  tokenType!: string
  user!: User
  runMode!: 'standard' | 'simple'
  refreshToken!: string
  expiresIn!: number
}
