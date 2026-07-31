package service

import "context"

func (s *SchedulerSnapshotService) cachedAccountSchedulingState(ctx context.Context, accountID int64) (AccountSchedulingState, bool, error) {
	if s == nil || s.cache == nil || accountID <= 0 {
		return AccountSchedulingState{}, false, nil
	}
	if cache, ok := s.cache.(AccountSchedulingStateCache); ok {
		return cache.GetCachedAccountSchedulingState(ctx, accountID)
	}

	// Preserve compatibility with SchedulerCache implementations that predate
	// the compact metadata lookup. Production Redis caches use the branch above.
	account, err := s.cache.GetAccount(ctx, accountID)
	if err != nil {
		return AccountSchedulingState{}, false, err
	}
	if account == nil {
		return AccountSchedulingState{}, false, nil
	}
	return AccountSchedulingState{Exists: true, Schedulable: account.IsSchedulable()}, true, nil
}
