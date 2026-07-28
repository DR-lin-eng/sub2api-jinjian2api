package config

import (
	"fmt"
	"strings"
)

func validateLinuxDoConnect(c *Config) error {
	if c.LinuxDo.Enabled {
		if strings.TrimSpace(c.LinuxDo.ClientID) == "" {
			return fmt.Errorf("linuxdo_connect.client_id is required when linuxdo_connect.enabled=true")
		}
		if strings.TrimSpace(c.LinuxDo.AuthorizeURL) == "" {
			return fmt.Errorf("linuxdo_connect.authorize_url is required when linuxdo_connect.enabled=true")
		}
		if strings.TrimSpace(c.LinuxDo.TokenURL) == "" {
			return fmt.Errorf("linuxdo_connect.token_url is required when linuxdo_connect.enabled=true")
		}
		if strings.TrimSpace(c.LinuxDo.UserInfoURL) == "" {
			return fmt.Errorf("linuxdo_connect.userinfo_url is required when linuxdo_connect.enabled=true")
		}
		if strings.TrimSpace(c.LinuxDo.RedirectURL) == "" {
			return fmt.Errorf("linuxdo_connect.redirect_url is required when linuxdo_connect.enabled=true")
		}
		method := strings.ToLower(strings.TrimSpace(c.LinuxDo.TokenAuthMethod))
		switch method {
		case "", "client_secret_post", "client_secret_basic", "none":
		default:
			return fmt.Errorf("linuxdo_connect.token_auth_method must be one of: client_secret_post/client_secret_basic/none")
		}
		if (method == "" || method == "client_secret_post" || method == "client_secret_basic") &&
			strings.TrimSpace(c.LinuxDo.ClientSecret) == "" {
			return fmt.Errorf("linuxdo_connect.client_secret is required when linuxdo_connect.enabled=true and token_auth_method is client_secret_post/client_secret_basic")
		}
		if strings.TrimSpace(c.LinuxDo.FrontendRedirectURL) == "" {
			return fmt.Errorf("linuxdo_connect.frontend_redirect_url is required when linuxdo_connect.enabled=true")
		}

		if err := ValidateAbsoluteHTTPURL(c.LinuxDo.AuthorizeURL); err != nil {
			return fmt.Errorf("linuxdo_connect.authorize_url invalid: %w", err)
		}
		if err := ValidateAbsoluteHTTPURL(c.LinuxDo.TokenURL); err != nil {
			return fmt.Errorf("linuxdo_connect.token_url invalid: %w", err)
		}
		if err := ValidateAbsoluteHTTPURL(c.LinuxDo.UserInfoURL); err != nil {
			return fmt.Errorf("linuxdo_connect.userinfo_url invalid: %w", err)
		}
		if err := ValidateAbsoluteHTTPURL(c.LinuxDo.RedirectURL); err != nil {
			return fmt.Errorf("linuxdo_connect.redirect_url invalid: %w", err)
		}
		if err := ValidateFrontendRedirectURL(c.LinuxDo.FrontendRedirectURL); err != nil {
			return fmt.Errorf("linuxdo_connect.frontend_redirect_url invalid: %w", err)
		}

		warnIfInsecureURL("linuxdo_connect.authorize_url", c.LinuxDo.AuthorizeURL)
		warnIfInsecureURL("linuxdo_connect.token_url", c.LinuxDo.TokenURL)
		warnIfInsecureURL("linuxdo_connect.userinfo_url", c.LinuxDo.UserInfoURL)
		warnIfInsecureURL("linuxdo_connect.redirect_url", c.LinuxDo.RedirectURL)
		warnIfInsecureURL("linuxdo_connect.frontend_redirect_url", c.LinuxDo.FrontendRedirectURL)
	}
	return nil
}

func validateWeChatConnect(c *Config) error {
	if c.WeChat.Enabled {
		weChat := c.WeChat
		normalizeWeChatConnectConfig(&weChat)

		if weChat.OpenEnabled {
			if strings.TrimSpace(weChat.OpenAppID) == "" {
				return fmt.Errorf("wechat_connect.open_app_id is required when wechat_connect.open_enabled=true")
			}
			if strings.TrimSpace(weChat.OpenAppSecret) == "" {
				return fmt.Errorf("wechat_connect.open_app_secret is required when wechat_connect.open_enabled=true")
			}
		}
		if weChat.MPEnabled {
			if strings.TrimSpace(weChat.MPAppID) == "" {
				return fmt.Errorf("wechat_connect.mp_app_id is required when wechat_connect.mp_enabled=true")
			}
			if strings.TrimSpace(weChat.MPAppSecret) == "" {
				return fmt.Errorf("wechat_connect.mp_app_secret is required when wechat_connect.mp_enabled=true")
			}
		}
		if weChat.MobileEnabled {
			if strings.TrimSpace(weChat.MobileAppID) == "" {
				return fmt.Errorf("wechat_connect.mobile_app_id is required when wechat_connect.mobile_enabled=true")
			}
			if strings.TrimSpace(weChat.MobileAppSecret) == "" {
				return fmt.Errorf("wechat_connect.mobile_app_secret is required when wechat_connect.mobile_enabled=true")
			}
		}
		if v := strings.TrimSpace(weChat.RedirectURL); v != "" {
			if err := ValidateAbsoluteHTTPURL(v); err != nil {
				return fmt.Errorf("wechat_connect.redirect_url invalid: %w", err)
			}
			warnIfInsecureURL("wechat_connect.redirect_url", v)
		}
		if err := ValidateFrontendRedirectURL(weChat.FrontendRedirectURL); err != nil {
			return fmt.Errorf("wechat_connect.frontend_redirect_url invalid: %w", err)
		}
		warnIfInsecureURL("wechat_connect.frontend_redirect_url", weChat.FrontendRedirectURL)
	}
	return nil
}

