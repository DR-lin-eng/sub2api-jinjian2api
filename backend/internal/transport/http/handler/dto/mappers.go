// Package dto provides data transfer objects for HTTP handlers.
package dto

import (
	"time"

	"github.com/Wei-Shaw/sub2api/internal/application/service"
)

func UserFromServiceShallow(u *service.User) *User {
	if u == nil {
		return nil
	}
	return &User{
		ID:           u.ID,
		Email:        u.Email,
		Username:     u.Username,
		Role:         u.Role,
		Concurrency:  u.Concurrency,
		Status:       u.Status,
		LastActiveAt: u.LastActiveAt,
		CreatedAt:    u.CreatedAt,
		UpdatedAt:    u.UpdatedAt,
	}
}

func UserFromService(u *service.User) *User {
	if u == nil {
		return nil
	}
	out := UserFromServiceShallow(u)
	if len(u.APIKeys) > 0 {
		out.APIKeys = make([]APIKey, 0, len(u.APIKeys))
		for i := range u.APIKeys {
			k := u.APIKeys[i]
			out.APIKeys = append(out.APIKeys, *APIKeyFromService(&k))
		}
	}
	return out
}

func APIKeyFromService(k *service.APIKey) *APIKey {
	if k == nil {
		return nil
	}
	out := &APIKey{
		ID:                 k.ID,
		UserID:             k.UserID,
		Key:                k.Key,
		Name:               k.Name,
		GroupID:            k.GroupID,
		Status:             k.Status,
		IPWhitelist:        k.IPWhitelist,
		IPBlacklist:        k.IPBlacklist,
		LastUsedAt:         k.LastUsedAt,
		LastUsedIP:         k.LastUsedIP,
		ExpiresAt:          k.ExpiresAt,
		CreatedAt:          k.CreatedAt,
		UpdatedAt:          k.UpdatedAt,
		ConcurrencyLimit:   k.ConcurrencyLimit,
		CurrentConcurrency: k.CurrentConcurrency,
		User:               UserFromServiceShallow(k.User),
		Group:              GroupFromServiceShallow(k.Group),
	}
	return out
}

func GroupFromServiceShallow(g *service.Group) *Group {
	if g == nil {
		return nil
	}
	out := groupFromServiceBase(g)
	return &out
}

func GroupFromService(g *service.Group) *Group {
	if g == nil {
		return nil
	}
	return GroupFromServiceShallow(g)
}

// GroupFromServiceAdmin converts a service Group to DTO for admin users.
// It includes internal fields like model_routing and account_count.
func GroupFromServiceAdmin(g *service.Group) *AdminGroup {
	if g == nil {
		return nil
	}
	out := &AdminGroup{
		Group:                       groupFromServiceBase(g),
		ProfitControlEnabled:        g.ProfitControlEnabled,
		ProfitMinMargin:             g.ProfitMinMargin,
		ProfitSafetyBuffer:          g.ProfitSafetyBuffer,
		ModelRouting:                g.ModelRouting,
		ModelRoutingEnabled:         g.ModelRoutingEnabled,
		MCPXMLInject:                g.MCPXMLInject,
		DefaultMappedModel:          g.DefaultMappedModel,
		MessagesDispatchModelConfig: g.MessagesDispatchModelConfig,
		ModelsListConfig:            g.ModelsListConfig,
		SupportedModelScopes:        g.SupportedModelScopes,
		AccountCount:                g.AccountCount,
		ActiveAccountCount:          g.ActiveAccountCount,
		RateLimitedAccountCount:     g.RateLimitedAccountCount,
		SortOrder:                   g.SortOrder,
	}
	if len(g.AccountGroups) > 0 {
		out.AccountGroups = make([]AccountGroup, 0, len(g.AccountGroups))
		for i := range g.AccountGroups {
			ag := g.AccountGroups[i]
			out.AccountGroups = append(out.AccountGroups, *AccountGroupFromService(&ag))
		}
	}
	return out
}

