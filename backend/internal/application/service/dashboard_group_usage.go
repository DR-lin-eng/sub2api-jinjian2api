package service

import (
	"context"
	"fmt"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/shared/usagestats"
)

// DashboardService provides the aggregate group costs used by group management.
type DashboardService struct {
	usageRepo UsageLogRepository
}

func NewDashboardService(usageRepo UsageLogRepository) *DashboardService {
	return &DashboardService{usageRepo: usageRepo}
}

// GetGroupUsageSummary returns today's and cumulative cost for all groups.
func (s *DashboardService) GetGroupUsageSummary(ctx context.Context, todayStart time.Time) ([]usagestats.GroupUsageSummary, error) {
	results, err := s.usageRepo.GetAllGroupUsageSummary(ctx, todayStart)
	if err != nil {
		return nil, fmt.Errorf("get group usage summary: %w", err)
	}
	return results, nil
}
