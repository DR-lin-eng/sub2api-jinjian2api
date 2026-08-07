/**
 * Core Type Definitions for Sub2API Frontend
 */

// ==================== Common Types ====================

export interface SelectOption {
  value: string | number | boolean | null
  label: string
  [key: string]: any // Support extra properties for custom templates
}

export interface BasePaginationResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  pages: number
}

export interface FetchOptions {
  signal?: AbortSignal
}

// ==================== Notification Types ====================

/** Administrator notification email entry. */
export interface NotifyEmailEntry {
  email: string
  disabled: boolean
  verified: boolean
}

// ==================== User & Auth Types ====================

export interface User {
	id: number
	username: string
	email: string
	avatar_url?: string | null
	role: 'admin'
	status: 'active' | 'disabled' // Account status
	last_active_at?: string | null
	created_at: string
	updated_at: string
}

export type RequestSchedulingTier = 0 | 1 | 2

export interface LoginRequest {
	email: string
	password: string
}

export interface CredentialEnvelope {
  algorithm: 'RSA-OAEP-256+A256GCM'
  key_id: string
  encrypted_key: string
  iv: string
  ciphertext: string
}

export interface CustomEndpoint {
  name: string
  endpoint: string
  description: string
}

export interface PublicSettings {
	totp_enabled: boolean
	passkey_enabled: boolean
	site_name: string
	site_logo: string
  api_base_url: string
  doc_url: string
	hide_ccs_import_button: boolean
	table_default_page_size: number
  table_page_size_options: number[]
  custom_endpoints: CustomEndpoint[]
	version: string
  // 服务器全局时区（IANA 名称与当前 UTC 偏移），高峰时段等服务端本地时间窗口的展示标注用；
  // 可选：注入的 __APP_CONFIG__ 旧缓存可能缺失
  server_timezone?: string
  server_utc_offset?: string
	channel_monitor_enabled: boolean
	channel_monitor_default_interval_seconds: number
}

export interface AuthResponse {
  access_token: string
  refresh_token?: string  // New: Refresh Token for token renewal
  expires_in?: number     // New: Access Token expiry time in seconds
  token_type: string
  user: User
}

export type CurrentUserResponse = User

// ==================== API Response Types ====================

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface ApiError {
  detail: string
  code?: string
  field?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  pages: number
}

// ==================== UI State Types ====================

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  message: string
  title?: string
  duration?: number // in milliseconds, undefined means no auto-dismiss
  startTime?: number // timestamp when toast was created, for progress bar
}

export interface AppState {
  sidebarCollapsed: boolean
  loading: boolean
  toasts: Toast[]
}

// ==================== Validation Types ====================

export interface ValidationError {
  field: string
  message: string
}

// ==================== Table/List Types ====================

export interface SortConfig {
  key: string
  order: 'asc' | 'desc'
}

export interface FilterConfig {
  [key: string]: string | number | boolean | null | undefined
}

export interface PaginationConfig {
  page: number
  page_size: number
}

// ==================== API Key & Group Types ====================
