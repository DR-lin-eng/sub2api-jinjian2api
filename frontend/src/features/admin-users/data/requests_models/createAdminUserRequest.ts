export interface CreateAdminUserRequest {
  email: string
  password: string
  username?: string
  notes?: string
  role?: 'admin' | 'user'
  balance?: number
  concurrency?: number
  rpm_limit?: number
  allowed_groups?: number[] | null
}
