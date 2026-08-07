package service

import (
	"context"
	"strings"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/shared/ctxkey"
	"github.com/Wei-Shaw/sub2api/internal/shared/logger"
)

// RecordUsageInput contains the immutable data needed to calculate and store usage.
type RecordUsageInput struct {
	Result            *ForwardResult
	APIKey            *APIKey
	User              *User
	Account           *Account
	PricingAt         time.Time
	InboundEndpoint   string
	UpstreamEndpoint  string
	UserAgent         string
	IPAddress         string
	SessionID         string
	ForceCacheBilling bool

	ChannelUsageFields
}

type usageLogBestEffortWriter interface {
	CreateBestEffort(ctx context.Context, log *UsageLog) error
}

func resolveUsageBillingRequestID(ctx context.Context, upstreamRequestID string) string {
	if ctx != nil {
		if clientRequestID, _ := ctx.Value(ctxkey.ClientRequestID).(string); strings.TrimSpace(clientRequestID) != "" {
			return "client:" + strings.TrimSpace(clientRequestID)
		}
		if requestID, _ := ctx.Value(ctxkey.RequestID).(string); strings.TrimSpace(requestID) != "" {
			return "local:" + strings.TrimSpace(requestID)
		}
	}
	if requestID := strings.TrimSpace(upstreamRequestID); requestID != "" {
		return requestID
	}
	return "generated:" + generateRequestID()
}

func detachedBillingContext(ctx context.Context) (context.Context, context.CancelFunc) {
	base := context.Background()
	if ctx != nil {
		base = context.WithoutCancel(ctx)
	}
	return context.WithTimeout(base, postUsageBillingTimeout)
}

func detachStreamUpstreamContext(ctx context.Context, stream bool) (context.Context, context.CancelFunc) {
	if ctx == nil {
		return context.Background(), func() {}
	}
	if !stream {
		return ctx, func() {}
	}
	return context.WithoutCancel(ctx), func() {}
}

func detachUpstreamContext(ctx context.Context) (context.Context, context.CancelFunc) {
	if ctx == nil {
		return context.Background(), func() {}
	}
	return context.WithoutCancel(ctx), func() {}
}

func writeUsageLogBestEffort(ctx context.Context, repo UsageLogRepository, usageLog *UsageLog, logKey string) {
	if repo == nil || usageLog == nil {
		return
	}
	usageCtx, cancel := detachedBillingContext(ctx)
	defer cancel()

	if writer, ok := repo.(usageLogBestEffortWriter); ok {
		if err := writer.CreateBestEffort(usageCtx, usageLog); err != nil {
			logger.LegacyPrintf(logKey, "Create usage log failed: %v", err)
			// The usage log is the durable source for cost statistics. A queue timeout
			// therefore falls back to a synchronous insert.
			// 重复写入由 usage_logs 的 ON CONFLICT (request_id, api_key_id) DO NOTHING 防护。
			fallbackCtx := usageCtx
			if usageCtx.Err() != nil {
				// usageCtx 已耗尽（best-effort 入队阻塞到期限）：换新的 detached 窗口，避免兜底必然失败。
				var fallbackCancel context.CancelFunc
				fallbackCtx, fallbackCancel = detachedBillingContext(context.Background())
				defer fallbackCancel()
			}
			if _, syncErr := repo.Create(fallbackCtx, usageLog); syncErr != nil {
				logger.LegacyPrintf(logKey, "Create usage log sync fallback failed: %v", syncErr)
			}
		}
		return
	}

	if _, err := repo.Create(usageCtx, usageLog); err != nil {
		logger.LegacyPrintf(logKey, "Create usage log failed: %v", err)
	}
}

// recordUsageOpts 内部选项，参数化普通计费与长上下文计费的差异点。
type recordUsageOpts struct {
	// 长上下文计费（仅 Gemini 路径需要）
	LongContextThreshold  int
	LongContextMultiplier float64
}

