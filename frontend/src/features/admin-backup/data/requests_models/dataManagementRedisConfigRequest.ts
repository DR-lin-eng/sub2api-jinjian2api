export interface DataManagementRedisConfigRequest {
  addr: string
  username: string
  password?: string
  password_configured?: boolean
  db: number
  container_name: string
}
