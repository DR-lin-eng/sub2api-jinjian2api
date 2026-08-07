package config

import (
	"fmt"
	"time"
)

func (s *ServerConfig) Address() string {
	return fmt.Sprintf("%s:%d", s.Host, s.Port)
}

// DatabaseConfig 数据库连接配置
// 性能优化：新增连接池参数，避免频繁创建/销毁连接
type DatabaseConfig struct {
	Host     string `mapstructure:"host"`
	Port     int    `mapstructure:"port"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
	DBName   string `mapstructure:"dbname"`
	SSLMode  string `mapstructure:"sslmode"`
	// 连接池配置（性能优化：可配置化连接池参数）
	// MaxOpenConns: 最大打开连接数，控制数据库连接上限，防止资源耗尽
	MaxOpenConns int `mapstructure:"max_open_conns"`
	// MaxIdleConns: 最大空闲连接数，保持热连接减少建连延迟
	MaxIdleConns int `mapstructure:"max_idle_conns"`
	// ConnMaxLifetimeMinutes: 连接最大存活时间，防止长连接导致的资源泄漏
	ConnMaxLifetimeMinutes int `mapstructure:"conn_max_lifetime_minutes"`
	// ConnMaxIdleTimeMinutes: 空闲连接最大存活时间，及时释放不活跃连接
	ConnMaxIdleTimeMinutes int `mapstructure:"conn_max_idle_time_minutes"`
}

func (d *DatabaseConfig) DSN() string {
	// 当密码为空时不包含 password 参数，避免 libpq 解析错误
	if d.Password == "" {
		return fmt.Sprintf(
			"host=%s port=%d user=%s dbname=%s sslmode=%s",
			d.Host, d.Port, d.User, d.DBName, d.SSLMode,
		)
	}
	return fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		d.Host, d.Port, d.User, d.Password, d.DBName, d.SSLMode,
	)
}

// DSNWithTimezone returns DSN with timezone setting
func (d *DatabaseConfig) DSNWithTimezone(tz string) string {
	if tz == "" {
		tz = "Asia/Shanghai"
	}
	// 当密码为空时不包含 password 参数，避免 libpq 解析错误
	if d.Password == "" {
		return fmt.Sprintf(
			"host=%s port=%d user=%s dbname=%s sslmode=%s TimeZone=%s",
			d.Host, d.Port, d.User, d.DBName, d.SSLMode, tz,
		)
	}
	return fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s TimeZone=%s",
		d.Host, d.Port, d.User, d.Password, d.DBName, d.SSLMode, tz,
	)
}

// RedisConfig Redis 连接配置
// 性能优化：新增连接池和超时参数，提升高并发场景下的吞吐量
type RedisConfig struct {
	Host     string `mapstructure:"host"`
	Port     int    `mapstructure:"port"`
	Username string `mapstructure:"username"`
	Password string `mapstructure:"password"`
	DB       int    `mapstructure:"db"`
	// 连接池与超时配置（性能优化：可配置化连接池参数）
	// DialTimeoutSeconds: 建立连接超时，防止慢连接阻塞
	DialTimeoutSeconds int `mapstructure:"dial_timeout_seconds"`
	// ReadTimeoutSeconds: 读取超时，避免慢查询阻塞连接池
	ReadTimeoutSeconds int `mapstructure:"read_timeout_seconds"`
	// WriteTimeoutSeconds: 写入超时，避免慢写入阻塞连接池
	WriteTimeoutSeconds int `mapstructure:"write_timeout_seconds"`
	// PoolSize: 连接池大小，控制最大并发连接数
	PoolSize int `mapstructure:"pool_size"`
	// MinIdleConns: 最小空闲连接数，保持热连接减少冷启动延迟
	MinIdleConns int `mapstructure:"min_idle_conns"`
	// MaxIdleConns: 最大空闲连接数，峰值流量结束后及时释放多余连接；0 表示不限制
	MaxIdleConns int `mapstructure:"max_idle_conns"`
	// EnableTLS: 是否启用 TLS/SSL 连接
	EnableTLS bool `mapstructure:"enable_tls"`
}

func (r *RedisConfig) Address() string {
	return fmt.Sprintf("%s:%d", r.Host, r.Port)
}

type OpsConfig struct {
	// Enabled controls whether ops features should run.
	//
	// NOTE: vNext still has a DB-backed feature flag (ops_monitoring_enabled) for runtime on/off.
	// This config flag is the "hard switch" for deployments that want to disable ops completely.
	Enabled bool `mapstructure:"enabled"`

	// UsePreaggregatedTables prefers ops_metrics_hourly/daily for long-window dashboard queries.
	UsePreaggregatedTables bool `mapstructure:"use_preaggregated_tables"`

	// Cleanup controls periodic deletion of old ops data to prevent unbounded growth.
	Cleanup OpsCleanupConfig `mapstructure:"cleanup"`

	// MetricsCollectorCache controls Redis caching for expensive per-window collector queries.
	MetricsCollectorCache OpsMetricsCollectorCacheConfig `mapstructure:"metrics_collector_cache"`

	// Pre-aggregation configuration.
	Aggregation OpsAggregationConfig `mapstructure:"aggregation"`
}

type OpsCleanupConfig struct {
	Enabled  bool   `mapstructure:"enabled"`
	Schedule string `mapstructure:"schedule"`

	// Retention days (0 disables that cleanup target).
	//
	// vNext requirement: default 30 days across ops datasets.
	ErrorLogRetentionDays      int `mapstructure:"error_log_retention_days"`
	MinuteMetricsRetentionDays int `mapstructure:"minute_metrics_retention_days"`
	HourlyMetricsRetentionDays int `mapstructure:"hourly_metrics_retention_days"`
}

type OpsAggregationConfig struct {
	Enabled bool `mapstructure:"enabled"`
}

type OpsMetricsCollectorCacheConfig struct {
	Enabled bool          `mapstructure:"enabled"`
	TTL     time.Duration `mapstructure:"ttl"`
}

type JWTConfig struct {
	Secret     string `mapstructure:"secret"`
	ExpireHour int    `mapstructure:"expire_hour"`
	// AccessTokenExpireMinutes: Access Token有效期（分钟）
	// - >0: 使用分钟配置（优先级高于 ExpireHour）
	// - =0: 回退使用 ExpireHour（向后兼容旧配置）
	AccessTokenExpireMinutes int `mapstructure:"access_token_expire_minutes"`
	// RefreshTokenExpireDays: Refresh Token有效期（天），默认30天，浏览器会话有效下限7天
	RefreshTokenExpireDays int `mapstructure:"refresh_token_expire_days"`
	// RefreshWindowMinutes: 刷新窗口（分钟），在Access Token过期前多久开始允许刷新
	RefreshWindowMinutes int `mapstructure:"refresh_window_minutes"`
}

// TotpConfig TOTP 双因素认证配置
type TotpConfig struct {
	// EncryptionKey 用于加密 TOTP 密钥的 AES-256 密钥（32 字节 hex 编码）
	// 如果为空，启动阶段会生成候选值，并由数据库中的系统密钥记录完成跨实例仲裁。
	EncryptionKey string `mapstructure:"encryption_key"`
	// EncryptionKeyConfigured 标记密钥是否已通过显式配置或数据库持久化稳定下来。
	// 只有跨重启/跨实例稳定的密钥才允许在管理后台启用 TOTP 功能。
	EncryptionKeyConfigured bool `mapstructure:"-"`
}

// DefaultConfig contains gateway-wide defaults that are not tied to a user.
type DefaultConfig struct {
	APIKeyPrefix   string  `mapstructure:"api_key_prefix"`
	RateMultiplier float64 `mapstructure:"rate_multiplier"`
}

type RateLimitConfig struct {
	OverloadCooldownMinutes int `mapstructure:"overload_cooldown_minutes"`  // 529过载冷却时间(分钟)
	OAuth401CooldownMinutes int `mapstructure:"oauth_401_cooldown_minutes"` // OAuth 401临时不可调度冷却(分钟)
}

// APIKeyAuthCacheConfig API Key 认证缓存配置
type APIKeyAuthCacheConfig struct {
	L1Size             int                    `mapstructure:"l1_size"`
	L1TTLSeconds       int                    `mapstructure:"l1_ttl_seconds"`
	L2TTLSeconds       int                    `mapstructure:"l2_ttl_seconds"`
	NegativeTTLSeconds int                    `mapstructure:"negative_ttl_seconds"`
	JitterPercent      int                    `mapstructure:"jitter_percent"`
	Singleflight       bool                   `mapstructure:"singleflight"`
	LookupConcurrency  int                    `mapstructure:"lookup_concurrency"`
	InvalidAbuse       InvalidAuthAbuseConfig `mapstructure:"invalid_abuse"`
}

type InvalidAuthAbuseConfig struct {
	Enabled       bool `mapstructure:"enabled"`
	Threshold     int  `mapstructure:"threshold"`
	WindowSeconds int  `mapstructure:"window_seconds"`
	BlockSeconds  int  `mapstructure:"block_seconds"`
	Capacity      int  `mapstructure:"capacity"`
}

// DashboardAggregationConfig 仪表盘预聚合配置
type DashboardAggregationConfig struct {
	// Enabled: 是否启用预聚合作业
	Enabled bool `mapstructure:"enabled"`
	// IntervalSeconds: 聚合刷新间隔（秒）
	IntervalSeconds int `mapstructure:"interval_seconds"`
	// LookbackSeconds: 回看窗口（秒）
	LookbackSeconds int `mapstructure:"lookback_seconds"`
	// BackfillEnabled: 是否允许全量回填
	BackfillEnabled bool `mapstructure:"backfill_enabled"`
	// BackfillMaxDays: 回填最大跨度（天）
	BackfillMaxDays int `mapstructure:"backfill_max_days"`
	// Retention: 各表保留窗口（天）
	Retention DashboardAggregationRetentionConfig `mapstructure:"retention"`
	// RecomputeDays: 启动时重算最近 N 天
	RecomputeDays int `mapstructure:"recompute_days"`
}

// DashboardAggregationRetentionConfig 预聚合保留窗口
type DashboardAggregationRetentionConfig struct {
	UsageLogsDays int `mapstructure:"usage_logs_days"`
	HourlyDays    int `mapstructure:"hourly_days"`
	DailyDays     int `mapstructure:"daily_days"`
}