// RecordUsage calculates informational cost and stores the usage record.
func (s *GatewayService) RecordUsage(ctx context.Context, input *RecordUsageInput) error {
	return s.recordUsageCore(ctx, &recordUsageCoreInput{
		Result:             input.Result,
		APIKey:             input.APIKey,
		User:               input.User,
		Account:            input.Account,
		PricingAt:          input.PricingAt,
		InboundEndpoint:    input.InboundEndpoint,
		UpstreamEndpoint:   input.UpstreamEndpoint,
		UserAgent:          input.UserAgent,
		IPAddress:          input.IPAddress,
		SessionID:          input.SessionID,
		ForceCacheBilling:  input.ForceCacheBilling,
		ChannelUsageFields: input.ChannelUsageFields,
	}, &recordUsageOpts{})
}

// RecordUsageLongContextInput 记录使用量的输入参数（支持长上下文双倍计费）
type RecordUsageLongContextInput struct {
	Result                *ForwardResult
	APIKey                *APIKey
	User                  *User
	Account               *Account
	PricingAt             time.Time // token 售价固定时刻；零值保持既有的记录时刻语义
	InboundEndpoint       string    // 入站端点（客户端请求路径）
	UpstreamEndpoint      string    // 上游端点（标准化后的上游路径）
	UserAgent             string    // 请求的 User-Agent
	IPAddress             string    // 请求的客户端 IP 地址
	SessionID             string    // 客户端显式会话标识（session_id / X-Session-Id 等请求头），仅用于用量行会话关联
	LongContextThreshold  int       // 长上下文阈值（如 200000）
	LongContextMultiplier float64   // 超出阈值部分的倍率（如 2.0）
	ForceCacheBilling     bool      // 强制缓存计费：将 input_tokens 转为 cache_read 计费（用于粘性会话切换）

	ChannelUsageFields // 渠道映射信息（由 handler 在 Forward 前解析）
}

// RecordUsageWithLongContext stores usage with long-context cost calculation.
func (s *GatewayService) RecordUsageWithLongContext(ctx context.Context, input *RecordUsageLongContextInput) error {
	return s.recordUsageCore(ctx, &recordUsageCoreInput{
		Result:             input.Result,
		APIKey:             input.APIKey,
		User:               input.User,
		Account:            input.Account,
		PricingAt:          input.PricingAt,
		InboundEndpoint:    input.InboundEndpoint,
		UpstreamEndpoint:   input.UpstreamEndpoint,
		UserAgent:          input.UserAgent,
		IPAddress:          input.IPAddress,
		SessionID:          input.SessionID,
		ForceCacheBilling:  input.ForceCacheBilling,
		ChannelUsageFields: input.ChannelUsageFields,
	}, &recordUsageOpts{
		LongContextThreshold:  input.LongContextThreshold,
		LongContextMultiplier: input.LongContextMultiplier,
	})
}

// recordUsageCoreInput 是 recordUsageCore 的公共输入字段，从两种输入结构体中提取。
type recordUsageCoreInput struct {
	Result            *ForwardResult
	APIKey            *APIKey
	User              *User
	Account           *Account
	PricingAt         time.Time
	InboundEndpoint   string
	UpstreamEndpoint  string
	UserAgent         string
	IPAddress         string
	SessionID         string
	ForceCacheBilling bool
	ChannelUsageFields
}

