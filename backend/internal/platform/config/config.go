// Package config provides configuration loading, defaults, and validation.
package config

import (
	"strings"
)

const (
	// RunMode is retained for internal scheduler regression fixtures. Runtime
	// loading always normalizes to the group-aware standard behavior.
	RunModeStandard = "standard"
	RunModeSimple   = "simple"

	DeploymentModeStandalone    = "standalone"
	DeploymentModeMultiInstance = "multi_instance"

	WorkerModeAuto     = "auto"
	WorkerModeEnabled  = "true"
	WorkerModeDisabled = "false"
)

// 使用量记录队列溢出策略
const (
	UsageRecordOverflowPolicyDrop   = "drop"
	UsageRecordOverflowPolicySample = "sample"
	UsageRecordOverflowPolicySync   = "sync"
)

// DefaultCSPPolicy is the default Content-Security-Policy with nonce support
// __CSP_NONCE__ will be replaced with actual nonce at request time by the SecurityHeaders middleware
const DefaultCSPPolicy = "default-src 'self'; script-src 'self' __CSP_NONCE__ https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https:; worker-src 'self' blob:; frame-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"

// UMQ（用户消息队列）模式常量
const (
	// UMQModeSerialize: 账号级串行锁 + RPM 自适应延迟
	UMQModeSerialize = "serialize"
	// UMQModeThrottle: 仅 RPM 自适应前置延迟，不阻塞并发
	UMQModeThrottle = "throttle"
)

// 连接池隔离策略常量
// 用于控制上游 HTTP 连接池的隔离粒度，影响连接复用和资源消耗
const (
	// ConnectionPoolIsolationProxy: 按代理隔离
	// 同一代理地址共享连接池，适合代理数量少、账户数量多的场景
	ConnectionPoolIsolationProxy = "proxy"
	// ConnectionPoolIsolationAccount: 按账户隔离
	// 每个账户独立连接池，适合账户数量少、需要严格隔离的场景
	ConnectionPoolIsolationAccount = "account"
	// ConnectionPoolIsolationAccountProxy: 按账户+代理组合隔离（默认）
	// 同一账户+代理组合共享连接池，提供最细粒度的隔离
	ConnectionPoolIsolationAccountProxy = "account_proxy"
)

// DefaultUpstreamResponseReadMaxBytes 上游非流式响应体的默认读取上限。
// 128 MB 可容纳 2-3 张 4K PNG（base64 膨胀 33%，单张 4K PNG 最坏约 67MB base64）。
// 可通过 gateway.upstream_response_read_max_bytes 配置项覆盖。
const DefaultUpstreamResponseReadMaxBytes int64 = 128 * 1024 * 1024

type Config struct {
	Deployment   DeploymentConfig           `mapstructure:"deployment"`
	Server       ServerConfig               `mapstructure:"server"`
	Log          LogConfig                  `mapstructure:"log"`
	CORS         CORSConfig                 `mapstructure:"cors"`
	Security     SecurityConfig             `mapstructure:"security"`
	Database     DatabaseConfig             `mapstructure:"database"`
	Redis        RedisConfig                `mapstructure:"redis"`
	Ops          OpsConfig                  `mapstructure:"ops"`
	JWT          JWTConfig                  `mapstructure:"jwt"`
	Totp         TotpConfig                 `mapstructure:"totp"`
	WebAuthn     WebAuthnConfig             `mapstructure:"webauthn"`
	Default      DefaultConfig              `mapstructure:"default"`
	RateLimit    RateLimitConfig            `mapstructure:"rate_limit"`
	Pricing      PricingConfig              `mapstructure:"pricing"`
	Gateway      GatewayConfig              `mapstructure:"gateway"`
	APIKeyAuth   APIKeyAuthCacheConfig      `mapstructure:"api_key_auth_cache"`
	DashboardAgg DashboardAggregationConfig `mapstructure:"dashboard_aggregation"`
	Concurrency  ConcurrencyConfig          `mapstructure:"concurrency"`
	TokenRefresh TokenRefreshConfig         `mapstructure:"token_refresh"`
	RunMode      string                     `mapstructure:"-" yaml:"-"`
	Timezone     string                     `mapstructure:"timezone"` // e.g. "Asia/Shanghai", "UTC"
	Gemini       GeminiConfig               `mapstructure:"gemini"`
	Update       UpdateConfig               `mapstructure:"update"`
	Idempotency  IdempotencyConfig          `mapstructure:"idempotency"`
	ImageStorage ImageStorageConfig         `mapstructure:"image_storage"`
}

