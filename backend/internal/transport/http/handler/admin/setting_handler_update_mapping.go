package admin

import (
	"strings"

	"github.com/Wei-Shaw/sub2api/internal/application/service"
	"github.com/Wei-Shaw/sub2api/internal/transport/http/handler/dto"
)

func buildSystemSettingsUpdate(prepared *preparedSettingsUpdate) *service.SystemSettings {
	req := prepared.request
	previousSettings := prepared.previousSettings
	passkeyEnabled := prepared.passkeyEnabled
	sessionBindingEnabled := prepared.sessionBindingEnabled
	stepUpEnabled := prepared.stepUpEnabled
	clientIPResolutionMode := prepared.clientIPResolutionMode
	clientIPTrustedProxies := prepared.clientIPTrustedProxies
	customEndpointsJSON := prepared.customEndpointsJSON

	return &service.SystemSettings{
		FrontendURL:           req.FrontendURL,
		TotpEnabled:           req.TotpEnabled,
		PasskeyEnabled:        passkeyEnabled,
		SessionBindingEnabled: sessionBindingEnabled,
		StepUpEnabled:         stepUpEnabled,
		AuditLogRetentionDays: req.AuditLogRetentionDays,
		SMTPHost:              req.SMTPHost,
		SMTPPort:              req.SMTPPort,
		SMTPUsername:          req.SMTPUsername,
		SMTPPassword:          req.SMTPPassword,
		SMTPFrom:              req.SMTPFrom,
		SMTPFromName:          req.SMTPFromName,
		SMTPUseTLS:            req.SMTPUseTLS,
		// The deprecated boolean is accepted but intentionally ignored so a
		// cached pre-upgrade admin page cannot re-enable the v0.1.161 regression.
		APIKeyACLTrustForwardedIP:                          previousSettings.APIKeyACLTrustForwardedIP,
		ClientIPResolutionMode:                             clientIPResolutionMode,
		ClientIPTrustedProxies:                             clientIPTrustedProxies,
		SiteName:                                           req.SiteName,
		SiteLogo:                                           req.SiteLogo,
		APIBaseURL:                                         req.APIBaseURL,
		DocURL:                                             req.DocURL,
		HideCcsImportButton:                                req.HideCcsImportButton,
		TableDefaultPageSize:                               req.TableDefaultPageSize,
		TablePageSizeOptions:                               req.TablePageSizeOptions,
		CustomEndpoints:                                    customEndpointsJSON,
		EnableModelFallback:                                req.EnableModelFallback,
		FallbackModelAnthropic:                             req.FallbackModelAnthropic,
		FallbackModelOpenAI:                                req.FallbackModelOpenAI,
		FallbackModelGemini:                                req.FallbackModelGemini,
		FallbackModelAntigravity:                           req.FallbackModelAntigravity,
		EnableIdentityPatch:                                req.EnableIdentityPatch,
		IdentityPatchPrompt:                                req.IdentityPatchPrompt,
		MinClaudeCodeVersion:                               req.MinClaudeCodeVersion,
		MaxClaudeCodeVersion:                               req.MaxClaudeCodeVersion,
		AllowUngroupedKeyScheduling:                        req.AllowUngroupedKeyScheduling,
		SchedulerV2Enabled:                                 boolValueOrDefault(req.SchedulerV2Enabled, previousSettings.SchedulerV2Enabled),
		SchedulerV2CandidateLimit:                          intValueOrDefault(req.SchedulerV2CandidateLimit, previousSettings.SchedulerV2CandidateLimit),
		SchedulerV2ScanLimit:                               intValueOrDefault(req.SchedulerV2ScanLimit, previousSettings.SchedulerV2ScanLimit),
		RequestPriorityAdmissionEnabled:                    boolValueOrDefault(req.RequestPriorityAdmissionEnabled, previousSettings.RequestPriorityAdmissionEnabled),
		RequestPriorityPendingLimitPerInstance:             intValueOrDefault(req.RequestPriorityPendingLimitPerInstance, previousSettings.RequestPriorityPendingLimitPerInstance),
		RequestPriorityPendingMiBPerInstance:               intValueOrDefault(req.RequestPriorityPendingMiBPerInstance, previousSettings.RequestPriorityPendingMiBPerInstance),
		StreamModePerformanceEnabled:                       boolValueOrDefault(req.StreamModePerformanceEnabled, previousSettings.StreamModePerformanceEnabled),
		OpenAIWSModeRouterV2Enabled:                        boolValueOrDefault(req.OpenAIWSModeRouterV2Enabled, previousSettings.OpenAIWSModeRouterV2Enabled),
		OpsMonitoringEnabled:                               boolValueOrDefault(req.OpsMonitoringEnabled, previousSettings.OpsMonitoringEnabled),
		OpsRealtimeMonitoringEnabled:                       boolValueOrDefault(req.OpsRealtimeMonitoringEnabled, previousSettings.OpsRealtimeMonitoringEnabled),
		OpsQueryModeDefault:                                stringSetting(req.OpsQueryModeDefault, previousSettings.OpsQueryModeDefault),
		OpsMetricsIntervalSeconds:                          intValueOrDefault(req.OpsMetricsIntervalSeconds, previousSettings.OpsMetricsIntervalSeconds),
		EnableFingerprintUnification:                       boolValueOrDefault(req.EnableFingerprintUnification, previousSettings.EnableFingerprintUnification),
		EnableMetadataPassthrough:                          boolValueOrDefault(req.EnableMetadataPassthrough, previousSettings.EnableMetadataPassthrough),
		EnableCCHSigning:                                   boolValueOrDefault(req.EnableCCHSigning, previousSettings.EnableCCHSigning),
		EnableClaudeOAuthSystemPromptInjection:             boolValueOrDefault(req.EnableClaudeOAuthSystemPromptInjection, previousSettings.EnableClaudeOAuthSystemPromptInjection),
		ClaudeOAuthSystemPrompt:                            stringSetting(req.ClaudeOAuthSystemPrompt, previousSettings.ClaudeOAuthSystemPrompt),
		ClaudeOAuthSystemPromptBlocks:                      stringSetting(req.ClaudeOAuthSystemPromptBlocks, previousSettings.ClaudeOAuthSystemPromptBlocks),
		EnableAnthropicCacheTTL1hInjection:                 boolValueOrDefault(req.EnableAnthropicCacheTTL1hInjection, previousSettings.EnableAnthropicCacheTTL1hInjection),
		RewriteMessageCacheControl:                         boolValueOrDefault(req.RewriteMessageCacheControl, previousSettings.RewriteMessageCacheControl),
		EnableClientDatelineNormalization:                  boolValueOrDefault(req.EnableClientDatelineNormalization, previousSettings.EnableClientDatelineNormalization),
		AntigravityUserAgentVersion:                        stringSetting(req.AntigravityUserAgentVersion, previousSettings.AntigravityUserAgentVersion),
		OpenAICodexUserAgent:                               stringSetting(req.OpenAICodexUserAgent, previousSettings.OpenAICodexUserAgent),
		OpenAICodexClientVersion:                           stringSetting(req.OpenAICodexClientVersion, previousSettings.OpenAICodexClientVersion),
		OpenAICodexClientVersionSynced:                     previousSettings.OpenAICodexClientVersionSynced,
		OpenAICodexVersionAutoSyncEnabled:                  boolValueOrDefault(req.OpenAICodexVersionAutoSyncEnabled, previousSettings.OpenAICodexVersionAutoSyncEnabled),
		MinCodexVersion:                                    strings.TrimSpace(req.MinCodexVersion),
		MaxCodexVersion:                                    strings.TrimSpace(req.MaxCodexVersion),
		CodexCLIOnlyBlacklist:                              strings.TrimSpace(req.CodexCLIOnlyBlacklist),
		CodexCLIOnlyWhitelist:                              strings.TrimSpace(req.CodexCLIOnlyWhitelist),
		CodexCLIOnlyAllowAppServerClients:                  boolValueOrDefault(req.CodexCLIOnlyAllowAppServerClients, previousSettings.CodexCLIOnlyAllowAppServerClients),
		CodexCLIOnlyEngineFingerprintSignals:               strings.TrimSpace(req.CodexCLIOnlyEngineFingerprintSignals),
		OpenAILowUpstreamRatePriorityEnabled:               boolValueOrDefault(req.OpenAILowUpstreamRatePriorityEnabled, previousSettings.OpenAILowUpstreamRatePriorityEnabled),
		OpenAIOAuthSchedulingRateMultiplier:                float64ValueOrDefault(req.OpenAIOAuthSchedulingRateMultiplier, previousSettings.OpenAIOAuthSchedulingRateMultiplier),
		OpenAIContentSessionBurstBalanceEnabled:            boolValueOrDefault(req.OpenAIContentSessionBurstBalanceEnabled, previousSettings.OpenAIContentSessionBurstBalanceEnabled),
		OpenAIAdvancedSchedulerEnabled:                     boolValueOrDefault(req.OpenAIAdvancedSchedulerEnabled, previousSettings.OpenAIAdvancedSchedulerEnabled),
		OpenAIAdvancedSchedulerStickyWeightedEnabled:       boolValueOrDefault(req.OpenAIAdvancedSchedulerStickyWeightedEnabled, previousSettings.OpenAIAdvancedSchedulerStickyWeightedEnabled),
		OpenAIAdvancedSchedulerSubscriptionPriorityEnabled: boolValueOrDefault(req.OpenAIAdvancedSchedulerSubscriptionPriorityEnabled, previousSettings.OpenAIAdvancedSchedulerSubscriptionPriorityEnabled),
		OpenAIAdvancedSchedulerLBTopK:                      stringSetting(req.OpenAIAdvancedSchedulerLBTopK, previousSettings.OpenAIAdvancedSchedulerLBTopK),
		OpenAIAdvancedSchedulerWeightPriority:              stringSetting(req.OpenAIAdvancedSchedulerWeightPriority, previousSettings.OpenAIAdvancedSchedulerWeightPriority),
		OpenAIAdvancedSchedulerWeightLoad:                  stringSetting(req.OpenAIAdvancedSchedulerWeightLoad, previousSettings.OpenAIAdvancedSchedulerWeightLoad),
		OpenAIAdvancedSchedulerWeightQueue:                 stringSetting(req.OpenAIAdvancedSchedulerWeightQueue, previousSettings.OpenAIAdvancedSchedulerWeightQueue),
		OpenAIAdvancedSchedulerWeightErrorRate:             stringSetting(req.OpenAIAdvancedSchedulerWeightErrorRate, previousSettings.OpenAIAdvancedSchedulerWeightErrorRate),
		OpenAIAdvancedSchedulerWeightTTFT:                  stringSetting(req.OpenAIAdvancedSchedulerWeightTTFT, previousSettings.OpenAIAdvancedSchedulerWeightTTFT),
		OpenAIAdvancedSchedulerWeightReset:                 stringSetting(req.OpenAIAdvancedSchedulerWeightReset, previousSettings.OpenAIAdvancedSchedulerWeightReset),
		OpenAIAdvancedSchedulerWeightQuotaHeadroom:         stringSetting(req.OpenAIAdvancedSchedulerWeightQuotaHeadroom, previousSettings.OpenAIAdvancedSchedulerWeightQuotaHeadroom),
		OpenAIAdvancedSchedulerWeightUpstreamCost:          stringSetting(req.OpenAIAdvancedSchedulerWeightUpstreamCost, previousSettings.OpenAIAdvancedSchedulerWeightUpstreamCost),
		OpenAIAdvancedSchedulerWeightPreviousResponse:      stringSetting(req.OpenAIAdvancedSchedulerWeightPreviousResponse, previousSettings.OpenAIAdvancedSchedulerWeightPreviousResponse),
		OpenAIAdvancedSchedulerWeightSessionSticky:         stringSetting(req.OpenAIAdvancedSchedulerWeightSessionSticky, previousSettings.OpenAIAdvancedSchedulerWeightSessionSticky),
		AccountQuotaNotifyEnabled:                          boolValueOrDefault(req.AccountQuotaNotifyEnabled, previousSettings.AccountQuotaNotifyEnabled),
		AccountQuotaNotifyEmails:                           notifyEmailEntriesValueOrDefault(req.AccountQuotaNotifyEmails, previousSettings.AccountQuotaNotifyEmails),
		ChannelMonitorEnabled:                              boolValueOrDefault(req.ChannelMonitorEnabled, previousSettings.ChannelMonitorEnabled),
		ChannelMonitorDefaultIntervalSeconds:               intValueOrDefault(req.ChannelMonitorDefaultIntervalSeconds, previousSettings.ChannelMonitorDefaultIntervalSeconds),
		RiskControlEnabled:                                 boolValueOrDefault(req.RiskControlEnabled, previousSettings.RiskControlEnabled),
		CyberSessionBlockEnabled:                           boolValueOrDefault(req.CyberSessionBlockEnabled, previousSettings.CyberSessionBlockEnabled),
		CyberSessionBlockTTLSeconds:                        intValueOrDefault(req.CyberSessionBlockTTLSeconds, previousSettings.CyberSessionBlockTTLSeconds),
	}
}

func trimmedStringValueOrDefault(value *string, fallback string) string {
	if value == nil {
		return fallback
	}
	return strings.TrimSpace(*value)
}

func notifyEmailEntriesValueOrDefault(
	value *[]dto.NotifyEmailEntry,
	fallback []service.NotifyEmailEntry,
) []service.NotifyEmailEntry {
	if value == nil {
		return fallback
	}
	return dto.NotifyEmailEntriesToService(*value)
}
