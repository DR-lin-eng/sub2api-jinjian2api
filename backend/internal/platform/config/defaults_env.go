package config

import "github.com/spf13/viper"

// setEnvReachableDefaults registers zero-valued defaults for keys that are
// documented in deploy/config.example.yaml but had no default of their own.
//
// viper.Unmarshal only decodes the keys returned by AllKeys(), which unions
// SetDefault keys, config-file keys and explicitly bound BindEnv keys.
// AutomaticEnv can override a key already in that union, but it never adds one,
// and the viper_bind_struct escape hatch is compiled out (we build with
// -tags embed). So a key that lives only in the example file was unreachable by
// environment variable: the value was read from the process environment and
// then silently dropped. Deployments driven purely by env — which is what
// deploy/docker-compose.yml does — got the zero value with no warning.
//
// The values below are deliberately zero rather than the documented example
// values: an absent key already unmarshalled to the zero value, so registering
// zero keeps behavior identical while making the key addressable from the
// environment. Any subsystem that wants a richer default still applies it after
// unmarshal, exactly as before.
func setEnvReachableDefaults() {
	viper.SetDefault("gateway.forced_codex_instructions_template_file", "")
	viper.SetDefault("gateway.session_idle_timeout_minutes", 0)
	viper.SetDefault("gateway.user_message_queue.mode", "")
	viper.SetDefault("update.proxy_url", "")

	// sticky_escape_enabled is the one exception to the zero-value rule: its
	// effective default is true, applied post-unmarshal via a viper.IsSet guard.
	// Registering false would make IsSet always report true and permanently
	// disable sticky escape, so register the effective default instead. An
	// explicit false in config or env still wins.
	viper.SetDefault("gateway.openai_scheduler.sticky_escape_enabled", true)
	viper.SetDefault("gateway.openai_scheduler.sticky_escape_error_rate", 0.0)
	viper.SetDefault("gateway.openai_scheduler.sticky_escape_ttft_ms", 0)

	// server.trusted_proxies is parsed explicitly from its comma-separated
	// environment variable, and binding records that reachability for the guard.
	_ = viper.BindEnv("server.trusted_proxies", "SERVER_TRUSTED_PROXIES")

}