// DeploymentConfig controls cluster identity and cluster-wide scheduled work.
// Every node always serves the complete API and embedded frontend. WorkerEnabled
// is tri-state: auto/true are worker candidates, while false disables only
// cluster-wide scheduled workers on this node.
type DeploymentConfig struct {
	Mode                     string `mapstructure:"mode"`
	NodeName                 string `mapstructure:"node_name"`
	WorkerEnabled            string `mapstructure:"worker_enabled"`
	HeartbeatIntervalSeconds int    `mapstructure:"heartbeat_interval_seconds"`
	StaleAfterSeconds        int    `mapstructure:"stale_after_seconds"`
	TaskLeaseSeconds         int    `mapstructure:"task_lease_seconds"`
}

func (c DeploymentConfig) IsMultiInstance() bool {
	return c.Mode == DeploymentModeMultiInstance
}

func (c DeploymentConfig) WorkerMode() string {
	mode := strings.ToLower(strings.TrimSpace(c.WorkerEnabled))
	switch mode {
	case WorkerModeEnabled, "1", "yes", "on", "enabled":
		return WorkerModeEnabled
	case WorkerModeDisabled, "0", "no", "off", "disabled":
		return WorkerModeDisabled
	default:
		return WorkerModeAuto
	}
}

// WorkerEnabledResolved reports whether this node may contend for distributed
// work. Auto deliberately enables candidacy on every node; the task lease picks
// the actual executor and preserves failover without a manually selected master.
func (c DeploymentConfig) WorkerEnabledResolved() bool {
	return c.WorkerMode() != WorkerModeDisabled
}

type LogConfig struct {
	Level           string            `mapstructure:"level"`
	Format          string            `mapstructure:"format"`
	ServiceName     string            `mapstructure:"service_name"`
	Environment     string            `mapstructure:"env"`
	Caller          bool              `mapstructure:"caller"`
	StacktraceLevel string            `mapstructure:"stacktrace_level"`
	Output          LogOutputConfig   `mapstructure:"output"`
	Rotation        LogRotationConfig `mapstructure:"rotation"`
	Sampling        LogSamplingConfig `mapstructure:"sampling"`
}

type LogOutputConfig struct {
	ToStdout bool   `mapstructure:"to_stdout"`
	ToFile   bool   `mapstructure:"to_file"`
	FilePath string `mapstructure:"file_path"`
}

type LogRotationConfig struct {
	MaxSizeMB  int  `mapstructure:"max_size_mb"`
	MaxBackups int  `mapstructure:"max_backups"`
	MaxAgeDays int  `mapstructure:"max_age_days"`
	Compress   bool `mapstructure:"compress"`
	LocalTime  bool `mapstructure:"local_time"`
}

type LogSamplingConfig struct {
	Enabled    bool `mapstructure:"enabled"`
	Initial    int  `mapstructure:"initial"`
	Thereafter int  `mapstructure:"thereafter"`
}

type GeminiConfig struct {
	OAuth GeminiOAuthConfig `mapstructure:"oauth"`
	Quota GeminiQuotaConfig `mapstructure:"quota"`
}

type GeminiOAuthConfig struct {
	ClientID     string `mapstructure:"client_id"`
	ClientSecret string `mapstructure:"client_secret"`
	Scopes       string `mapstructure:"scopes"`
}

type GeminiQuotaConfig struct {
	Tiers  map[string]GeminiTierQuotaConfig `mapstructure:"tiers"`
	Policy string                           `mapstructure:"policy"`
}

type GeminiTierQuotaConfig struct {
	ProRPD          *int64 `mapstructure:"pro_rpd" json:"pro_rpd"`
	FlashRPD        *int64 `mapstructure:"flash_rpd" json:"flash_rpd"`
	CooldownMinutes *int   `mapstructure:"cooldown_minutes" json:"cooldown_minutes"`
}