func groupFromServiceBase(g *service.Group) Group {
	return Group{
		ID:                              g.ID,
		Name:                            g.Name,
		Description:                     g.Description,
		Platform:                        g.Platform,
		RateMultiplier:                  g.RateMultiplier,
		Status:                          g.Status,
		AllowImageGeneration:            g.AllowImageGeneration,
		OpenAIForceImageTool:            g.OpenAIForceImageTool,
		ImageRateIndependent:            g.ImageRateIndependent,
		ImageRateMultiplier:             g.ImageRateMultiplier,
		VideoRateIndependent:            g.VideoRateIndependent,
		VideoRateMultiplier:             g.VideoRateMultiplier,
		ImagePrice1K:                    g.ImagePrice1K,
		ImagePrice2K:                    g.ImagePrice2K,
		ImagePrice4K:                    g.ImagePrice4K,
		VideoPrice480P:                  g.VideoPrice480P,
		VideoPrice720P:                  g.VideoPrice720P,
		VideoPrice1080P:                 g.VideoPrice1080P,
		WebSearchPricePerCall:           g.WebSearchPricePerCall,
		ClaudeCodeOnly:                  g.ClaudeCodeOnly,
		FallbackGroupID:                 g.FallbackGroupID,
		FallbackGroupIDOnInvalidRequest: g.FallbackGroupIDOnInvalidRequest,
		AllowMessagesDispatch:           g.AllowMessagesDispatch,
		AllowLive:                       g.AllowLive,
		RequireOAuthOnly:                g.RequireOAuthOnly,
		RequirePrivacySet:               g.RequirePrivacySet,
		RPMLimit:                        g.RPMLimit,
		MaxReasoningEffort:              g.MaxReasoningEffort,
		ReasoningEffortMappings:         g.ReasoningEffortMappings,
		CreatedAt:                       g.CreatedAt,
		UpdatedAt:                       g.UpdatedAt,
	}
}

