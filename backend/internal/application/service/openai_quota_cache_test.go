package service

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/require"
)

type openAIQuotaCacheRepo struct {
	AccountRepository
	updates map[int64]map[string]any
	err     error
}

func (r *openAIQuotaCacheRepo) UpdateExtra(_ context.Context, id int64, updates map[string]any) error {
	if r.err != nil {
		return r.err
	}
	if r.updates == nil {
		r.updates = make(map[int64]map[string]any)
	}
	r.updates[id] = updates
	return nil
}

func TestCacheResetCreditsSnapshot(t *testing.T) {
	t.Run("complete snapshot is persisted", func(t *testing.T) {
		repo := &openAIQuotaCacheRepo{}
		svc := &OpenAIQuotaService{accountRepo: repo}
		credits := &OpenAIRateLimitResetCredits{
			AvailableCount: 1,
			Credits:        []OpenAIRateLimitResetCreditDetail{{ExpiresAt: "2026-08-04T00:00:00Z"}},
		}

		require.NoError(t, svc.CacheResetCreditsSnapshot(context.Background(), 42, credits))
		require.Equal(t, credits, repo.updates[42][openAIQuotaResetCreditsKey])
	})

	t.Run("zero count allows an empty expiration list", func(t *testing.T) {
		repo := &openAIQuotaCacheRepo{}
		svc := &OpenAIQuotaService{accountRepo: repo}
		credits := &OpenAIRateLimitResetCredits{AvailableCount: 0}

		require.NoError(t, svc.CacheResetCreditsSnapshot(context.Background(), 42, credits))
		require.Equal(t, credits, repo.updates[42][openAIQuotaResetCreditsKey])
	})

	for _, tc := range []struct {
		name    string
		credits *OpenAIRateLimitResetCredits
	}{
		{name: "nil snapshot", credits: nil},
		{name: "positive count without expirations", credits: &OpenAIRateLimitResetCredits{AvailableCount: 1}},
	} {
		t.Run(tc.name, func(t *testing.T) {
			repo := &openAIQuotaCacheRepo{}
			svc := &OpenAIQuotaService{accountRepo: repo}

			require.Error(t, svc.CacheResetCreditsSnapshot(context.Background(), 42, tc.credits))
			require.Empty(t, repo.updates)
		})
	}

	t.Run("repository error is preserved as cause", func(t *testing.T) {
		repoErr := errors.New("database unavailable")
		repo := &openAIQuotaCacheRepo{err: repoErr}
		svc := &OpenAIQuotaService{accountRepo: repo}

		err := svc.CacheResetCreditsSnapshot(context.Background(), 42, &OpenAIRateLimitResetCredits{
			AvailableCount: 1,
			Credits:        []OpenAIRateLimitResetCreditDetail{{ExpiresAt: "2026-08-04T00:00:00Z"}},
		})

		require.ErrorIs(t, err, repoErr)
	})
}