// recordUsageCore 是 RecordUsage 和 RecordUsageWithLongContext 的统一实现。
// LongContextThreshold > 0 时 Token 计费回退走 CalculateCostWithLongContext。
func (s *GatewayService) recordUsageCore(ctx context.Context, input *recordUsageCoreInput, opts *recordUsageOpts) error {
	result := input.Result
	apiKey := input.APIKey
	user := input.User
	account := input.Account
	ApplyForwardImageBillingResolution(result)

	// 强制缓存计费：将 input_tokens 转为 cache_read_input_tokens
	// 用于粘性会话切换时的特殊计费处理
	if input.ForceCacheBilling && result.Usage.InputTokens > 0 {
		logger.LegacyPrintf("service.gateway", "force_cache_billing: %d input_tokens → cache_read_input_tokens (account=%d)",
			result.Usage.InputTokens, account.ID)
		result.Usage.CacheReadInputTokens += result.Usage.InputTokens
		result.Usage.InputTokens = 0
	}

	// Cache TTL Override: 确保计费时 token 分类与账号设置一致。
	// 账号级设置优先；全局 1h 请求注入开启时，默认把 usage 计费归回 5m。
	cacheTTLOverridden := false
	if overrideTarget, ok := s.resolveCacheTTLUsageOverrideTarget(ctx, account); ok {
		applyCacheTTLOverride(&result.Usage, overrideTarget)
		cacheTTLOverridden = (result.Usage.CacheCreation5mTokens + result.Usage.CacheCreation1hTokens) > 0
	}

	// Group pricing remains useful for cost analytics even though no user is charged.
	multiplier := 1.0
	if s.cfg != nil {
		multiplier = s.cfg.Default.RateMultiplier
	}
	if apiKey.GroupID != nil && apiKey.Group != nil {
		multiplier = apiKey.Group.RateMultiplier
	}
	multiplier, imageMultiplier := resolveUsageMultipliers(apiKey, multiplier)

	// 确定计费模型
	concreteBillingModel := forwardResultBillingModel(result.Model, result.UpstreamModel)
	billingModel := concreteBillingModel
	if input.BillingModelSource == BillingModelSourceChannelMapped && input.ChannelMappedModel != "" {
		billingModel = input.ChannelMappedModel
	}
	if input.BillingModelSource == BillingModelSourceRequested && input.OriginalModel != "" {
		billingModel = input.OriginalModel
	}
	// Composite public aliases are billable only when they have explicit channel
	// pricing. Otherwise bill the concrete forwarded model. Resolve the selected
	// pricing once and pass it into the cost path to avoid repeated model parsing.
	billingModel, resolvedBillingPricing := s.selectBillableModelPricing(
		ctx,
		apiKey,
		billingModel,
		concreteBillingModel,
		result.UpstreamModel,
		result.Model,
	)

	// 确定 RequestedModel（渠道映射前的原始模型）
	requestedModel := result.Model
	if input.OriginalModel != "" {
		requestedModel = input.OriginalModel
	}

	// 计算费用
	cost := s.calculateRecordUsageCostWithPricing(ctx, result, apiKey, billingModel, multiplier, imageMultiplier, opts, resolvedBillingPricing)

	// 创建使用日志
	accountRateMultiplier := account.BillingRateMultiplier()
	usageLog := s.buildRecordUsageLog(ctx, input, result, apiKey, user, account,
		requestedModel, multiplier, imageMultiplier, accountRateMultiplier, cacheTTLOverridden, cost, opts)

	// 计算账号统计定价费用（使用最终上游模型匹配自定义规则）
	if apiKey.GroupID != nil {
		applyAccountStatsCost(ctx, usageLog, s.channelService, s.billingService,
			account.ID, *apiKey.GroupID, result.UpstreamModel, result.Model,
			// Anthropic's input_tokens excludes cache_read and cache_creation (billed separately);
			// OpenAI gateway uses actualInputTokens which also excludes cache_read for the same reason.
			UsageTokens{
				InputTokens:         result.Usage.InputTokens,
				OutputTokens:        result.Usage.OutputTokens,
				CacheCreationTokens: result.Usage.CacheCreationInputTokens,
				CacheReadTokens:     result.Usage.CacheReadInputTokens,
				ImageOutputTokens:   result.Usage.ImageOutputTokens,
			},
			cost.TotalCost,
		)
	}

	writeUsageLogBestEffort(ctx, s.usageLogRepo, usageLog, "service.gateway")
	if s.deferredService != nil {
		s.deferredService.ScheduleLastUsedUpdate(account.ID)
	}

	return nil
}

// calculateRecordUsageCost 根据请求类型和选项计算费用。
func (s *GatewayService) calculateRecordUsageCost(
	ctx context.Context,
	result *ForwardResult,
	apiKey *APIKey,
	billingModel string,
	multiplier float64,
	imageMultiplier float64,
	opts *recordUsageOpts,
) *CostBreakdown {
	resolved := s.resolveBillingPricing(ctx, apiKey, billingModel)
	return s.calculateRecordUsageCostWithPricing(ctx, result, apiKey, billingModel, multiplier, imageMultiplier, opts, resolved)
}

