package service

import (
	"errors"
	"fmt"
	"math"
	"strings"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/domain"
)

type OpenAIMessagesDispatchModelConfig = domain.OpenAIMessagesDispatchModelConfig
type GroupModelsListConfig = domain.GroupModelsListConfig
type ReasoningEffortMapping = domain.ReasoningEffortMapping

type Group struct {
	ID             int64
	Name           string
	Description    string
	Platform       string
	RateMultiplier float64
	Status         string
	Hydrated       bool // indicates the group was loaded from a trusted repository source
	// DuplicateOperationID is internal persistence metadata used only to recover
	// an already committed one-click copy. It must never be mapped to API DTOs.
	DuplicateOperationID string

	// 图片生成权限与计费配置
	AllowImageGeneration bool
	OpenAIForceImageTool bool
	ImageRateIndependent bool
	ImageRateMultiplier  float64
	ImagePrice1K         *float64
	ImagePrice2K         *float64
	ImagePrice4K         *float64
	VideoRateIndependent bool
	VideoRateMultiplier  float64
	VideoPrice480P       *float64
	VideoPrice720P       *float64
	VideoPrice1080P      *float64
	// Codex alpha/search 网页搜索单次价格（USD/次，仅 openai 平台使用）；
	// nil 表示使用默认价 defaultWebSearchPricePerCall（官方 $10/1000 次）。
	WebSearchPricePerCall *float64

	// Claude Code 客户端限制
	ClaudeCodeOnly  bool
	FallbackGroupID *int64
	// 无效请求兜底分组（仅 anthropic 平台使用）
	FallbackGroupIDOnInvalidRequest *int64

	// 模型路由配置
	// key: 模型匹配模式（支持 * 通配符，如 "claude-opus-*"）
	// value: 优先账号 ID 列表
	ModelRouting        map[string][]int64
	ModelRoutingEnabled bool

	// MCP XML 协议注入开关（仅 antigravity 平台使用）
	MCPXMLInject bool

	// 支持的模型系列（仅 antigravity 平台使用）
	// 可选值: claude, gemini_text, gemini_image
	SupportedModelScopes []string

	// 分组排序
	SortOrder int

	// OpenAI Messages 调度配置（仅 openai 平台使用）
	AllowMessagesDispatch       bool
	AllowLive                   bool
	RequireOAuthOnly            bool // 仅允许非 apikey 类型账号关联（OpenAI/Antigravity/Anthropic/Gemini）
	RequirePrivacySet           bool // 调度时仅允许 privacy 已成功设置的账号（OpenAI/Antigravity/Anthropic/Gemini）
	DefaultMappedModel          string
	MessagesDispatchModelConfig OpenAIMessagesDispatchModelConfig
	ModelsListConfig            GroupModelsListConfig

	// RPMLimit 分组级每分钟请求数上限（0 = 不限制）。
	// 一旦设置即接管该分组用户的限流（覆盖用户级 rpm_limit），可被 user-group rpm_override 进一步覆盖。
	RPMLimit int

	// MaxReasoningEffort limits the effective OpenAI/Codex reasoning effort.
	// Empty means unlimited; supported values are minimal/low/medium/high/xhigh/max.
	MaxReasoningEffort string
	// ReasoningEffortMappings rewrites explicit request values before applying the ceiling.
	ReasoningEffortMappings []ReasoningEffortMapping

	ProfitControlEnabled bool
	ProfitMinMargin      float64
	ProfitSafetyBuffer   float64

	CreatedAt time.Time
	UpdatedAt time.Time

	AccountGroups           []AccountGroup
	AccountCount            int64
	ActiveAccountCount      int64
	RateLimitedAccountCount int64
}

func (g *Group) IsActive() bool {
	return g.Status == StatusActive
}

// GetImagePrice 根据 image_size 返回对应的图片生成价格
// 如果分组未配置价格，返回 nil（调用方应使用默认值）
func (g *Group) GetImagePrice(imageSize string) *float64 {
	switch imageSize {
	case "1K":
		return g.ImagePrice1K
	case "2K":
		return g.ImagePrice2K
	case "4K":
		return g.ImagePrice4K
	default:
		// 未知尺寸默认按 2K 计费
		return g.ImagePrice2K
	}
}

