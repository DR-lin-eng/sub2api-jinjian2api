package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"math"
	"sort"
	"strconv"
	"strings"

	"github.com/Wei-Shaw/sub2api/internal/platform/config"
	infraerrors "github.com/Wei-Shaw/sub2api/internal/shared/errors"
	"github.com/Wei-Shaw/sub2api/internal/shared/ip"
	"github.com/Wei-Shaw/sub2api/internal/shared/openai"
)

// InitializeDefaultSettings 初始化默认设置
func (s *SettingService) InitializeDefaultSettings(ctx context.Context) error {
	// 检查是否已有设置
	_, err := s.settingRepo.GetValue(ctx, SettingKeySiteName)
	if err == nil {
		// 已有设置，不需要初始化
		return nil
	}
	if !errors.Is(err, ErrSettingNotFound) {
		return fmt.Errorf("check existing settings: %w", err)
	}

	// 初始化默认设置
	defaults := map[string]string{
		SettingKeyAPIKeyACLTrustForwardedIP: "false",
		SettingKeyClientIPResolutionMode:    ip.ResolutionModeAutoCompat,
		SettingKeyClientIPTrustedProxies:    "[]",
		SettingKeySiteName:                  "Sub2API",
		SettingKeySiteLogo:                  "",
		SettingKeyTableDefaultPageSize:      "20",
		SettingKeyTablePageSizeOptions:      "[10,20,50,100]",
		SettingKeyCustomEndpoints:           "[]",
		SettingKeySMTPPort:                  "587",
		SettingKeySMTPUseTLS:                "false",
		// Model fallback defaults
		SettingKeyEnableModelFallback:      "false",
		SettingKeyFallbackModelAnthropic:   "claude-3-5-sonnet-20241022",
		SettingKeyFallbackModelOpenAI:      "gpt-4o",
		SettingKeyFallbackModelGemini:      "gemini-2.5-pro",
		SettingKeyFallbackModelAntigravity: "gemini-2.5-pro",
		// Identity patch defaults
		SettingKeyEnableIdentityPatch: "true",
		SettingKeyIdentityPatchPrompt: "",

		// Ops monitoring defaults (vNext)
		SettingKeyOpsMonitoringEnabled:         "true",
		SettingKeyOpsRealtimeMonitoringEnabled: "true",
		SettingKeyOpsQueryModeDefault:          "auto",
		SettingKeyOpsMetricsIntervalSeconds:    "60",

		// Channel monitor defaults (enabled, 60s)
		SettingKeyChannelMonitorEnabled:                "true",
		SettingKeyChannelMonitorDefaultIntervalSeconds: "60",

		// Claude Code version check (default: empty = disabled)
		SettingKeyMinClaudeCodeVersion: "",
		SettingKeyMaxClaudeCodeVersion: "",

		// codex_cli_only 加固（默认：版本不检查、名单空、默认种子指纹信号）
		SettingKeyMinCodexVersion:                      "",
		SettingKeyMaxCodexVersion:                      "",
		SettingKeyCodexCLIOnlyBlacklist:                "",
		SettingKeyCodexCLIOnlyWhitelist:                "",
		SettingKeyCodexCLIOnlyAllowAppServerClients:    "false",
		SettingKeyCodexCLIOnlyEngineFingerprintSignals: openai.DefaultEngineFingerprintSignalsJSON(),

		// 分组隔离（默认不允许未分组 Key 调度）
		SettingKeyAllowUngroupedKeyScheduling:                        "false",
		SettingKeyOpenAILowUpstreamRatePriorityEnabled:               "false",
		SettingKeyOpenAIOAuthSchedulingRateMultiplier:                "1",
		SettingKeySchedulerV2Enabled:                                 "false",
		SettingKeySchedulerV2CandidateLimit:                          strconv.Itoa(DefaultSchedulerCandidateFetchLimit),
		SettingKeySchedulerV2ScanLimit:                               strconv.Itoa(DefaultSchedulerCandidateScanLimit),
		SettingKeyRequestPriorityAdmissionEnabled:                    "false",
		SettingKeyRequestPriorityPendingLimitPerInstance:             strconv.Itoa(DefaultRequestPriorityPendingLimitPerInstance),
		SettingKeyRequestPriorityPendingMiBPerInstance:               strconv.Itoa(DefaultRequestPriorityPendingMiBPerInstance),
		SettingKeyOpenAIWSModeRouterV2Enabled:                        strconv.FormatBool(s.defaultOpenAIWSModeRouterV2Enabled()),
		SettingKeyEnableAnthropicCacheTTL1hInjection:                 "false",
		SettingKeyRewriteMessageCacheControl:                         strconv.FormatBool(s.defaultRewriteMessageCacheControl()),
		SettingKeyEnableClientDatelineNormalization:                  "true",
		SettingKeyAntigravityUserAgentVersion:                        "",
		SettingKeyOpenAICodexUserAgent:                               "",
		SettingKeyOpenAICodexClientVersion:                           "",
		SettingKeyOpenAICodexClientVersionSynced:                     "",
		SettingKeyOpenAICodexVersionAutoSyncEnabled:                  "true",
		SettingKeyOpenAIContentSessionBurstBalanceEnabled:            "false",
		openAIAdvancedSchedulerSettingKey:                            "false",
		SettingKeyOpenAIAdvancedSchedulerStickyWeightedEnabled:       "false",
		SettingKeyOpenAIAdvancedSchedulerSubscriptionPriorityEnabled: "false",
		SettingKeyOpenAIAdvancedSchedulerLBTopK:                      "",
		SettingKeyOpenAIAdvancedSchedulerWeightPriority:              "",
		SettingKeyOpenAIAdvancedSchedulerWeightLoad:                  "",
		SettingKeyOpenAIAdvancedSchedulerWeightQueue:                 "",
		SettingKeyOpenAIAdvancedSchedulerWeightErrorRate:             "",
		SettingKeyOpenAIAdvancedSchedulerWeightTTFT:                  "",
		SettingKeyOpenAIAdvancedSchedulerWeightReset:                 "",
		SettingKeyOpenAIAdvancedSchedulerWeightQuotaHeadroom:         "",
		SettingKeyOpenAIAdvancedSchedulerWeightUpstreamCost:          "",
		SettingKeyOpenAIAdvancedSchedulerWeightPreviousResponse:      "",
		SettingKeyOpenAIAdvancedSchedulerWeightSessionSticky:         "",
	}

	return s.settingRepo.SetMultiple(ctx, defaults)
}

