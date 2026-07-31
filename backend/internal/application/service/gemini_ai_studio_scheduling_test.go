package service

import (
	"context"
	"testing"

	"github.com/Wei-Shaw/sub2api/internal/platform/config"
	"github.com/stretchr/testify/require"
)

type aiStudioSchedulingAccountRepo struct {
	AccountRepository
	accounts []Account
}

func (r aiStudioSchedulingAccountRepo) ListSchedulableByPlatforms(context.Context, []string) ([]Account, error) {
	return append([]Account(nil), r.accounts...), nil
}

func TestSelectAccountForAIStudioEndpointsWithExclusions(t *testing.T) {
	accounts := []Account{
		{
			ID:          1,
			Type:        AccountTypeAPIKey,
			Priority:    0,
			Credentials: map[string]any{"api_key": "first"},
		},
		{
			ID:          2,
			Type:        AccountTypeAPIKey,
			Priority:    1,
			Credentials: map[string]any{"api_key": "second"},
		},
	}
	svc := &GeminiMessagesCompatService{
		accountRepo: aiStudioSchedulingAccountRepo{accounts: accounts},
		cfg:         &config.Config{RunMode: config.RunModeSimple},
	}

	selected, err := svc.SelectAccountForAIStudioEndpointsWithExclusions(
		context.Background(),
		nil,
		map[int64]struct{}{1: {}},
	)
	require.NoError(t, err)
	require.Equal(t, int64(2), selected.ID)
}
