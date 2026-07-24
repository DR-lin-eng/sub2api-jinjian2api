export interface UpdateAdminUserRequest {
  email?: string
  password?: string
  username?: string
  notes?: string
  role?: 'admin' | 'user'
  balance?: number
  concurrency?: number
  rpm_limit?: number
  status?: 'active' | 'disabled'
  allowed_groups?: number[] | null
  group_rates?: Record<number, number | null>
}