// parseSettings 解析设置到结构体
func (s *SettingService) parseSettings(settings map[string]string) *SystemSettings {
	result := s.parseCoreSystemSettings(settings)
	s.applyFeatureSettings(result, settings)
	s.applyGatewaySettings(result, settings)
	s.applyNotificationAndVisibilitySettings(result, settings)
	return result
}

func parseSchedulerV2Limits(candidateRaw, scanRaw string) (int, int) {
	candidateLimit := DefaultSchedulerCandidateFetchLimit
	scanLimit := DefaultSchedulerCandidateScanLimit
	if parsed, err := strconv.Atoi(strings.TrimSpace(candidateRaw)); err == nil {
		candidateLimit = parsed
	}
	if parsed, err := strconv.Atoi(strings.TrimSpace(scanRaw)); err == nil {
		scanLimit = parsed
	}
	if ValidateSchedulerV2Limits(candidateLimit, scanLimit) != nil {
		return DefaultSchedulerCandidateFetchLimit, DefaultSchedulerCandidateScanLimit
	}
	return candidateLimit, scanLimit
}

func isFalseSettingValue(value string) bool {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "false", "0", "off", "disabled":
		return true
	default:
		return false
	}
}

func (s *SettingService) openAIAdvancedSchedulerEffectiveLBTopK() string {
	if s != nil && s.cfg != nil && s.cfg.Gateway.OpenAIWS.LBTopK > 0 {
		return strconv.Itoa(s.cfg.Gateway.OpenAIWS.LBTopK)
	}
	return "7"
}

