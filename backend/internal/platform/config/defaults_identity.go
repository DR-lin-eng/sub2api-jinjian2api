package config

import "github.com/spf13/viper"

func setIdentityDefaults() {
	// Turnstile
	viper.SetDefault("turnstile.required", false)

	// LinuxDo Connect OAuth 登录
	viper.SetDefault("linuxdo_connect.enabled", false)
	viper.SetDefault("linuxdo_connect.client_id", "")
	viper.SetDefault("linuxdo_connect.client_secret", "")
	viper.SetDefault("linuxdo_connect.authorize_url", "https://connect.linux.do/oauth2/authorize")
	viper.SetDefault("linuxdo_connect.token_url", "https://connect.linux.do/oauth2/token")
	viper.SetDefault("linuxdo_connect.userinfo_url", "https://connect.linux.do/api/user")
	viper.SetDefault("linuxdo_connect.scopes", "user")
	viper.SetDefault("linuxdo_connect.redirect_url", "")
	viper.SetDefault("linuxdo_connect.frontend_redirect_url", "/auth/linuxdo/callback")
	viper.SetDefault("linuxdo_connect.token_auth_method", "client_secret_post")
	viper.SetDefault("linuxdo_connect.use_pkce", false)
	viper.SetDefault("linuxdo_connect.userinfo_email_path", "")
	viper.SetDefault("linuxdo_connect.userinfo_id_path", "")
	viper.SetDefault("linuxdo_connect.userinfo_username_path", "")

	// WeChat Connect OAuth 登录
	viper.SetDefault("wechat_connect.enabled", false)
	viper.SetDefault("wechat_connect.app_id", "")
	viper.SetDefault("wechat_connect.app_secret", "")
	viper.SetDefault("wechat_connect.open_app_id", "")
	viper.SetDefault("wechat_connect.open_app_secret", "")
	viper.SetDefault("wechat_connect.mp_app_id", "")
	viper.SetDefault("wechat_connect.mp_app_secret", "")
	viper.SetDefault("wechat_connect.mobile_app_id", "")
	viper.SetDefault("wechat_connect.mobile_app_secret", "")
	viper.SetDefault("wechat_connect.open_enabled", false)
	viper.SetDefault("wechat_connect.mp_enabled", false)
	viper.SetDefault("wechat_connect.mobile_enabled", false)
	viper.SetDefault("wechat_connect.mode", defaultWeChatConnectMode)
	viper.SetDefault("wechat_connect.scopes", defaultWeChatConnectScopes)
	viper.SetDefault("wechat_connect.redirect_url", "")
	viper.SetDefault("wechat_connect.frontend_redirect_url", defaultWeChatConnectFrontendRedirect)

	// Generic OIDC OAuth 登录
	viper.SetDefault("oidc_connect.enabled", false)
	viper.SetDefault("oidc_connect.provider_name", "OIDC")
	viper.SetDefault("oidc_connect.client_id", "")
	viper.SetDefault("oidc_connect.client_secret", "")
	viper.SetDefault("oidc_connect.issuer_url", "")
	viper.SetDefault("oidc_connect.discovery_url", "")
	viper.SetDefault("oidc_connect.authorize_url", "")
	viper.SetDefault("oidc_connect.token_url", "")
	viper.SetDefault("oidc_connect.userinfo_url", "")
	viper.SetDefault("oidc_connect.jwks_url", "")
	viper.SetDefault("oidc_connect.scopes", "openid email profile")
	viper.SetDefault("oidc_connect.redirect_url", "")
	viper.SetDefault("oidc_connect.frontend_redirect_url", "/auth/oidc/callback")
	viper.SetDefault("oidc_connect.token_auth_method", "client_secret_post")
	viper.SetDefault("oidc_connect.use_pkce", true)
	viper.SetDefault("oidc_connect.validate_id_token", true)
	viper.SetDefault("oidc_connect.allowed_signing_algs", "RS256,ES256,PS256")
	viper.SetDefault("oidc_connect.clock_skew_seconds", 120)
	viper.SetDefault("oidc_connect.require_email_verified", false)
	viper.SetDefault("oidc_connect.userinfo_email_path", "")
	viper.SetDefault("oidc_connect.userinfo_id_path", "")
	viper.SetDefault("oidc_connect.userinfo_username_path", "")

	// DingTalk Connect OAuth 登录
	viper.SetDefault("dingtalk_connect.enabled", false)
	viper.SetDefault("dingtalk_connect.authorize_url", "https://login.dingtalk.com/oauth2/auth")
	viper.SetDefault("dingtalk_connect.token_url", "https://api.dingtalk.com/v1.0/oauth2/userAccessToken")
	viper.SetDefault("dingtalk_connect.userinfo_url", "https://api.dingtalk.com/v1.0/contact/users/me")
	viper.SetDefault("dingtalk_connect.scopes", "openid")
	viper.SetDefault("dingtalk_connect.frontend_redirect_url", "/auth/dingtalk/callback")
	viper.SetDefault("dingtalk_connect.dingtalk_app_kind", "internal_app")
	viper.SetDefault("dingtalk_connect.app_type", "public")
	viper.SetDefault("dingtalk_connect.corp_restriction_policy", "none")
	viper.SetDefault("dingtalk_connect.require_email", true)
	viper.SetDefault("dingtalk_connect.username_overwrite_policy", "if_empty")
}
