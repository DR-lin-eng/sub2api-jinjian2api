import type { TestDatabaseRequest } from './testDatabaseRequest'
import type { TestRedisRequest } from './testRedisRequest'

export interface AdminConfigRequest {
  email: string
  password: string
}

export interface ServerConfigRequest {
  host: string
  port: number
  mode: string
}

export interface InstallRequest {
  database: TestDatabaseRequest
  redis: TestRedisRequest
  admin: AdminConfigRequest
  server: ServerConfigRequest
}
