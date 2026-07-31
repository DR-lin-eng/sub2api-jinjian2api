export interface TestRedisRequest {
  host: string
  port: number
  password: string
  db: number
  enable_tls: boolean
}
