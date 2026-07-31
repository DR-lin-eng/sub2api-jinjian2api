package service

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/require"
)

type waitRevalidationStateCache struct {
	SchedulerCache
	state AccountSchedulingState
	found bool
	err   error
	calls int
}

func (c *waitRevalidationStateCache) GetCachedAccountSchedulingState(context.Context, int64) (AccountSchedulingState, bool, error) {
	c.calls++
	return c.state, c.found, c.err
}

type waitRevalidationStateRepo struct {
	AccountRepository
	state         AccountSchedulingState
	stateErr      error
	stateCalls    int
	fullReadCalls int
}

func (r *waitRevalidationStateRepo) GetAccountSchedulingState(context.Context, int64) (AccountSchedulingState, error) {
	r.stateCalls++
	return r.state, r.stateErr
}

func (r *waitRevalidationStateRepo) GetByID(context.Context, int64) (*Account, error) {
	r.fullReadCalls++
	return nil, errors.New("full account hydration must not run")
}

func TestEnsureAccountSchedulableAfterWaitUsesCachedSchedulingState(t *testing.T) {
	tests := []struct {
		name              string
		state             AccountSchedulingState
		wantErr           error
		wantStickyBinding bool
	}{
		{
			name:              "active account",
			state:             AccountSchedulingState{Exists: true, Schedulable: true},
			wantStickyBinding: true,
		},
		{
			name:    "disabled account",
			state:   AccountSchedulingState{Exists: true, Schedulable: false},
			wantErr: ErrAccountSchedulingChanged,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			stateCache := &waitRevalidationStateCache{state: tc.state, found: true}
			repo := &waitRevalidationStateRepo{}
			sticky := &stubGatewayCache{sessionBindings: map[string]int64{"openai:session": 81}}
			svc := &OpenAIGatewayService{
				accountRepo:       repo,
				schedulerSnapshot: &SchedulerSnapshotService{cache: stateCache},
				cache:             sticky,
			}

			err := svc.EnsureAccountSchedulableAfterWait(context.Background(), nil, "session", 81)
			if tc.wantErr == nil {
				require.NoError(t, err)
			} else {
				require.ErrorIs(t, err, tc.wantErr)
			}
			require.Equal(t, 1, stateCache.calls)
			require.Zero(t, repo.stateCalls)
			require.Zero(t, repo.fullReadCalls)
			if tc.wantStickyBinding {
				require.Equal(t, int64(81), sticky.sessionBindings["openai:session"])
			} else {
				require.NotContains(t, sticky.sessionBindings, "openai:session")
			}
		})
	}
}

func TestEnsureAccountSchedulableAfterWaitUsesProjectionOnCacheMissOrFailure(t *testing.T) {
	tests := []struct {
		name     string
		cacheErr error
	}{
		{name: "cache miss"},
		{name: "cache failure", cacheErr: errors.New("redis unavailable")},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			stateCache := &waitRevalidationStateCache{err: tc.cacheErr}
			repo := &waitRevalidationStateRepo{state: AccountSchedulingState{Exists: true, Schedulable: true}}
			svc := &OpenAIGatewayService{
				accountRepo:       repo,
				schedulerSnapshot: &SchedulerSnapshotService{cache: stateCache},
			}

			require.NoError(t, svc.EnsureAccountSchedulableAfterWait(context.Background(), nil, "", 82))
			require.Equal(t, 1, stateCache.calls)
			require.Equal(t, 1, repo.stateCalls)
			require.Zero(t, repo.fullReadCalls)
		})
	}
}

func TestEnsureAccountSchedulableAfterWaitProjectionFailureKeepsStickyBinding(t *testing.T) {
	repoErr := errors.New("database unavailable")
	repo := &waitRevalidationStateRepo{stateErr: repoErr}
	sticky := &stubGatewayCache{sessionBindings: map[string]int64{"openai:session": 83}}
	svc := &OpenAIGatewayService{accountRepo: repo, cache: sticky}

	err := svc.EnsureAccountSchedulableAfterWait(context.Background(), nil, "session", 83)
	require.ErrorIs(t, err, repoErr)
	require.NotErrorIs(t, err, ErrAccountSchedulingChanged)
	require.Equal(t, int64(83), sticky.sessionBindings["openai:session"])
	require.Zero(t, repo.fullReadCalls)
}