func AccountFromServiceShallow(a *service.Account) *Account {
	if a == nil {
		return nil
	}
	redactedCreds, credsStatus := RedactCredentials(a.Credentials)
	extra := redactAccountManagedExtra(a.Extra)
	var ollamaCloudUsage *service.OllamaCloudUsageState
	if state := service.OllamaCloudUsageStateFromAccount(a); state.Eligible {
		ollamaCloudUsage = state
	}
	out := &Account{
		ID:                      a.ID,
		Name:                    a.Name,
		Notes:                   a.Notes,
		Platform:                a.Platform,
		Type:                    a.Type,
		Credentials:             redactedCreds,
		CredentialsStatus:       credsStatus,
		Extra:                   extra,
		OllamaCloudUsage:        ollamaCloudUsage,
		ProxyID:                 a.ProxyID,
		ProxyFallbackOriginID:   a.ProxyFallbackOriginID,
		ProxyFallbackOriginName: a.ProxyFallbackOriginName,
		Concurrency:             a.Concurrency,
		LoadFactor:              a.LoadFactor,
		Priority:                a.Priority,
		RateMultiplier:          a.BillingRateMultiplier(),
		Status:                  a.Status,
		ErrorMessage:            a.ErrorMessage,
		LastUsedAt:              a.LastUsedAt,
		ExpiresAt:               timeToUnixSeconds(a.ExpiresAt),
		AutoPauseOnExpired:      a.AutoPauseOnExpired,
		CreatedAt:               a.CreatedAt,
		UpdatedAt:               a.UpdatedAt,
		Schedulable:             a.Schedulable,
		RateLimitedAt:           a.RateLimitedAt,
		RateLimitResetAt:        a.RateLimitResetAt,
		OverloadUntil:           a.OverloadUntil,
		TempUnschedulableUntil:  a.TempUnschedulableUntil,
		TempUnschedulableReason: a.TempUnschedulableReason,
		SessionWindowStart:      a.SessionWindowStart,
		SessionWindowEnd:        a.SessionWindowEnd,
		SessionWindowStatus:     a.SessionWindowStatus,
		GroupIDs:                a.GroupIDs,
		ParentAccountID:         a.ParentAccountID,
		QuotaDimension:          a.QuotaDimension,
	}

	// 提取 5h 窗口费用控制和会话数量控制配置（仅 Anthropic OAuth/SetupToken 账号有效）
	if a.IsAnthropicOAuthOrSetupToken() {
		if limit := a.GetWindowCostLimit(); limit > 0 {
			out.WindowCostLimit = &limit
		}
		if reserve := a.GetWindowCostStickyReserve(); reserve > 0 {
			out.WindowCostStickyReserve = &reserve
		}
		if maxSessions := a.GetMaxSessions(); maxSessions > 0 {
			out.MaxSessions = &maxSessions
		}
		if idleTimeout := a.GetSessionIdleTimeoutMinutes(); idleTimeout > 0 {
			out.SessionIdleTimeoutMin = &idleTimeout
		}
		if rpm := a.GetBaseRPM(); rpm > 0 {
			out.BaseRPM = &rpm
			strategy := a.GetRPMStrategy()
			out.RPMStrategy = &strategy
			buffer := a.GetRPMStickyBuffer()
			out.RPMStickyBuffer = &buffer
		}
		// 用户消息队列模式
		if mode := a.GetUserMsgQueueMode(); mode != "" {
			out.UserMsgQueueMode = &mode
		}
		// TLS指纹伪装开关
		if a.IsTLSFingerprintEnabled() {
			enabled := true
			out.EnableTLSFingerprint = &enabled
		}
		// TLS指纹模板ID
		if profileID := a.GetTLSFingerprintProfileID(); profileID > 0 {
			out.TLSFingerprintProfileID = &profileID
		}
		// 会话ID伪装开关
		if a.IsSessionIDMaskingEnabled() {
			enabled := true
			out.EnableSessionIDMasking = &enabled
		}
		// 缓存 TTL 强制替换
		if a.IsCacheTTLOverrideEnabled() {
			enabled := true
			out.CacheTTLOverrideEnabled = &enabled
			target := a.GetCacheTTLOverrideTarget()
			out.CacheTTLOverrideTarget = &target
		}
		// 自定义 Base URL 中继转发
		if a.IsCustomBaseURLEnabled() {
			enabled := true
			out.CustomBaseURLEnabled = &enabled
			if customURL := a.GetCustomBaseURL(); customURL != "" {
				out.CustomBaseURL = &customURL
			}
		}
	}

	// 提取账号配额限制（apikey / bedrock 类型有效）
	if a.IsAPIKeyOrBedrock() {
		if limit := a.GetQuotaLimit(); limit > 0 {
			out.QuotaLimit = &limit
			used := a.GetQuotaUsed()
			out.QuotaUsed = &used
		}
		if limit := a.GetQuotaDailyLimit(); limit > 0 {
			out.QuotaDailyLimit = &limit
			used := a.GetQuotaDailyUsed()
			if a.IsDailyQuotaPeriodExpired() {
				used = 0
			}
			out.QuotaDailyUsed = &used
		}
		if limit := a.GetQuotaWeeklyLimit(); limit > 0 {
			out.QuotaWeeklyLimit = &limit
			used := a.GetQuotaWeeklyUsed()
			if a.IsWeeklyQuotaPeriodExpired() {
				used = 0
			}
			out.QuotaWeeklyUsed = &used
		}
		// 固定时间重置配置
		if mode := a.GetQuotaDailyResetMode(); mode == "fixed" {
			out.QuotaDailyResetMode = &mode
			hour := a.GetQuotaDailyResetHour()
			out.QuotaDailyResetHour = &hour
		}
		if mode := a.GetQuotaWeeklyResetMode(); mode == "fixed" {
			out.QuotaWeeklyResetMode = &mode
			day := a.GetQuotaWeeklyResetDay()
			out.QuotaWeeklyResetDay = &day
			hour := a.GetQuotaWeeklyResetHour()
			out.QuotaWeeklyResetHour = &hour
		}
		if a.GetQuotaDailyResetMode() == "fixed" || a.GetQuotaWeeklyResetMode() == "fixed" {
			tz := a.GetQuotaResetTimezone()
			out.QuotaResetTimezone = &tz
		}
		if a.Extra != nil {
			if v, ok := a.Extra["quota_daily_reset_at"].(string); ok && v != "" {
				out.QuotaDailyResetAt = &v
			}
			if v, ok := a.Extra["quota_weekly_reset_at"].(string); ok && v != "" {
				out.QuotaWeeklyResetAt = &v
			}
		}
	}

	return out
}

func redactAccountManagedExtra(extra map[string]any) map[string]any {
	if extra == nil {
		return nil
	}
	redacted := make(map[string]any, len(extra))
	for key, value := range extra {
		switch key {
		case service.OllamaCloudUsageSessionExtraKey,
			service.OllamaCloudUsageAutoRefreshExtraKey,
			service.OllamaCloudUsageSnapshotExtraKey:
			continue
		default:
			redacted[key] = value
		}
	}
	return redacted
}

func AccountFromService(a *service.Account) *Account {
	if a == nil {
		return nil
	}
	out := AccountFromServiceShallow(a)
	out.Proxy = ProxyFromService(a.Proxy)
	if len(a.AccountGroups) > 0 {
		out.AccountGroups = make([]AccountGroup, 0, len(a.AccountGroups))
		for i := range a.AccountGroups {
			ag := a.AccountGroups[i]
			out.AccountGroups = append(out.AccountGroups, *AccountGroupFromService(&ag))
		}
	}
	if len(a.Groups) > 0 {
		out.Groups = make([]*Group, 0, len(a.Groups))
		for _, g := range a.Groups {
			out.Groups = append(out.Groups, GroupFromServiceShallow(g))
		}
	}
	return out
}