func (s *GatewayService) calculateRecordUsageCostWithPricing(
	ctx context.Context,
	result *ForwardResult,
	apiKey *APIKey,
	billingModel string,
	multiplier float64,
	imageMultiplier float64,
	opts *recordUsageOpts,
	resolved *ResolvedPricing,
) *CostBreakdown {
	// 图片生成：渠道定价为 token 计费时走 token 路径，否则走图片计费
	if result.ImageCount > 0 {
		if resolved != nil && resolved.Source == PricingSourceChannel && resolved.Mode == BillingModeToken {
			return s.calculateTokenCostWithPricing(ctx, result, apiKey, billingModel, multiplier, opts, resolved)
		}
		return s.calculateImageCostWithPricing(ctx, result, apiKey, billingModel, imageMultiplier, resolved)
	}

	// Token 计费
	return s.calculateTokenCostWithPricing(ctx, result, apiKey, billingModel, multiplier, opts, resolved)
}

// selectBillableModelPricing returns the model and its already-resolved pricing.
// Composite aliases skip global family fallback unless the alias has explicit
// channel pricing; unknown aliases fall back to a concrete forwarded model.
func (s *GatewayService) selectBillableModelPricing(
	ctx context.Context,
	apiKey *APIKey,
	billingModel string,
	concreteBillingModel string,
	fallbacks ...string,
) (string, *ResolvedPricing) {
	billingModel = strings.TrimSpace(billingModel)
	concreteBillingModel = strings.TrimSpace(concreteBillingModel)
	if apiKey != nil && apiKey.Group != nil && apiKey.Group.Platform == PlatformComposite &&
		concreteBillingModel != "" && billingModel != concreteBillingModel &&
		!s.hasExplicitChannelPricing(ctx, apiKey, billingModel) {
		billingModel = concreteBillingModel
	}

	resolved := s.resolveBillingPricing(ctx, apiKey, billingModel)
	if billingPricingResolvable(resolved) {
		return billingModel, resolved
	}
	for i, fallback := range fallbacks {
		fallback = strings.TrimSpace(fallback)
		if fallback == "" || fallback == billingModel || duplicateBillingFallback(fallbacks[:i], fallback) {
			continue
		}
		fallbackResolved := s.resolveBillingPricing(ctx, apiKey, fallback)
		if billingPricingResolvable(fallbackResolved) {
			return fallback, fallbackResolved
		}
	}
	return billingModel, resolved
}

func duplicateBillingFallback(previous []string, candidate string) bool {
	for _, model := range previous {
		if strings.TrimSpace(model) == candidate {
			return true
		}
	}
	return false
}

func (s *GatewayService) hasExplicitChannelPricing(ctx context.Context, apiKey *APIKey, model string) bool {
	if apiKey == nil || apiKey.Group == nil || strings.TrimSpace(model) == "" {
		return false
	}
	channelService := s.channelService
	if channelService == nil && s.resolver != nil {
		channelService = s.resolver.channelService
	}
	return channelService != nil && channelService.GetChannelModelPricing(ctx, apiKey.Group.ID, model) != nil
}

func (s *GatewayService) resolveBillingPricing(ctx context.Context, apiKey *APIKey, model string) *ResolvedPricing {
	model = strings.TrimSpace(model)
	if model == "" {
		return nil
	}
	if s.resolver != nil {
		var groupID *int64
		if apiKey != nil && apiKey.Group != nil {
			gid := apiKey.Group.ID
			groupID = &gid
		}
		return s.resolver.Resolve(ctx, PricingInput{Model: model, GroupID: groupID})
	}
	if s.billingService == nil {
		return nil
	}
	pricing, err := s.billingService.GetModelPricing(model)
	if err != nil {
		return nil
	}
	return &ResolvedPricing{Mode: BillingModeToken, BasePricing: pricing, Source: PricingSourceFallback}
}

func billingPricingResolvable(resolved *ResolvedPricing) bool {
	if resolved == nil {
		return false
	}
	return resolved.Source == PricingSourceChannel || resolved.BasePricing != nil ||
		len(resolved.Intervals) > 0 || len(resolved.RequestTiers) > 0
}

