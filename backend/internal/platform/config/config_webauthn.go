package config

import (
	"fmt"
	"net/url"
	"strings"
)

// WebAuthnConfig configures this deployment as a WebAuthn relying party.
// RPID and RPOrigins are security boundaries and must not be inferred from
// request Host or Origin headers.
type WebAuthnConfig struct {
	Enabled       bool     `mapstructure:"enabled"`
	RPDisplayName string   `mapstructure:"rp_display_name"`
	RPID          string   `mapstructure:"rp_id"`
	RPOrigins     []string `mapstructure:"rp_origins"`
}

func validateWebAuthn(c *Config) error {
	if c == nil || !c.WebAuthn.Enabled {
		return nil
	}

	c.WebAuthn.RPDisplayName = strings.TrimSpace(c.WebAuthn.RPDisplayName)
	c.WebAuthn.RPID = strings.ToLower(strings.TrimSpace(c.WebAuthn.RPID))
	c.WebAuthn.RPOrigins = normalizeStringSlice(c.WebAuthn.RPOrigins)
	if c.WebAuthn.RPDisplayName == "" {
		return fmt.Errorf("webauthn.rp_display_name is required when passkeys are enabled")
	}
	if c.WebAuthn.RPID == "" {
		return fmt.Errorf("webauthn.rp_id is required when passkeys are enabled")
	}
	if strings.Contains(c.WebAuthn.RPID, "://") || strings.ContainsAny(c.WebAuthn.RPID, "/:") {
		return fmt.Errorf("webauthn.rp_id must be a domain without scheme, port, or path")
	}
	if len(c.WebAuthn.RPOrigins) == 0 {
		return fmt.Errorf("webauthn.rp_origins must contain at least one origin when passkeys are enabled")
	}

	for i, origin := range c.WebAuthn.RPOrigins {
		u, err := url.Parse(origin)
		if err != nil || u.Scheme == "" || u.Host == "" {
			return fmt.Errorf("webauthn.rp_origins contains invalid origin %q", origin)
		}
		if u.User != nil || u.RawQuery != "" || u.Fragment != "" || u.Path != "" {
			return fmt.Errorf("webauthn.rp_origins entry %q must not include userinfo, path, query, or fragment", origin)
		}
		u.Scheme = strings.ToLower(u.Scheme)
		u.Host = strings.ToLower(u.Host)
		host := strings.ToLower(u.Hostname())
		localDevelopment := host == "localhost" || host == "127.0.0.1" || host == "::1"
		if u.Scheme != "https" && (u.Scheme != "http" || !localDevelopment) {
			return fmt.Errorf("webauthn.rp_origins entry %q must use HTTPS (HTTP is allowed only for localhost)", origin)
		}
		if host != c.WebAuthn.RPID && !strings.HasSuffix(host, "."+c.WebAuthn.RPID) {
			return fmt.Errorf("webauthn.rp_origins entry %q is not within relying party ID %q", origin, c.WebAuthn.RPID)
		}
		c.WebAuthn.RPOrigins[i] = u.Scheme + "://" + u.Host
	}
	return nil
}
