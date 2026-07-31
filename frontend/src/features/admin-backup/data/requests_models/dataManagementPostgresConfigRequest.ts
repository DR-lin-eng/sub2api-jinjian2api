export interface DataManagementPostgresConfigRequest {
  host: string
  port: number
  user: string
  password?: string
  password_configured?: boolean
  database: string
  ssl_mode: string
  container_name: string
}