func (s *GatewayService) calculateImageCostWithPricing(
	ctx context.Context,
	result *ForwardResult,
	apiKey *APIKey,
	billingModel string,
	multiplier float64,
	resolved *ResolvedPricing,
) *CostBreakdown {
	sizeTier := NormalizeImageBillingTierOrDefault(result.ImageSize)
	groupConfig := imagePriceConfigFromAPIKey(apiKey)
	if apiKeyHasConfiguredImagePrice(apiKey, sizeTier) {
		return s.billingService.CalculateImageCost(billingModel, sizeTier, result.ImageCount, groupConfig, multiplier)
	}
	if resolved != nil && resolved.Source == PricingSourceChannel && s.resolver != nil && apiKey != nil && apiKey.Group != nil {
		tokens := UsageTokens{
			InputTokens:       result.Usage.InputTokens,
			OutputTokens:      result.Usage.OutputTokens,
			ImageOutputTokens: result.Usage.ImageOutputTokens,
		}
		gid := apiKey.Group.ID
		cost, err := s.billingService.CalculateCostUnified(CostInput{
			Ctx:            ctx,
			Model:          billingModel,
			GroupID:        &gid,
			Tokens:         tokens,
			RequestCount:   result.ImageCount,
			SizeTier:       sizeTier,
			RateMultiplier: multiplier,
			Resolver:       s.resolver,
			Resolved:       resolved,
		})
		if err != nil {
			logger.LegacyPrintf("service.gateway", "Calculate image token cost failed: %v", err)
			return &CostBreakdown{ActualCost: 0}
		}
		return cost
	}

	return s.billingService.CalculateImageCost(billingModel, sizeTier, result.ImageCount, groupConfig, multiplier)
}

func (s *GatewayService) calculateTokenCostWithPricing(
	ctx context.Context,
	result *ForwardResult,
	apiKey *APIKey,
	billingModel string,
	multiplier float64,
	opts *recordUsageOpts,
	resolved *ResolvedPricing,
) *CostBreakdown {
	tokens := UsageTokens{
		InputTokens:           result.Usage.InputTokens,
		OutputTokens:          result.Usage.OutputTokens,
		CacheCreationTokens:   result.Usage.CacheCreationInputTokens,
		CacheReadTokens:       result.Usage.CacheReadInputTokens,
		CacheCreation5mTokens: result.Usage.CacheCreation5mTokens,
		CacheCreation1hTokens: result.Usage.CacheCreation1hTokens,
		ImageOutputTokens:     result.Usage.ImageOutputTokens,
	}

	var cost *CostBreakdown
	var err error

	// Reuse the selected model's pricing for normal and channel billing. The
	// legacy partial-over-threshold path remains separate for Gemini callers.
	useUnified := resolved != nil && s.resolver != nil &&
		(resolved.Source == PricingSourceChannel || opts == nil || opts.LongContextThreshold <= 0)
	if useUnified {
		var groupID *int64
		if apiKey != nil && apiKey.Group != nil {
			gid := apiKey.Group.ID
			groupID = &gid
		}
		cost, err = s.billingService.CalculateCostUnified(CostInput{
			Ctx:            ctx,
			Model:          billingModel,
			GroupID:        groupID,
			Tokens:         tokens,
			RequestCount:   1,
			RateMultiplier: multiplier,
			Resolver:       s.resolver,
			Resolved:       resolved,
		})
	} else if opts != nil && opts.LongContextThreshold > 0 {
		// 长上下文双倍计费（如 Gemini 200K 阈值）
		cost, err = s.billingService.CalculateCostWithLongContext(billingModel, tokens, multiplier, opts.LongContextThreshold, opts.LongContextMultiplier)
	} else {
		cost, err = s.billingService.CalculateCost(billingModel, tokens, multiplier)
	}
	if err != nil {
		logger.LegacyPrintf("service.gateway", "Calculate cost failed: %v", err)
		return &CostBreakdown{ActualCost: 0}
	}
	return cost
}