type UpdateConfig struct {
	// ProxyURL 用于访问 GitHub 的代理地址
	// 支持 http/https/socks5/socks5h 协议
	// 例如: "http://127.0.0.1:7890", "socks5://127.0.0.1:1080"
	ProxyURL string `mapstructure:"proxy_url"`
}

type IdempotencyConfig struct {
	// ObserveOnly 为 true 时处于观察期：未携带 Idempotency-Key 的请求继续放行。
	ObserveOnly bool `mapstructure:"observe_only"`
	// DefaultTTLSeconds 关键写接口的幂等记录默认 TTL（秒）。
	DefaultTTLSeconds int `mapstructure:"default_ttl_seconds"`
	// SystemOperationTTLSeconds 系统操作接口的幂等记录 TTL（秒）。
	SystemOperationTTLSeconds int `mapstructure:"system_operation_ttl_seconds"`
	// ProcessingTimeoutSeconds processing 状态锁超时（秒）。
	ProcessingTimeoutSeconds int `mapstructure:"processing_timeout_seconds"`
	// FailedRetryBackoffSeconds 失败退避窗口（秒）。
	FailedRetryBackoffSeconds int `mapstructure:"failed_retry_backoff_seconds"`
	// MaxStoredResponseLen 持久化响应体最大长度（字节）。
	MaxStoredResponseLen int `mapstructure:"max_stored_response_len"`
	// CleanupIntervalSeconds 过期记录清理周期（秒）。
	CleanupIntervalSeconds int `mapstructure:"cleanup_interval_seconds"`
	// CleanupBatchSize 每次清理的最大记录数。
	CleanupBatchSize int `mapstructure:"cleanup_batch_size"`
}

// ImageStorageConfig 配置异步图片任务结果上传的 S3 兼容对象存储。
// Enabled 同时作为异步图片任务功能的总开关：未启用或未配置完整凭证时，
// 异步生图接口整体禁用，避免把上游返回的大 base64 结果塞进 Redis。
type ImageStorageConfig struct {
	Enabled         bool   `mapstructure:"enabled"`
	Endpoint        string `mapstructure:"endpoint"` // e.g. https://<account_id>.r2.cloudflarestorage.com
	Region          string `mapstructure:"region"`   // R2 用 "auto"
	Bucket          string `mapstructure:"bucket"`
	AccessKeyID     string `mapstructure:"access_key_id"`
	SecretAccessKey string `mapstructure:"secret_access_key"`
	Prefix          string `mapstructure:"prefix"`               // S3 key 前缀，如 "images/"
	ForcePathStyle  bool   `mapstructure:"force_path_style"`     // MinIO/路径风格桶
	PublicBaseURL   string `mapstructure:"public_base_url"`      // 配了则返回 public_base_url/key 直链；否则 presigned
	PresignExpiry   int    `mapstructure:"presign_expiry_hours"` // public_base_url 为空时的 presigned 过期时长(小时)
	MaxDownloadByte int64  `mapstructure:"max_download_bytes"`   // 下载上游 url 图片的字节上限
	MaxInFlight     int    `mapstructure:"max_in_flight"`        // 单实例同时执行的异步生图任务上限
}

// IsConfigured 检查对象存储必要字段是否已配置
func (c *ImageStorageConfig) IsConfigured() bool {
	return c.Bucket != "" && c.AccessKeyID != "" && c.SecretAccessKey != ""
}

// Active 返回异步图片任务是否可用：开关打开且凭证齐全
func (c *ImageStorageConfig) Active() bool {
	return c.Enabled && c.IsConfigured()
}

// MissingCredentialKeys 返回 IsConfigured 所缺的配置键名。
// 用于启动日志：只说"凭证不完整"会让运维以为自己漏填了，而实际可能是值填了却没被读到。
func (c *ImageStorageConfig) MissingCredentialKeys() []string {
	var missing []string
	if c.Bucket == "" {
		missing = append(missing, "image_storage.bucket")
	}
	if c.AccessKeyID == "" {
		missing = append(missing, "image_storage.access_key_id")
	}
	if c.SecretAccessKey == "" {
		missing = append(missing, "image_storage.secret_access_key")
	}
	return missing
}

// TokenRefreshConfig OAuth token自动刷新配置