func timeToUnixSeconds(value *time.Time) *int64 {
	if value == nil {
		return nil
	}
	ts := value.Unix()
	return &ts
}

func AccountGroupFromService(ag *service.AccountGroup) *AccountGroup {
	if ag == nil {
		return nil
	}
	return &AccountGroup{
		AccountID: ag.AccountID,
		GroupID:   ag.GroupID,
		Priority:  ag.Priority,
		CreatedAt: ag.CreatedAt,
		Account:   AccountFromServiceShallow(ag.Account),
		Group:     GroupFromServiceShallow(ag.Group),
	}
}

func ProxyFromService(p *service.Proxy) *Proxy {
	if p == nil {
		return nil
	}
	return &Proxy{
		ID:             p.ID,
		Name:           p.Name,
		Protocol:       p.Protocol,
		Host:           p.Host,
		Port:           p.Port,
		Username:       p.Username,
		Status:         p.Status,
		CreatedAt:      p.CreatedAt,
		UpdatedAt:      p.UpdatedAt,
		ExpiresAt:      p.ExpiresAt,
		FallbackMode:   p.FallbackMode,
		BackupProxyID:  p.BackupProxyID,
		ExpiryWarnDays: p.ExpiryWarnDays,
	}
}

func ProxyWithAccountCountFromService(p *service.ProxyWithAccountCount) *ProxyWithAccountCount {
	if p == nil {
		return nil
	}
	return &ProxyWithAccountCount{
		Proxy:          *ProxyFromService(&p.Proxy),
		AccountCount:   p.AccountCount,
		LatencyMs:      p.LatencyMs,
		LatencyStatus:  p.LatencyStatus,
		LatencyMessage: p.LatencyMessage,
		IPAddress:      p.IPAddress,
		Country:        p.Country,
		CountryCode:    p.CountryCode,
		Region:         p.Region,
		City:           p.City,
		QualityStatus:  p.QualityStatus,
		QualityScore:   p.QualityScore,
		QualityGrade:   p.QualityGrade,
		QualitySummary: p.QualitySummary,
		QualityChecked: p.QualityChecked,
	}
}

// ProxyFromServiceAdmin converts a service Proxy to AdminProxy DTO for admin users.
// It includes the password field - user-facing endpoints must not use this.
func ProxyFromServiceAdmin(p *service.Proxy) *AdminProxy {
	if p == nil {
		return nil
	}
	base := ProxyFromService(p)
	if base == nil {
		return nil
	}
	return &AdminProxy{
		Proxy:    *base,
		Password: p.Password,
	}
}

// ProxyWithAccountCountFromServiceAdmin converts a service ProxyWithAccountCount to AdminProxyWithAccountCount DTO.
// It includes the password field - user-facing endpoints must not use this.
func ProxyWithAccountCountFromServiceAdmin(p *service.ProxyWithAccountCount) *AdminProxyWithAccountCount {
	if p == nil {
		return nil
	}
	admin := ProxyFromServiceAdmin(&p.Proxy)
	if admin == nil {
		return nil
	}
	return &AdminProxyWithAccountCount{
		AdminProxy:     *admin,
		AccountCount:   p.AccountCount,
		LatencyMs:      p.LatencyMs,
		LatencyStatus:  p.LatencyStatus,
		LatencyMessage: p.LatencyMessage,
		IPAddress:      p.IPAddress,
		Country:        p.Country,
		CountryCode:    p.CountryCode,
		Region:         p.Region,
		City:           p.City,
		QualityStatus:  p.QualityStatus,
		QualityScore:   p.QualityScore,
		QualityGrade:   p.QualityGrade,
		QualitySummary: p.QualitySummary,
		QualityChecked: p.QualityChecked,
	}
}

func ProxyAccountSummaryFromService(a *service.ProxyAccountSummary) *ProxyAccountSummary {
	if a == nil {
		return nil
	}
	return &ProxyAccountSummary{
		ID:       a.ID,
		Name:     a.Name,
		Platform: a.Platform,
		Type:     a.Type,
		Notes:    a.Notes,
	}
}

// AccountSummaryFromService returns a minimal AccountSummary for usage log display.
// Only includes ID and Name - no sensitive fields like Credentials, Proxy, etc.
func AccountSummaryFromService(a *service.Account) *AccountSummary {
	if a == nil {
		return nil
	}
	return &AccountSummary{
		ID:   a.ID,
		Name: a.Name,
	}
}