// buildRecordUsageLog 构建使用日志并设置计费模式。
func (s *GatewayService) buildRecordUsageLog(
	ctx context.Context,
	input *recordUsageCoreInput,
	result *ForwardResult,
	apiKey *APIKey,
	user *User,
	account *Account,
	requestedModel string,
	multiplier float64,
	imageMultiplier float64,
	accountRateMultiplier float64,
	cacheTTLOverridden bool,
	cost *CostBreakdown,
	opts *recordUsageOpts,
) *UsageLog {
	durationMs := int(result.Duration.Milliseconds())
	requestID := resolveUsageBillingRequestID(ctx, result.RequestID)
	usageLog := &UsageLog{
		UserID:                user.ID,
		APIKeyID:              apiKey.ID,
		AccountID:             account.ID,
		RequestID:             requestID,
		Model:                 result.Model,
		RequestedModel:        requestedModel,
		UpstreamModel:         optionalUsageUpstreamModel(result.UpstreamModel, result.Model, requestedModel),
		ReasoningEffort:       result.ReasoningEffort,
		InboundEndpoint:       optionalTrimmedStringPtr(input.InboundEndpoint),
		UpstreamEndpoint:      optionalTrimmedStringPtr(input.UpstreamEndpoint),
		InputTokens:           result.Usage.InputTokens,
		OutputTokens:          result.Usage.OutputTokens,
		CacheCreationTokens:   result.Usage.CacheCreationInputTokens,
		CacheReadTokens:       result.Usage.CacheReadInputTokens,
		CacheCreation5mTokens: result.Usage.CacheCreation5mTokens,
		CacheCreation1hTokens: result.Usage.CacheCreation1hTokens,
		ImageOutputTokens:     result.Usage.ImageOutputTokens,
		RateMultiplier:        multiplier,
		AccountRateMultiplier: &accountRateMultiplier,
		BillingMode:           resolveBillingMode(result, cost),
		Stream:                result.Stream,
		DurationMs:            &durationMs,
		FirstTokenMs:          usageFirstTokenMs(result.FirstTokenMs, result.ImageCount),
		ImageCount:            result.ImageCount,
		ImageSize:             optionalTrimmedStringPtr(result.ImageSize),
		ImageInputSize:        optionalTrimmedStringPtr(result.ImageInputSize),
		ImageOutputSize:       optionalTrimmedStringPtr(result.ImageOutputSize),
		ImageSizeSource:       optionalTrimmedStringPtr(result.ImageSizeSource),
		ImageSizeBreakdown:    result.ImageSizeBreakdown,
		CacheTTLOverridden:    cacheTTLOverridden,
		ChannelID:             optionalInt64Ptr(input.ChannelID),
		ModelMappingChain:     optionalTrimmedStringPtr(input.ModelMappingChain),
		UserAgent:             optionalTrimmedStringPtr(input.UserAgent),
		IPAddress:             optionalTrimmedStringPtr(input.IPAddress),
		SessionID:             optionalTrimmedStringPtr(input.SessionID),
		GroupID:               apiKey.GroupID,
		CreatedAt:             time.Now(),
	}
	if result.ImageCount > 0 && (cost == nil || cost.BillingMode != string(BillingModeToken)) {
		usageLog.RateMultiplier = imageMultiplier
	}
	if cost != nil {
		usageLog.InputCost = cost.InputCost
		usageLog.OutputCost = cost.OutputCost
		usageLog.ImageOutputCost = cost.ImageOutputCost
		usageLog.CacheCreationCost = cost.CacheCreationCost
		usageLog.CacheReadCost = cost.CacheReadCost
		usageLog.TotalCost = cost.TotalCost
		usageLog.ActualCost = cost.ActualCost
		usageLog.LongContextBillingApplied = cost.LongContextBillingApplied
	}

	return usageLog
}

// resolveBillingMode 根据计费结果和请求类型确定计费模式。
func resolveBillingMode(result *ForwardResult, cost *CostBreakdown) *string {
	var mode string
	switch {
	case cost != nil && cost.BillingMode != "":
		mode = cost.BillingMode
	case result.ImageCount > 0:
		mode = string(BillingModeImage)
	default:
		mode = string(BillingModeToken)
	}
	return &mode
}
