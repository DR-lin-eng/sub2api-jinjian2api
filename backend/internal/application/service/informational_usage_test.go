package service

import (
	"context"
	"testing"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/platform/config"
	"github.com/stretchr/testify/require"
)

type informationalUsageRepo struct {
	UsageLogRepository
	created *UsageLog
}

func (r *informationalUsageRepo) Create(_ context.Context, log *UsageLog) (bool, error) {
	r.created = log
	return true, nil
}

func TestGatewayRecordUsagePersistsInformationalCost(t *testing.T) {
	cfg := &config.Config{}
	cfg.Default.RateMultiplier = 1
	repo := &informationalUsageRepo{}
	groupID := int64(7)
	user := &User{ID: 1}
	apiKey := &APIKey{ID: 2, UserID: user.ID, User: user, GroupID: &groupID, Group: &Group{ID: groupID, RateMultiplier: 1}}
	account := &Account{ID: 3, Platform: PlatformAnthropic}
	service := NewGatewayService(
		nil, nil, repo, nil, cfg, nil, nil, NewBillingService(cfg, nil), nil,
		nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil,
	)

	err := service.RecordUsage(context.Background(), &RecordUsageInput{
		Result: &ForwardResult{
			RequestID: "req-info-anthropic",
			Model:     "unknown-informational-model",
			Usage:     ClaudeUsage{InputTokens: 12, OutputTokens: 4},
			Duration:  time.Second,
		},
		APIKey:          apiKey,
		User:            user,
		Account:         account,
		InboundEndpoint: "/v1/messages",
	})

	require.NoError(t, err)
	require.NotNil(t, repo.created)
	require.Equal(t, "req-info-anthropic", repo.created.RequestID)
	require.Equal(t, 12, repo.created.InputTokens)
	require.Equal(t, 4, repo.created.OutputTokens)
	require.GreaterOrEqual(t, repo.created.ActualCost, float64(0))
}

func TestOpenAIRecordUsagePersistsInformationalCost(t *testing.T) {
	cfg := &config.Config{}
	cfg.Default.RateMultiplier = 1
	repo := &informationalUsageRepo{}
	groupID := int64(8)
	user := &User{ID: 11}
	apiKey := &APIKey{ID: 12, UserID: user.ID, User: user, GroupID: &groupID, Group: &Group{ID: groupID, RateMultiplier: 1}}
	account := &Account{ID: 13, Platform: PlatformOpenAI}
	service := NewOpenAIGatewayService(
		nil, repo, nil, cfg, nil, nil, NewBillingService(cfg, nil), nil,
		nil, nil, nil, nil, nil, nil, nil,
	)

	err := service.RecordUsage(context.Background(), &OpenAIRecordUsageInput{
		Result: &OpenAIForwardResult{
			RequestID: "req-info-openai",
			Model:     "unknown-informational-model",
			Usage:     OpenAIUsage{InputTokens: 15, OutputTokens: 5},
			Duration:  time.Second,
		},
		APIKey:          apiKey,
		User:            user,
		Account:         account,
		InboundEndpoint: "/v1/responses",
	})

	require.NoError(t, err)
	require.NotNil(t, repo.created)
	require.Equal(t, "req-info-openai", repo.created.RequestID)
	require.Equal(t, 15, repo.created.InputTokens)
	require.Equal(t, 5, repo.created.OutputTokens)
	require.GreaterOrEqual(t, repo.created.ActualCost, float64(0))
}
