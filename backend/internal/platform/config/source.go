package config

import (
	"log/slog"
	"os"
	"strings"
)

const (
	configFileEnv       = "SUB2API_CONFIG_FILE"
	legacyConfigFileEnv = "CONFIG_FILE"
)

// configureConfigSource keeps full configuration loading and the lightweight
// setup address lookup on the same source precedence.
func configureConfigSource(setConfigFile, addConfigPath func(string)) {
	if configFile := strings.TrimSpace(os.Getenv(configFileEnv)); configFile != "" {
		if legacy := strings.TrimSpace(os.Getenv(legacyConfigFileEnv)); legacy != "" {
			slog.Warn("CONFIG_FILE is deprecated and ignored because SUB2API_CONFIG_FILE is set",
				"config_file", legacy,
				"sub2api_config_file", configFile,
			)
		}
		setConfigFile(configFile)
		return
	}

	if configFile := strings.TrimSpace(os.Getenv(legacyConfigFileEnv)); configFile != "" {
		slog.Warn("CONFIG_FILE is deprecated; use SUB2API_CONFIG_FILE instead",
			"config_file", configFile,
		)
		setConfigFile(configFile)
		return
	}

	if dataDir := strings.TrimSpace(os.Getenv("DATA_DIR")); dataDir != "" {
		addConfigPath(dataDir)
	}
	addConfigPath("/app/data")
	addConfigPath(".")
	addConfigPath("./config")
	addConfigPath("/etc/sub2api")
}