func (s *SettingService) openAIAdvancedSchedulerEffectiveWeights() config.GatewayOpenAIWSSchedulerScoreWeights {
	defaults := config.GatewayOpenAIWSSchedulerScoreWeights{
		Priority:         1.0,
		Load:             1.0,
		Queue:            0.7,
		ErrorRate:        0.8,
		TTFT:             0.5,
		Reset:            0.0,
		QuotaHeadroom:    0.0,
		UpstreamCost:     0.0,
		PreviousResponse: 5.0,
		SessionSticky:    3.0,
	}
	if s == nil || s.cfg == nil {
		return defaults
	}

	weights := s.cfg.Gateway.OpenAIWS.SchedulerScoreWeights
	if !weights.IsValid() {
		return defaults
	}
	return weights
}

func formatOpenAIAdvancedSchedulerFloat(value float64) string {
	return strconv.FormatFloat(value, 'f', -1, 64)
}

func (s *SettingService) normalizeOpenAIAdvancedSchedulerOverrides(settings *SystemSettings) error {
	if rate := settings.OpenAIOAuthSchedulingRateMultiplier; rate < 0 || math.IsNaN(rate) || math.IsInf(rate, 0) {
		return infraerrors.BadRequest("INVALID_OPENAI_OAUTH_SCHEDULING_RATE_MULTIPLIER", "OpenAI OAuth scheduling rate multiplier must be a finite non-negative number")
	}

	lbTopK, err := normalizeOptionalPositiveIntString(settings.OpenAIAdvancedSchedulerLBTopK)
	if err != nil {
		return infraerrors.BadRequest("INVALID_OPENAI_ADVANCED_SCHEDULER_LB_TOP_K", "openai advanced scheduler TopK must be a positive integer or empty")
	}
	settings.OpenAIAdvancedSchedulerLBTopK = lbTopK

	weights := []*string{
		&settings.OpenAIAdvancedSchedulerWeightPriority,
		&settings.OpenAIAdvancedSchedulerWeightLoad,
		&settings.OpenAIAdvancedSchedulerWeightQueue,
		&settings.OpenAIAdvancedSchedulerWeightErrorRate,
		&settings.OpenAIAdvancedSchedulerWeightTTFT,
		&settings.OpenAIAdvancedSchedulerWeightReset,
		&settings.OpenAIAdvancedSchedulerWeightQuotaHeadroom,
		&settings.OpenAIAdvancedSchedulerWeightUpstreamCost,
		&settings.OpenAIAdvancedSchedulerWeightPreviousResponse,
		&settings.OpenAIAdvancedSchedulerWeightSessionSticky,
	}
	for _, target := range weights {
		normalized, err := normalizeOptionalNonNegativeFloatString(*target)
		if err != nil {
			return infraerrors.BadRequest("INVALID_OPENAI_ADVANCED_SCHEDULER_WEIGHT", "openai advanced scheduler weights must be non-negative numbers or empty")
		}
		*target = normalized
	}

	// 与 config.Validate 的 "scheduler_score_weights must not all be zero" 保持一致：
	// 覆盖值（空则回退到生效的配置值）叠加后的基础权重和不允许为 0，
	// 否则调度会静默退化为 TopK 内均匀随机。
	effective := s.openAIAdvancedSchedulerEffectiveWeights()
	resolved := config.GatewayOpenAIWSSchedulerScoreWeights{
		Priority:         resolveOpenAIAdvancedSchedulerWeight(settings.OpenAIAdvancedSchedulerWeightPriority, effective.Priority),
		Load:             resolveOpenAIAdvancedSchedulerWeight(settings.OpenAIAdvancedSchedulerWeightLoad, effective.Load),
		Queue:            resolveOpenAIAdvancedSchedulerWeight(settings.OpenAIAdvancedSchedulerWeightQueue, effective.Queue),
		ErrorRate:        resolveOpenAIAdvancedSchedulerWeight(settings.OpenAIAdvancedSchedulerWeightErrorRate, effective.ErrorRate),
		TTFT:             resolveOpenAIAdvancedSchedulerWeight(settings.OpenAIAdvancedSchedulerWeightTTFT, effective.TTFT),
		Reset:            resolveOpenAIAdvancedSchedulerWeight(settings.OpenAIAdvancedSchedulerWeightReset, effective.Reset),
		QuotaHeadroom:    resolveOpenAIAdvancedSchedulerWeight(settings.OpenAIAdvancedSchedulerWeightQuotaHeadroom, effective.QuotaHeadroom),
		UpstreamCost:     resolveOpenAIAdvancedSchedulerWeight(settings.OpenAIAdvancedSchedulerWeightUpstreamCost, effective.UpstreamCost),
		PreviousResponse: resolveOpenAIAdvancedSchedulerWeight(settings.OpenAIAdvancedSchedulerWeightPreviousResponse, effective.PreviousResponse),
		SessionSticky:    resolveOpenAIAdvancedSchedulerWeight(settings.OpenAIAdvancedSchedulerWeightSessionSticky, effective.SessionSticky),
	}
	if !resolved.IsValid() {
		return infraerrors.BadRequest("INVALID_OPENAI_ADVANCED_SCHEDULER_WEIGHT", "openai advanced scheduler weights must have finite non-zero base and total sums")
	}
	return nil
}