func usageLogFromServiceUser(l *service.UsageLog) UsageLog {
	// 普通用户 DTO：严禁包含管理员字段（例如 account_rate_multiplier、account、upstream_model）。
	requestType := l.EffectiveRequestType()
	stream, openAIWSMode := service.ApplyLegacyRequestFields(requestType, l.Stream, l.OpenAIWSMode)
	requestedModel := l.RequestedModel
	if requestedModel == "" {
		requestedModel = l.Model
	}
	return UsageLog{
		ID:                        l.ID,
		UserID:                    l.UserID,
		APIKeyID:                  l.APIKeyID,
		AccountID:                 l.AccountID,
		RequestID:                 l.RequestID,
		Model:                     requestedModel,
		ServiceTier:               l.ServiceTier,
		ReasoningEffort:           l.ReasoningEffort,
		InboundEndpoint:           l.InboundEndpoint,
		GroupID:                   l.GroupID,
		InputTokens:               l.InputTokens,
		OutputTokens:              l.OutputTokens,
		CacheCreationTokens:       l.CacheCreationTokens,
		CacheReadTokens:           l.CacheReadTokens,
		CacheCreation5mTokens:     l.CacheCreation5mTokens,
		CacheCreation1hTokens:     l.CacheCreation1hTokens,
		InputCost:                 l.InputCost,
		OutputCost:                l.OutputCost,
		CacheCreationCost:         l.CacheCreationCost,
		CacheReadCost:             l.CacheReadCost,
		TotalCost:                 l.TotalCost,
		ActualCost:                l.ActualCost,
		RateMultiplier:            l.RateMultiplier,
		LongContextBillingApplied: l.LongContextBillingApplied,
		RequestType:               requestType.String(),
		Stream:                    stream,
		OpenAIWSMode:              openAIWSMode,
		DurationMs:                l.DurationMs,
		FirstTokenMs:              l.FirstTokenMs,
		ImageCount:                l.ImageCount,
		ImageSize:                 l.ImageSize,
		ImageInputSize:            l.ImageInputSize,
		ImageOutputSize:           l.ImageOutputSize,
		ImageInputTokens:          l.ImageInputTokens,
		ImageInputCost:            l.ImageInputCost,
		ImageOutputTokens:         l.ImageOutputTokens,
		ImageOutputCost:           l.ImageOutputCost,
		ImageSizeSource:           l.ImageSizeSource,
		ImageSizeBreakdown:        l.ImageSizeBreakdown,
		MediaType:                 l.MediaType,
		VideoCount:                l.VideoCount,
		VideoResolution:           l.VideoResolution,
		VideoDurationSeconds:      l.VideoDurationSeconds,
		UserAgent:                 l.UserAgent,
		IPAddress:                 l.IPAddress,
		SessionID:                 l.SessionID,
		CacheTTLOverridden:        l.CacheTTLOverridden,
		BillingMode:               l.BillingMode,
		CreatedAt:                 l.CreatedAt,
		User:                      UserFromServiceShallow(l.User),
		APIKey:                    APIKeyFromService(l.APIKey),
		Group:                     GroupFromServiceShallow(l.Group),
	}
}

// UsageLogFromService converts a service UsageLog to DTO for regular users.
// It excludes admin-only account/upstream internals while keeping user billing and request metadata.
func UsageLogFromService(l *service.UsageLog) *UsageLog {
	if l == nil {
		return nil
	}
	u := usageLogFromServiceUser(l)
	return &u
}

// UsageLogFromServiceAdmin converts a service UsageLog to DTO for admin users.
// It includes minimal Account info (ID, Name only) and IP address.
func UsageLogFromServiceAdmin(l *service.UsageLog) *AdminUsageLog {
	if l == nil {
		return nil
	}
	usageLog := usageLogFromServiceUser(l)
	usageLog.UpstreamEndpoint = l.UpstreamEndpoint
	return &AdminUsageLog{
		UsageLog:              usageLog,
		UpstreamModel:         l.UpstreamModel,
		ChannelID:             l.ChannelID,
		ModelMappingChain:     l.ModelMappingChain,
		BillingTier:           l.BillingTier,
		AccountRateMultiplier: l.AccountRateMultiplier,
		AccountStatsCost:      l.AccountStatsCost,
		IPAddress:             l.IPAddress,
		Account:               AccountSummaryFromService(l.Account),
	}
}

func SettingFromService(s *service.Setting) *Setting {
	if s == nil {
		return nil
	}
	return &Setting{
		ID:        s.ID,
		Key:       s.Key,
		Value:     s.Value,
		UpdatedAt: s.UpdatedAt,
	}
}
