package service

import "context"

// AccountSchedulingState is the minimal result needed to validate a queued
// account selection after its concurrency slot becomes available.
type AccountSchedulingState struct {
	Exists      bool
	Schedulable bool
}

// AccountSchedulingStateCache is optional so existing SchedulerCache test
// doubles do not need to implement the wait-revalidation fast path.
type AccountSchedulingStateCache interface {
	GetCachedAccountSchedulingState(ctx context.Context, accountID int64) (AccountSchedulingState, bool, error)
}

// AccountSchedulingStateReader avoids hydrating groups, proxies, and complete
// credentials when the scheduling cache cannot answer a wait revalidation.
type AccountSchedulingStateReader interface {
	GetAccountSchedulingState(ctx context.Context, accountID int64) (AccountSchedulingState, error)
}