func validateOIDCConnect(c *Config) error {
	if c.OIDC.Enabled {
		if strings.TrimSpace(c.OIDC.ClientID) == "" {
			return fmt.Errorf("oidc_connect.client_id is required when oidc_connect.enabled=true")
		}
		if strings.TrimSpace(c.OIDC.IssuerURL) == "" {
			return fmt.Errorf("oidc_connect.issuer_url is required when oidc_connect.enabled=true")
		}
		if strings.TrimSpace(c.OIDC.RedirectURL) == "" {
			return fmt.Errorf("oidc_connect.redirect_url is required when oidc_connect.enabled=true")
		}
		if strings.TrimSpace(c.OIDC.FrontendRedirectURL) == "" {
			return fmt.Errorf("oidc_connect.frontend_redirect_url is required when oidc_connect.enabled=true")
		}
		if !scopeContainsOpenID(c.OIDC.Scopes) {
			return fmt.Errorf("oidc_connect.scopes must contain openid")
		}

		method := strings.ToLower(strings.TrimSpace(c.OIDC.TokenAuthMethod))
		switch method {
		case "", "client_secret_post", "client_secret_basic", "none":
		default:
			return fmt.Errorf("oidc_connect.token_auth_method must be one of: client_secret_post/client_secret_basic/none")
		}
		if (method == "" || method == "client_secret_post" || method == "client_secret_basic") &&
			strings.TrimSpace(c.OIDC.ClientSecret) == "" {
			return fmt.Errorf("oidc_connect.client_secret is required when oidc_connect.enabled=true and token_auth_method is client_secret_post/client_secret_basic")
		}
		if c.OIDC.ClockSkewSeconds < 0 || c.OIDC.ClockSkewSeconds > 600 {
			return fmt.Errorf("oidc_connect.clock_skew_seconds must be between 0 and 600")
		}
		if c.OIDC.ValidateIDToken && strings.TrimSpace(c.OIDC.AllowedSigningAlgs) == "" {
			return fmt.Errorf("oidc_connect.allowed_signing_algs is required when oidc_connect.validate_id_token=true")
		}

		if err := ValidateAbsoluteHTTPURL(c.OIDC.IssuerURL); err != nil {
			return fmt.Errorf("oidc_connect.issuer_url invalid: %w", err)
		}
		if v := strings.TrimSpace(c.OIDC.DiscoveryURL); v != "" {
			if err := ValidateAbsoluteHTTPURL(v); err != nil {
				return fmt.Errorf("oidc_connect.discovery_url invalid: %w", err)
			}
		}
		if v := strings.TrimSpace(c.OIDC.AuthorizeURL); v != "" {
			if err := ValidateAbsoluteHTTPURL(v); err != nil {
				return fmt.Errorf("oidc_connect.authorize_url invalid: %w", err)
			}
		}
		if v := strings.TrimSpace(c.OIDC.TokenURL); v != "" {
			if err := ValidateAbsoluteHTTPURL(v); err != nil {
				return fmt.Errorf("oidc_connect.token_url invalid: %w", err)
			}
		}
		if v := strings.TrimSpace(c.OIDC.UserInfoURL); v != "" {
			if err := ValidateAbsoluteHTTPURL(v); err != nil {
				return fmt.Errorf("oidc_connect.userinfo_url invalid: %w", err)
			}
		}
		if v := strings.TrimSpace(c.OIDC.JWKSURL); v != "" {
			if err := ValidateAbsoluteHTTPURL(v); err != nil {
				return fmt.Errorf("oidc_connect.jwks_url invalid: %w", err)
			}
		}
		if err := ValidateAbsoluteHTTPURL(c.OIDC.RedirectURL); err != nil {
			return fmt.Errorf("oidc_connect.redirect_url invalid: %w", err)
		}
		if err := ValidateFrontendRedirectURL(c.OIDC.FrontendRedirectURL); err != nil {
			return fmt.Errorf("oidc_connect.frontend_redirect_url invalid: %w", err)
		}

		warnIfInsecureURL("oidc_connect.issuer_url", c.OIDC.IssuerURL)
		warnIfInsecureURL("oidc_connect.discovery_url", c.OIDC.DiscoveryURL)
		warnIfInsecureURL("oidc_connect.authorize_url", c.OIDC.AuthorizeURL)
		warnIfInsecureURL("oidc_connect.token_url", c.OIDC.TokenURL)
		warnIfInsecureURL("oidc_connect.userinfo_url", c.OIDC.UserInfoURL)
		warnIfInsecureURL("oidc_connect.jwks_url", c.OIDC.JWKSURL)
		warnIfInsecureURL("oidc_connect.redirect_url", c.OIDC.RedirectURL)
		warnIfInsecureURL("oidc_connect.frontend_redirect_url", c.OIDC.FrontendRedirectURL)
	}
	return nil
}
