package config

import "github.com/spf13/viper"

func setIdentityDefaults() {
	// WebAuthn / Passkeys are opt-in because the relying-party boundary must
	// be configured explicitly for each deployment.
	viper.SetDefault("webauthn.enabled", false)
	viper.SetDefault("webauthn.rp_display_name", "Sub2API")
	viper.SetDefault("webauthn.rp_id", "")
	viper.SetDefault("webauthn.rp_origins", []string{})
}
