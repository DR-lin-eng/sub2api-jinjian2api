package config

import "github.com/spf13/viper"

func setStorageDefaults() {
	// Database
	viper.SetDefault("database.host", "localhost")
	viper.SetDefault("database.port", 5432)
	viper.SetDefault("database.user", "postgres")
	viper.SetDefault("database.password", "postgres")
	viper.SetDefault("database.dbname", "sub2api")
	viper.SetDefault("database.sslmode", "prefer")
	viper.SetDefault("database.max_open_conns", 256)
	viper.SetDefault("database.max_idle_conns", 128)
	viper.SetDefault("database.conn_max_lifetime_minutes", 30)
	viper.SetDefault("database.conn_max_idle_time_minutes", 5)

	// Redis
	viper.SetDefault("redis.host", "localhost")
	viper.SetDefault("redis.port", 6379)
	viper.SetDefault("redis.username", "")
	viper.SetDefault("redis.password", "")
	viper.SetDefault("redis.db", 0)
	viper.SetDefault("redis.dial_timeout_seconds", 5)
	viper.SetDefault("redis.read_timeout_seconds", 3)
	viper.SetDefault("redis.write_timeout_seconds", 3)
	viper.SetDefault("redis.pool_size", 1024)
	viper.SetDefault("redis.min_idle_conns", 128)
	viper.SetDefault("redis.max_idle_conns", 0)
	viper.SetDefault("redis.enable_tls", false)

	// Image storage (async image task result offload to S3-compatible object storage)
	viper.SetDefault("image_storage.enabled", false)
	viper.SetDefault("image_storage.region", "auto")
	viper.SetDefault("image_storage.prefix", "images/")
	viper.SetDefault("image_storage.force_path_style", false)
	viper.SetDefault("image_storage.presign_expiry_hours", 24)
	viper.SetDefault("image_storage.max_download_bytes", 33554432)
	viper.SetDefault("image_storage.max_in_flight", 8)
	// Registered with empty defaults so AutomaticEnv can reach them: viper only
	// decodes keys present in AllKeys(), so a credential that is supplied purely
	// via IMAGE_STORAGE_* and never appears in config.yaml would be dropped and
	// silently disable the whole async image feature.
	viper.SetDefault("image_storage.endpoint", "")
	viper.SetDefault("image_storage.bucket", "")
	viper.SetDefault("image_storage.access_key_id", "")
	viper.SetDefault("image_storage.secret_access_key", "")
	viper.SetDefault("image_storage.public_base_url", "")
}
