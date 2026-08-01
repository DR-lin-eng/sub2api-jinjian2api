//go:build unit

package service

import (
	"context"
	"errors"
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

type accountBatchDeleteRepoStub struct {
	AccountRepository
	accounts   map[int64]*Account
	shadows    map[int64][]*Account
	deleteErrs map[int64]error
	delay      time.Duration

	mu         sync.Mutex
	active     int
	maxActive  int
	deletedIDs []int64
}

func (r *accountBatchDeleteRepoStub) GetByIDs(_ context.Context, ids []int64) ([]*Account, error) {
	accounts := make([]*Account, 0, len(ids))
	for _, id := range ids {
		if account := r.accounts[id]; account != nil {
			accounts = append(accounts, account)
		}
	}
	return accounts, nil
}

func (r *accountBatchDeleteRepoStub) ListShadowsByParent(_ context.Context, parentID int64) ([]*Account, error) {
	return append([]*Account(nil), r.shadows[parentID]...), nil
}

func (r *accountBatchDeleteRepoStub) Delete(ctx context.Context, id int64) error {
	r.mu.Lock()
	r.active++
	if r.active > r.maxActive {
		r.maxActive = r.active
	}
	r.mu.Unlock()

	select {
	case <-ctx.Done():
	case <-time.After(r.delay):
	}

	r.mu.Lock()
	r.active--
	r.deletedIDs = append(r.deletedIDs, id)
	err := r.deleteErrs[id]
	r.mu.Unlock()
	return err
}

func TestAdminServiceBatchDeleteAccountsBoundsConcurrencyAndSortsResults(t *testing.T) {
	accounts := make(map[int64]*Account)
	for id := int64(1); id <= 12; id++ {
		accounts[id] = &Account{ID: id}
	}
	repo := &accountBatchDeleteRepoStub{
		accounts:   accounts,
		deleteErrs: map[int64]error{3: errors.New("delete failed")},
		delay:      10 * time.Millisecond,
	}
	svc := &adminServiceImpl{accountRepo: repo}

	result, err := svc.BatchDeleteAccounts(context.Background(), []int64{12, 3, 2, 1, 2, 0, -1, 11, 10, 9, 8, 7, 6, 5, 4})
	require.NoError(t, err)
	require.Equal(t, 12, result.Total)
	require.Equal(t, 11, result.Success)
	require.Equal(t, 1, result.Failed)
	require.Equal(t, []int64{3}, result.FailedIDs)
	require.Equal(t, int64(3), result.Errors[0].AccountID)
	require.LessOrEqual(t, repo.maxActive, accountBatchDeleteMaxConcurrency)
	require.Greater(t, repo.maxActive, 1)
}

func TestAdminServiceBatchDeleteAccountsGroupsSelectedShadowWithParent(t *testing.T) {
	parentID := int64(1)
	repo := &accountBatchDeleteRepoStub{
		accounts: map[int64]*Account{
			1: {ID: 1},
			2: {ID: 2, ParentAccountID: &parentID},
			3: {ID: 3},
		},
		shadows: map[int64][]*Account{1: {{ID: 2, ParentAccountID: &parentID}}},
	}
	svc := &adminServiceImpl{accountRepo: repo}

	result, err := svc.BatchDeleteAccounts(context.Background(), []int64{1, 2, 3})
	require.NoError(t, err)
	require.Equal(t, []int64{1, 2, 3}, result.SuccessIDs)
	require.Empty(t, result.FailedIDs)
	require.ElementsMatch(t, []int64{1, 2, 3}, repo.deletedIDs)
}

func TestAdminServiceBatchDeleteAccountsReportsMissingIDs(t *testing.T) {
	repo := &accountBatchDeleteRepoStub{accounts: map[int64]*Account{1: {ID: 1}}}
	svc := &adminServiceImpl{accountRepo: repo}

	result, err := svc.BatchDeleteAccounts(context.Background(), []int64{1, 9})
	require.NoError(t, err)
	require.Equal(t, []int64{1}, result.SuccessIDs)
	require.Equal(t, []int64{9}, result.FailedIDs)
	require.Equal(t, "account not found", result.Errors[0].Error)
}
