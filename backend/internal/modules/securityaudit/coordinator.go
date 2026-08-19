package securityaudit

import (
	"context"
	"errors"
	"net/http"
)

// PromptEngine is the only request-audit engine in this branch. The former
// content-moderation/risk-control engine was intentionally removed.
type PromptEngine interface {
	EffectiveMode() Mode
	// Enqueue must copy request memory before retaining it beyond the call.
	Enqueue(ctx context.Context, req Request) error
	Evaluate(ctx context.Context, req Request) (*PromptDecision, error)
}

type Coordinator struct {
	prompt PromptEngine
}

// NewCoordinator accepts an optional compatibility prefix while older callers
// migrate to the prompt-only constructor.
func NewCoordinator(first PromptEngine, rest ...PromptEngine) *Coordinator {
	prompt := first
	if len(rest) > 0 {
		prompt = rest[len(rest)-1]
	}
	return &Coordinator{prompt: prompt}
}

func NewPromptCoordinator(prompt PromptEngine) *Coordinator {
	return NewCoordinator(prompt)
}

// RequiresCheck lets handlers avoid request construction when Prompt Audit is
// explicitly disabled or not yet available.
func (c *Coordinator) RequiresCheck() bool {
	return c != nil && c.prompt != nil && c.prompt.EffectiveMode() != ModeOff
}

func (c *Coordinator) Check(ctx context.Context, req Request) Decision {
	if c == nil || c.prompt == nil {
		return allowDecision()
	}
	switch c.prompt.EffectiveMode() {
	case ModeAsync:
		_ = c.prompt.Enqueue(ctx, req)
		return allowDecision()
	case ModeBlocking:
		return c.checkBlocking(ctx, req)
	default:
		return allowDecision()
	}
}

func (c *Coordinator) checkBlocking(ctx context.Context, req Request) Decision {
	return promptDecision(c.evaluatePrompt(ctx, req))
}

func (c *Coordinator) evaluatePrompt(ctx context.Context, req Request) *PromptDecision {
	if c == nil || c.prompt == nil {
		return unavailablePromptDecision(ErrorCodeUnavailable)
	}
	result, err := c.prompt.Evaluate(ctx, req)
	if err != nil {
		var guardErr *GuardError
		if errors.As(err, &guardErr) && guardErr.Code == ErrorCodeInvalidResponse {
			return unavailablePromptDecision(ErrorCodeInvalidResponse)
		}
		return unavailablePromptDecision(ErrorCodeUnavailable)
	}
	if result == nil {
		return unavailablePromptDecision(ErrorCodeUnavailable)
	}
	return result
}

func promptDecision(prompt *PromptDecision) Decision {
	if prompt == nil {
		return allowDecision()
	}
	switch prompt.Kind {
	case DecisionBlock:
		return Decision{Kind: DecisionBlock, HTTPStatus: http.StatusForbidden, ErrorCode: ErrorCodeBlocked,
			ClientMessage: "提示词安全审计拒绝了该请求，请调整输入后重试", Prompt: prompt}
	case DecisionInvalid:
		return Decision{Kind: DecisionInvalid, HTTPStatus: http.StatusServiceUnavailable, ErrorCode: ErrorCodeInvalidResponse,
			ClientMessage: "提示词安全审计暂时不可用，请稍后重试", Prompt: prompt}
	case DecisionUnavailable:
		return Decision{Kind: DecisionUnavailable, HTTPStatus: http.StatusServiceUnavailable, ErrorCode: ErrorCodeUnavailable,
			ClientMessage: "提示词安全审计暂时不可用，请稍后重试", Prompt: prompt}
	case DecisionFlag:
		return Decision{Kind: DecisionFlag, HTTPStatus: http.StatusOK, Prompt: prompt, AllowNextStage: true}
	default:
		return Decision{Kind: DecisionAllow, HTTPStatus: http.StatusOK, Prompt: prompt, AllowNextStage: true}
	}
}

func allowDecision() Decision {
	return Decision{Kind: DecisionAllow, HTTPStatus: http.StatusOK, AllowNextStage: true}
}

func unavailablePromptDecision(code string) *PromptDecision {
	kind := DecisionUnavailable
	if code == ErrorCodeInvalidResponse {
		kind = DecisionInvalid
	}
	return &PromptDecision{Kind: kind, ErrorCode: code, AllowNextStage: false}
}