func parseOpenAIOAuthSchedulingRateMultiplier(raw string) float64 {
	value, err := strconv.ParseFloat(strings.TrimSpace(raw), 64)
	if err != nil || value < 0 || math.IsNaN(value) || math.IsInf(value, 0) {
		return defaultOpenAIOAuthSchedulingRateMultiplier
	}
	return value
}

// resolveOpenAIAdvancedSchedulerWeight 返回覆盖值（已归一化的非空字符串），空则回退默认值。
func resolveOpenAIAdvancedSchedulerWeight(normalized string, fallback float64) float64 {
	if normalized == "" {
		return fallback
	}
	value, err := strconv.ParseFloat(normalized, 64)
	if err != nil {
		return fallback
	}
	return value
}

func normalizeOptionalPositiveIntString(raw string) (string, error) {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return "", nil
	}
	value, err := strconv.Atoi(raw)
	if err != nil || value <= 0 {
		return "", fmt.Errorf("invalid positive integer")
	}
	return strconv.Itoa(value), nil
}

func normalizeOptionalNonNegativeFloatString(raw string) (string, error) {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return "", nil
	}
	value, err := strconv.ParseFloat(raw, 64)
	if err != nil || value < 0 || math.IsNaN(value) || math.IsInf(value, 0) {
		return "", fmt.Errorf("invalid non-negative float")
	}
	return strconv.FormatFloat(value, 'f', -1, 64), nil
}

func parseTablePreferences(defaultPageSizeRaw, optionsRaw string) (int, []int) {
	defaultPageSize := 20
	if v, err := strconv.Atoi(strings.TrimSpace(defaultPageSizeRaw)); err == nil {
		defaultPageSize = v
	}

	var options []int
	if strings.TrimSpace(optionsRaw) != "" {
		_ = json.Unmarshal([]byte(optionsRaw), &options)
	}

	return normalizeTablePreferences(defaultPageSize, options)
}

func normalizeTablePreferences(defaultPageSize int, options []int) (int, []int) {
	const minPageSize = 5
	const maxPageSize = 1000
	const fallbackPageSize = 20

	seen := make(map[int]struct{}, len(options))
	normalizedOptions := make([]int, 0, len(options))
	for _, option := range options {
		if option < minPageSize || option > maxPageSize {
			continue
		}
		if _, ok := seen[option]; ok {
			continue
		}
		seen[option] = struct{}{}
		normalizedOptions = append(normalizedOptions, option)
	}
	sort.Ints(normalizedOptions)

	if defaultPageSize < minPageSize || defaultPageSize > maxPageSize {
		defaultPageSize = fallbackPageSize
	}

	if len(normalizedOptions) == 0 {
		normalizedOptions = []int{10, 20, 50}
	}

	return defaultPageSize, normalizedOptions
}