// GetVideoPrice 根据 resolution 返回对应的视频生成价格。
// 如果分组未配置价格，返回 nil（调用方应使用默认值）。
func (g *Group) GetVideoPrice(resolution string) *float64 {
	switch NormalizeVideoBillingResolutionOrDefault(resolution) {
	case VideoBillingResolution480P:
		return g.VideoPrice480P
	case VideoBillingResolution720P:
		return g.VideoPrice720P
	case VideoBillingResolution1080P:
		return g.VideoPrice1080P
	default:
		return g.VideoPrice480P
	}
}

// IsGroupContextValid reports whether a group from context has the fields required for routing decisions.
func IsGroupContextValid(group *Group) bool {
	if group == nil {
		return false
	}
	if group.ID <= 0 {
		return false
	}
	if !group.Hydrated {
		return false
	}
	if group.Platform == "" || group.Status == "" {
		return false
	}
	return true
}

// GetRoutingAccountIDs 根据请求模型获取路由账号 ID 列表
// 返回匹配的优先账号 ID 列表，如果没有匹配规则则返回 nil
func (g *Group) GetRoutingAccountIDs(requestedModel string) []int64 {
	if !g.ModelRoutingEnabled || len(g.ModelRouting) == 0 || requestedModel == "" {
		return nil
	}

	// 1. 精确匹配优先
	if accountIDs, ok := g.ModelRouting[requestedModel]; ok && len(accountIDs) > 0 {
		return accountIDs
	}

	// 2. 通配符匹配（前缀匹配）
	for pattern, accountIDs := range g.ModelRouting {
		if matchModelPattern(pattern, requestedModel) && len(accountIDs) > 0 {
			return accountIDs
		}
	}

	return nil
}

// matchModelPattern 检查模型是否匹配模式
// 支持 * 通配符，如 "claude-opus-*" 匹配 "claude-opus-4-20250514"
func matchModelPattern(pattern, model string) bool {
	if pattern == model {
		return true
	}

	// 处理 * 通配符（仅支持末尾通配符）
	if strings.HasSuffix(pattern, "*") {
		prefix := strings.TrimSuffix(pattern, "*")
		return strings.HasPrefix(model, prefix)
	}

	return false
}

func resolveUsageMultipliers(apiKey *APIKey, base float64) (text, image float64) {
	return base, resolveImageRateMultiplier(apiKey, base)
}

func validProfitControlRatio(v float64) bool {
	return !math.IsNaN(v) && !math.IsInf(v, 0) && v >= 0 && v < 1
}

func NormalizeGroupPlatform(platform string) string {
	if platform == "" {
		return PlatformAnthropic
	}
	return platform
}

func ValidateProfitControlConfig(platform string, enabled bool, minMargin, safetyBuffer float64) error {
	if !enabled {
		return nil
	}
	if !profitControlPlatformSupported(platform) {
		return errors.New("利润控制仅支持 openai、anthropic、gemini、grok、antigravity 平台分组")
	}
	if !validProfitControlRatio(minMargin) {
		return fmt.Errorf("profit_min_margin 应为 [0,1) 的小数，got %v", minMargin)
	}
	if !validProfitControlRatio(safetyBuffer) {
		return fmt.Errorf("profit_safety_buffer 应为 [0,1) 的小数，got %v", safetyBuffer)
	}
	if minMargin+safetyBuffer >= 1 {
		return errors.New("profit_min_margin 与 profit_safety_buffer 之和必须小于 1，否则将排除全部账号")
	}
	return nil
}

func NormalizeProfitControlConfig(platform string, enabled bool, minMargin, safetyBuffer float64) (bool, float64, float64) {
	if !profitControlPlatformSupported(platform) {
		return false, 0, 0
	}
	if !enabled {
		if !validProfitControlRatio(minMargin) {
			minMargin = 0
		}
		if !validProfitControlRatio(safetyBuffer) {
			safetyBuffer = 0
		}
	}
	return enabled, minMargin, safetyBuffer
}

func profitControlPlatformSupported(platform string) bool {
	switch platform {
	case PlatformOpenAI, PlatformAnthropic, PlatformGemini, PlatformGrok, PlatformAntigravity:
		return true
	default:
		return false
	}
}
